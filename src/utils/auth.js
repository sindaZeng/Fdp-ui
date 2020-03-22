import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

/**
 *
 * @param {arr} clientAsyncRoutes 前端保存动态路由
 * @param {arr} serverRouter 后端保存动态路由M
 */
export function makePermissionRouters(clientAsyncRoutes, serverRouter) {
  const routeStr = JSON.stringify(clientAsyncRoutes);
  serverRouter.map(ele => {
    if (!routeStr.includes(ele.path)){
      const newRooter = {
        path: ele.path || '',
        component(resolve) {
          if (ele.children===null || ele.children.length === 0) {
            require([`@/views${ele.path}`], resolve)
          }else {
            require(['../layout/index'], resolve)
          }
        },
        redirect: ele.redirect || '',
        name: ele.name,
        children: [],
        meta: { title: ele.name || '', icon: ele.icon || '' }
      }
      if (ele.children) {
        makePermissionRouters(newRooter.children, ele.children)
      }
      clientAsyncRoutes.push(newRooter)
    }
  })
  return clientAsyncRoutes
}
