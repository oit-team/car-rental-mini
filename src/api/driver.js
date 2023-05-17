import { post } from './index'

export function getDriverList(params) {
  return post('/driverServer/driver/getDriverList', params)
}

export function getDriverMap(params) {
  return post('/driverServer/driver/getDriverMap', params)
}

/**
 * 新增司机
 * @param params
 * @returns {Promise<HttpResponse<any>>}
 */
export function addDriverInfo(params) {
  return post('/driverServer/driver/addDriverInfo', params)
}

/**
 * 模糊查询城市
 * @param params
 * @returns {Promise<HttpResponse<any>>}
 */
export function getCitiesName(params) {
  return post('/order/scheme/getCitiesName', params)
}

/**
 * 查询自营租赁订单列表
 * @param params
 * @returns {Promise<HttpResponse<any>>}
 */
export function getLeaseOrderList(params) {
  return post('/order/leaseOrder/getLeaseOrderList', params)
}

/**
 * 查询T3租赁订单列表
 * @param params
 */
export function getT3LeaseOrderList(params) {
  return post('/order/leaseOrder/getT3LeaseOrderList', params)
}
