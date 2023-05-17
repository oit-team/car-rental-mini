<script>
import { previewImg } from '@/utils/helper'

export default {
  components: {},
  props: {
    info: Object,
  },
  data() {
    return {
      name: 'Vue',
    }
  },
  computed: {},
  watch: {},
  methods: {
    previewImg,
  },
}
</script>

<template>
  <view class="bg-white overflow-hidden text-sm">
    <view class="flex">
      <view class="text-center">
        驾驶证
      </view>
      <view class="flex-1 border-none border-l border-[#ccc] border-solid">
        <view v-if="info?.driveLicense?.driveLicenseAssistant && info?.driveLicense?.driveLicenseHost" class="w-full grid grid-cols-2 gap-1 p-2 box-border">
          <van-image
            width="140"
            height="140"
            class="w-140px h-140px"
            fit="contain"
            :src="info.driveLicense?.driveLicenseAssistant"
            @click="previewImg(info.driveLicense?.driveLicenseAssistant)"
          />
          <van-image
            width="140"
            height="140"
            class="w-140px h-140px"
            fit="contain"
            :src="info.driveLicense?.driveLicenseHost"
            @click="previewImg(info.driveLicense?.driveLicenseHost)"
          />
        </view>
        <view v-else class="w-full h-100px text-[#777] text-sm flex justify-center items-center">
          (空)
        </view>
      </view>
    </view>
    <view class="text-center">
      身份证
    </view>
    <view v-if="info?.driverIdentity?.identityImg && info?.driverIdentity?.identityReverse && info?.driverIdentity?.identityStraight" class="w-full grid grid-cols-2 gap-1 p-2 box-border">
      <van-image
        width="140"
        height="140"
        class="w-140px h-140px"
        fit="contain"
        :src="info.driverIdentity?.identityImg"
        @click="previewImg(info.driverIdentity?.identityImg)"
      />
      <van-image
        width="140"
        height="140"
        class="w-140px h-140px"
        fit="contain"
        :src="info.driverIdentity?.identityReverse"
        @click="previewImg(info.driverIdentity?.identityReverse)"
      />
      <van-image
        width="140"
        height="140"
        class="w-140px h-140px"
        fit="contain"
        :src="info.driverIdentity?.identityStraight"
        @click="previewImg(info.driverIdentity?.identityStraight)"
      />
    </view>
    <view v-else class="w-full h-100px text-[#777] text-sm flex justify-center items-center">
      (空)
    </view>
  </view>
</template>

<style lang="scss" scoped>

</style>
