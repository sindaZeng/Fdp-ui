import Cookies from 'js-cookie'
import Layout from '@/layout/index'

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

const routerMap = {
  sys_admin_manager: () => import('@/views/admin/roles/index'),
  layoutStr: Layout
}
/**
 *
 * @param {arr} clientAsyncRoutes 前端保存动态路由
 * @param {arr} serverRouter 后端保存动态路由M  () => import('@/views/admin/roles/index')
 */
export function makePermissionRouters(clientAsyncRoutes, serverRouter) {
  serverRouter.map(ele => {
    const newRooter = {
      path: ele.path || '',
      // component: ele.children.length === 0 ? routerMap['sys_admin_manager'] : routerMap['layoutStr'],
      // component: Layout,
      component(resolve) {
        if (ele.children.length === 0) {
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
    // let roles_obj
    // for (let i = 0; i < serverRouter.length; i++) {
    //   const element = serverRouter[i]
    //   if (ele.name === element.name) {
    //     roles_obj = element
    //   }
    // }
    // ele.meta.roles = roles_obj.meta.roles
    //
    // if (ele.children) {
    //   makePermissionRouters(serverRouter, ele.children)
    // }
    clientAsyncRoutes.push(newRooter)
  })
  return clientAsyncRoutes
}
