import { isAuth } from "@/utils"
import { Navigate } from "react-router-dom"


//路由鉴权，未登录访问拦截至登陆页面
function AuthRoute({ children }) {
    //判断token是否存在
    const auth = isAuth()
    if (auth) {
        return <>{children}</>
    } else {
        return <Navigate on to="/login" replace />
    }
}

export default AuthRoute