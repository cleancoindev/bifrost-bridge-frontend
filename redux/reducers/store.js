import {combineReducers, createStore} from 'redux'
import ethReducer from './eth.reducer'
import userReducer from './user.reducer'
import modalsReducer from "./modalReducers";

const rootReducer = combineReducers({
    user: userReducer,
    address: ethReducer,
    modals: modalsReducer
})

const store = createStore(rootReducer)

export default store