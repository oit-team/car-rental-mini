<template>
  <container classes="w-full h-full bg-white p-3">
    <van-field
      v-model="oldPassowrd"
      required
      :type="hide ? 'password' : 'text'"
      placeholder="旧密码"
      @change="oldPassowrd = $event.detail"
    >
      <van-icon slot="right-icon" name="eye-o" @click="hide = !hide"></van-icon>
      <!--      <van-icon slot="right-icon" :name="hide ? 'eye-o' : 'closed-eye'" @click="hide = !hide"></van-icon> -->
    </van-field>
    <van-field
      v-model="newPassword"
      placeholder="新密码"
      type="password"
      required
      @change="newPassword = $event.detail"
    >
      <!--      <van-icon slot="right-icon" :name="hide ? 'eye-o' : 'closed-eye'" @click="hide = !hide"></van-icon> -->
    </van-field>
    <van-field
      v-model="checkPassword"
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
  </container>
</template>

<script>
import { updatePassWord } from '../../api/account'
import crypto from '../../utils/crypto'

export default {
  components: {},
  data() {
    return {
      name: 'Vue',
      oldPassowrd: '',
      newPassword: '',
      checkPassword: '',
      hide: true,
    }
  },
  computed: {},
  watch: {},
  onShow() {
    this.useVantModel(['oldPassowrd', 'newPassword', 'checkPassword'])
  },
  methods: {
    async submit() {
      this.oldPassowrd = this.oldPassowrd.trim()
      this.newPassword = this.newPassword.trim()
      this.checkPassword = this.checkPassword.trim()
      if (this.oldPassowrd === '' || this.newPassword === '' || this.checkPassword === '') {
        this.$toast.error('必填项不能为空')
      }
      if (this.newPassword !== this.checkPassword) {
        this.$toast.error('两次输入不一致')
        return
      }
      await this.$dialog.confirm({
        title: '提示',
        message: '确认修改吗？',
      })
      await updatePassWord({
        oldPassWord: crypto.encrypt(this.oldPassowrd),
        newPassWord: crypto.encrypt(this.newPassword),
      })
      this.$toast.success('修改成功')
      uni.navigateBack()
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
