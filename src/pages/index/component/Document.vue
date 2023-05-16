<script>
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
  methods: {},
}
</script>

<template>
  <view class="bg-white overflow-hidden text-sm">
    <view class="text-center">
      驾驶证
    </view>
    <view v-if="info?.driveLicense?.driveLicenseAssistant && info?.driveLicense?.driveLicenseHost" class="w-full grid grid-cols-2 gap-2 p-2 box-border">
      <image
        class="w-140px h-140px mb-2"
        :src="info.driveLicense?.driveLicenseAssistant"
      />
      <image
        class="w-140px h-140px"
        :src="info.driveLicense?.driveLicenseHost"
      />
    </view>
    <view v-else class="w-full h-100px text-[#777] text-sm flex justify-center items-center">
      (空)
    </view>
    <view class="text-center">
      身份证
    </view>
    <view v-if="info?.driverIdentity?.identityImg && info?.driverIdentity?.identityReverse && info?.driverIdentity?.identityStraight" class="w-full grid grid-cols-2 gap-2 p-2 box-border">
      <image
        class="w-140px h-140px mb-2"
        :src="info.driverIdentity?.identityImg"
      />
      <image
        class="w-140px h-140px mb-2"
        :src="info.driverIdentity?.identityReverse"
      />
      <image
        class="w-140px h-140px"
        :src="info.driverIdentity?.identityStraight"
      />
    </view>
    <view v-else class="w-full h-100px text-[#777] text-sm flex justify-center items-center">
      (空)
    </view>
  </view>
</template>

<style lang="scss" scoped>

</style>
