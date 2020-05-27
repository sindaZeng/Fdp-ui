import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'admin/tenant/page',
    method: 'get',
    params: query
  })
}

export function createTenant(data) {
  return request({
    url: 'admin/tenant',
    method: 'post',
    data
  })
}

export function updateTenant(data) {
  return request({
    url: 'admin/tenant',
    method: 'put',
    data
  })
}

export function deleteTenant(id) {
  return request({
    url: 'admin/tenant/'+id,
    method: 'delete'
  })
}
