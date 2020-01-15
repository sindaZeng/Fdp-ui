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

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/vue-element-admin/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}
