<script>
export default {
  props: {
    workCode: String,
  },
  data: () => ({
    contract: {},
    driverAnnex: [],
    resList: [],
    vehicleSupplementary: {
      front: [],
      rear: [],
      left: [],
      right: [],
      backRow: [],
      frontRow: [],
      dashboard: [],
      chassis: [],
    },
  }),
  methods: {
    setContract({ fileList }) {
      this.contract = fileList[0] ?? {}
    },
    setDriverAnnex({ fileList }) {
      this.driverAnnex = fileList
    },
    convertToUrls(files) {
      return files.filter(file => file.status === 'done').map(file => file.response.fileUrl).join(',')
    },
    async submit() {
      if (this.contract.status && this.contract.status !== 'done')
        return this.$toast('请等待合同上传完成')

      await this.$dialog.confirm({
        message: '确认要提交吗？',
      })

      const params = {
        contractName: this.contract.name,
        contractUrl: this.contract?.response?.fileUrl,
        driverAnnex: this.convertToUrls(this.driverAnnex),
        resList: this.convertToUrls(this.resList),
        vehicleSupplementary: Object.fromEntries(Object.entries(this.vehicleSupplementary).map(([key, value]) => [key, this.convertToUrls(value)])),
      }

      await this.$loading(
        this.$post('/workFlow/workFlow/submit', {
          flowCode: 'CAR_RENTAL',
          workCode: this.workCode,
          approvalStatus: 1,
          params,
        }),
      )

      uni.$emit('order:reload')
      uni.navigateBack()
    },
    async reject() {
      await this.$dialog.confirm({
        message: '确认要拒绝吗？',
      })
      await this.$loading(
        this.$post('/workFlow/workFlow/submit', {
          flowCode: 'CAR_RENTAL',
          workCode: this.workCode,
          approvalStatus: 0,
          params: {},
        }),
      )
      uni.$emit('order:reload')
      uni.navigateBack()
    },
  },
}
</script>

<template>
  <page>
    <van-cell-group title="附件">
      <van-cell title="司机附件" value-class="upload-cell-class">
        <vc-upload @change="driverAnnex = $event.fileList" />
      </van-cell>
      <van-cell title="车辆附件" value-class="upload-cell-class">
        <vc-upload @change="resList = $event.fileList" />
      </van-cell>
    </van-cell-group>
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
        <vc-upload :limit="1" @change="vehicleSupplementary[item.key] = $event.fileList" />
      </van-cell>
    </van-cell-group>
    <van-cell-group title="租赁合同">
      <van-cell
        title="附件"
        value-class="upload-cell-class"
      >
        <vc-upload :limit="1" @success="setContract" />
      </van-cell>
    </van-cell-group>
    <div class="pt-3 flex">
      <van-button class="flex-1" block type="danger" square @click="reject()">
        拒绝
      </van-button>
      <van-button class="flex-1" block type="primary" square @click="submit()">
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
