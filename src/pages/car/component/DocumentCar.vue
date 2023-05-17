<script setup>
import { previewImg } from '@/utils/helper'

defineProps({
  info: Object,
})
</script>

<template>
  <view class="bg-white p-2 box-border overflow-hidden">
    <view class="text-center">
      行驶证
    </view>
    <view v-if="info?.driveLicense?.driveLicenceOriginal" class="w-full flex flex-col items-center p-2">
      <image
        class="w-200px h-140px mb-2"
        :src="info.driveLicense.driveLicenceOriginal"
        @click="previewImg([info.driveLicense?.driveLicenceOriginal])"
      />
      <image
        class="w-200px h-140px"
        :src="info.driveLicense.driveLicenceEctype"
        @click="previewImg([info.driveLicense?.driveLicenceEctype])"
      />
    </view>
    <view v-else class="w-full h-100px text-[#777] text-sm flex justify-center items-center">
      (空)
    </view>
    <view class="text-center">
      运输证
    </view>
    <view v-if="info?.driverIdentity?.transporteCardImg" class="w-full flex flex-col items-center p-2">
      <image
        class="w-200px h-140px"
        :src="info.driverIdentity.transporteCardImg"
        @click="previewImg([info.driverIdentity?.transporteCardImg])"
      />
    </view>
    <view v-else class="w-full h-100px text-[#777] text-sm flex justify-center items-center">
      (空)
    </view>
    <view class="text-center">
      保险
    </view>
    <view v-if="info?.driverIdentity?.identityImg" class="w-full flex flex-col items-center p-2">
      <image
        class="w-200px h-140px"
        mode="aspectFit"
        :src="info.driverIdentity.identityImg"
        @click="previewImg([info.driverIdentity?.identityImg])"
      />
    </view>
    <view v-else class="w-full h-100px text-[#777] text-sm flex justify-center items-center">
      (空)
    </view>
  </view>
</template>

<style lang="scss" scoped>

</style>
