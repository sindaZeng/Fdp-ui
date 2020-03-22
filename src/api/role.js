import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'FDP-upmm-business/role/pageList',
    method: 'get',
    params: query
  })
}

export function delRole(id) {
  return request({
    url: 'FDP-upmm-business/role/' + id,
    method: 'delete'
  })
}

export function createRole(data) {
  return request({
    url: 'FDP-upmm-business/role/save',
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
    url: 'FDP-upmm-business/role/menus',
    method: 'post',
    params: {
      roleId: roleId,
      menuIds: menuIdStr
    }
  })
}
