<script>
import { getT3LeaseOrderInfo } from '@/api/car'

export default {
  props: {
    id: String,
    type: String,
  },
  data() {
    return {
      list: [
        {
          title: '订单编号',
          value: 'orderNo',
        }, {
          title: '订单类型',
          value: 'orderType',
        }, {
          title: '订单状态',
          value: 'orderStatus',
        }, {
          title: '方案编号',
          value: 'schemeNo',
        }, {
          title: '城市',
          value: 'city',
        }, {
          title: '供应方式',
          value: 'supplyMode',
        }, {
          title: '司机id',
          value: 'driverId',
        }, {
          title: '司机名称',
          value: 'driverName',
        }, {
          title: '司机手机号',
          value: 'driverPhone',
        }, {
          title: '租赁合同签约状态',
          value: 'leaseContract',
        }, {
          title: '车架号',
          value: 'vinNo',
        }, {
          title: '车牌号',
          value: 'carNumber',
        }, {
          title: '租期（月）',
          value: 'tenancy',
        }, {
          title: '月租（元）',
          value: 'monthlyRent',
        }, {
          title: '终止时间',
          value: 'endDate',
        }, {
          title: '实际终止日期',
          value: 'actualEndDate',
        }, {
          title: '是否延期',
          value: 'postponeStatus',
        }, {
          title: '是否延期',
          value: 'postponeStatus',
        }, {
          title: '延期天数',
          value: 'delayDays',
        }, {
          title: '延期类型',
          value: 'delayType',
        }, {
          title: '延期描述',
          value: 'delayRemarks',
        }, {
          title: '历史换车单号',
          value: 'changeOrderNoHist',
        }, {
          title: 'T3订单创建时间',
          value: 't3CreatTime',
        }, {
          title: '交付日期',
          value: 'deliveryDate',
        }, {
          title: '运营商',
          value: 'operator',
        }, {
          title: '资产公司',
          value: 'assetCompany',
        }, {
          title: '品牌车系车型',
          value: 'brandCarModel',
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
      const { body } = await getT3LeaseOrderInfo({
        t3LeaseOrderId: this.id,
      })
      this.data = body
    },
  },
}
</script>

<template>
  <page classes="min-h-screen bg-neutral-100 p-2">
    <van-cell-group inset>
      <van-cell v-for="item in list" :key="item.key" :title="item.title" :value="data.resultMap[item.value] || '暂无'" />
    </van-cell-group>
  </page>
</template>

<style scoped>
:deep(.van-cell-group--inset) {
  margin: 0;
}
</style>
