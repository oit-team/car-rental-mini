<script>
import dayjs from 'dayjs'

export default {
  props: {
    workCode: String,
  },
  data: () => ({
    datePicker: false,

    appendix: '',
    vehicleInspectionDetailed: {
      trailerFee: {
        subtotal: '',
        receivable: '',
        received: '',
        netReceipts: '',
        remarks: '',
      },
      liquidatedDamages: {
        actualApplicationTime: '',
        subtotal: '',
        remarks: '',
      },
      vehicleLossAssessment: {
        subtotal: '',
        receivable: 0,
        netReceipts: '',
        workingHours: '',
        remarks: '',
      },
      vehicleAccessories: [
        '车钥匙',
        '行驶证',
        '运输证',
        '灭火器',
        '脚垫',
        '紧急警示牌',
        '拖车钩',
        '反光背心',
        '千斤顶',
        '备胎/充气泵',
        '其它',
      ].map(item => ({
        receivable: item,
        missing: false,
        subtotal: '',
        remark: '',
      })),
      vehicleCertificate: {
        subtotal: 0,
        remark: '',
      },
    },
    vehicleSupplementary: {
      front: '',
      rear: '',
      left: '',
      right: '',
      backRow: '',
      frontRow: '',
      dashboard: '',
      chassis: '',
    },
    keepInRepair: [],
  }),
  computed: {
    datePickerValue() {
      return new Date(this.vehicleInspectionDetailed.liquidatedDamages.actualApplicationTime).getTime()
    },
    vehicleAccessoriesResult() {
      const result = this.vehicleInspectionDetailed.vehicleAccessories.reduce((prev, cur) => {
        return prev + Number(cur.subtotal || 0)
      }, 0)
      return this.parsePrice(result)
    },
    keepInRepairResult() {
      const result = this.keepInRepair.reduce((prev, cur) => {
        return prev + Number(cur.repairAmount || 0)
      }, 0)
      return this.parsePrice(result)
    },
    vehicleLossAssessmentSubtotal() {
      return this.parsePrice(this.keepInRepairResult - (this.vehicleInspectionDetailed.vehicleLossAssessment.netReceipts || 0))
    },
    trailerFeeSubtotal() {
      return this.parsePrice(
        this.vehicleInspectionDetailed.trailerFee.receivable
        - this.vehicleInspectionDetailed.trailerFee.received,
      )
    },
  },
  watch: {
    vehicleAccessoriesResult(value) {
      this.vehicleInspectionDetailed.vehicleCertificate.subtotal = value || 0
    },
    keepInRepairResult(value) {
      this.vehicleInspectionDetailed.vehicleLossAssessment.receivable = value || 0
    },
    vehicleLossAssessmentSubtotal(value) {
      this.vehicleInspectionDetailed.vehicleLossAssessment.subtotal = value || 0
    },
    trailerFeeSubtotal(value) {
      this.vehicleInspectionDetailed.trailerFee.subtotal = value || 0
    },
  },
  mounted() {
    this.calcLiquidatedDamages()
  },
  methods: {
    dayjs,
    async submit() {
      await this.$dialog.confirm({
        title: '确认要提交吗？',
      })
      const keepInRepair = !this.keepInRepair?.length
      await this.$post('/workFlow/workFlow/submit', {
        params: {
          appendix: this.appendix,
          vehicleInspectionDetailed: this.vehicleInspectionDetailed,
          vehicleSupplementary: this.vehicleSupplementary,
          keepInRepair: this.keepInRepair,
        },
        flowCode: 'CAR_RETURN',
        workCode: this.workCode,
        approvalStatus: 1,
        // 没有维修项时跳到下一个流程
        nextTaskCode: keepInRepair
          ? 'CAR_RETURN_SURE'
          : undefined,
      })

      uni.$emit('order:reload')
      uni.navigateBack()
    },
    async reject() {
      await this.$dialog.confirm({
        message: '确认要拒绝吗？',
      })
      await this.$loading(
        this.$post('/workFlow/workFlow/submit', {
          flowCode: 'CAR_RETURN',
          workCode: this.workCode,
          approvalStatus: 0,
          params: {},
        }),
      )
      uni.$emit('order:reload')
      uni.navigateBack()
    },
    parsePrice(value) {
      return parseFloat(value.toFixed(2))
    },
    changeVehicleAccessories(index, missing) {
      this.vehicleInspectionDetailed.vehicleAccessories[index].missing = missing
      this.vehicleInspectionDetailed.vehicleAccessories[index].subtotal = ''
      this.vehicleInspectionDetailed.vehicleAccessories[index].remark = ''
    },
    async calcLiquidatedDamages(time) {
      // 计算违约金
      const res = await this.$post('/order/leaseOrder/liquidatedDamages', {
        time,
        workCode: this.workCode,
      })

      this.vehicleInspectionDetailed.liquidatedDamages.subtotal = res.body.liquidatedDamages
      if (!time)
        this.vehicleInspectionDetailed.liquidatedDamages.actualApplicationTime = res.body.terminationDate
    },
    addKeepInRepair() {
      this.$set(
        this.keepInRepair,
        this.keepInRepair.length,
        {
          beforeNow: '',
          keepInRepairItemName: '',
          repairAmount: '',
          remarks: '',
        },
      )
    },
    removeKeepInRepair(index) {
      this.$delete(this.keepInRepair, index)
    },
    setDateValue({ detail }) {
      const date = dayjs(detail).format('YYYY-MM-DD')
      this.vehicleInspectionDetailed.liquidatedDamages.actualApplicationTime = date
      this.calcLiquidatedDamages(date)
      this.datePicker = false
    },
  },
}
</script>

<template>
  <page>
    <van-tabs>
      <van-tab title="基本">
        <van-cell-group title="拖车费">
          <van-field
            v-for="field, index of [
              { label: '应收金额(元)', key: 'receivable', required: true },
              { label: '已收金额(元)', key: 'received', required: true },
              { label: '金额小计(元)', key: 'subtotal', required: true },
              { label: '备注', key: 'remarks', type: 'text' },
            ]"
            :key="index"
            :type="field.type || 'digit'"
            :required="field.required"
            placeholder="请输入"
            :label="field.label"
            :value="vehicleInspectionDetailed.trailerFee[field.key]"
            @input="vehicleInspectionDetailed.trailerFee[field.key] = $event.detail"
          />
        </van-cell-group>
        <van-cell-group title="违约金">
          <van-cell
            title="实际退车日期"
            :value="vehicleInspectionDetailed.liquidatedDamages.actualApplicationTime || '选择日期'"
            is-link
            required
            @click="datePicker = true"
          />
          <van-field
            v-for="field, index of [
              { label: '金额小计(元)', key: 'subtotal', required: true, readonly: true, placeholder: '选择退车日期后自动计算' },
              { label: '备注', key: 'remarks', type: 'text' },
            ]"
            :key="index"
            :type="field.type || 'digit'"
            :required="field.required"
            :readonly="field.readonly"
            :placeholder="field.placeholder || '请输入'"
            :label="field.label"
            :value="vehicleInspectionDetailed.liquidatedDamages[field.key]"
            @input="vehicleInspectionDetailed.liquidatedDamages[field.key] = $event.detail"
          />
        </van-cell-group>
        <van-cell-group title="车辆定损">
          <van-field
            v-for="field, index of [
              { label: '维修时长(天)', key: 'workingHours', required: true },
              { label: '定损金额(元)', key: 'receivable', readonly: true, placeholder: '在下方添加维修项' },
              { label: '已收金额(元)', key: 'netReceipts', required: true },
              { label: '金额小计(元)', key: 'subtotal', required: true, readonly: true },
              { label: '备注', key: 'remarks', type: 'text' },
            ]"
            :key="index"
            :type="field.type || 'digit'"
            :required="field.required"
            :readonly="field.readonly"
            :placeholder="field.placeholder || '请输入'"
            :label="field.label"
            :value="vehicleInspectionDetailed.vehicleLossAssessment[field.key]"
            @input="vehicleInspectionDetailed.vehicleLossAssessment[field.key] = $event.detail"
          />
        </van-cell-group>

        <div class="text-center py-2 text-sm">
          维修项
        </div>
        <div>
          <van-cell-group v-for="item, index of keepInRepair" :key="index" :title="`第${index + 1}项`">
            <div class="absolute right-2 -top-28px">
              <van-button type="danger" size="mini" plain @click="removeKeepInRepair(index)">
                删除
              </van-button>
            </div>
            <van-field
              label="项目名称"
              placeholder="请输入"
              required
              @input="keepInRepair[index].keepInRepairItemName = $event.detail"
            />
            <van-field
              label="维修金额"
              placeholder="请输入"
              type="digit"
              required
              @input="keepInRepair[index].repairAmount = $event.detail"
            />
            <van-field
              label="备注"
              placeholder="请输入"
              @input="keepInRepair[index].remarks = $event.detail"
            />
            <van-cell title="维修前" value-class="upload-cell-class">
              <vc-upload :limit="1" @success="keepInRepair[index].beforeNow = $event.fileUrls" />
            </van-cell>
          </van-cell-group>
          <div class="flex justify-center mt-1">
            <van-button @click="addKeepInRepair()">
              添加维修项
            </van-button>
          </div>
        </div>
      </van-tab>
      <van-tab title="车辆配件">
        <van-cell-group v-for="field, index of vehicleInspectionDetailed.vehicleAccessories" :key="index" :title="field.receivable">
          <van-cell title="是否丢失">
            <van-switch
              :checked="vehicleInspectionDetailed.vehicleAccessories[index].missing"
              size="20"
              @change="changeVehicleAccessories(index, $event.detail)"
            />
          </van-cell>
          <template v-if="vehicleInspectionDetailed.vehicleAccessories[index].missing">
            <van-field
              placeholder="请输入"
              label="金额小计"
              type="digit"
              :required="true"
              :value="vehicleInspectionDetailed.vehicleAccessories[index].subtotal"
              @input="vehicleInspectionDetailed.vehicleAccessories[index].subtotal = $event.detail"
            />
            <van-field
              placeholder="请输入"
              label="备注"
              :value="vehicleInspectionDetailed.vehicleAccessories[index].remark"
              @input="vehicleInspectionDetailed.vehicleAccessories[index].remark = $event.detail"
            />
          </template>
        </van-cell-group>
        <van-cell-group title="结果">
          <van-field
            label="金额总计"
            readonly
            :value="vehicleInspectionDetailed.vehicleCertificate.subtotal"
          />
          <van-field
            placeholder="请输入"
            label="备注"
            :value="vehicleInspectionDetailed.vehicleCertificate.remark"
            @input="vehicleInspectionDetailed.vehicleCertificate.remark = $event.detail"
          />
        </van-cell-group>
      </van-tab>
      <van-tab title="车辆情况">
        <van-cell-group title="车辆情况">
          <van-cell
            v-for="item of [
              { title: '正前方', key: 'front' },
              { title: '正后方', key: 'rear' },
              { title: '左侧', key: 'left' },
              { title: '右侧', key: 'right' },
              { title: '后排', key: 'backRow' },
              { title: '前排', key: 'frontRow' },
              { title: '仪表盘', key: 'dashboard' },
              { title: '底盘', key: 'chassis' },
            ]"
            :key="item.key"
            :title="item.title"
            value-class="upload-cell-class"
          >
            <vc-upload :limit="1" @success="vehicleSupplementary[item.key] = $event.fileUrls" />
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="其它附件">
        <van-cell-group>
          <van-cell
            title="文件"
            value-class="upload-cell-class"
          >
            <vc-upload @success="appendix = $event.fileUrls" />
          </van-cell>
        </van-cell-group>
      </van-tab>
    </van-tabs>
    <div class="pt-3 flex">
      <van-button class="flex-1" block type="danger" square @click="reject()">
        拒绝
      </van-button>
      <van-button class="flex-1" block type="primary" square @click="submit()">
        提交
      </van-button>
    </div>

    <van-popup
      :show="datePicker"
      round
      position="bottom"
      @close="datePicker = false"
    >
      <van-datetime-picker
        type="date"
        :value="datePickerValue"
        @confirm="setDateValue"
      />
    </van-popup>
  </page>
</template>

<style>
.upload-cell-class {
  flex: 0!important;
  min-width: 265px;
  margin-right: -8px;
}
</style>
