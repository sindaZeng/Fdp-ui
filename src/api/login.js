import request from "@/utils/request";


export function logout() {
  return request({
    url: 'auth/token/logout',
    method: 'post'
  })
}

export function login(username, password) {
  const grant_type = 'password'
  return request({
    url: 'auth/oauth/token',
    headers: {
      isToken: false,
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic d2ViOjEyMzQ1Ng=='
    },
    method: 'post',
    params: { username, password, grant_type }
  })
}
export function loginByMobile(mobile, code) {
  return request({
    url: 'auth/token/social',
    headers: {
      'Authorization': 'Basic d2ViOjEyMzQ1Ng=='
    },
    method: 'post',
    params: { auth_code: 'SMS@' + mobile, code }
  })
}

export function loginBySocial(state, code) {
  return request({
    url: 'auth/token/social',
    headers: {
      'Authorization': 'Basic d2ViOjEyMzQ1Ng=='
    },
    method: 'post',
    params: { auth_code: state + '@' + code, code }
  })
}
