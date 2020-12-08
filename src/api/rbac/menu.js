import request from '@/utils/request'

export function getRoutes() {
  return request({
    baseURL: process.env.VUE_APP_AUTH_API,
    url: '/route/',
    method: 'get'
  })
}

export function addRoute(data) {
  return request({
    baseURL: process.env.VUE_APP_AUTH_API,
    url: '/route/',
    method: 'post',
    data
  })
}

export function updateRoute(id, data) {
  return request({
    baseURL: process.env.VUE_APP_AUTH_API,
    url: `/route/${id}/`,
    method: 'put',
    data
  })
}

export function deleteRoute(id) {
  return request({
    baseURL: process.env.VUE_APP_AUTH_API,
    url: `/route/${id}/`,
    method: 'delete'
  })
}
