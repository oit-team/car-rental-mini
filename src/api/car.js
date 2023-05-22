import { post } from './index'

export function getVehicleBrandSeriesModel() {
  return post('/vehicle/vehicle/getVehicleBrandSeriesModel')
}

/**
 * 查看车辆违章信息
 * @param params
 */
export function getViolationInfo(params) {
  return post('/vehicle/vehicle/getViolationInfo', params)
}

/**
 * 车辆列表
 */
export function getVehicleList(params) {
  return post('/vehicle/vehicle/getVehicleList', params)
}

/**
 * 车辆列表
 */
export function getVehicleDetailed(params) {
  return post('/vehicle/vehicle/getVehicleDetailed', params)
}

/**
 * 车辆流水
 */
export function getT3OperationalDataList(params) {
  return post('/vehicle/vehicle/getT3OperationalDatas', params)
}

/**
 * 自营租赁订单详情
 */
export function getLeaseOrderInfo(params) {
  return post('/order/leaseOrder/getLeaseOrderInfo', params)
}

/**
 * T3租赁订单详情
 */
export function getT3LeaseOrderInfo(params) {
  return post('/order/leaseOrder/getT3LeaseOrderInfo', params)
}

/**
 * 车牌号检索
 */
export function getVehicles(params) {
  return post('/vehicle/vehicle/getVehicles', params)
}
