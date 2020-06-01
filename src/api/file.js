import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'admin/file/page',
    method: 'get',
    params: query
  })
}

export function delFile(id) {
  return request({
    url: 'admin/file/' + id,
    method: 'delete'
  })
}

export function detail(id) {
  return request({
    url: 'admin/file/detail/' + id,
    method: 'get'
  })
}
