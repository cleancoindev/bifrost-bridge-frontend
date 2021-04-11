import 'bootstrap/dist/css/bootstrap.min.css'
import {Provider} from "react-redux";
import '../styles/globals.css'
import {ToastProvider} from "react-toast-notifications";
import store from '../redux/reducers/store'
import Layout from "../component/Layout/Layout";


function MyApp({Component, pageProps}) {

    return (
        <Provider store={store}>
            <ToastProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ToastProvider>
        </Provider>
    )
}

export default MyApp
