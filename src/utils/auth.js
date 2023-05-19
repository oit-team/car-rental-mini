import store from '@/store'

// 陪护人员
export const WAITER = 2
// 客户
export const CUSTOMER = 3

// 校验权限
export function checkPermission(role) {
  return store.state.userInfo?.userType === role
}

/**
 * 根据权限执行不同的函数
 * @param {function} condition.waiter 陪护人员
 * @param {function} condition.customer 客户
 */
export function withPermission(condition) {
  if (checkPermission(WAITER)) return condition?.waiter
  else if (checkPermission(CUSTOMER)) return condition?.customer
}

// 验证角色是否是客户
export const isCustomer = () => checkPermission(CUSTOMER)
// 验证角色是否是陪护人员
export const isWaiter = () => checkPermission(WAITER)
