import request from '@/utils/request'

export function getInfo() {
  return request({
    url: 'admin/user/info',
    method: 'get'
  })
}

export function createUser(data) {
  return request({
    url: 'admin/user',
    method: 'post',
    data
  })
}

export function userPage(data) {
  return request({
    url: 'admin/user/page',
    method: 'get',
    params: data
  })
}

export function lockUser(userId) {
  return request({
    url: 'admin/user/'+userId,
    method: 'post'
  })
}

export function deleteUser(userId) {
  return request({
    url: 'admin/user/'+userId,
    method: 'delete'
  })
}

export function updateUser(data) {
  return request({
    url: 'admin/user',
    method: 'put',
    data
  })
}

export function getUserById(userId) {
  return request({
    url: 'admin/user/'+userId,
    method: 'post'
  })
}
