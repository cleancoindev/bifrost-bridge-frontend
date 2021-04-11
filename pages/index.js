import {Fragment, useState} from "react";
import {useSelector} from "react-redux";
import {ErrorMessage, Field, Form, Formik} from "formik";
import Header from "../component/Header/Header";
import styles from "../styles/Home.module.css"
import * as Web3 from "web3";
import * as Yup from "yup";
import {Docs} from "../utils/config";
import {bridgeAbi, bridgeAddress, daiAddress, tokenAbi, usdcAddress,} from "../utils/abi";
import Loader from "react-loader-spinner";
import {useRouter} from "next/router";
import Link from "next/link";


const web3 = new Web3(Web3.givenProvider);

const schema = Yup.object().shape({
    value: Yup.number()
        .required("Enter value of token")
        .test(
            "lowAmount",
            `Should be greater than 0`,
            (val) => parseFloat(val) > 0
        ),
    token: Yup.string().required("Select a token type"),
});

const initialValues = {
    value: "",
    token: "USDC",
};

const usdcContract = new web3.eth.Contract(tokenAbi, usdcAddress);
const daiContract = new web3.eth.Contract(tokenAbi, daiAddress);
const brigeContract = new web3.eth.Contract(bridgeAbi, bridgeAddress);


const EthToEosTransfer = () => {

    const router = useRouter()
    const walletConnected = useSelector((state) => state.user.walletConnected);
    const address = useSelector((state) => state.address.address);
    const ethwalletConnected = useSelector(
        (state) => state.address.ethWalletConnected
    );
    const [loading, setLoading] = useState("");
    const [checked, setChecked] = useState(false);
    const [errorMsg, seterrorMsg] = useState("");
    const [successMsg, setsuccessMsg] = useState("");
    const [approvedMsg, setapprovedMsg] = useState("");

    const sendToken = async (stakeAMount, tokenId) => {
        brigeContract.methods
            .sendToken(stakeAMount, tokenId)
            .send({
                from: address,
            })
            .on("transactionHash", (hash) => {
                console.log("transactionHash  sendToken", hash);
            })
            .on("receipt", (receipt) => {
                console.log("receipt sendToken", receipt);
                setLoading(false);
                setsuccessMsg(receipt.transactionHash);
            })
            .on("confirmation", (confirmationNumber, receipt) => {
                console.log("confirmationNumber sendToken", confirmationNumber);
                console.log("receipt sendToken", receipt);
            })
            .on("error", (error) => {
                console.log("error sendToken", error);
                setLoading(false);
                seterrorMsg(error.message);
            });
    };

    const approveAndSendToken = async (stakeAMount, tokenId, token) => {
        console.log("inside approve and send token");

        setLoading(true);

        const contract = token === "USDC" ? usdcContract : daiContract;

        let approvedAmount = "";

        if (checked) {
            approvedAmount =
                token === "USDC"
                    ? web3.utils.toWei("10000000000000000", "mwei")
                    : web3.utils.toWei("10000000000000000", "ether");
        } else {
            approvedAmount = stakeAMount;
        }

        console.log("approved amount ", approvedAmount);

        contract.methods
            .approve(bridgeAddress, approvedAmount)
            .send({
                from: address,
            })
            .on("transactionHash", (hash) => {
                console.log("transactionHash approve ", hash);
            })
            .on("receipt", (receipt) => {
                console.log("receipt approve", receipt);
                setapprovedMsg(receipt.transactionHash);
            })
            .on("confirmation", (confirmationNumber, receipt) => {
                console.log("confirmationNumber approve", confirmationNumber);
                console.log("receipt approve", receipt);
            })
            .on("error", (error) => {
                console.log("error approve", error);
                setLoading(false);
                seterrorMsg(error.message);
            })
            .then(() => {
                brigeContract.methods
                    .sendToken(stakeAMount, tokenId)
                    .send({
                        from: address,
                    })
                    .on("transactionHash", (hash) => {
                        console.log("transactionHash  sendToken", hash);
                    })
                    .on("receipt", (receipt) => {
                        console.log("receipt sendToken", receipt);
                        setLoading(false);
                        setsuccessMsg(receipt.transactionHash);
                    })
                    .on("confirmation", (confirmationNumber, receipt) => {
                        console.log("confirmationNumber sendToken", confirmationNumber);
                        console.log("receipt sendToken", receipt);
                    })
                    .on("error", (error) => {
                        console.log("error sendToken", error);
                        setLoading(false);
                        seterrorMsg(error.message);
                    });
            });
    };


    const handleSubmit = async (values) => {
        console.log("values ", values);

        if (!address) {
            alert("Please connect to metamask first");
            return;
        }

        const {value, token} = values;

        console.log("value ", value);

        const tokenId = token === "USDC" ? 0 : 1;

        const contract = token === "USDC" ? usdcContract : daiContract;

        const stakeAMount =
            token === "USDC"
                ? web3.utils.toWei(value, "mwei")
                : web3.utils.toWei(value, "ether");

        console.log("stakeAMount ", stakeAMount);

        const approvedAmount = await contract.methods
            .allowance(address, bridgeAddress)
            .call();

        console.log("approvedAmount in contract ", approvedAmount);

        if (approvedAmount > stakeAMount) {
            sendToken(stakeAMount, tokenId);
        } else {
            approveAndSendToken(stakeAMount, tokenId, token);
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


                                    <div className="tab tabBlock">
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
                                            Etherum To EOS Transfer
                                        </h1>

                                        <Formik
                                            initialValues={initialValues}
                                            validationSchema={schema}
                                            onSubmit={handleSubmit}
                                        >
                                            <Form>
                                                <div className="row">
                                                    <div className="col-md-12">

                                                        <label className={styles.white}
                                                               htmlFor="token">Token</label>
                                                        <Field name="token"
                                                               className={`form-control primaryInput ${styles.formControl}`}
                                                               component="select">
                                                            <option value="USDC">USDC</option>
                                                            <option value="DAI">DAI</option>
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

                                                    <div className={`col-md-6 ${styles.InfiniteApprovalBlock}`}>
                                                        <input type="checkbox"
                                                               name="infiniteApproval"
                                                               checked={checked}
                                                               onChange={() => setChecked(!checked)}
                                                               disabled={loading} className={styles.checkBox}
                                                        />

                                                        <label className={styles.InfiniteApprovalText}
                                                               htmlFor="infiniteApproval">
                                                            Infinite approval
                                                        </label>
                                                    </div>

                                                    <div className={`col-md-6 ${styles.needHelpBlock}`}>
                                                        <a href="https://t.me/dad_token" className={styles.needHelpText}>
                                                            Need Help ?
                                                        </a>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className={styles.buttonBlock}>
                                                            <button type="submit"
                                                                    disabled={loading}
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

export default EthToEosTransfer