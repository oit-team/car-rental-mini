<script>
import crypto from '../../utils/crypto'
import { getCode, userLogin } from '@/api/account'

export default {
  name: 'Index',
  data() {
    return {
      username: '',
      password: '',
      checkCode: '',
      imgCode: '',
    }
  },
  onLoad() {
  },
  onShow() {
    this.getCode()
  },
  methods: {
    async getCode() {
      const res = await getCode({}, {
        responseType: 'arraybuffer',
      })
      if (res)
        this.imgCode = `data:image/png;base64,${uni.arrayBufferToBase64(res)}`
    },

    async login() {
      if (this.username === '')
        return this.$toast('请输入账号')
      if (this.password === '')
        return this.$toast('请输入密码')
      if (this.checkCode === '')
        return this.$toast('请输入验证码')

      this.$toast.loading({
        message: '正在登录...',
        forbidClick: true,
        duration: 0,
      })
      const res = await userLogin({
        userName: this.username.trim(),
        passWord: crypto.encrypt(this.password.trim()),
        checkCode: this.checkCode.trim(),
      })
      this.$toast.clear()
      uni.setStorageSync('token', res.body.accessToken)
      this.$store.commit('setUserInfo', res.body)
      uni.switchTab({
        url: '/pages/index/index',
      })
    },
  },
}
</script>

<template>
  <page classes="flex flex-col items-center">
    <view class="width-4-5 h-full mt-24">
      <view class="w-full flex flex-col justify-center items-center mb-10">
        <van-image
          width="70"
          height="100"
          :src="require('../../static/logo.jpg')"
        />
        <view class="leading-normal mt-2 text-sm text-center">
          浪汛租车系统
        </view>
      </view>
      <van-field
        :value="username"
        placeholder="账号"
        left-icon="contact"
        clearable
        maxlength="50"
        @change="username = $event.detail"
      />
      <van-field
        :value="password"
        left-icon="lock"
        type="password"
        clearable
        maxlength="50"
        placeholder="密码"
        @change="password = $event.detail"
      />
      <view class="w-full flex justify-between gap-1 pl-3 box-border items-center">
        <van-image
          class="my-2"
          width="100"
          height="30"
          :src="imgCode"
          @click="getCode()"
        />
        <van-field
          :value="checkCode"
          class="flex-1"
          center
          clearable
          placeholder="验证码"
          @change="checkCode = $event.detail"
        />
      </view>
      <view class="m-5" @click="login()">
        <van-button round block type="info" native-type="submit">
          登录
        </van-button>
      </view>
    </view>
  </page>
</template>

<style scoped>
::v-deep .van-image {
  display: block;
}

.width-4-5 {
  width: 80%;
}
</style>
