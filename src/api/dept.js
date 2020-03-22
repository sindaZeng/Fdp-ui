import request from '@/utils/request'

export function getDeptTree() {
  return request({
    url: 'admin/dept/tree',
    method: 'get'
  })
}
