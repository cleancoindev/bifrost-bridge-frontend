import {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";
import {showConnectModal} from "../../redux/actions/modalActions";
import ConnectTokenModal from "../ConnectModal/connectModal";
import WalletProvider from "../../utils/walletProvider";
import {login} from "../../redux/actions/actions";

const Header = () => {

    const dispatch = useDispatch()
    const selector = useSelector(state => state)

    console.log('selector state', selector)






    return (
        <Fragment>

            <section className="headerBlock">
                <div className="container">
                    <div className="col-md-12">
                        <div className="row d-flex flex-row">
                            <div className="headerLogoBlock">
                                <Link href="/">
                                    <a className="nav-logo-link">
                                        <img src="/images/Logo.png" className="headerLogo"
                                             alt="logo"/>
                                    </a>
                                </Link>
                            </div>


                            <div className="ml-auto mtb-auto">
                                <div className="navbar-collapse offcanvas-collapse">

                                    <ul className="navbar-nav mr-auto hideDesktop">
                                        <li className="nav-item">
                                            <Link href="/modify-etherum">
                                                <a className="nav-link" href="#">Modify Ethereum</a>
                                            </Link>

                                        </li>
                                        <li className="nav-item">
                                            <Link href="/update-price">
                                                <a className="nav-link" href="#">Update Price</a>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link href="/connect">
                                                <a>
                                                    <button className="btn btnBlue">Connect</button>
                                                </a>
                                            </Link>
                                        </li>

                                    </ul>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </section>

            <ConnectTokenModal/>

        </Fragment>
    )
}

export default Header