<template>
  <view class="order-card" @click="handleClick">
    <!-- 状态标识和订单号 -->
    <view class="card-header">
      <view class="status-badge" :class="`status-${data.status}`">
        <text class="status-text">{{ statusText }}</text>
      </view>
      <text class="order-no">{{ data.orderNo }}</text>
    </view>

    <!-- 客户信息和金额 -->
    <view class="client-section">
      <image class="avatar" :src="data.clientAvatar" mode="aspectFill" />
      <view class="client-info">
        <text class="client-name">{{ data.clientName }}</text>
        <view class="amount-section">
          <text class="amount-symbol">¥</text>
          <text class="amount-value">{{ formatAmount(data.amount) }}</text>
        </view>
      </view>
    </view>

    <!-- 拍摄信息 -->
    <view class="shoot-section">
      <view class="shoot-row">
        <text class="shoot-icon">📅</text>
        <text class="shoot-text">{{ formatDate(data.shootDate) }}</text>
        <text class="shoot-time">{{ data.startTime }} - {{ data.endTime }}</text>
      </view>
      <view v-if="data.location" class="shoot-row">
        <text class="shoot-icon">📍</text>
        <text class="shoot-text">{{ data.location }}</text>
        <view class="type-badge">
          <text class="type-text">{{ typeText }}</text>
        </view>
      </view>
    </view>

    <!-- 付款进度 -->
    <view class="payment-section">
      <view class="payment-header">
        <text class="payment-label">付款进度</text>
        <text class="payment-text">{{ paymentProgress.paid }} / {{ paymentProgress.total }}</text>
      </view>
      <view class="progress-bar">
        <view
          class="progress-fill"
          :class="`progress-${data.paymentStatus}`"
          :style="{ width: paymentProgress.percentage + '%' }"
        />
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="actions">
      <button class="btn-detail" @click.stop="handleDetail">详情</button>
      <button
        v-if="canEdit"
        class="btn-edit"
        @click.stop="handleEdit"
      >
        编辑
      </button>
    </view>
  </view>
</template>

<script setup>
/**
 * 订单卡片组件
 *
 * 展示单个订单的详细信息
 */
import { computed } from 'vue'

const props = defineProps({
  // 订单数据
  data: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'detail', 'edit'])

/**
 * 状态文本
 */
const statusText = computed(() => {
  const statusMap = {
    draft: '草稿',
    pending: '待确认',
    confirmed: '已确认',
    production: '拍摄中',
    editing: '后期中',
    delivered: '已交付',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款'
  }
  return statusMap[props.data.status] || '未知'
})

/**
 * 拍摄类型文本
 */
const typeText = computed(() => {
  const typeMap = {
    wedding: '婚纱照',
    portrait: '个人写真',
    commercial: '商业摄影'
  }
  return typeMap[props.data.type] || '其他'
})

/**
 * 付款进度
 */
const paymentProgress = computed(() => {
  const paid = props.data.paidAmount || 0
  const total = props.data.amount || 0
  const percentage = total > 0 ? Math.min(100, (paid / total) * 100) : 0
  return {
    paid,
    total,
    percentage
  }
})

/**
 * 是否可编辑
 */
const canEdit = computed(() => {
  return !['completed', 'cancelled', 'refunded'].includes(props.data.status)
})

/**
 * 格式化金额
 */
const formatAmount = (amount) => {
  return (amount || 0).toLocaleString()
}

/**
 * 格式化日期
 */
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const weekDay = weekDays[date.getDay()]
  return `${month}月${day}日 周${weekDay}`
}

/**
 * 点击卡片
 */
const handleClick = () => {
  emit('click', props.data)
}

/**
 * 查看详情
 */
const handleDetail = () => {
  emit('detail', props.data)
}

/**
 * 编辑订单
 */
const handleEdit = () => {
  emit('edit', props.data)
}
</script>

<style lang="scss" scoped>
.order-card {
  position: relative;
  background: var(--lens-bg-secondary);
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    background: rgba(255, 255, 255, 0.05);
  }
}

/* 顶部状态和订单号 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.status-badge {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 22rpx;

  &.status-draft {
    background: rgba(158, 158, 158, 0.2);
    color: #9E9E9E;
  }

  &.status-pending {
    background: rgba(255, 152, 0, 0.2);
    color: #FF9800;
  }

  &.status-confirmed {
    background: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
  }

  &.status-production {
    background: rgba(33, 150, 243, 0.2);
    color: #2196F3;
  }

  &.status-editing {
    background: rgba(156, 39, 176, 0.2);
    color: #9C27B0;
  }

  &.status-delivered {
    background: rgba(0, 188, 212, 0.2);
    color: #00BCD4;
  }

  &.status-completed {
    background: rgba(158, 158, 158, 0.2);
    color: #9E9E9E;
  }

  &.status-cancelled {
    background: rgba(244, 67, 54, 0.2);
    color: #F44336;
  }

  &.status-refunded {
    background: rgba(255, 87, 34, 0.2);
    color: #FF5722;
  }
}

.status-text {
  font-size: 22rpx;
  font-weight: 500;
}

.order-no {
  font-size: 22rpx;
  color: var(--lens-text-muted);
  font-family: 'Georgia', serif;
}

/* 客户信息 */
.client-section {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
}

.client-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.client-name {
  font-size: 28rpx;
  color: var(--lens-text-primary);
  font-weight: 500;
}

.amount-section {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
}

.amount-symbol {
  font-size: 22rpx;
  color: var(--lens-accent);
}

.amount-value {
  font-size: 32rpx;
  color: var(--lens-accent);
  font-weight: 600;
  font-family: 'Georgia', serif;
}

/* 拍摄信息 */
.shoot-section {
  margin-bottom: 20rpx;
}

.shoot-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.shoot-icon {
  font-size: 24rpx;
}

.shoot-text {
  font-size: 26rpx;
  color: var(--lens-text-secondary);
}

.shoot-time {
  margin-left: auto;
  font-size: 24rpx;
  color: var(--lens-text-muted);
}

.type-badge {
  margin-left: auto;
  display: inline-block;
  padding: 6rpx 16rpx;
  background: rgba(139, 115, 85, 0.15);
  border-radius: 12rpx;
}

.type-text {
  font-size: 22rpx;
  color: var(--lens-accent);
}

/* 付款进度 */
.payment-section {
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.payment-label {
  font-size: 24rpx;
  color: var(--lens-text-muted);
}

.payment-text {
  font-size: 24rpx;
  color: var(--lens-text-secondary);
}

.progress-bar {
  height: 8rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4rpx;
  transition: width 0.3s ease;

  &.progress-deposit {
    background: #FF9800;
  }

  &.progress-partial {
    background: #2196F3;
  }

  &.progress-full {
    background: #4CAF50;
  }

  &.progress-unpaid {
    background: #9E9E9E;
  }
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 16rpx;
}

.btn-detail,
.btn-edit {
  flex: 1;
  padding: 24rpx;
  border-radius: 12rpx;
  font-size: 26rpx;
  border: none;
}

.btn-detail {
  background: rgba(255, 255, 255, 0.05);
  color: var(--lens-text-primary);
}

.btn-edit {
  background: rgba(139, 115, 85, 0.15);
  color: var(--lens-accent);
}
</style>
