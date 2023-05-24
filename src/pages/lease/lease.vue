<script>
import { getLeaseOrderList, getT3LeaseOrderList } from '@/api/driver'
import BackTop from '@/components/business/BackTop/BackTop.vue'
import ScrollBtm from '@/components/business/ScrollBtm/ScrollBtm.vue'
import LeaseOrder from '@/pages/car/component/LeaseOrder.vue'
import SearchPopup from '@/pages/lease/component/SearchPopup.vue'

export default {
  components: {
    SearchPopup,
    BackTop,
    ScrollBtm,
    LeaseOrder,
  },
  data() {
    return {
      value: '',
      leaseOrderFormData: {
        pageNum: 1,
        pageSize: 20,
        // orderNo: '',
        // schemeNo: '',
        // carNumber: '',
        // driverName: '',
        // startcreateTime: '',
        // endcreateTime: '',
      },
      leaseOrderT3FormData: {
        pageNum: 1,
        pageSize: 20,
        // orderNo: '',
        // schemeNo: '',
        // carNumber: '',
        // vinNo: '',
        // driverId: '',
      },
      leaseOrderList: [],
      leaseOrderListT3: [],
      leaseOrderEmpty: true,
      leaseOrderT3Empty: true,
      leaseOrderCanReLoad: false,
      leaseOrderT3CanReLoad: false,
      active: 1,
      showFilter: false,
      showFilterT3: false,
      showCalendar: false,
      showCalendarT3: false,
      searchFormData: {},
      searchT3FormData: {},
    }
  },
  onShow() {
    this.leaseOrderFormData.pageNum = 1
    this.leaseOrderT3FormData.pageNum = 1

    this.getLeaseOrder()
    this.getT3LeaseOrder()
  },
  async onPullDownRefresh() {
    this.leaseOrderFormData.pageNum = 1
    this.leaseOrderT3FormData.pageNum = 1
    if (this.active === 1)
      await this.getLeaseOrder()
    else
      await this.getT3LeaseOrder()
  },
  async onReachBottom() {
    if (this.active === 1) {
      this.leaseOrderFormData.pageNum++
      await this.getLeaseOrderListReload()
    }
    if (this.active === 2) {
      this.leaseOrderT3FormData.pageNum++
      await this.getT3LeaseOrderListReload()
    }
  },
  methods: {
    // 租赁订单-自营
    async getLeaseOrder() {
      uni.showLoading({
        title: '加载中',
        mask: true,
      })
      const res = await getLeaseOrderList({
        ...this.leaseOrderFormData,
        ...this.searchFormData,
      }).finally(() => {
        uni.stopPullDownRefresh()
        uni.hideLoading()
      })
      this.leaseOrderList = res.body.resultList
      this.leaseOrderEmpty = this.leaseOrderList.length === 0
      this.leaseOrderCanReLoad = res.body.totalCount > this.leaseOrderList.length
    },
    // 租赁订单-自营 加载
    async getLeaseOrderListReload() {
      if (!this.leaseOrderCanReLoad)
        return
      const res = await this.$loading(getLeaseOrderList({
        ...this.leaseOrderFormData,
        ...this.searchFormData,
      }),
      )
      this.leaseOrderList = [...this.leaseOrderList, ...res.body.resultList]
      this.leaseOrderCanReLoad = res.body.totalCount > this.leaseOrderList.length
    },
    // 租赁订单-T3
    async getT3LeaseOrder() {
      const res = await getT3LeaseOrderList({
        ...this.leaseOrderT3FormData,
        ...this.searchT3FormData,
      }).finally(() => {
        uni.stopPullDownRefresh()
      })
      this.leaseOrderListT3 = res.body.resultList
      this.leaseOrderT3Empty = this.leaseOrderListT3.length === 0
      this.leaseOrderT3CanReLoad = res.body.totalCount > this.leaseOrderListT3.length
    },
    // 租赁订单-T3 加载
    async getT3LeaseOrderListReload() {
      if (!this.leaseOrderT3CanReLoad)
        return
      const res = await this.$loading(getT3LeaseOrderList({
        ...this.leaseOrderT3FormData,
        ...this.searchT3FormData,
      }),
      )
      this.leaseOrderListT3 = [...this.leaseOrderListT3, ...res.body.resultList]
      this.leaseOrderT3CanReLoad = res.body.totalCount > this.leaseOrderListT3.length
    },
    filter(e) {
      this.leaseOrderFormData.pageNum = 1
      this.searchFormData = { ...e }
      this.getLeaseOrder()
      this.showFilter = false
    },
    filterT3(e) {
      this.leaseOrderT3FormData.pageNum = 1
      this.searchT3FormData = { ...e }
      this.getT3LeaseOrder()
      this.showFilterT3 = false
    },
    onChange(e) {
      this.active = e.detail.name
      this.leaseOrderFormData.pageNum = 1
      this.leaseOrderT3FormData.pageNum = 1
    },
    toDetail(p) {
      const url = p.type === 'T3' ? 'leaseOrderT3Detail' : 'leaseOrderDetail'
      uni.navigateTo({
        url: `/pages/lease/${url}?id=${p.id}&type=${p.type}`,
      })
    },
    // formatDate(date) {
    //   date = new Date(date)
    //   return `${date.getFullYear()}-${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`}-${date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`}`
    // },
    // onConfirm(e) {
    //   const [start, end] = e.detail
    //   // console.log(this.formatDate(start), this.formatDate(end))
    //   this.showCalendar = false
    // },
    // onConfirmT3(e) {
    //   const [start, end] = e.detail
    //   // console.log(this.formatDate(start), this.formatDate(end))
    //   this.showCalendarT3 = false
    // },
  },
}
</script>

<template>
  <page>
    <van-tabs
      :active="active"
      color="#1296db"
      class=""
      sticky
      @change="onChange"
    >
      <van-tab title="自营" :name="1">
        <view
          v-if="leaseOrderEmpty"
        >
          <van-empty description="暂无数据" />
        </view>
        <view v-else class="p-2">
          <lease-order
            v-for="item in leaseOrderList"
            :key="item.id"
            :item="item"
            type="my"
            card="card"
            @click-event="toDetail"
          />
          <scroll-btm :can-reload="leaseOrderCanReLoad" />
        </view>
      </van-tab>
      <van-tab title="T3" :name="2">
        <view
          v-if="leaseOrderT3Empty"
        >
          <van-empty description="暂无数据" />
        </view>

        <view v-else class="p-2">
          <lease-order
            v-for="item in leaseOrderListT3"
            :key="item.id"
            :item="item"
            type="T3"
            card="card"
            @click-event="toDetail"
          />
          <scroll-btm :can-reload="leaseOrderT3CanReLoad" />
        </view>
      </van-tab>
      <template #nav-right>
        <view class="px-2 flex items-center bg-[#efefef]" @click="active === 1 ? showFilter = true : showFilterT3 = true">
          <van-icon name="filter-o" />
        </view>
      </template>
    </van-tabs>

    <!--    自营 -->
    <search-popup :show="showFilter" type="my" @close="showFilter = false" @filter="filter" />
    <!--    T3 -->
    <search-popup :show="showFilterT3" type="T3" @close="showFilterT3 = false" @filter="filterT3" />

    <view class="fixed bottom-16 right-4">
      <view class="bg-primary w-8 h-8 backTop rounded-1/2 flex place-content-center" @click="uni.navigateTo({ url: '/pages/order/car-rental/apply' })">
        <van-icon name="plus" color="#fff" />
      </view>
    </view>

    <back-top />
  </page>
</template>

<style scoped>

</style>
