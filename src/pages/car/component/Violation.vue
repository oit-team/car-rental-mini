<script>
import Card from '../../index/component/Card.vue'

export default {
  components: { Card },
  props: {
    violation: Array,
  },
  data() {
    return {
    }
  },
  computed: {},
  watch: {},
  methods: {},
}
</script>

<template>
  <view class="text-xs px-2">
    <view
      v-for="item in violation"
      :key="item.id"
      class="border-1 border-solid border-[#ccc] rounded mb-2"
    >
      <card>
        <template #title-left>
          <view class="flex">
            <!--          违法记录编号：<span class="text-[#888]">{{ item.violationRecordNumber || '暂无' }}</span> -->
            违章信息
          </view>
        </template>
        <template #title-right>
          <view class="flex">
            <van-tag v-if="item.disposeState === '未完结'" type="warning">
              {{ item.disposeState }}
            </van-tag>
            <van-tag v-if="item.disposeState !== '未完结'" type="success">
              {{ item.disposeState }}
            </van-tag>
          </view>
        </template>
        <template #card-content>
          <view class="p-2 leading-relaxed">
            <view>
              <span class=" text-[#777]">处罚金额：</span><span class="text-red-500">￥{{ item.forfeit }}</span>
            </view>
            <view>
              <span class=" text-[#777]">违章地址：</span>{{ item.violationAddress }}
            </view>
            <view>
              <span class=" text-[#777]">违章行为：</span>{{ item.illegalBehavior }}
            </view>
            <view>
              <span class=" text-[#777]">违章日期：</span>{{ item.violationTime || '暂无' }}
            </view>
          </view>
        </template>
      </card>
    </view>
  </view>
</template>

<style lang="scss" scoped>

</style>
