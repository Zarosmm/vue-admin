import request from '@/utils/request'

export function getRoles() {
  return request({
    baseURL: process.env.VUE_APP_AUTH_API,
    url: '/role/',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    baseURL: process.env.VUE_APP_AUTH_API,
    url: '/role/',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    baseURL: process.env.VUE_APP_AUTH_API,
    url: `/role/${id}/`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    baseURL: process.env.VUE_APP_AUTH_API,
    url: `/role/${id}/`,
    method: 'delete'
  })
}
