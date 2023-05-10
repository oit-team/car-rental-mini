<script setup lang="ts">
import { ref } from 'vue'

const title = ref('Hello')
</script>

<template>
  <view class="flex flex-col items-center justify-center pt-20">
    <image class="w-100px h-100px" src="/static/logo.png" />
    <view class="mt-4">
      <text class="text-lg color-[red]">
        {{ title }}
      </text>
    </view>
  </view>
</template>
