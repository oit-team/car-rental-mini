<script>
import { userLogout } from '@/api/account'
import { useUserStore } from '@/store/user'

export default {
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState(useUserStore, ['profile', 'logged']),
  },
  methods: {
    logout() {
      if (!this.logged) {
        uni.reLaunch({
          url: '/pages/login/login',
        })
        return
      }
      this.$dialog.confirm({
        title: '提示',
        message: '确认退出登录',
      }).then(async () => {
        await userLogout({})
        uni.reLaunch({
          url: '/pages/login/login',
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
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-neutral-100">
    {{ profile }}
    <view class="flex-1 rounded-xl w-full">
      <view class="w-full flex flex-col justify-center items-center py-3">
        <van-image
          width="5rem"
          height="5rem"
          round
          :src="userInfo.headPortrait"
        />
        <view class="pt-1 text-[#34495e] text-sm">
          {{ userInfo.nickName || '' }}
        </view>
      </view>
      <van-cell-group inset>
        <van-cell title="修改密码" is-link @click="uni.navigateTo({ url: '/pages/my/editPassword' })">
          <van-icon slot="icon" name="edit" size="18" class="mr-2" />
        </van-cell>
        <!--        <van-cell title="申请租车" is-link @click="uni.navigateTo({ url: '/pages/my/rental/rent' })"> -->
        <!--          <van-icon slot="icon" name="balance-o" size="18" class="mr-2" /> -->
        <!--        </van-cell> -->
        <!--        <van-cell title="申请退车" is-link @click="uni.navigateTo({ url: '/pages/my/rental/rentingOut' })"> -->
        <!--          <van-icon slot="icon" name="refund-o" size="18" class="mr-2" /> -->
        <!--        </van-cell> -->
        <!--        <van-cell title="联系我们" is-link @click="uni.navigateTo({ url: '/pages/my/agreement' })"> -->
        <!--          <van-icon slot="icon" name="phone-o" size="18" class="mr-2" /> -->
        <!--        </van-cell> -->
        <van-cell title="版本号" is-link />
      </van-cell-group>
      <view class="w-full mt-2 flex justify-center">
        <view class="w-1/2 ">
          <van-button
            type="info"
            block
            plain
            round
            class="w-full"
            @click="logout()"
          >
            {{ logged ? '退出登录' : '去登录' }}
          </van-button>
        </view>
      </view>
    </view>
  </container>
</template>

<style scoped>
::v-deep .van-image {
  display: block;
}
</style>
