import { makeAutoObservable, runInAction } from "mobx"
import { getToken, http, setToken, removeToken } from "@/utils"

class LoginStore {
    constructor() {
        //用户token
        this.token = getToken() || '';
        makeAutoObservable(this);
    }

    //登录
    login = async (email, password) => {
        const res = await http.get(`/user/login?email=${email}&password=${password}`);
        runInAction(() => {
            this.token = res.data.user.token;
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