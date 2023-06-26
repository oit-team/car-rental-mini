<script>
import CardItem from './component/CardItem.vue'
import { getDriverList } from '@/api/driver'
import BackTop from '@/components/business/BackTop/BackTop.vue'

export default {
  components: {
    BackTop,
    CardItem,
  },
  data() {
    return {
      title: 'Hello',
      value: '',
      formData: {
        pageNum: 1,
        pageSize: 20,
        keyWord: '',
      },
      driverList: [],
      canReLoad: false,
      showEmpty: true,
      showBackTop: false,
    }
  },
  computed: {
    logged() {
      return this.$store.getters.logged
    },
  },
  watch: {
  },
  onLoad() {
  },
  async onShow() {
    await this.$store.state.userLoginPromise

    this.formData.pageNum = 1
    this.getData()
  },
  async onPullDownRefresh() {
    this.formData.pageNum = 1
    await this.getData()
    uni.stopPullDownRefresh()
  },
  async onReachBottom() {
    this.formData.pageNum++
    await this.reload()
  },
  methods: {
    async getData() {
      const res = await this.$loading(
        getDriverList({ ...this.formData }),
      )
      this.driverList = res.body.resultList
      this.showEmpty = this.driverList.length === 0
      this.canReLoad = this.driverList.length < res.body.count
    },
    async reload() {
      if (!this.canReLoad)
        return
      const res = await this.$loading(getDriverList({ ...this.formData }))
      this.driverList = this.driverList.concat(...res.body.resultList)
      this.canReLoad = this.driverList.length < res.body.count
    },
    onSearch(e) {
      this.formData.pageNum = 1
      this.formData.keyWord = e.detail
      this.getData()
    },
    onClear() {
      this.formData.pageNum = 1
      this.formData.keyWord = ''
      this.getData()
    },
    login() {
      uni.reLaunch({
        url: '/pages/account/login',
      })
    },
    toDetail(item) {
      uni.navigateTo({
        url: `/pages/index/detail?id=${item.driverId}`,
      })
    },
    addDriver() {
      uni.navigateTo({
        url: '/pages/index/add',
      })
    },
  },
}
</script>

<template>
  <page classes="flex flex-col bg-neutral-100 min-h-screen">
    <view v-if="!logged" class="w-[100vw] h-[100vh] bg-white flex flex-col justify-center items-center fixed top-0 left-0 z-20">
      <view @click="login">
        <van-empty description="点击去登录" />
      </view>
    </view>
    <van-search
      :value="value"
      placeholder="手机号/司机姓名"
      class="shadow-lg mb-2 sticky top-0 left-0 z-10"
      @search="onSearch"
      @clear="onClear"
      @change="value = $event.detail"
    />
    <view v-if="showEmpty">
      <van-empty
        class="custom-image"
        description="暂无数据"
      />
    </view>
    <view v-else class="w-full grid grid-cols-1 gap-2 flex-1 px-2 box-border">
      <card-item
        v-for="item in driverList"
        :key="item.driverId"
        :item="item"
        @to-detail="toDetail(item)"
      >
        <view class="text-[#888888]">
          {{ item.licensePlateNumber || '无绑定车辆' }}
        </view>
      </card-item>
      <view v-if="driverList.length" class="text-center text-[#888] pb-2 flex justify-center items-center">
        <view class="w-1/2">
          <van-divider content-position="center">
            {{ canReLoad ? '正在加载' : '我也是有底线的' }}
          </van-divider>
        </view>
      </view>
    </view>

    <back-top />
    <!--    <view class="fixed bottom-4 right-4"> -->
    <!--      <view class="bg-[#467ff3] w-8 h-8  rounded-1/2 flex place-content-center mb-2" @click="addDriver"> -->
    <!--        <van-icon name="plus" color="#fff" /> -->
    <!--      </view> -->
    <!--      <view class="bg-[#1296db] w-8 h-8 backTop rounded-1/2 flex place-content-center" @click="backTop"> -->
    <!--        <van-icon name="back-top" color="#fff" /> -->
    <!--      </view> -->
    <!--    </view> -->
  </page>
</template>

<style lang="scss" scoped>
.van-image__img {
  border-radius: 6px !important;
}
.backTop{
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
}
</style>
