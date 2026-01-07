<template>
  <view class="request-list">
    <!-- 列表 -->
    <view v-if="requests.length > 0" class="list">
      <RequestCard
        v-for="request in requests"
        :key="request.id"
        :data="request"
        @click="handleCardClick"
        @approve="handleApprove"
        @reject="handleReject"
      />
    </view>

    <!-- 空状态 -->
    <EmptyState
      v-else
      icon="📝"
      text="暂无预约申请"
    />
  </view>
</template>

<script setup>
/**
 * 预约申请列表组件
 *
 * 显示预约申请列表或空状态
 */
import { computed } from 'vue'
import RequestCard from './RequestCard.vue'
import EmptyState from './EmptyState.vue'

const props = defineProps({
  // 预约申请列表
  requests: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['cardClick', 'approve', 'reject'])

/**
 * 点击卡片
 */
const handleCardClick = (request) => {
  emit('cardClick', request)
}

/**
 * 接受预约
 */
const handleApprove = (request) => {
  emit('approve', request)
}

/**
 * 拒绝预约
 */
const handleReject = (request) => {
  emit('reject', request)
}
</script>

<style lang="scss" scoped>
.request-list {
  padding: 0 32rpx 32rpx;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
