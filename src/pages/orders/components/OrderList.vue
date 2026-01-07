<template>
  <view class="order-list">
    <!-- 空状态 -->
    <view v-if="orders.length === 0" class="empty-state">
      <text class="empty-icon">📋</text>
      <text class="empty-title">暂无订单</text>
      <text class="empty-desc">点击右下角 + 号创建新订单</text>
    </view>

    <!-- 订单列表 -->
    <view v-else class="list-content">
      <OrderCard
        v-for="order in orders"
        :key="order.id"
        :data="order"
        @click="handleCardClick"
        @detail="handleDetail"
        @edit="handleEdit"
      />
    </view>
  </view>
</template>

<script setup>
/**
 * 订单列表组件
 *
 * 展示订单列表，处理空状态
 */
import OrderCard from './OrderCard.vue'

const props = defineProps({
  // 订单列表
  orders: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['cardClick', 'detail', 'edit'])

/**
 * 点击卡片
 */
const handleCardClick = (order) => {
  emit('cardClick', order)
}

/**
 * 查看详情
 */
const handleDetail = (order) => {
  emit('detail', order)
}

/**
 * 编辑订单
 */
const handleEdit = (order) => {
  emit('edit', order)
}
</script>

<style lang="scss" scoped>
.order-list {
  min-height: 100%;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 60rpx;
  text-align: center;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 32rpx;
  opacity: 0.5;
}

.empty-title {
  font-size: 32rpx;
  color: var(--lens-text-primary);
  margin-bottom: 16rpx;
  font-weight: 500;
}

.empty-desc {
  font-size: 26rpx;
  color: var(--lens-text-muted);
}

/* 列表内容 */
.list-content {
  padding: 0 32rpx;
  padding-bottom: 120rpx;
}
</style>
