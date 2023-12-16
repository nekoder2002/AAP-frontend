const { useRoutes } = require("react-router-dom");

/**
 * 配置式路由组件，使用必须为 <*Router> 唯一子组件
 * @param routes 配置路由 json 列表
 */
function ConfiguredRoutes({ routes }) {
    return useRoutes(routes);
}

export default ConfiguredRoutes;