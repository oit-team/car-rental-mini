<script setup>
import { getLeaseOrderInfo } from '@/api/car'

const props = defineProps({
  id: String,
  type: String,
})
const data = ref()
async function getData() {
  const { body } = await getLeaseOrderInfo({
    leaseOrderId: props.id,
  })
  data.value = body
}
getData()
</script>

<template>
  <page classes="min-h-screen bg-neutral-100 p-2 box-border">
    <view>
      <view class="my-2 text-sm text-[#777]">
        司机信息
      </view>
      <van-cell-group inset>
        <van-cell title="司机姓名" :value="data?.driverInfo.driverName" />
        <van-cell title="司机手机号" :value="data?.driverInfo.driverPhone" />
        <van-cell title="身份证号" :value="data?.driverInfo.identityCard" />
      </van-cell-group>
    </view>
    <view>
      <view class="my-2 text-sm text-[#777]">
        车辆信息
      </view>
      <van-cell-group inset>
        <van-cell title="车牌号" :value="data?.vehicleInfo.licensePlateNumber" />
        <van-cell title="车辆颜色" :value="data?.vehicleInfo.bodyColor" />
        <van-cell title="车架号" :value="data?.vehicleInfo.vinNo" />
      </van-cell-group>
    </view>
    <view>
      <view class="my-2 text-sm text-[#777]">
        租赁信息
      </view>
      <van-cell-group inset>
        <van-cell title="订单编号" :value="data?.orderInfo.leaseOrderNo" />
        <van-cell title="方案名称" :value="data?.orderInfo.schemeName" />
        <van-cell title="租期（月）" :value="data?.orderInfo.leaseTerm" />
        <van-cell title="押金（元）" :value="data?.orderInfo.cashPledge" />
        <van-cell title="原月租（元）" :value="data?.orderInfo.rent" />
        <van-cell title="现月租（元）" :value="data?.orderInfo.preferentialRent" />
        <van-cell title="起租日期" :value="data?.orderInfo.startTime" />
        <van-cell title="原终止日期" :value="data?.orderInfo.primaryEndTime" />
        <van-cell title="终止日期" :value="data?.orderInfo.endTime" />
        <van-cell title="合同名" :value="data?.orderInfo.contractName" />
        <van-cell title="备注" :value="data?.orderInfo.remarks" />
      </van-cell-group>
    </view>
    <view>
      <view class="my-2 text-sm text-[#777]">
        账单信息
      </view>
      <view class="bg-white rounded-lg">
        <view v-for="item in data.billingInfo" :key="item.numberOfPeriods" class="flex justify-between items-center text-sm text-[#333] py-2 px-4">
          <view class="flex-1">
            {{ item.numberOfPeriods }}
          </view>
          <view class="flex-1">
            {{ item.accountingPeriod }}
          </view>
          <view class="flex-1 text-end">
            {{ item.rent }}
          </view>
        </view>
      </view>
    </view>
  </page>
</template>

<style scoped>
:deep(.van-cell-group--inset) {
    margin: 0;
}
</style>
