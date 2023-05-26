<script>
import { pick } from 'lodash-es'
import { post } from '@/api'

export default {
  props: {
    orderNo: String,
  },
  data: () => ({
    // 方案
    schemeTypeId: 0,
    scheme: {},
    schemeList: [],
    // 活动
    activityId: null,
    activity: {},
    activityList: [],
    // 优惠
    preferential: {},
    orderInfo: {
      leaseOrder: {},
    },
    rentInspection: {},

    showschemePopup: false,
    showActivityPopup: false,
  }),
  computed: {
    unpaidRent() {
      const {
        rentReceivable,
        t3Withholding,
        offlinePay,
      } = this.rentInspection
      return Math.floor((rentReceivable - t3Withholding - offlinePay) * 100) / 100
    },
  },
  watch: {
    'schemeTypeId': {
      immediate: true,
      handler() {
        this.scheme = {}
        this.schemeList = []
        this.activityId = null
        this.activity = {}
        this.activityList = []
        this.preferential = {}
        this.getscheme()
      },
    },
    'scheme.id': function (id) {
      if (!id)
        return
      this.getActivityList()
      this.getOrderPreferential()
    },
    'activityId': function (id) {
      if (!id)
        return
      this.getActivity()
      this.getOrderPreferential()
    },
    unpaidRent(val) {
      this.rentInspection.unpaidRent = val
    },
  },
  mounted() {
    this.getOrderInfo()
  },
  methods: {
    async getOrderInfo() {
      const res = await post('/order/leaseOrder/selectOrderInfoAndRentInspection', {
        leaseOrderNo: this.orderNo,
        selectRentInspectionTag: 1,
      })
      this.orderInfo = res.body
      this.rentInspection = res.body.rentInspection ?? {}
    },
    async getscheme() {
      const res = await post('/order/scheme/getLeaseOrderSchemes', {
        caseType: this.schemeTypeId,
        caseState: 1,
      })
      this.schemeList = res.body.schemeList
    },
    async getActivityList() {
      const res = await post('/order/activity/getActivitys', {
        caseType: this.scheme.id,
        caseState: 1,
      })
      this.activityList = res.body.resultList
    },
    async getActivity() {
      const res = await post('/order/activity/getActivityMap', {
        activityId: this.activityId,
      })
      this.activity = res.body
    },
    async getOrderPreferential() {
      const res = await post('/order/leaseOrder/getOrderPreferential', {
        schemeId: this.scheme.id,
        activityId: this.activity.activityId,
      })
      this.preferential = res.body
    },
    async submit() {
      const check = [
        [this.rentInspection.t3Withholding !== '', '请输入T3代扣'],
        [this.rentInspection.offlinePay !== '', '请输入线下收取'],
        [this.scheme.id, '请选择方案'],
      ]
      const checkResult = check.find(item => !item[0])
      if (checkResult) {
        this.$toast(checkResult[1])
        return
      }

      await this.$dialog.confirm({
        title: '提示',
        message: '确定要提交申请吗？',
      })

      const params = {
        ...pick(this.scheme, [
          'leaseTerm',
          'rent',
          'cashPledge',
          'vehicleAge',
        ]),
        ...pick(this.preferential.preferentialMap, [
          'primaryEndTime',
          'preferentialRent',
          'startTime',
          'remarks',
        ]),
        ...pick(this.orderInfo.leaseOrder, [
          'vehicleId',
          'driverId',
        ]),
        appendix: this.rentInspection,
        activityId: this.activity.activityId,
        schemeId: this.scheme.id,
        fatherOrderNo: this.orderNo,
        fatherOrderType: 1,
        leaseOrderType: 2,
        time: this.orderInfo.leaseOrder?.endTime,
      }

      await post('/workFlow/workFlow/workOrderApply', {
        flowCode: 'CAR_RENEWAL',
        workCode: '',
        params,
      })

      this.$toast.success('提交成功')
      setTimeout(uni.navigateBack, 1000)
    },
  },
}
</script>

<template>
  <page classes="flex flex-col h-screen">
    <div class="flex-1 overflow-auto">
      <van-tabs>
        <van-tab title="基本信息">
          <div class="py-2 flex flex-col gap-3">
            <div class="title">
              订单信息
            </div>
            <van-cell-group inset>
              <van-cell
                v-for="item of [
                  { label: '订单编号', prop: 'leaseOrderNo' },
                  { label: '车牌号', prop: 'licensePlateNumber' },
                  { label: '司机姓名', prop: 'driverName' },
                  { label: '订单类型', prop: 'leaseOrderType' },
                  { label: '起租日期', prop: 'startTime' },
                  { label: '截至日期', prop: 'endTime' },
                  { label: '租期', prop: 'leaseTerm' },
                  { label: '月租', prop: 'rent' },
                ]"
                :key="item.prop"
                :title="item.label"
                :value="orderInfo.leaseOrder[item.prop] || '暂无'"
              />
            </van-cell-group>

            <div class="title">
              租金查验
            </div>
            <van-cell-group inset>
              <van-cell title="总租金" :value="rentInspection.totalBillRent" />
              <van-cell title="应交租金" :value="rentInspection.rentReceivable" />
              <van-field
                :value="rentInspection.t3Withholding"
                required
                label="T3代扣"
                input-align="right"
                @input="rentInspection.t3Withholding = +$event.detail || 0"
              />
              <van-field
                :value="rentInspection.offlinePay"
                required
                label="线下收取"
                input-align="right"
                @input="rentInspection.offlinePay = +$event.detail || 0"
              />
              <van-cell title="欠缴租金" :value="rentInspection.unpaidRent" />
            </van-cell-group>
          </div>
        </van-tab>
        <van-tab title="租赁信息">
          <div class="py-2 flex flex-col gap-3">
            <van-cell-group inset>
              <van-cell title="方案类型">
                <van-radio-group :value="schemeTypeId" @change="schemeTypeId = $event.detail">
                  <div class="flex gap-3 justify-end">
                    <van-radio :name="0">
                      自营
                    </van-radio>
                    <van-radio :name="1">
                      T3
                    </van-radio>
                  </div>
                </van-radio-group>
              </van-cell>
              <van-cell title="方案" :value="scheme.caseName || '请选择方案'" is-link @click="showschemePopup = true" />
              <van-cell title="活动" :value="activity.activityName || '请选择活动'" is-link @click="showActivityPopup = true" />
            </van-cell-group>
            <template v-if="scheme.id">
              <div class="title">
                方案信息
              </div>
              <van-cell-group inset>
                <van-cell
                  v-for="item of [
                    { label: '品牌车系车型', prop: 'brandCarModel' },
                    { label: '租期（月）', prop: 'leaseTerm' },
                    { label: '月租（元）', prop: 'rent' },
                    { label: '押金（元）', prop: 'cashPledge' },
                    { label: '车龄（年）', prop: 'vehicleAge' },
                    { label: '里程（km）', prop: 'mileage' },
                  ]"
                  :key="item.prop"
                  :title="item.label"
                  :value="scheme[item.prop] || '暂无'"
                />
              </van-cell-group>
            </template>
            <template v-if="activity.id">
              <div class="title">
                活动信息
              </div>
              <van-cell-group inset>
                <van-cell
                  v-for="item of [
                    { label: '活动名称', prop: 'activityName' },
                    { label: '开始时间', prop: 'startTime' },
                    { label: '结束时间', prop: 'endTime' },
                    { label: '活动说明', prop: 'activityDescription' },
                  ]"
                  :key="item.prop"
                  :title="item.label"
                  :value="activity[item.prop] || '暂无'"
                />
              </van-cell-group>
            </template>
            <template v-if="activity.activityDetails">
              <div class="title">
                活动奖励
              </div>
              <div class="text-center mx-4 bg-white rounded-lg text-sm">
                <div class="grid grid-cols-3 py-1 text-gray-500">
                  <div>奖励类型</div>
                  <div>数量</div>
                  <div>兑现方式</div>
                </div>
                <div v-for="(item, index) of activity.activityDetails" :key="index" class="grid grid-cols-3 py-1">
                  <div>{{ item.rewardMethod }}</div>
                  <div>{{ item.number }}</div>
                  <div>{{ item.cashingMethod }}</div>
                </div>
              </div>
            </template>
            <template v-if="preferential.preferentialMap">
              <div class="title">
                租赁信息
              </div>
              <van-cell-group inset>
                <van-cell
                  v-for="item of [
                    { label: '租期（月）', prop: 'leaseTerm' },
                    { label: '原月租（元）', prop: 'rent' },
                    { label: '优惠月租（元）', prop: 'preferentialRent' },
                    { label: '押金（元）', prop: 'cashPledge' },
                    { label: '起租日期', prop: 'startTime' },
                    { label: '原终止日期', prop: 'primaryEndTime' },
                    { label: '终止日期', prop: 'endTime' },
                    { label: '备注', prop: 'activityDescription' },
                  ]"
                  :key="item.prop"
                  :title="item.label"
                  :value="preferential.preferentialMap[item.prop] || '暂无'"
                />
              </van-cell-group>
            </template>
            <template v-if="preferential.orderBill && preferential.orderBill.length">
              <div class="title">
                账单信息
              </div>
              <div class="text-center mx-4 bg-white rounded-lg text-sm">
                <div class="grid grid-cols-4 py-1 text-gray-500">
                  <div>期数</div>
                  <div>账期</div>
                  <div>月租</div>
                  <div>备注</div>
                </div>
                <div v-for="(item, index) of preferential.orderBill" :key="index" class="grid grid-cols-4 py-1">
                  <div>{{ item.numberOfPeriods }}</div>
                  <div>{{ item.accountingPeriod }}</div>
                  <div>{{ item.rent }}</div>
                  <div>{{ item.remarks || '-' }}</div>
                </div>
              </div>
            </template>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <van-button type="primary" block @click="submit()">
      提交
    </van-button>

    <van-popup :show="showschemePopup" position="bottom" @close="showschemePopup = false">
      <van-picker
        v-if="schemeList.length"
        :columns="schemeList"
        value-key="caseName"
        show-toolbar
        @confirm="scheme = $event.detail.value, showschemePopup = false"
      />
      <van-empty v-else description="暂无方案" />
    </van-popup>

    <van-popup :show="showActivityPopup" position="bottom" @close="showActivityPopup = false">
      <van-picker
        v-if="activityList.length"
        :columns="activityList"
        value-key="activityName"
        show-toolbar
        @confirm="activityId = $event.detail.value.activityId, showActivityPopup = false"
      />
      <van-empty v-else description="暂无活动" />
    </van-popup>
  </page>
</template>

<style scoped>
.title {
  font-size: 12px;
  color: #999;
  padding: 0 16px;
  margin-bottom: -0.5em;
}
</style>
