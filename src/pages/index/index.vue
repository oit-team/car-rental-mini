<script setup lang="ts">
import Toast from '@/wxcomponents/vant/toast/toast'

const title = ref('Hello')

function test() {
  Toast.success('测试')
}
</script>

<template>
  <Page classes="flex flex-col items-center pt-20">
    <image class="w-100px h-100px" src="/static/logo.png" />
    <view class="mt-4">
      <text class="text-lg color-[red]">
        {{ title }}
      </text>
    </view>
    <VanButton @click="test()">
      测试
    </VanButton>
  </Page>
</template>
