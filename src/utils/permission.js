import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
// export default function checkRole(value) {
//   if (value && value instanceof Array && value.length > 0) {
//     const roles = store.getters && store.getters.roles
//     const routes = store.getters && store.getters.routes
//     const permissionRoles = value
//     const hasPermission = roles.some(role => {
//       return permissionRoles.includes(role)
//     })
//     if (!hasPermission) {
//       return false
//     }
//     return true
//   } else {
//     return false
//   }
// }

export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = store.getters && store.getters.permissions
    const permissionRoles = value
    const hasPermission = permissions.some(role => {
      return permissionRoles.includes(role)
    })
    if (!hasPermission) {
      return false
    }
    return true
  } else {
    return false
  }
}
