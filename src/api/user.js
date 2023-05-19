import { post } from './index'

export function getUserByKeyword(params) {
  return post('/system/user/getUserByKeyword', params)
}
