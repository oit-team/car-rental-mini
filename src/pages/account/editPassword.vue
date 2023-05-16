<script>
import crypto from '../../utils/crypto'
import { updatePassWord } from '@/api/account'

export default {
  components: {},
  data() {
    return {
      name: 'Vue',
      oldPassword: '',
      newPassword: '',
      checkPassword: '',
      hide: true,
    }
  },
  computed: {},
  watch: {},
  onShow() {
  },
  methods: {
    async submit() {
      this.oldPassword = this.oldPassword.trim()
      this.newPassword = this.newPassword.trim()
      this.checkPassword = this.checkPassword.trim()
      if (this.oldPassword === '' || this.newPassword === '' || this.checkPassword === '')
        this.$toast('必填项不能为空')

      if (this.newPassword !== this.checkPassword) {
        this.$toast('两次输入不一致')
        return
      }
      await this.$dialog.confirm({
        title: '提示',
        message: '确认修改吗？',
      })
      await updatePassWord({
        oldPassWord: crypto.encrypt(this.oldPassword),
        newPassWord: crypto.encrypt(this.newPassword),
      })
      this.$toast('修改成功')
      setTimeout(() => {
        uni.navigateBack()
      }, 200)
    },
  },
}
</script>

<template>
  <page classes="w-full h-full bg-white p-3">
    <van-field
      :value="oldPassword"
      required
      :type="hide ? 'password' : 'text'"
      placeholder="旧密码"
      @change="oldPassword = $event.detail"
    >
      <template #right-icon>
        <van-icon name="eye-o" @click="hide = !hide" />
      </template>
      <!--      <van-icon slot="right-icon" :name="hide ? 'eye-o' : 'closed-eye'" @click="hide = !hide"></van-icon> -->
    </van-field>
    <van-field
      :value="newPassword"
      placeholder="新密码"
      type="password"
      required
      @change="newPassword = $event.detail"
    >
      <!--      <van-icon slot="right-icon" :name="hide ? 'eye-o' : 'closed-eye'" @click="hide = !hide"></van-icon> -->
    </van-field>
    <van-field
      :value="checkPassword"
      placeholder="确认密码"
      required
      type="password"
      @change="checkPassword = $event.detail"
    >
      <!--      <van-icon slot="right-icon" :name="hide ? 'eye-o' : 'closed-eye'" @click="hide = !hide"></van-icon> -->
    </van-field>
    <view class="w-full mt-2 flex justify-center">
      <view class="w-1/2">
        <van-button
          type="success"
          block
          round
          @click="submit()"
        >
          确认
        </van-button>
      </view>
    </view>
  </page>
</template>

<style lang="scss" scoped>

</style>
