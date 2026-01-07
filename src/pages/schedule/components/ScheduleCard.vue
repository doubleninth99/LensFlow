<template>
  <view class="schedule-card" @click="handleClick">
    <!-- 状态标识 -->
    <view class="status-badge" :class="`status-${data.status}`">
      <text class="status-text">{{ statusText }}</text>
    </view>

    <!-- 时间信息 -->
    <view class="time-section">
      <text class="time-range">{{ data.startTime }} - {{ data.endTime }}</text>
      <text class="date-text">{{ formatDate(data.date) }}</text>
    </view>

    <!-- 客户信息 -->
    <view class="client-section">
      <image class="avatar" :src="data.clientAvatar" mode="aspectFill" />
      <view class="client-info">
        <text class="client-name">{{ data.clientName }}</text>
        <view class="type-badge">
          <text class="type-text">{{ typeText }}</text>
        </view>
      </view>
    </view>

    <!-- 地点 -->
    <view v-if="data.location" class="location-section">
      <text class="location-icon">📍</text>
      <text class="location-text">{{ data.location }}</text>
    </view>

    <!-- 备注 -->
    <view v-if="data.notes" class="notes-section">
      <text class="notes-text">{{ data.notes }}</text>
    </view>

    <!-- 操作按钮 -->
    <view class="actions">
      <button class="btn-detail" @click.stop="handleDetail">详情</button>
      <button
        v-if="data.status === 'pending'"
        class="btn-confirm"
        @click.stop="handleConfirm"
      >
        确认
      </button>
    </view>
  </view>
</template>

<script setup>
/**
 * 档期卡片组件
 *
 * 展示单个档期的详细信息
 */
import { computed } from 'vue'

const props = defineProps({
  // 档期数据
  data: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'detail', 'confirm', 'cancel'])

/**
 * 状态文本
 */
const statusText = computed(() => {
  const statusMap = {
    confirmed: '已确认',
    pending: '待确认',
    completed: '已完成',
    cancelled: '已取消'
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
 * 确认档期
 */
const handleConfirm = () => {
  emit('confirm', props.data)
}
</script>

<style lang="scss" scoped>
.schedule-card {
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

/* 状态标识 */
.status-badge {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 22rpx;

  &.status-confirmed {
    background: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
  }

  &.status-pending {
    background: rgba(255, 152, 0, 0.2);
    color: #FF9800;
  }

  &.status-completed {
    background: rgba(158, 158, 158, 0.2);
    color: #9E9E9E;
  }

  &.status-cancelled {
    background: rgba(244, 67, 54, 0.2);
    color: #F44336;
  }
}

.status-text {
  font-size: 22rpx;
  font-weight: 500;
}

/* 时间信息 */
.time-section {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.time-range {
  font-size: 32rpx;
  color: var(--lens-text-primary);
  font-weight: 500;
  font-family: Georgia, serif;
}

.date-text {
  font-size: 24rpx;
  color: var(--lens-text-muted);
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

.type-badge {
  display: inline-block;
  padding: 6rpx 16rpx;
  background: rgba(139, 115, 85, 0.15);
  border-radius: 12rpx;
  align-self: flex-start;
}

.type-text {
  font-size: 22rpx;
  color: var(--lens-accent);
}

/* 地点 */
.location-section {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.location-icon {
  font-size: 24rpx;
}

.location-text {
  font-size: 24rpx;
  color: var(--lens-text-secondary);
}

/* 备注 */
.notes-section {
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.notes-text {
  font-size: 24rpx;
  color: var(--lens-text-muted);
  line-height: 1.6;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 16rpx;
}

.btn-detail,
.btn-confirm {
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

.btn-confirm {
  background: var(--lens-accent);
  color: #FFFFFF;
}
</style>
