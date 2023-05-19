import { post } from '@/api/index'

/**
 * T3租赁订单详情
 */
export function getWorkOrderList(params) {
  return post('/workFlow/workFlow/getWorkOrderList', params)
}

/**
 * T3租赁订单详情
 */
export function getWorkFlowSteps(params) {
  return post('/workFlow/workFlow/getWorkFlowSteps', params)
}
