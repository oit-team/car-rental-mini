<script>
import { previewImg } from '@/utils/helper'

export default {
  props: {
    info: Object,
  },
  computed: {
    driveLicenceOriginal() {
      return this.info?.driveLicense?.driveLicenceOriginal
    },
    driveLicenceEctype() {
      return this.info?.driveLicense?.driveLicenceEctype
    },
    transporteCardImg() {
      return this.info?.driverIdentity?.transporteCardImg
    },
    identityImg() {
      return this.info?.driverIdentity?.identityImg
    },
  },
  methods: { previewImg },
}
</script>

<template>
  <view class="bg-white p-2 box-border overflow-hidden">
    <view class="flex p-2 box-border">
      <view class="text-center">
        行驶证
      </view>
      <view class="flex-1 shadow ml-2">
        <view v-if="driveLicenceOriginal && driveLicenceEctype" class="w-full grid grid-cols-2 gap-1 p-2">
          <van-image
            width="120"
            height="120"
            :src="driveLicenceOriginal"
            @click="previewImg([driveLicenceOriginal])"
          />
          <van-image
            width="120"
            height="120"
            :src="driveLicenceEctype"
            @click="previewImg([driveLicenceEctype])"
          />
        </view>
        <view v-else class="w-full h-100px text-[#777] text-sm flex justify-center items-center">
          (空)
        </view>
      </view>
    </view>
    <view class="flex p-2 box-border">
      <view class="text-center">
        运输证
      </view>
      <view class="flex-1 shadow ml-2">
        <view v-if="transporteCardImg" class="w-full flex flex-col items-center p-2">
          <van-image
            width="120"
            height="120"
            :src="transporteCardImg"
            @click="previewImg([transporteCardImg])"
          />
        </view>
        <view v-else class="w-full h-100px text-[#777] text-sm flex justify-center items-center">
          (空)
        </view>
      </view>
    </view>
    <view class="flex p-2 box-border">
      <view class="text-center">
        保险单
      </view>
      <view class="flex-1 shadow ml-2">
        <view v-if="identityImg" class="w-full flex flex-col items-center p-2">
          <van-image
            width="120"
            height="120"
            mode="aspectFit"
            :src="identityImg"
            @click="previewImg([identityImg])"
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
