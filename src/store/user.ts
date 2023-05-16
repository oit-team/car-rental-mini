import { defineStore } from 'pinia'
import { post } from '@/api'
import { setToken } from '@/utils/token'

interface UserProfile {
  userId?: number
  userName?: string
  orgId?: number
  nickName?: string
  userRole?: number
  phoneNum?: number
  sex?: string
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile>()

  const setUserProfile = (data: UserProfile) => {
    profile.value = data
  }

  // 更新用户信息
  const updateUserProfile = async () => {
    const { body } = await post('/system/login/getUserToken')
    profile.value = body
    setToken(body.accessToken)
  }

  // 获取用户信息
  const getUserProfile = async () => {
    !profile.value && await updateUserProfile()
    return profile.value
  }

  // 清除用户信息
  const clearUserProfile = async () => {
    profile.value = undefined
  }

  const logged = computed(() => !!profile.value)

  return {
    profile: readonly(profile),
    logged: readonly(logged),
    setUserProfile,
    updateUserProfile,
    getUserProfile,
    clearUserProfile,
  }
})
