import { http } from "@/utils"
import { makeAutoObservable, runInAction } from "mobx"

class CountStore {
    constructor() {
        this.countInfo = {}
        makeAutoObservable(this)
    }

    async getCountInfo() {
        const res1 = await http.get('/schedule/count')
        const res2 = await http.get('/team/count?admin=false')
        const res3 = await http.get('/paper/count')
        const res4 = await http.get('/kb/count')
        const res5 = await http.get('/team/count_sys')
        const res6 = await http.get('/team/count_check_sys')
        const res7 = await http.get('/user/count_sys')
        
        runInAction(() => {
            this.countInfo.schedule = res1.data.count
            this.countInfo.team = res2.data.count
            this.countInfo.paper = res3.data.count
            this.countInfo.kb = res4.data.count
            this.countInfo.sys_team = res5.data.count
            this.countInfo.sys_check_team = res6.data.count
            this.countInfo.user = res7.data.count
        })
    }
}

export default CountStore