<script>
const STATUS = {
  INACTIVE: 0,
  LOADING: 1,
  ERROR: 2,
  DONE: 3,
}

const REFRESH_STATUS = {
  INACTIVE: 0,
  LOADING: 1,
  ERROR: 2,
  DONE: 3,
}

export default {
  options: {
    virtualHost: true,
  },
  props: {
    immediate: {
      type: Boolean,
      default: true,
    },
    pullRefresh: {
      type: Boolean,
      default: false,
    },
    loadMore: {
      type: Boolean,
      default: false,
    },
    scope: { type: Object },
  },
  data() {
    return {
      STATUS,
      REFRESH_STATUS,
      page: 1,
      status: STATUS.INACTIVE,
      refreshStatus: REFRESH_STATUS.INACTIVE,
    }
  },
  computed: {
    isLoading() {
      return this.status === STATUS.LOADING
    },
  },
  mounted() {
    this.immediate && this.load()
  },
  methods: {
    async scrolltolower() {
      if (!this.loadMore || [STATUS.DONE, STATUS.LOADING].includes(this.status))
        return

      this.load()
    },
    async refresh() {
      if (!this.pullRefresh || REFRESH_STATUS.LOADING === this.refreshStatus)
        return

      this.reset()
      this.refreshStatus = REFRESH_STATUS.LOADING
      this.status = STATUS.LOADING
      this.$emit('refresh', {
        page: this.page,
        next: () => {
          this.refreshStatus = REFRESH_STATUS.INACTIVE
          this.status = STATUS.INACTIVE
        },
        done: () => {
          this.refreshStatus = REFRESH_STATUS.DONE
          this.status = STATUS.DONE
        },
        fail: (err) => {
          this.refreshStatus = REFRESH_STATUS.ERROR
          this.status = STATUS.ERROR
          return Promise.reject(err)
        },
      })
    },
    load() {
      this.status = STATUS.LOADING
      this.$emit('load', {
        page: this.page,
        next: () => {
          this.page++
          this.status = STATUS.INACTIVE
        },
        done: () => {
          this.status = STATUS.DONE
        },
        fail: (err) => {
          this.status = STATUS.ERROR
          return Promise.reject(err)
        },
      })
    },
    reset() {
      this.page = 1
      this.status = STATUS.INACTIVE
      this.refreshStatus = REFRESH_STATUS.INACTIVE
      return this
    },
  },
}
</script>

<template>
  <scroll-view
    class="vc-list"
    :class="[classes]"
    scroll-y
    enable-back-to-top
    :refresher-enabled="pullRefresh"
    :refresher-triggered="refreshStatus === REFRESH_STATUS.LOADING"
    @scrolltolower="scrolltolower"
    @refresherrefresh="refresh"
  >
    <slot />
    <slot v-if="loadMore" name="load-more" :loading="status === STATUS.LOADING" :finished="status === STATUS.DONE">
      <div class="flex items-center justify-center py-2 text-sm text-gray-400">
        <div v-if="status === STATUS.INACTIVE" size="16px" @click="load">
          加载更多
        </div>
        <van-loading v-if="isLoading" size="16px">
          加载中...
        </van-loading>
        <div v-if="status === STATUS.ERROR" size="16px">
          加载出错，请重试
        </div>
        <div v-if="status === STATUS.DONE">
          没有更多了
        </div>
      </div>
    </slot>
  </scroll-view>
</template>

<style>
.vc-list {
  height: 100%;
  flex: 1;
}
</style>
