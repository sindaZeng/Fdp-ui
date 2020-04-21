import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'admin/role/page',
    method: 'get',
    params: query
  })
}

export function rolesList() {
  return request({
    url: 'admin/role/list',
    method: 'get'
  })
}

export function delRole(id) {
  return request({
    url: 'admin/role/' + id,
    method: 'delete'
  })
}

export function createRole(data) {
  return request({
    url: 'admin/role/save',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: 'admin/role/',
    method: 'put',
    data
  })
}


export function updataRoleMenus(roleId, menuIdStr) {
  return request({
    url: 'admin/role/menus',
    method: 'post',
    params: {
      roleId: roleId,
      menuIds: menuIdStr
    }
  })
}
