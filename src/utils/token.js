const TOKEN_KEY = 'pc-token'

//保存token
const setToken = (token) => {
    return window.localStorage.setItem(TOKEN_KEY, token)
}

//获取token
const getToken = () => {
    return window.localStorage.getItem(TOKEN_KEY)
}

//移除token
const removeToken = () => {
    return window.localStorage.removeItem(TOKEN_KEY)
}

//判断是否授权
const isAuth = () => {
    return getToken() !== null
}

export { setToken, getToken, removeToken, isAuth }