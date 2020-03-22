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

export function userPage(data) {
  return request({
    url: 'admin/user/userPage',
    method: 'get',
    params: data
  })
}

export function logout() {
  return request({
    url: 'FDP-auth/token/logout',
    method: 'post'
  })
}

export function lockUser(userId) {
  return request({
    url: 'admin/user/'+userId,
    method: 'get'
  })
}

export function deleteUser(userId) {
  return request({
    url: 'admin/user/'+userId,
    method: 'delete'
  })
}
