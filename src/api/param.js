import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'admin/param/page',
    method: 'get',
    params: query
  })
}

export function delParam(id) {
  return request({
    url: 'admin/param/' + id,
    method: 'delete'
  })
}

export function createParam(data) {
  return request({
    url: 'admin/param/save',
    method: 'post',
    data
  })
}

export function updateParam(data) {
  return request({
    url: 'admin/param',
    method: 'put',
    data
  })
}
