import {Fragment} from "react";

const Footer = () => {
    return (
        <Fragment>
            <footer className="footerBlock">
                <img src="/images/footer-stone.png" alt="footer" className="footerStone"/>
                <p className="footerCopyright">
                    Copyright © 2021 usdbridge blockstart. All rights reserved.
                </p>
            </footer>
        </Fragment>
    )
}

export default Footer