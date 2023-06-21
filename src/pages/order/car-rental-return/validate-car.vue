<script>
export default {
  data: () => ({
    vehicleInspectionDetailed: {
      trailerFee: {
        subtotal: '',
        receivable: '',
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
        receivable: '',
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
        subtotal: 0,
        remark: '',
      })),
      vehicleCertificate: {
        subtotal: 0,
        remark: '',
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
    },
  }),
  methods: {
    submit() {
      console.log(this.vehicleInspectionDetailed)
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
              { label: '应收金额(元)', key: 'receivable' },
              { label: '已收金额(元)', key: 'received' },
              { label: '备注', key: 'remarks', type: 'text' },
              { label: '金额小计(元)', key: 'subtotal' },
            ]"
            :key="index"
            :type="field.type || 'digit'"
            placeholder="请输入"
            :label="field.label"
            :value="vehicleInspectionDetailed.trailerFee[field.key]"
            @input="vehicleInspectionDetailed.trailerFee[field.key] = $event.detail"
          />
        </van-cell-group>
        <van-cell-group title="违约金">
          <van-field
            v-for="field, index of [
              { label: '实际退车日期', key: 'actualApplicationTime' },
              { label: '备注', key: 'remarks', type: 'text' },
              { label: '金额小计(元)', key: 'subtotal' },
            ]"
            :key="index"
            :type="field.type || 'digit'"
            placeholder="请输入"
            :label="field.label"
            :value="vehicleInspectionDetailed.liquidatedDamages[field.key]"
            @input="vehicleInspectionDetailed.liquidatedDamages[field.key] = $event.detail"
          />
        </van-cell-group>
        <van-cell-group title="车辆定损">
          <van-field
            v-for="field, index of [
              { label: '维修时长(天)', key: 'workingHours' },
              { label: '定损金额(元)', key: 'receivable' },
              { label: '已收金额(元)', key: 'netReceipts' },
              { label: '备注', key: 'remarks', type: 'text' },
              { label: '金额小计(元)', key: 'subtotal' },
            ]"
            :key="index"
            :type="field.type || 'digit'"
            placeholder="请输入"
            :label="field.label"
            :value="vehicleInspectionDetailed.vehicleLossAssessment[field.key]"
            @input="vehicleInspectionDetailed.vehicleLossAssessment[field.key] = $event.detail"
          />
        </van-cell-group>
      </van-tab>
      <van-tab title="车辆配件">
        <van-cell-group v-for="field, index of vehicleInspectionDetailed.vehicleAccessories" :key="index" :title="field.receivable">
          <van-cell title="是否丢失">
            <van-switch
              :checked="vehicleInspectionDetailed.vehicleAccessories[index].missing"
              size="20"
              @change="vehicleInspectionDetailed.vehicleAccessories[index].missing = $event.detail"
            />
          </van-cell>
          <template v-if="vehicleInspectionDetailed.vehicleAccessories[index].missing">
            <van-field
              placeholder="请输入"
              label="金额小计"
              type="digit"
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
            <vc-upload :limit="1" @success="vehicleInspectionDetailed.vehicleSupplementary[item.key] = $event.fileUrls" />
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="其它附件">
        <van-cell-group>
          <van-cell
            title="文件"
            value-class="upload-cell-class"
          >
            <vc-upload @success="vehicleInspectionDetailed.appendix = $event.fileUrls" />
          </van-cell>
        </van-cell-group>
      </van-tab>
    </van-tabs>
    <div class="pt-3">
      <van-button block type="primary" square @click="submit()">
        提交
      </van-button>
    </div>
  </page>
</template>

<style>
.upload-cell-class {
  flex: 0!important;
  min-width: 265px;
  margin-right: -8px;
}
</style>
