import { makeAutoObservable, runInAction } from "mobx"
import { getToken, http, setToken, removeToken } from "@/utils"

class LoginStore {
    constructor() {
        //用户token
        this.token = getToken() || '';
        makeAutoObservable(this);
    }

    //登录
    login = async (phone, code) => {
        const res = await http.post('http://geek.itheima.net/v1_0/authorizations', { mobile: phone, code: code });
        runInAction(()=>{
            this.token = res.data.data.token;
        });
        //存入local_storage
        setToken(this.token);
    }

    //退出登录
    loginOut = () => {
        this.token = '';
        removeToken();
    }
}

export default LoginStore;