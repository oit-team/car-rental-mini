import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const profile = ref<{
    userId: number
    userName: string
  }>()

  // 清除用户信息
  const clearUserProfile = () => {
    profile.value = undefined
  }

  return {
    profile: readonly(profile),
    clearUserProfile,
  }
})
