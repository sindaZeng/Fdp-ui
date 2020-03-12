import request from '@/utils/request'

export function getMenu() {
  return request({
    url: 'admin/menu',
    method: 'get'
  })
}

export function getRoleTree(roleId) {
  return request({
    url: 'admin/menu/tree/'+ roleId,
    method: 'get'
  })
}

export function getMenuTree() {
  return request({
    url: 'admin/menu/tree',
    method: 'get'
  })
}
