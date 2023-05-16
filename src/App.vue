<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { clearToken, hasToken } from '@/utils/token'
import { useUserStore } from '@/store/user'
import { toast } from '@/utils/helper'

const store = useUserStore()

onLaunch(async () => {
  if (hasToken()) {
    store.updateUserProfile().catch(() => {
      store.clearUserProfile()
      clearToken()
      uni.reLaunch({
        url: '/pages/account/login',
      })
    })
  }
  else {
    await store.clearUserProfile()
    await uni.showToast({ title: '先登录' })
    clearToken()
    await uni.reLaunch({
      url: '/pages/account/login',
    })
  }
})
onShow(() => {
  console.info('App Show')
})
onHide(() => {
  console.info('App Hide')
})
</script>

<style>
page {
  height: 100vh;
  background-color: #f8f8f8;
}
</style>
