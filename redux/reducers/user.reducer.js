const initialState = {
    walletConnected: false,
    username: '',
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                walletConnected: true,
                username: action.username
            }

        case "LOGOUT":
            return {
                ...state,
                walletConnected: false,
                username: ''
            }
        default:
            return state
    }
}

export default userReducer