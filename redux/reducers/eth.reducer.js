const initialState = {
    ethWalletConnected: false,
    address: '',
}

const ethReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ETHLOGIN":
            return {
                ...state,
                ethWalletConnected: true,
                address: action.address
            }
        default:
            return state
    }
}

export default ethReducer