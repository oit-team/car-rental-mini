<script setup lang="ts">
const title = ref('Hello')

function test() {
  uni.navigateTo({ url: '/pages/account/login' })
}
</script>

<template>
  <page classes="flex flex-col items-center pt-20">
    <image class="w-100px h-100px" src="/static/logo.png" />
    <view class="mt-4">
      <text class="text-lg color-[red]">
        {{ title }}
      </text>
    </view>
    <van-button @click="test()">
      测试
    </van-button>
  </page>
</template>
