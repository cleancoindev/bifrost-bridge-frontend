import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import WalletProvider from "../../utils/walletProvider";
import {login} from "../../redux/actions/actions";
import Head from "next/head";


const Layout = (props) => {

    const {children} = props

    const dispatch = useDispatch();
    const [loggedIn, setLoggedIn] = useState(false);

    const toggleLogin = (logged) => {
        setLoggedIn(logged);
    };

    useEffect(() => {
        const connectWallet = async (walletType) => {
            try {
                await WalletProvider.login(walletType);
                const wallet = WalletProvider.getWallet();

                if (!!wallet) {
                    dispatch(login({username: wallet?.auth?.accountName}));
                    toggleLogin(true);
                }
            } catch (e) {
                console.log("something went wrong ", e);
            }
        };

        const walletType = localStorage.getItem("walletType");

        if (!!walletType) {
            let wallet = parseInt(walletType);

            if (wallet >= 0) {
                connectWallet(wallet);
            }
        }
    }, []);

    return (
        <Fragment>
            <Head>
                <title>BiFrost</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
                <meta name="msapplication-TileColor" content="#da532c"/>
                <meta name="theme-color" content="#ffffff"/>
            </Head>
            <div>
                {children}
            </div>
        </Fragment>
    );
}

export default Layout