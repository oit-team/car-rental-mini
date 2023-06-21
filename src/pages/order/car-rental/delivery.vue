<script>
export default {
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
  computed: {
    hasContract() {
      return Object.keys(this.contract).length
    },
  },
  methods: {
    setContract({ fileList }) {
      this.contract = fileList[0] ?? {}
    },
    clearContract() {
      this.$refs.contract.deleteFile(0)
    },
    contractUploadError(err) {
      this.$toast(err.msg)
      this.clearContract()
    },
    setDriverAnnex({ fileList }) {
      this.driverAnnex = fileList
    },
    convertToUrls(files) {
      return files.filter(file => file.status === 'done').map(file => file.response.fileUrl).join(',')
    },
    submit() {
      if (this.contract.status && this.contract.status !== 'done')
        return this.$toast('请等待合同上传完成')

      const data = {
        contractName: this.contract.name,
        contractUrl: this.contract?.response?.fileUrl,
        driverAnnex: this.convertToUrls(this.driverAnnex),
        resList: this.convertToUrls(this.resList),
        vehicleSupplementary: Object.fromEntries(Object.entries(this.vehicleSupplementary).map(([key, value]) => [key, this.convertToUrls(value)])),
      }

      console.log(data)
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
      <van-cell title="文件" value-class="upload-cell-class">
        <vc-upload
          v-show="!hasContract"
          id="contract"
          ref="contract"
          accept="file"
          :preview-image="false"
          @change="setContract"
          @error="contractUploadError"
        >
          <van-button icon="orders-o">
            选择文件
          </van-button>
        </vc-upload>
        <div v-show="hasContract" @click="clearContract()">
          {{ contract.name }}{{ !contract.status === 'done' ? '(上传中)' : '' }}
          <div class="text-sm">
            点击删除
          </div>
        </div>
      </van-cell>
    </van-cell-group>
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
