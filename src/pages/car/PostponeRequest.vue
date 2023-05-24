<script>
import dayjs from 'dayjs'
import { selectOrderInfoAndRentInspection } from '@/api/postpone'
import { workOrderApply } from '@/api/work'
export default {
  props: {
  },
  data() {
    return {
      orderInfo: [
        { label: '订单编号', prop: 'leaseOrderNo' },
        { label: '车牌号', prop: 'licensePlateNumber' },
        { label: '司机姓名', prop: 'driverName' },
        { label: '订单类型', prop: 'leaseOrderType' },
        { label: '起租日期', prop: 'startTime' },
        { label: '截至日期', prop: 'endTime' },
        { label: '租期', prop: 'leaseTerm' },
        { label: '月租', prop: 'rent' },
      ],
      data: {}, // 数据
      show: false,
      submitLoading: false,
      minDate: dayjs().add(1, 'day').toDate().getTime(),

      leaseOrderNo: '',
      orderCode: '',

      t3Withholding: 0, // T3代扣
      offlinePay: 0, // 线下收取
      rentReceivable: 0,

      extensionEndTime: '', // 延期截止日期
      dayRent: 0, // 日租金
      remarks: '', // 备注

    }
  },
  onLoad(option) {
    this.leaseOrderNo = option.workCode
    this.orderCode = option.orderCode
  },
  async onShow() {
    await this.getData()
  },
  computed: {
    extensionRent() {
      return this.dayRent * this.extensionDay
    },
    unpaidRent() {
      return (this.rentReceivable - this.t3Withholding - this.offlinePay).toFixed(2) || 0
    },
    extensionEndTimeForMat() {
      return this.extensionEndTime ? dayjs(new Date(this.extensionEndTime)).format('YYYY-MM-DD') : ''
    },
    extensionDay() {
      const difference = dayjs(this.extensionEndTimeForMat).diff(this.data?.leaseOrder?.endTime, 'day')
      return difference || 0
    },
  },
  watch: {
  },
  methods: {
    async getData() {
      const { body } = await selectOrderInfoAndRentInspection({
        leaseOrderNo: this.orderCode,
        selectRentInspectionTag: 1,
        workCode: this.leaseOrderNo,
      })
      this.data = body
      this.extensionEndTime = new Date(this.data.leaseOrder.endTime).getTime()
      this.rentReceivable = this.data.rentInspection.rentReceivable
    },
    onDisplay() {
      this.show = true
    },
    onConfirm(event) {
      this.extensionEndTime = event.detail
      this.show = false
    },
    async submit() {
      if (this.extensionDay < 0) {
        this.$toast('延期截至日期必须大于截止日期！')
        return
      }
      this.submitLoading = true
      const rentInspection = {
        totalBillRent: this.data.rentInspection.totalBillRent,
        rentReceivable: this.data.rentInspection.rentReceivable,
        t3Withholding: this.t3Withholding,
        offlinePay: this.offlinePay,
        unpaidRent: this.unpaidRent,
      }
      await workOrderApply({
        flowCode: 'CAR_EXTENSION',
        workCode: this.workCode || '',
        params: {
          ...this.data.leaseOrder,
          rentInspection: JSON.stringify(rentInspection),
          extensionEndTime: this.extensionEndTimeForMat,
          extensionDay: this.extensionDay,
          dayRent: this.dayRent,
          extensionRent: this.extensionRent,
          remarks: this.remarks,
        },
      }).finally(() => this.submitLoading = false)
      this.$toast.success('申请成功！')
      setTimeout(() => uni.navigateBack(), 1000)
    },

  },
}
</script>

<template>
  <page classes="relative min-h-screen bg-neutral-100 box-border pb-12">
    <view v-if="data.leaseOrder" class="px-2">
      <view class="my-2 text-sm text-[#777]">
        订单信息
      </view>
      <van-cell-group>
        <van-cell
          v-for="item, index in orderInfo"
          :key="index"
          :title="item.label"
          :value="data.leaseOrder[item.prop] || '暂无'"
        />
        <view>
          <view class="my-2 text-sm text-[#777]">
            租金查验
          </view>
          <van-field
            :value="data.rentInspection.totalBillRent"
            label="总租金"
            readonly
            input-align="right"
          />
          <van-field
            :value="data.rentInspection.rentReceivable"
            label="应交租金"
            readonly
            input-align="right"
          />
          <van-field
            :value="t3Withholding"
            label="T3代扣"
            type="number"
            placeholder="请输入T3代扣"
            required
            input-align="right"
            @change="t3Withholding = $event.detail"
          />
          <van-field
            :value="offlinePay"
            label="线下收取"
            type="number"
            placeholder="请输入线下收取"
            input-align="right"
            required
            @change="offlinePay = $event.detail"
          />
          <van-field
            :value="unpaidRent"
            label="欠缴租金"
            type="number"
            input-align="right"
            placeholder="请输入欠缴租金"
            required
            readonly
            @change="unpaidRent = $event.detail"
          />
        </view>
        <view>
          <view class="my-2 text-sm text-[#777]">
            延期信息
          </view>
          <van-cell title="延期截至日期" :value="extensionEndTimeForMat" is-link @click="onDisplay" />

          <van-popup :show="show" position="bottom" @close="show = false">
            <div class="px-2">
              <van-datetime-picker
                type="date"
                :value="extensionEndTime"
                :min-date="minDate"
                @close="show = false"
                @confirm="onConfirm"
              />
            </div>
          </van-popup>
          <van-field
            :value="extensionDay || 0"
            label="延期天数"
            input-align="right"
            readonly
          />
          <van-field
            :value="dayRent"
            label="日租金"
            type="number"
            placeholder="请输入日租金"
            required
            input-align="right"
            @change="dayRent = $event.detail"
          />
          <van-field
            :value="extensionRent"
            label="延期租金"
            type="number"
            placeholder="请输入延期租金"
            required
            readonly
            input-align="right"
            @change="extensionRent = $event.detail"
          />
          <van-field
            :value="remarks"
            label="备注"
            placeholder="请输入备注"
            input-align="right"
            @change="remarks = $event.detail"
          />
          <view class="w-full mt-2 flex flex-col justify-center">
            <van-button
              type="primary"
              block
              :loading="submitLoading"
              loading-text="提交中..."
              @click="submit()"
            >
              确认
            </van-button>
          </view>
        </view>
      </van-cell-group>
    </view>
    <van-empty v-else class="w-full h-full" description="暂无数据" />
  </page>
</template>
