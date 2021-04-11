import {Fragment, useState} from "react";
import WalletProvider from '../../utils/walletProvider'
import {login} from '../../redux/actions/actions'
import {useDispatch, useSelector} from 'react-redux'
import {useToasts} from 'react-toast-notifications'
import {hideConnectModal} from "../../redux/actions/modalActions";
import Loader from "react-loader-spinner";


const ConnectTokenModal = () => {

    const dispatch = useDispatch()
    const selector = useSelector(state => state)

    const {addToast} = useToasts()
    const [modal, setModal] = useState(true)
    const tokenList = [
        {
            image: "images/tokens/scatter.png",
            name: "Scatter",
            index: 0
        },
        {
            image: "images/tokens/anchor.svg",
            name: "Anchor",
            index: 1
        },

    ]


    const [loading, setLoading] = useState(false)
    const [active, setActive] = useState(-1)

    const closeModal = () => {
        dispatch(hideConnectModal())
    }

    const connectWallet = async (index) => {

        try {
            console.log('started connecting')
            setActive(index)
            setLoading(true)
            await WalletProvider.login(index)
            const wallet = WalletProvider.getWallet()
            console.log('wallet', wallet)
            dispatch(login({username: wallet?.auth?.accountName}))
            addToast('Wallet Connected', {appearance: 'success', autoDismiss: true})
            localStorage.setItem("walletType", index.toString());
            closeModal()
            console.log('connection done')

        } catch (e) {
            closeModal()
            addToast('Failed to connect', {appearance: 'error', autoDismiss: true})
        } finally {
            setLoading(false)
            setActive(-1)
        }
    }



    return (
        <Fragment>
            <div className={`modal modal-backdrop connectTokenModal ${selector.modals.connectTokenModal ? 'show' : ''} `} tabIndex="-1"
                 role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">

                        <div className="modal-body blueBg" >

                            <div className="d-flex flex-row mt-3">
                                <h5 className="connectTokenModalHeading">
                                    Select a wallet
                                </h5>
                                <div className="ml-auto p-2 mtb-auto">
                                    <button type="button" onClick={closeModal}
                                            className="close text-white pull-right">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </div>

                            {tokenList.map((token) => {
                                return (
                                    <Fragment>

                                        <div className="connectTokenBorder" onClick={() => connectWallet(token.index)}>
                                            <div className="col-md-12">
                                                <div className="row">
                                                    <div className="col-md-10">
                                                        <h4 className="connectTokenName">
                                                            <img src={token.image}
                                                                 alt={token.name}
                                                                 className="connectTokenImg"/>
                                                            {token.name}
                                                        </h4>
                                                    </div>
                                                    <div className="col-md-2">
                                                        {(loading && active === token.index) &&
                                                        <div className="loaderConnect">
                                                            <Loader color={"#fff"} type="Oval" width={40} height={45}/>
                                                        </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Fragment>
                                )
                            })
                            }


                        </div>

                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default ConnectTokenModal