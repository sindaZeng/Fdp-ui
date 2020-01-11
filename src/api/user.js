import request from '@/utils/request'

export function login(username, password) {
  const grant_type = 'password'
  return request({
    url: 'FDP-auth/oauth/token',
    headers: {
      isToken: false,
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic d2ViOjEyMzQ1Ng=='
    },
    method: 'post',
    params: { username, password, grant_type }
  })
}

export function getInfo() {
  return request({
    url: 'FDP-upmm-business/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
