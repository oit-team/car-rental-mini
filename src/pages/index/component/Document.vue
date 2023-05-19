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
  computed: {
    driveLicenseAssistant() {
      return this.info?.driveLicense?.driveLicenseAssistant
    },
    driveLicenseHost() {
      return this.info?.driveLicense?.driveLicenseHost
    },
    identityImg() {
      return this.info?.driverIdentity?.identityImg
    },
    identityReverse() {
      return this.info?.driverIdentity?.identityReverse
    },
    identityStraight() {
      return this.info?.driverIdentity?.identityStraight
    },
  },
  watch: {},
  methods: {
    previewImg,
  },
}
</script>

<template>
  <view class="bg-white overflow-hidden text-sm">
    <view class="flex p-2 box-border">
      <view class="text-center">
        驾驶证
      </view>
      <view class="flex-1 shadow ml-2">
        <view v-if="driveLicenseAssistant && driveLicenseHost" class="w-full grid grid-cols-2 gap-1 p-2 box-border">
          <van-image
            width="120"
            height="120"
            fit="contain"
            :src="driveLicenseAssistant"
            @click="previewImg(driveLicenseAssistant)"
          />
          <van-image
            width="120"
            height="120"
            fit="contain"
            :src="driveLicenseHost"
            @click="previewImg(driveLicenseHost)"
          />
        </view>
        <view v-else class="w-full h-100px text-[#777] text-sm flex justify-center items-center">
          (空)
        </view>
      </view>
    </view>
    <view class="flex p-2 box-border">
      <view class="text-center">
        身份证
      </view>
      <view class="flex-1 shadow ml-2">
        <view v-if="identityImg && identityReverse && identityStraight" class="w-full grid grid-cols-2 gap-1 p-2 box-border">
          <van-image
            width="120"
            height="120"
            fit="contain"
            :src="identityImg"
            @click="previewImg(identityImg)"
          />
          <van-image
            width="120"
            height="120"
            fit="contain"
            :src="identityReverse"
            @click="previewImg(identityReverse)"
          />
          <van-image
            width="120"
            height="120"
            fit="contain"
            :src="identityStraight"
            @click="previewImg(identityStraight)"
          />
        </view>
        <view v-else class="w-full h-100px text-[#777] text-sm flex justify-center items-center">
          (空)
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>

</style>
