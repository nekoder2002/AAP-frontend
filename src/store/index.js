import { createContext, useContext } from "react"
import LoginStore from "@/store/login.Store"
import UserStore from "@/store/user.Store"
import CountStore from "./count.Store";

class RootStore {
    //组合模块
    constructor() {
        this.loginStore = new LoginStore();
        this.userStore = new UserStore();
        this.countStore=new CountStore();
    }
}

//导入useStore方法组件使用数据
const context = createContext(new RootStore())
export const useStore = () => useContext(context)