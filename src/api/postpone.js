import { post } from './index'

export function selectOrderInfoAndRentInspection(params) {
  return post('/order/leaseOrder/selectOrderInfoAndRentInspection', params)
}
