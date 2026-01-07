<template>
  <view class="request-card" @click="handleClick">
    <!-- 状态标识 -->
    <view class="status-badge" :class="`status-${data.status}`">
      <text class="status-text">{{ statusText }}</text>
    </view>

    <!-- 客户信息 -->
    <view class="client-section">
      <image class="avatar" :src="data.clientAvatar" mode="aspectFill" />
      <view class="client-info">
        <text class="client-name">{{ data.clientName }}</text>
        <text class="client-phone">{{ data.clientPhone }}</text>
      </view>
    </view>

    <!-- 偏好日期 -->
    <view class="dates-section">
      <text class="section-label">偏好日期</text>
      <view class="date-tags">
        <text
          v-for="(date, index) in data.preferredDates"
          :key="index"
          class="date-tag"
        >
          {{ formatDateShort(date) }}
        </text>
      </view>
    </view>

    <!-- 偏好时间 -->
    <view class="time-section">
      <text class="section-label">偏好时间</text>
      <text class="time-text">{{ data.preferredTime }}</text>
    </view>

    <!-- 拍摄类型 -->
    <view class="type-section">
      <text class="section-label">拍摄类型</text>
      <view class="type-badge">
        <text class="type-text">{{ typeText }}</text>
      </view>
    </view>

    <!-- 留言 -->
    <view v-if="data.message" class="message-section">
      <text class="section-label">客户留言</text>
      <text class="message-text">{{ data.message }}</text>
    </view>

    <!-- 操作按钮 -->
    <view v-if="data.status === 'pending'" class="actions">
      <button class="btn-reject" @click.stop="handleReject">拒绝</button>
      <button class="btn-approve" @click.stop="handleApprove">确认</button>
    </view>
  </view>
</template>

<script setup>
/**
 * 预约申请卡片组件
 *
 * 展示预约申请信息
 */
import { computed } from 'vue'

const props = defineProps({
  // 预约数据
  data: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'approve', 'reject', 'detail'])

/**
 * 状态文本
 */
const statusText = computed(() => {
  const statusMap = {
    pending: '待处理',
    approved: '已接受',
    rejected: '已拒绝'
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
 * 格式化日期为短格式
 */
const formatDateShort = (dateStr) => {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}/${day}`
}

/**
 * 点击卡片
 */
const handleClick = () => {
  emit('click', props.data)
}

/**
 * 拒绝预约
 */
const handleReject = () => {
  uni.showModal({
    title: '拒绝预约',
    content: '确认拒绝此预约申请？',
    success: (res) => {
      if (res.confirm) {
        emit('reject', props.data)
      }
    }
  })
}

/**
 * 接受预约
 */
const handleApprove = () => {
  emit('approve', props.data)
}
</script>

<style lang="scss" scoped>
.request-card {
  position: relative;
  background: var(--lens-bg-secondary);
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
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

  &.status-pending {
    background: rgba(255, 152, 0, 0.2);
    color: #FF9800;
  }

  &.status-approved {
    background: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
  }

  &.status-rejected {
    background: rgba(244, 67, 54, 0.2);
    color: #F44336;
  }
}

.status-text {
  font-size: 22rpx;
  font-weight: 500;
}

/* 客户信息 */
.client-section {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
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
  gap: 8rpx;
}

.client-name {
  font-size: 28rpx;
  color: var(--lens-text-primary);
  font-weight: 500;
}

.client-phone {
  font-size: 24rpx;
  color: var(--lens-text-muted);
}

/* 各个区块 */
.dates-section,
.time-section,
.type-section {
  margin-bottom: 20rpx;
}

.section-label {
  display: block;
  font-size: 24rpx;
  color: var(--lens-text-muted);
  margin-bottom: 12rpx;
}

.date-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.date-tag {
  padding: 8rpx 20rpx;
  background: rgba(139, 115, 85, 0.15);
  border-radius: 12rpx;
  font-size: 24rpx;
  color: var(--lens-accent);
}

.time-text {
  font-size: 26rpx;
  color: var(--lens-text-secondary);
}

.type-badge {
  display: inline-block;
  padding: 6rpx 16rpx;
  background: rgba(139, 115, 85, 0.15);
  border-radius: 12rpx;
}

.type-text {
  font-size: 22rpx;
  color: var(--lens-accent);
}

/* 留言 */
.message-section {
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.message-text {
  font-size: 24rpx;
  color: var(--lens-text-secondary);
  line-height: 1.6;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 16rpx;
}

.btn-reject,
.btn-approve {
  flex: 1;
  padding: 24rpx;
  border-radius: 12rpx;
  font-size: 26rpx;
  border: none;
}

.btn-reject {
  background: rgba(255, 255, 255, 0.05);
  color: var(--lens-text-primary);
}

.btn-approve {
  background: var(--lens-accent);
  color: #FFFFFF;
}
</style>
