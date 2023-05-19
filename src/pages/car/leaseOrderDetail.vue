<script>
import { getLeaseOrderInfo } from '@/api/car'

export default {
  props: {
    id: String,
    type: String,
  },
  data() {
    return {
      driverInfo: [
        {
          title: '司机姓名',
          value: 'driverName',
        },
        {
          title: '司机手机号',
          value: 'driverPhone',
        },
        {
          title: '身份证号',
          value: 'identityCard',
        },
      ],
      vehicleInfo: [
        {
          title: '车牌号',
          value: 'licensePlateNumber',
        },
        {
          title: '车辆颜色',
          value: 'bodyColor',
        },
        {
          title: '车架号',
          value: 'vinNo',
        },
      ],
      orderInfo: [
        {
          title: '订单编号',
          value: 'leaseOrderNo',
        },
        {
          title: '方案名称',
          value: 'schemeName',
        },
        {
          title: '租期（月）',
          value: 'leaseTerm',
        },
        {
          title: '押金（元）',
          value: 'cashPledge',
        },
        {
          title: '原月租（元）',
          value: 'rent',
        },
        {
          title: '现月租（元）',
          value: 'preferentialRent',
        },
        {
          title: '起租日期',
          value: 'startTime',
        },
        {
          title: '原终止日期',
          value: 'primaryEndTime',
        },
        {
          title: '终止日期',
          value: 'endTime',
        },
        {
          title: '合同名',
          value: 'contractName',
        },
        {
          title: '备注',
          value: 'remarks',
        },
      ],
      data: {},
    }
  },
  onShow() {
    this.getData()
  },
  methods: {
    async getData() {
      const { body } = await getLeaseOrderInfo({
        leaseOrderId: this.id,
      })
      this.data = body
    },
  },
}
</script>

<template>
  <page classes="min-h-screen bg-neutral-100 p-2 box-border">
    <view>
      <view class="my-2 text-sm text-[#777]">
        司机信息
      </view>
      <van-cell-group inset>
        <van-cell
          v-for="item in driverInfo"
          :key="item.value"
          :title="item.title"
          :value="data.driverInfo[item.value]"
        />
      </van-cell-group>
    </view>
    <view>
      <view class="my-2 text-sm text-[#777]">
        车辆信息
      </view>
      <van-cell-group inset>
        <van-cell v-for="item in vehicleInfo" :key="item.value" :title="item.title" :value="data.vehicleInfo[item.value]" />
      </van-cell-group>
    </view>
    <view>
      <view class="my-2 text-sm text-[#777]">
        租赁信息
      </view>
      <van-cell-group inset>
        <van-cell v-for="item in orderInfo" :key="item.value" :title="item.title" :value="data.orderInfo[item.value] || '暂无'" />
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
          <view class="flex-1 text-right">
            {{ item.rent }}
          </view>
        </view>
      </view>
    </view>
  </page>
</template>

<style lang="scss" scoped>
.van-cell-group--inset {
  margin: 0;
}
</style>
