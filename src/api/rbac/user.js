import service from '@/utils/request'

export function login(data) {
  return service({
    baseURL: process.env.VUE_APP_AUTH_API,
    url: '/api/token-obtain',
    method: 'post',
    data
  })
}

export function getInfo() {
  return service({
    baseURL: process.env.VUE_APP_AUTH_API,
    url: '/user/getuserinfo/',
    method: 'get'
  })
}

export function logout() {
  return service({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function getUsers() {
  return service({
    baseURL: process.env.VUE_APP_AUTH_API,
    url: '/user/',
    method: 'get'
  })
}

export function addUser(data) {
  return service({
    baseURL: process.env.VUE_APP_AUTH_API,
    url: '/user/',
    method: 'post',
    data
  })
}

export function updateUser(id, data) {
  return service({
    baseURL: process.env.VUE_APP_AUTH_API,
    url: `/user/${id}/`,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return service({
    baseURL: process.env.VUE_APP_AUTH_API,
    url: `/user/${id}/`,
    method: 'delete'
  })
}
