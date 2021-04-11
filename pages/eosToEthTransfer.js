import {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ErrorMessage, Field, Form, Formik} from "formik";
import Header from "../component/Header/Header";
import styles from "../styles/Home.module.css"
import * as Yup from "yup";
import EosApi from "eosjs-api";
import {Actions, contracts, eosEndpoint, tables} from "../utils/config";
import WalletProvider from "../utils/walletProvider";
import {login} from "../redux/actions/actions";
import Loader from "react-loader-spinner";
import {useRouter} from "next/router";
import Link from "next/link";


const options = {
    httpEndpoint: eosEndpoint,
};
const eos = EosApi(options);

const schema = Yup.object().shape({
    value: Yup.number()
        .required("Enter value of token")
        .test("lowAmount", `Should be greater than 0`, (val) => parseFloat(val) > 0),
    token: Yup.string().required("Select a token type"),
});

const initialValues = {
    value: "",
    token: "6,USDC",
};


const EosToEthTransfer = () => {

    const router = useRouter()

    const username = useSelector((state) => state.user.username);
    const walletConnected = useSelector((state) => state.user.walletConnected);
    const ethwalletConnected = useSelector(
        (state) => state.address.ethWalletConnected
    );
    const [balances, setUserBalances] = useState([]);
    const [tokenSymbol, setSymbols] = useState(["4,USDC"]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, seterrorMsg] = useState("");
    const [successMsg, setsuccessMsg] = useState("");
    const [usdcfee, setUsdcFee] = useState("0.000000 USDC");
    const [daifee, setDaiFee] = useState("0.000000 DAI");

    const dispatch = useDispatch();
    const [loggedIn, setLoggedIn] = useState(false);

    const toggleLogin = (logged) => {
        setLoggedIn(logged);
    };


    const getTokens = async () => {
        let tokens = [];
        const requests = await eos.getTableRows({
            code: contracts.BRIDGE_CON,
            scope: contracts.BRIDGE_CON,
            table: tables.Symbols,
            json: "true",
        });
        if (requests.rows.length) {
            requests.rows.map((row) => {
                tokens.push(row.dtoken.toString());
            });
        }
        setSymbols(tokens);
        return tokens;
    };

    const getBalance = async (tokens, account) => {
        const userbal = [];
        try {
            if (tokens.length) {
                for (const symbol of tokens) {
                    let code;
                    // let toAcc;
                    code = contracts.TokenContract;
                    const tokensData = {
                        code: code,
                        json: true,
                        limit: 1000,
                        scope: account,
                        table: tables.Accounts,
                        table_key: account,
                    };
                    const responses = await fetch(
                        `${eosEndpoint}/v1/chain/get_table_rows`,
                        {
                            method: "post",
                            body: JSON.stringify(tokensData),
                        }
                    );

                    const tokensdata = await responses.json();

                    if (tokensdata.rows.length) {
                        const balanceRow = tokensdata.rows.find(
                            (row) => row.balance.split(" ")[1] == symbol.split(",")[1]
                        );
                        userbal.push(balanceRow.balance);
                    }
                }
                setUserBalances(userbal);
            }
        } catch (e) {
            setUserBalances(userbal);
        }
    };

    useEffect(() => {
        const getfees = async () => {
            const usdcreq = await eos.getTableRows({
                code: contracts.BRIDGE_CON,
                scope: "USDC",
                table: tables.FEE_TAB,
                json: "true",
            });
            const daireq = await eos.getTableRows({
                code: contracts.BRIDGE_CON,
                scope: "DAI",
                table: tables.FEE_TAB,
                json: "true",
            });
            if (usdcreq.rows.length) {
                const fee = await usdcreq.rows[0].minfeewithdraw;
                setUsdcFee(fee);
            }
            if (daireq.rows.length) {
                const fee = await daireq.rows[0].minfeewithdraw;
                setDaiFee(fee);
            }
        };
        getfees();
    }, []);

    useEffect(() => {
        getTokens();
        const getbal = async () => {
            const tokens = await getTokens();
            if (walletConnected && tokens.length) {
                await getBalance(tokens, username);
            }
        };
        if (loggedIn) {
            getbal();
        }
        if (!loggedIn) {
            setUserBalances([]);
        }
    }, [loggedIn]);

    const handleTransfer = async (values) => {
        try {
            const {value, token} = values;
            console.log('value', value, 'token', token)
            const wallet = WalletProvider.getWallet();
            if (!walletConnected) {
                seterrorMsg("Eos wallet is not connected");
            }/* else if (!ethwalletConnected) {
                seterrorMsg("Ethereum wallet is not connected");
            }*/ else if (!!wallet) {
                setLoading(true);
                let account;
                let toAcc;
                account = contracts.TokenContract;
                toAcc = contracts.BRIDGE_CON;
                const result = await wallet.eosApi.transact(
                    {
                        actions: [
                            {
                                account: account,
                                name: Actions.Transfer,
                                authorization: [
                                    {
                                        actor: wallet.auth.accountName,
                                        permission: wallet.auth.permission,
                                    },
                                ],
                                data: {
                                    from: wallet.auth.accountName,
                                    to: toAcc,
                                    quantity: `${parseFloat(value).toFixed(
                                        parseFloat(token.split(",")[0])
                                    )} ${token.split(",")[1]} `,
                                    memo: `Transfer ${token.split(",")[1]} token`,
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
                    setLoading(false);
                    setsuccessMsg("Transaction Success");
                    seterrorMsg("");
                }
            } else {
                setLoading(false);
            }
        } catch (e) {
            seterrorMsg(e.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };





    return (
        <Fragment>

            <section className={styles.homeMain}>
                <Header/>
                <div className="container-fluid">
                    <div className="container90">
                        <div className="col-md-12">
                            <div className="row mt-5">

                                <div className={`col-md-5 ${styles.leftMainBlock}`}>
                                    <h1 className={styles.mainHeading}>
                                        Move across nine realms with Bifrost
                                    </h1>
                                    <h6 className={styles.subHeading}>
                                        Use BiFrost cross-chain bridge to move between blockchains. Now supporting
                                        ethereum
                                        and EOS
                                    </h6>

                                    <img src="/images/group-icons.png" alt="tokens" className={styles.groupToken}/>

                                    <h4 className={styles.totalValueText}>
                                        Now supporting Ethereum to EOS
                                    </h4>
                                    {/*<p className={styles.paraText}>
                                        Use bridge cross-chain bridge to move between ETH is blockchains,Lorem ipsum
                                        dolor
                                        sit amet, consect iuyes adipiscing elit, sed do eiusmod tempor incididunt labore
                                        et
                                        dolore magna aliqua. Ut enim ad minim veniam
                                    </p>
                                    <h4 className={styles.totalValueText}>Total Value Locked (USD): $ 67,429,427.53</h4>
                                    <button className={`${styles.mainBtnDesign} ${styles.viewMoreBtn}`}>view more
                                    </button>*/}
                                </div>

                                <div className="col-md-7">


                                    <div className="tab">
                                        <Link href="/">
                                            <a>
                                                <button className="tablinks">Eth to EOS
                                                    Transfer
                                                </button>
                                            </a>
                                        </Link>
                                        <Link href="/eosToEthTransfer">
                                            <a>
                                                <button className="tablinks">
                                                    EOS to Eth Transfer
                                                </button>
                                            </a>
                                        </Link>
                                    </div>

                                    <div className={styles.gridBlock}>

                                        <h1 className="exchangeHeading">
                                            EOS to Etherum Transfer
                                        </h1>

                                        <Formik
                                            initialValues={initialValues}
                                            validationSchema={schema}
                                            onSubmit={handleTransfer}
                                        >
                                            <Form>
                                                <div className="row">


                                                    {balances.map((balance) => (
                                                        <div className="text-info">{balance}</div>
                                                    ))}

                                                    <div className={`col-md-12 ${styles.firstSingleInput}`}>
                                                        <label className={styles.white}
                                                               htmlFor="token">Token</label>
                                                        <Field name="token"
                                                               className={`form-control primaryInput ${styles.formControl}`}
                                                               component="select">
                                                            <option value="6,USDC">USDC</option>
                                                            <option value="6,DAI">DAI</option>
                                                        </Field>
                                                        <p className="text-danger mt-2 errorInput">
                                                            <ErrorMessage name="token"/>
                                                        </p>
                                                    </div>


                                                    <div className="col-md-12 mt-3">
                                                        <label className={styles.white} htmlFor="value">
                                                            Amount</label>
                                                        <Field name="value"
                                                               className={`form-control primaryInput ${styles.formControl}`}
                                                               placeholder="Enter Amount"/>
                                                        <p className="text-danger mt-2 errorInput">
                                                            <ErrorMessage name="value"/>
                                                        </p>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <p className="text-info">
                                                            Note: Current withdraw fee is {usdcfee} and {daifee} set
                                                        </p>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className={styles.buttonBlock}>
                                                            <button type="submit" disabled={loading}
                                                                    className={styles.mainBtnDesign}>
                                                                {loading ? <Loader color={"#fff"} type="Oval" width={40}
                                                                                   height={45}/> : "Send Token"}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12 mt-3">
                                                        {errorMsg ? (
                                                            <p className="text-danger">{errorMsg}</p>
                                                        ) : (
                                                            <div className="text-success">{successMsg}</div>
                                                        )}
                                                    </div>


                                                </div>
                                            </Form>
                                        </Formik>
                                    </div>

                                </div>
                                <div className="col-md-12">
                                    <img src="/images/pngwing1.png" className="sideThorImg"/>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </Fragment>
    )
}

export default EosToEthTransfer