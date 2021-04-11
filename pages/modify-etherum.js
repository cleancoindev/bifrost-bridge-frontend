import {Fragment, useEffect, useState} from "react";
import Header from "../component/Header/Header";
import styles from "../styles/Connect.module.css";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import WalletProvider from "../utils/walletProvider";
import {useSelector} from "react-redux";
import {Actions, contracts, eosEndpoint, tables} from "../utils/config";
import EosApi from "eosjs-api";
import Loader from 'react-loader-spinner'

const ethereum_address = require("ethereum-address");

const ModifyEtherum = () => {

    const options = {
        httpEndpoint: eosEndpoint,
    };
    const eos = EosApi(options);

    const username = useSelector((state) => state.user.username);
    const walletConnected = useSelector((state) => state.user.walletConnected);
    const ethwalletConnected = useSelector(
        (state) => state.address.ethWalletConnected
    );

    const [updateloading, setUpdateLoading] = useState(false);
    const [errorMsg, seterrorMsg] = useState("");
    const [successMsg, setsuccessMsg] = useState("");
    const [ethaddress, setAddress] = useState("");
    const [registerfee, setRegisterFee] = useState("0.0000 EOS");

    const updateSchema = Yup.object().shape({
        newaddress: Yup.string()
            .required("Enter new ethereum address")
            .test("ethereumaddress", `Invalid ethereum address`, (address) =>
                ethereum_address.isAddress(address)
            ),
    });

    const initialUpdate = {
        newaddress: "",
    };


    const handleUpdate = async (values) => {
        try {
            const wallet = WalletProvider.getWallet();
            const {newaddress} = values;
            if (!walletConnected) {
                seterrorMsg("Eos wallet is not connected");
            } else if (!ethwalletConnected) {
                seterrorMsg("Ethereum wallet is not connected");
            } else if (!!wallet) {
                setUpdateLoading(true);
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
                                    memo: "modification fees",
                                },
                            },
                            {
                                account: contracts.BRIDGE_CON,
                                name: Actions.ModifyEth,
                                authorization: [
                                    {
                                        actor: wallet.auth.accountName,
                                        permission: wallet.auth.permission,
                                    },
                                ],
                                data: {
                                    account: wallet.auth.accountName,
                                    newethaddress: newaddress,
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
                    setUpdateLoading(false);
                    setsuccessMsg("Transaction Success");
                    seterrorMsg("");
                }
            } else {
                setUpdateLoading(false);
            }
        } catch (e) {
            seterrorMsg(e.message);
            setUpdateLoading(false);
        } finally {
            setUpdateLoading(false);
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
            <section className={styles.proposalScreen2}>
                <Header/>
                <div className="container-fluid mt-5">
                    <div className="container90">
                        <div className="col-md-12">
                            <div className="col-md-6 offset-md-3">
                                <h1 className="mainHeading">
                                    Modify Ethereum Address on EOS
                                </h1>
                                <div className="seprater"/>

                                <div className={styles.connectGrid}>
                                    <div className={styles.module}>

                                        <Formik
                                            initialValues={initialUpdate}
                                            validationSchema={updateSchema}
                                            onSubmit={handleUpdate}
                                        >
                                            {({setFieldValue}) => (
                                                <Form>
                                                    <label htmlFor="address">Enter new Ethereum address</label>

                                                    <Field
                                                        className="form-control primaryInput mt-2"
                                                        name="newaddress"
                                                        placeholder="enter new ethereum address"
                                                        onClick={() => setFieldValue("newaddress", ethaddress)}
                                                    />

                                                    <p className="text-danger">
                                                        <ErrorMessage name="newaddress"/>
                                                    </p>


                                                    <p className={`${styles.noteText} mt-4`}>
                                                        Note:- Current modification fee {registerfee} will be deducted
                                                        from your
                                                        account.
                                                    </p>

                                                    <button className="btn btn-block mainBtnDesign2 connectPageBtn mt-4 mb-3"
                                                            disabled={updateloading}
                                                            type="submit"
                                                    >
                                                        {updateloading ? <Loader color={"#fff"} type="Oval" width={40}
                                                                                 height={30}/> : "Update Address"}
                                                    </button>
                                                </Form>
                                            )}
                                        </Formik>

                                        {errorMsg ? (
                                            <p className="text-danger">{errorMsg}</p>
                                        ) : (
                                            <p className="text-success">{successMsg}</p>
                                        )}


                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.footerImage}>
                    <img src="/images/footer-stone.png" className={styles.width100} alt="stone"/>
                </div>
            </section>

        </Fragment>
    )
}

export default ModifyEtherum