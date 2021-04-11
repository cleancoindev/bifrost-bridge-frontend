import {Fragment, useEffect, useState} from "react";
import Header from "../component/Header/Header";
import styles from "../styles/Connect.module.css"
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import WalletProvider from "../utils/walletProvider";
import {useDispatch, useSelector} from "react-redux";
import {Actions, contracts, Docs, eosEndpoint, tables} from "../utils/config";
import EosApi from "eosjs-api";
import Loader from 'react-loader-spinner'
import {showConnectModal} from "../redux/actions/modalActions";
import {Ethlogin} from "../redux/actions/actions";
import {logout} from "../redux/actions/actions";


const ethereum_address = require("ethereum-address");

const ConnectWallet = () => {

    const options = {
        httpEndpoint: eosEndpoint,
    };
    const eos = EosApi(options);


    const username = useSelector((state) => state.user.username);
    const walletConnected = useSelector((state) => state.user.walletConnected);
    const ethwalletConnected = useSelector(
        (state) => state.address.ethWalletConnected
    );

    const dispatch = useDispatch();

    const [registerLoading, setRegisterLoading] = useState(false);
    const [regerrorMsg, setregerrorMsg] = useState("");
    const [regsuccessMsg, setregsuccessMsg] = useState("");
    const [ethaddress, setAddress] = useState("");
    const [registerfee, setRegisterFee] = useState("0.0000 EOS");

    const registerSchema = Yup.object().shape({
        address: Yup.string()
            .required("Enter Ethereum address")
            .test("ethereumaddress", `Invalid ethereum address`, (address) => {
                return ethereum_address.isAddress(address);
            }),
    });

    const initialRegister = {
        address: ethaddress,
    };


    const handleRegister = async (values) => {
        try {
            const eosAmount = 1;
            const wallet = WalletProvider.getWallet();
            const {address} = values;
            if (!walletConnected) {
                setregerrorMsg("Eos wallet is not connected");
            } else if (!ethwalletConnected) {
                setregerrorMsg("Ethereum wallet is not connected");
            } else if (!!wallet) {
                setRegisterLoading(true);
                const result = await wallet.eosApi.transact(
                    {
                        actions: [
                            {
                                account: contracts.EosTokenContract,
                                name: Actions.Transfer,
                                authorization: [
                                    {
                                        actor: wallet.auth.accountName,
                                        permission: wallet.auth.permission,
                                    },
                                ],
                                data: {
                                    from: wallet.auth.accountName,
                                    to: contracts.BRIDGE_CON,
                                    quantity: registerfee,
                                    memo: "registration fees",
                                },
                            },
                            {
                                account: contracts.BRIDGE_CON,
                                name: Actions.RegisterEth,
                                authorization: [
                                    {
                                        actor: wallet.auth.accountName,
                                        permission: wallet.auth.permission,
                                    },
                                ],
                                data: {
                                    account: wallet.auth.accountName,
                                    ethaddress: address,
                                },
                            },
                        ],
                    },
                    {
                        broadcast: true,
                        blocksBehind: 3,
                        expireSeconds: 60,
                    }
                );
                if (result) {
                    setRegisterLoading(false);
                    setregsuccessMsg("Transaction Success");
                    setregerrorMsg("");
                }
            } else {
                setRegisterLoading(false);
            }
        } catch (e) {
            setregerrorMsg(e.message);
            setRegisterLoading(false);
        } finally {
            setRegisterLoading(false);
        }
    };

    const connectToWallet = async () => {
        if (walletConnected) {
            try {
                const wallet = WalletProvider.getWallet();
                if (!!wallet) {
                    await WalletProvider.disconnectWallet();
                    dispatch(logout());
                    localStorage.clear();
                }
            } catch (e) {
                console.log("something went wrong ", e);
            }
        } else {
            dispatch(showConnectModal())
        }
    };


    const connectToMetamask = async () => {
        try {
            const {ethereum} = window;
            const {chainId} = ethereum;

            if (chainId === "0x1") {
                if (!!ethereum) {
                    const accounts = await ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    setAddress(accounts[0]);
                    console.log('eth wallet connect state going to be set')
                    dispatch(Ethlogin({address: accounts[0]}));
                }
            } else {
                alert("Please select Ethereum Main Network (Mainnet) then connect");
            }
        } catch (e) {
            console.log("something went wrong ", e);
        }
    };

    useEffect(() => {
        const getfees = async () => {
            const requests = await eos.getTableRows({
                code: contracts.BRIDGE_CON,
                scope: contracts.BRIDGE_CON,
                table: tables.Configs,
                json: "true",
            });
            if (requests.rows.length) {
                const fee = await requests.rows[0].registrationfee;
                setRegisterFee(fee);
            }
        };
        getfees();
    }, []);


    return (
        <Fragment>

            <section className={styles.connectScreen}>
                <Header/>

                <div className="container-fluid mt-5">
                    <div className="container90">
                        <div className="col-md-12">
                            <div className="col-md-6 offset-md-3">
                                <h1 className="mainHeading">
                                    Register Ethereum Address on EOS
                                </h1>
                                <div className="seprater"/>


                                <div className={styles.connectGrid}>
                                    <div className={styles.module}>
                                        <button onClick={connectToWallet}
                                                className="btn btn-block btnBlue mainBtnDesign2">
                                            {walletConnected
                                                ? `Logout From ${username}`
                                                : "Connect to Eos Wallet"}
                                        </button>
                                        <button className="btn btn-block btnBlue mt-4 mainBtnDesign2"
                                                onClick={connectToMetamask}
                                        >
                                            {!!ethaddress ? "Connected" : "Connect to metamask"}
                                        </button>

                                        <Formik
                                            initialValues={initialRegister}
                                            validationSchema={registerSchema}
                                            onSubmit={handleRegister}
                                        >
                                            {({setFieldValue}) => (
                                                <Form>
                                                    <Field type="text" placeholder="Enter Ethereum address"
                                                           name="address"
                                                           onClick={() => setFieldValue("address", ethaddress)}
                                                           className="form-control primaryInput mt-4"/>
                                                    <p className="text-danger">
                                                        <ErrorMessage name="address"/>
                                                    </p>


                                                    <p className={`${styles.noteText} mt-4`}>
                                                        Note:- Current registration fee {registerfee} will be deducted
                                                        from
                                                        your
                                                        account.
                                                    </p>

                                                    <button className="btn btn-block btnBlue mt-4 mainBtnDesign2"
                                                            disabled={registerLoading}>
                                                        {registerLoading ? <Loader color={"#fff"} type="Oval" width={40}
                                                                                   height={30}/> : 'REGISTER'}


                                                    </button>
                                                </Form>
                                            )}
                                        </Formik>

                                        {regerrorMsg ? (
                                            <p className="text-danger">{regerrorMsg}</p>
                                        ) : (
                                            <p className="text-success">{regsuccessMsg}</p>
                                        )}

                                        <a className="mt-4 linkText text-center" href={Docs.Eosdoc} target="_blank">
                                            Need Help?
                                        </a>

                                    </div>
                                </div>

                                <div className="pb-5"/>

                            </div>

                        </div>
                    </div>
                </div>

            </section>

        </Fragment>
    )
}
export default ConnectWallet