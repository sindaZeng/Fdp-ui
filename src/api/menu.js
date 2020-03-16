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

export function addMenu(data) {
  return request({
    url: 'admin/menu/',
    method: 'post',
    data
  })
}

export function deleteMenu(Id) {
  return request({
    url: 'admin/menu/'+Id,
    method: 'delete',
  })
}

export function getMenuTree() {
  return request({
    url: 'admin/menu/tree',
    method: 'get'
  })
}
