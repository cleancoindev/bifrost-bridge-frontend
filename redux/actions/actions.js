export const login = ({ username }) => {
    return {
        type: 'LOGIN',
        username
    }
}

export const Ethlogin = ({ address }) => {
    return {
        type: 'ETHLOGIN',
        address
    }
}

export const logout = () => {
    return {
        type: 'LOGOUT'
    }
}