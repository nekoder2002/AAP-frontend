import { http } from "@/utils"
import { makeAutoObservable, runInAction } from "mobx"

class UserStore {
    constructor() {
        this.userInfo = {}
        makeAutoObservable(this)
    }

    async getUserInfo() {
        const res = await http.get('/user/profile')
        runInAction(()=>{
            this.userInfo = res.data.data
        })
    }
}

export default UserStore