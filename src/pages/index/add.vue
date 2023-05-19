<template>
  <page classes="h-full bg-neutral-100 p-3">
    <van-collapse :value="activeNames" @change="activeNames = $event.detail">
      <van-collapse-item title="司机信息" name="1">
        <van-cell-group :border="false">
          <van-field
            v-for="item of driverForm"
            :key="item.key"
            :value="formData[item.key]"
            :type="item.type"
            required
            clearable
            :label="item.label"
            :placeholder="item.placeholder"
            @change="formData[item.key] = $event.detail"
          />
          <van-field
            :value="formData.city"
            required
            clearable
            label="所属城市"
            placeholder="请选择"
            @change="cityChange($event.detail)"
            @focus="cityChange($event.detail.value)"
          />
          <van-field
            :value="formData.exclusiveService"
            required
            clearable
            label="专属私服"
            placeholder="请选择"
            @change="staffChange($event.detail)"
          />
          <van-field
            :value="formData.salesLeader"
            required
            clearable
            label="销售负责人"
            placeholder="请选择"
            @change="leaderChange($event.detail)"
          />
        </van-cell-group>
      </van-collapse-item>
      <van-collapse-item title="身份证信息" name="2">
        <van-cell-group :border="false">
          <van-field
            :value="formData.driverIdentity.startTime"
            required
            clickable
            is-link
            label="生效期"
            placeholder="请选择"
            @click-input="nowKey = 'startTime', showDriverTime = true"
          />
          <van-field
            :value="formData.driverIdentity.endTime"
            required
            clickable
            is-link
            label="失效期"
            placeholder="请选择"
            @click-input="nowKey = 'endTime', showDriverTime = true"
          />
          <van-field
            v-model="formData.driverIdentity.issuingInstitution"
            required
            clearable
            label="发证机构"
            placeholder="请输入发证机构"
            @change="formData.driverIdentity.issuingInstitution = $event.detail"
          />
        </van-cell-group>
      </van-collapse-item>
      <van-collapse-item title="驾驶证信息" name="3">
        <van-cell-group :border="false">
          <van-field
            v-for="item of driveLicenseForm"
            :key="item.key"
            :value="formData.driveLicense[item.key]"
            required
            clearable
            :label="item.label"
            :placeholder="item.placeholder"
            :class="item.row"
            @change="formData[item.key] = $event.detail"
          />
          <van-field
            v-for="item of driveLicenseTimeForm"
            :key="item.key"
            :value="formData.driveLicense[item.key]"
            required
            clickable
            is-link
            :label="item.label"
            :placeholder="item.placeholder"
            :class="item.row"
            @click-input="nowKey = item.key, showLicenseTime = true"
          />
        </van-cell-group>
      </van-collapse-item>
      <van-collapse-item title="网约资格证" name="4">
        <van-cell-group :border="false">
          <van-field
            :value="formData.driverQualifica.isOnlineCar"
            clickable
            is-link
            label="政府人证情况"
            placeholder="请选择"
            @click-input="isOnlineCarPicker = true"
          />
          <van-field
            v-for="item of onlineCarForm"
            :key="item.key"
            :value="formData.driverQualifica[item.key]"
            required
            clearable
            :label="item.label"
            :placeholder="item.placeholder"
            :class="item.row"
            @change="formData.driverQualifica[item.key] = $event.detail"
          />
          <van-field
            v-for="item of onlineCarTimeForm"
            :key="item.key"
            :value="formData.driverQualifica[item.key]"
            required
            clickable
            is-link
            :label="item.label"
            :placeholder="item.placeholder"
            :class="item.row"
            @click-input="nowKey = item.key, showOnlineTime = true"
          />
        </van-cell-group>
      </van-collapse-item>
    </van-collapse>

    <van-button type="default" block @click="submit()">
      提交
    </van-button>

    <!--    选择城市 -->
    <van-popup
      :show="cityPicker"
      round
      position="bottom"
    >
      <van-picker show-toolbar :columns="cityColumns" value-key="value" @confirm="cityConfirm" @cancel="cityPicker = false" />
    </van-popup>
    <!-- 选择专属私服 -->
    <van-popup
      round
      :show="staffPicker"
      position="bottom"
    >
      <van-picker show-toolbar :columns="staffColumns" value-key="value" @confirm="staffConfirm" @cancel="staffPicker = false" />
    </van-popup>
    <!-- 选择负责人 -->
    <van-popup
      round
      :show="leaderPicker"
      position="bottom"
    >
      <van-picker show-toolbar :columns="leaderColumns" value-key="value" @confirm="leaderConfirm" @cancel="leaderPicker = false" />
    </van-popup>
    <!-- 网约车-政府人证 -->
    <van-popup
      :show="isOnlineCarPicker"
      round
      position="bottom"
    >
      <van-picker show-toolbar :columns="isOnlineCar" @confirm="isOnlineCarConfirm" @cancel="isOnlineCarPicker = false" />
    </van-popup>

    <van-popup
      round
      :show="showDriverTime"
      position="bottom"
    >
      <van-datetime-picker
        :value="formData.driverIdentity[nowKey]"
        type="date"
        show-toolbar
        :formatter="formatter"
        @cancel="showDriverTime = false"
        @confirm="timerDriverConfirm"
      />
    </van-popup>
    <van-popup
      round
      :show="showLicenseTime"
      position="bottom"
    >
      <van-datetime-picker
        :value="formData.driveLicense[nowKey]"
        type="date"
        show-toolbar
        :formatter="formatter"
        @cancel="showLicenseTime = false"
        @confirm="timerLicenseConfirm"
      />
    </van-popup>
    <van-popup
      round
      :show="showOnlineTime"
      position="bottom"
    >
      <van-datetime-picker
        :value="formData.driverQualifica[nowKey]"
        type="date"
        show-toolbar
        :formatter="formatter"
        @cancel="showOnlineTime = false"
        @confirm="timerOnlineConfirm"
      />
    </van-popup>
  </page>
</template>

<script>
import { addDriverInfo, getCitiesName } from '../../api/driver'
import { getUserByKeyword } from '../../api/user'
import { driveLicenseForm, driveLicenseTimeForm, driverForm, onlineCarForm, onlineCarTimeForm } from './form'

export default {
  components: {},
  data() {
    return {
      driverForm,
      driveLicenseForm,
      driveLicenseTimeForm,
      onlineCarForm,
      onlineCarTimeForm,
      activeNames: ['1', '2', '3', '4'],
      cityColumns: [], // 城市列表
      staffColumns: [], // 员工列表
      leaderColumns: [], // 负责人列表
      cityPicker: false,
      staffPicker: false,
      leaderPicker: false,
      isOnlineCarPicker: false,
      showDriverTime: false,
      showLicenseTime: false,
      showOnlineTime: false,
      nowKey: '',
      isOnlineCar: ['是', '否'],
      formatter(type, value) {
        if (type === 'year') {
          return `${value}年`
        }
        if (type === 'month') {
          return `${value}月`
        }
        return value
      },
      formData: {
        driverName: '',
        identityCard: '',
        address: '',
        driverPhone: '',
        exclusiveService: '',
        exclusiveServiceId: '',
        city: '',
        salesLeader: '',
        salesLeaderId: '',
        // 网约车资格证
        driverQualifica: {
          qualificaCode: '',
          issuingAuthority: '',
          isOnlineCar: '',
          issuingTime: '',
          theFirstTime: '',
          effectiveStartTime: '',
          effectiveEndTime: '',
          reportingTime: '',
          certificateImg: '',
        },
        // 身份证信息
        driverIdentity: {
          startTime: '',
          endTime: '',
          issuingInstitution: '',
          identityStraight: '',
          identityReverse: '',
          identityImg: '',
        },
        // 司机驾驶证
        driveLicense: {
          driveLicenseCode: '',
          permitDriveVehicle: '',
          startTime: '',
          endTime: '',
          drawTime: '',
          filesCode: '',
          driveLicenseHost: '',
          driveLicenseAssistant: '',
        },
      },
    }
  },
  computed: {},
  watch: {
  },
  onShow() {
    this.useVantModel(['username'])
  },
  methods: {
    async cityChange(e) {
      const res = await getCitiesName({
        keyWord: e,
      })
      this.cityColumns = res.body.citiesName
      this.cityPicker = true
    },
    async staffChange(e) {
      const res = await getUserByKeyword({
        keyWord: e,
      })
      this.staffColumns = res.body.result.map(item => ({
        value: item.userName,
        index: item.userId,
      }))
      if (this.staffColumns.length === 0) return
      this.staffPicker = true
    },
    async leaderChange(e) {
      const res = await getUserByKeyword({
        keyWord: e,
      })
      this.leaderColumns = res.body.result.map(item => ({
        value: item.userName,
        index: item.userId,
      }))
      if (this.leaderColumns.length === 0) return
      this.leaderPicker = true
    },
    cityConfirm(e) {
      this.formData.city = e.detail.value
      this.cityPicker = false
    },
    staffConfirm(e) {
      this.formData.exclusiveService = e.detail.value.value
      this.formData.exclusiveServiceId = e.detail.value.index
      this.staffPicker = false
    },
    leaderConfirm(e) {
      this.formData.salesLeader = e.detail.value.value
      this.formData.salesLeaderId = e.detail.value.index
      this.leaderPicker = false
    },
    isOnlineCarConfirm(e) {
      this.formData.driverQualifica.isOnlineCar = e.detail.value
      this.isOnlineCarPicker = false
    },
    formatDate(date) {
      date = new Date(date)
      const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
      const dt = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
      return `${date.getFullYear()}-${month}-${dt}`
    },

    timerDriverConfirm(e) {
      this.formData.driverIdentity[this.nowKey] = this.formatDate(e.detail)
      this.showDriverTime = false
    },
    timerLicenseConfirm(e) {
      this.formData.driveLicense[this.nowKey] = this.formatDate(e.detail)
      this.showLicenseTime = false
    },
    timerOnlineConfirm(e) {
      this.formData.driverQualifica[this.nowKey] = this.formatDate(e.detail)
      this.showOnlineTime = false
    },
    async submit() {
      const dt = { ...this.formData }
      if (dt.driverName) {
        return this.$toast.warning('有必填项未填')
      }
      await addDriverInfo({
        ...this.formData,
      })
      this.$toast.success('新增成功')
      uni.navigateBack()
    },
  },
}
</script>

<style lang="scss" scoped>
:deep(.van-cell-group){
  display: grid;
}
:deep(van-cell-group){
  display: grid;
}
</style>
