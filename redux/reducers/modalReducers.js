const initialState = {
    connectTokenModal: false
}

const modalsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SHOW_LOGIN_MODAL":
            return {
                ...state,
                connectTokenModal: true,
            }

        case "HIDE_LOGIN_MODAL":
            return {
                ...state,
                connectTokenModal: false,
            }
        default:
            return state
    }
}

export default modalsReducer