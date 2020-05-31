import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'admin/param/page',
    method: 'get',
    params: query
  })
}
