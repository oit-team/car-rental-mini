<script>
import { userLogout } from '@/api/account'

export default {
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    logged() {
      return this.$store.getters.logged
    },
  },
  onShow() {
  },
  methods: {
    logout() {
      if (!this.logged) {
        uni.reLaunch({
          url: '/pages/account/login',
        })
        return
      }
      this.$dialog.confirm({
        title: '提示',
        message: '确认退出登录',
      }).then(async () => {
        await userLogout({})
        uni.reLaunch({
          url: '/pages/account/login',
        })
      })
    },
    toWriteOff() {
      // uni.navigateTo({
      //   url: '/pages/activity/writeOff',
      // })
    },
    test() {
      // uni.navigateTo({
      //   url: '/pages/activity/text',
      // })
    },
    toEdit() {
      uni.navigateTo({ url: '/pages/account/editPassword' })
    },
  },
}
</script>

<template>
  <page classes="flex flex-col items-center bg-neutral-100">
    <view class="flex-1 rounded-xl w-full">
      <view class="w-full flex flex-col justify-center items-center py-3">
        <van-image
          width="80"
          height="80"
          src="/static/user.png"
          mode="aspectFit"
        />
        <view class="pt-1 text-[#34495e] text-sm">
          {{ userInfo.nickName || '未登录' }}
        </view>
      </view>
      <van-cell-group inset>
        <van-cell title="修改密码" icon="edit" is-link @click="toEdit" />
        <!--        <van-cell title="申请租车" is-link @click="uni.navigateTo({ url: '/pages/my/rental/rent' })"> -->
        <!--          <van-icon slot="icon" name="balance-o" size="18" class="mr-2" /> -->
        <!--        </van-cell> -->
        <!--        <van-cell title="申请退车" is-link @click="uni.navigateTo({ url: '/pages/my/rental/rentingOut' })"> -->
        <!--          <van-icon slot="icon" name="refund-o" size="18" class="mr-2" /> -->
        <!--        </van-cell> -->
        <!--        <van-cell title="联系我们" icon="phone-o" is-link @click="uni.navigateTo({ url: '/pages/my/agreement' })" /> -->
      </van-cell-group>
      <view class="w-full px-4 mt-2 flex justify-center box-border">
        <van-button
          type="info"
          block
          class="w-full"
          @click="logout()"
        >
          {{ logged ? '退出登录' : '去登录' }}
        </van-button>
      </view>
    </view>
  </page>
</template>

<style scoped>
:deep(.van-image) {
    display: block;
}
</style>
