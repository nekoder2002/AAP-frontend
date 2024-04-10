import { http } from "@/utils"
import { makeAutoObservable, runInAction } from "mobx"

class CountStore {
    constructor() {
        this.countInfo = {}
        makeAutoObservable(this)
    }

    async getCountInfo() {
        const res1 = await http.get('/team/count?admin=true')
        const res2 = await http.get('/team/count?admin=false')
        const res3 = await http.get('/paper/count')
        const res4 = await http.get('/kb/count')
        runInAction(() => {
            this.countInfo.m_team = res1.data.count
            this.countInfo.team = res2.data.count
            this.countInfo.paper = res3.data.count
            this.countInfo.kb = res4.data.count
        })
    }
}

export default CountStore