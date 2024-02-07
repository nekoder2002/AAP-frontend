import { http } from "@/utils"
import { makeAutoObservable, runInAction } from "mobx"

class UserStore {
    constructor() {
        this.user = {}
        makeAutoObservable(this)
    }

    // 获取个人基本信息
    async getMe() {
        const res = await http.get('/user/me');
        runInAction(()=>{
            this.user = res.data.user;
        });
    }
}

export default UserStore