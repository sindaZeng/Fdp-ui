import request from '@/utils/request'

export function getMenu() {
  return request({
    url: 'FDP-upmm-business/menu',
    method: 'get'
  })
}
