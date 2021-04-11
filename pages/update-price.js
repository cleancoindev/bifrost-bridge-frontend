import {Fragment, useState} from "react";
import Header from "../component/Header/Header";
import styles from "../styles/Proposal.module.css"
import WalletProvider from "../utils/walletProvider";
import {useDispatch, useSelector} from "react-redux";
import {Actions, contracts, eosEndpoint} from "../utils/config";
import Loader from "react-loader-spinner";
import EosApi from "eosjs-api";

const UpdatePrice = () => {

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
    const [gasloading, setGasLoading] = useState(false);
    const [ethloading, setEthLoading] = useState(false);
    const [eosloading, setEosLoading] = useState(false);
    const [errorMsg, seterrorMsg] = useState("");

    const [errorMesg, seterrorMesg] = useState("");
    const [successMesg, setsuccessMesg] = useState("");


    const updateGasPrice = async () => {
        try {
            const wallet = WalletProvider.getWallet();
            if (!walletConnected) {
                seterrorMesg("Eos wallet is not connected");
            } /*else if (!ethwalletConnected) {
                seterrorMesg("Ethereum wallet is not connected");
            }*/ else if (!!wallet) {
                setGasLoading(true);
                const result = await wallet.eosApi.transact(
                    {
                        actions: [
                            {
                                account: contracts.BRIDGE_CON,
                                name: Actions.SetGasPrice,
                                authorization: [
                                    {
                                        actor: wallet.auth.accountName,
                                        permission: wallet.auth.permission,
                                    },
                                ],
                                data: {},
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
                    setGasLoading(false);
                    setsuccessMesg("Transaction Success");
                    seterrorMesg("");
                }
            }
        } catch (e) {
            setGasLoading(false);
        } finally {
            setGasLoading(false);
        }
    };

    const updateEthPrice = async () => {
        try {
            const wallet = WalletProvider.getWallet();
            if (!walletConnected) {
                seterrorMesg("Eos wallet is not connected");
            } /*else if (!ethwalletConnected) {
                seterrorMesg("Ethereum wallet is not connected");
            }*/ else if (!!wallet) {
                setEthLoading(true);
                const result = await wallet.eosApi.transact(
                    {
                        actions: [
                            {
                                account: contracts.BRIDGE_CON,
                                name: Actions.SetEthPrice,
                                authorization: [
                                    {
                                        actor: wallet.auth.accountName,
                                        permission: wallet.auth.permission,
                                    },
                                ],
                                data: {},
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
                    setEthLoading(false);
                    setsuccessMesg("Transaction Success");
                    seterrorMesg("");
                }
            }
        } catch (e) {
            setEthLoading(false);
        } finally {
            setEthLoading(false);
        }
    };

    const updateEosPrice = async () => {
        try {
            const wallet = WalletProvider.getWallet();
            if (!walletConnected) {
                seterrorMesg("Eos wallet is not connected");
            } /*else if (!ethwalletConnected) {
                seterrorMesg("Ethereum wallet is not connected");
            }*/ else if (!!wallet) {
                setEosLoading(true);
                const result = await wallet.eosApi.transact(
                    {
                        actions: [
                            {
                                account: contracts.BRIDGE_CON,
                                name: Actions.SetEosPrice,
                                authorization: [
                                    {
                                        actor: wallet.auth.accountName,
                                        permission: wallet.auth.permission,
                                    },
                                ],
                                data: {},
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
                    setEosLoading(false);
                    setsuccessMesg("Transaction Success");
                    seterrorMsg("");
                }
            }
        } catch (e) {
            setEosLoading(false);
        } finally {
            setEosLoading(false);
        }
    };


    return (
        <Fragment>
            <section className={styles.proposalScreen}>
                <Header/>
                <div className="container-fluid mt-5">
                    <div className="container90">
                        <div className="col-md-12">
                            <div className="col-md-6 offset-md-3">
                                <h1 className="mainHeading mt-5">
                                    Update Prices (Ethereum Gas, EOS, ETH)
                                </h1>
                                <div className="seprater"/>


                                <div className="col-md-12 mt-5 mb-5">
                                    <div className={styles.absImg}>
                                        <img src="/images/thor.png" alt="thor" className={styles.thorImage}/>
                                    </div>

                                    <div className={styles.borderedBlock}>
                                        <button className={`btn btn-block ${styles.keyHeading}`}
                                                disabled={gasloading}
                                                onClick={updateGasPrice}
                                        >
                                            <img src="/images/key.png" alt="key" className={styles.keyImage}/>

                                            {gasloading ?  <Loader color={"#fff"} type="Oval" width={40}
                                                                   height={30}/> : "Update GAS Price"}

                                        </button>
                                    </div>
                                    <div className={styles.borderedBlock}>
                                        <button className={`btn btn-block ${styles.keyHeading}`}
                                                disabled={ethloading}
                                                onClick={updateEthPrice}
                                        >
                                            <img src="/images/key.png" alt="key" className={styles.keyImage}/>

                                            {ethloading ?  <Loader color={"#fff"} type="Oval" width={40}
                                                                   height={30}/> : "Update ETH Price"}

                                        </button>
                                    </div>
                                    <div className={styles.borderedBlock}>
                                        <button className={`btn btn-block ${styles.keyHeading}`}
                                                disabled={eosloading}
                                                onClick={updateEosPrice}
                                        >
                                            <img src="/images/key.png" alt="key" className={styles.keyImage}/>

                                            {eosloading ?  <Loader color={"#fff"} type="Oval" width={40}
                                                                   height={30}/> : "Update EOS Price"}

                                        </button>
                                    </div>

                                    {errorMesg ? (
                                        <p className="text-danger text-center">{errorMesg}</p>
                                    ) : (
                                        <p className="text-success  text-center">{successMesg}</p>
                                    )}

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

export default UpdatePrice