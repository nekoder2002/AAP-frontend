import axios from "axios"
import { getToken, removeToken } from "./token"
import { history } from "./history"

const http = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000
})

//添加请求拦截器
http.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})

//添加响应拦截器
http.interceptors.response.use((response) => {
    if (response.data.code % 10 === 0) {
        if (response.data.code === 20000) {
            removeToken()
            history.push('/login')
            return Promise.reject('登陆过期，请重新登录');
        } else if (response.data.code === 10000) {
            return Promise.reject(response.data.message);
        }
        return Promise.reject(response.data);
    } else {
        return response.data;
    }
}, (error) => {
    console.log(error);
    return Promise.reject('与服务器连接异常，请稍后重试');
})

export { http }