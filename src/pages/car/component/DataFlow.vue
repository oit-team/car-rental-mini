<script>
export default {
  props: {
    list: Array,
  },
  methods: {
  },
}
</script>

<template>
  <view class="p-2 text-xs box-border">
    <view v-for="(item, index) in list" :key="index" class="bg-white p-2 rounded mb-2 shadow">
      <view class="mb-2">
        <span class=" text-[#888]">统计日期：</span> {{ item.statisticalDate }}
      </view>
      <view class="grid grid-cols-3 gap-2 items-center">
        <view>
          <span class="text-[#888]">司机姓名</span>
          <br>
          {{ item.driverName }}
        </view>
        <view>
          <span class="text-[#888]">行驶里程（km）</span>
          <br> {{ item.totalMileage }}
        </view>
        <view>
          <span class="text-[#888]">流水（元）</span>
          <br> {{ item.journeyFlow }}
        </view>
        <view>
          <span class="text-[#888]">订单量</span>
          <br> {{ item.acceptedOrderNumber }}
        </view>
        <view>
          <span class="text-[#888]">差评数（次）</span>
          <br> {{ item.badEvaluaRate }}
        </view>
      </view>
    </view>
  </view>
</template>
