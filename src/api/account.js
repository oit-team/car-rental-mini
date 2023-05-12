import { post } from './index'

export function userLogin(params) {
  return post('/system/login/userLogin', params)
}

export function getCode(params, config) {
  return post('/system/login/checkCodeImg', params, config)
}

export function getUserToken(params) {
  return post('/system/login/getUserToken', params)
}

export function userLogout(params) {
  return post('/system/login/userLogout', params)
}

export function updatePassWord(params) {
  return post('/system/user/updatePassWord', params)
}
