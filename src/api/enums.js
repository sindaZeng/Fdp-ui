import request from '@/utils/request'

export function get(data) {
  return request({
    url: 'admin/enum/'+ data,
    method: 'get',
  })
}
