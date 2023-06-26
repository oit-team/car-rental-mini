import { post } from '@/api/index'

/**
 * 工单列表
 */
export function getWorkOrderList(params) {
  return post('/workFlow/workFlow/getAppWorkOrderList', params)
}

/**
 * 工单详情
 */
export function getWorkFlowSteps(params) {
  return post('/workFlow/workFlow/getWorkFlowSteps', params)
}

/**
 * 延期申请第一步点击确认
 */
export function workOrderApply(params) {
  return post('/workFlow/workFlow/workOrderApply', params)
}

/* 换车申请
 */
export function addVehicleChangeRecords(params) {
  return post('/order/leaseOrder/addVehicleChangeRecords', params)
}

