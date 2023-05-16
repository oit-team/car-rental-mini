<script>
import { mapActions } from 'pinia'
import crypto from '../../utils/crypto'
import { getCode, userLogin } from '@/api/account'
import { useUserStore } from '@/store/user'
import { promiseLoading } from '@/utils/helper'
import { setToken } from '@/utils/token'

export default defineComponent({
  name: 'index',
  data() {
    return {
      username: '',
      password: '',
      checkCode: '',
      imgCode: '',
    }
  },
  computed: {
  },
  onLoad() {
  },
  onShow() {
    this.getCode()
  },
  methods: {
    ...mapActions(useUserStore, { setUser: 'setUserProfile' }),
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

      const res = await promiseLoading(
        userLogin({
          userName: this.username,
          passWord: crypto.encrypt(this.password),
          checkCode: this.checkCode,
        }),
        '正在登录...',
      )
      setToken(res.body.accessToken)
      this.setUser(res.body)
      await uni.switchTab({
        url: '/pages/index/index',
      })
    },
  },
})
</script>

<template>
  <page classes="flex flex-col items-center">
    <view class="width-4-5 h-full mt-24">
      <view class="w-full flex flex-col justify-center items-center mb-10">
        <image
          class="w-100px h-100px"
          src="/static/logo.png"
        />
        <view class="leading-normal mt-2 text-sm text-center">
          浪汛租赁系统
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
      <view class="w-full bg-white flex justify-between gap-1 pl-3 box-border items-center">
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
      <view class="my-5" @click="login()">
        <van-button block type="info" native-type="submit">
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
