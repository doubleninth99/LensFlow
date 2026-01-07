<template>
  <view v-if="visible" class="schedule-detail-overlay" @click="handleClose">
    <view class="detail-popup" @click.stop>
      <!-- 顶部栏 -->
      <view class="popup-header">
        <view class="close-btn" @click="handleClose">
          <text class="close-icon">✕</text>
        </view>
        <text class="header-title">档期详情</text>
        <view class="header-spacer" />
      </view>

      <!-- 内容区域 -->
      <scroll-view class="popup-content" scroll-y>
        <!-- 状态卡片 -->
        <view class="status-section">
          <view class="status-badge" :class="`status-${schedule.status}`">
            <text class="status-text">{{ statusText }}</text>
          </view>
        </view>

        <!-- 时间信息 -->
        <view class="time-section">
          <view class="date-row">
            <text class="date-icon">📅</text>
            <text class="date-text">{{ formattedDate }}</text>
          </view>
          <view class="time-row">
            <text class="time-icon">⏰</text>
            <text class="time-text">{{ schedule.startTime }} - {{ schedule.endTime }}</text>
            <text class="duration-text">（{{ duration }}小时）</text>
          </view>
        </view>

        <!-- 客户信息 -->
        <view class="section">
          <view class="section-header">
            <text class="section-icon">👤</text>
            <text class="section-title">客户信息</text>
          </view>
          <view class="client-card">
            <image class="client-avatar" :src="schedule.clientAvatar" mode="aspectFill" />
            <view class="client-info">
              <text class="client-name">{{ schedule.clientName }}</text>
              <text class="client-phone">{{ schedule.clientPhone }}</text>
            </view>
            <button class="call-btn" @click="handleCall">
              <text class="call-icon">📞</text>
              <text class="call-text">拨打</text>
            </button>
          </view>
        </view>

        <!-- 拍摄信息 -->
        <view class="section">
          <view class="section-header">
            <text class="section-icon">📷</text>
            <text class="section-title">拍摄信息</text>
          </view>
          <view class="info-card">
            <view class="info-row">
              <text class="info-label">拍摄类型</text>
              <view class="type-badge">
                <text class="type-text">{{ typeText }}</text>
              </view>
            </view>
            <view class="info-row">
              <text class="info-label">拍摄地点</text>
              <text class="info-value">{{ schedule.location || '未设置' }}</text>
            </view>
            <view v-if="schedule.notes" class="info-row info-row-block">
              <text class="info-label">备注</text>
              <text class="info-value info-notes">{{ schedule.notes }}</text>
            </view>
          </view>
        </view>

        <!-- 创建时间 -->
        <view class="section">
          <view class="section-header">
            <text class="section-icon">🕐</text>
            <text class="section-title">创建时间</text>
          </view>
          <view class="info-card">
            <text class="create-time">{{ formattedCreateTime }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 底部操作栏 -->
      <view class="action-bar">
        <!-- 取消档期按钮 -->
        <button
          v-if="schedule.status === 'pending' || schedule.status === 'confirmed'"
          class="btn-cancel"
          @click="handleCancel"
        >
          取消档期
        </button>

        <!-- 编辑按钮 -->
        <button
          v-if="schedule.status !== 'completed' && schedule.status !== 'cancelled'"
          class="btn-edit"
          @click="handleEdit"
        >
          编辑
        </button>

        <!-- 确认按钮 -->
        <button
          v-if="schedule.status === 'pending'"
          class="btn-confirm"
          @click="handleConfirm"
        >
          确认档期
        </button>

        <!-- 转为订单按钮 -->
        <button
          v-if="schedule.status === 'confirmed' && !schedule.orderId"
          class="btn-convert"
          @click="handleConvertToOrder"
        >
          转为订单
        </button>

        <!-- 联系客户按钮 -->
        <button class="btn-contact" @click="handleCall">
          联系客户
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 档期详情弹窗组件
 *
 * 半屏弹窗形式展示档期详细信息
 */
import { computed } from 'vue'

const props = defineProps({
  // 是否显示
  visible: {
    type: Boolean,
    default: false
  },
  // 档期数据
  schedule: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'confirm', 'cancel', 'edit', 'call', 'convertToOrder'])

/**
 * 状态文本
 */
const statusText = computed(() => {
  const statusMap = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[props.schedule.status] || '未知'
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
  return typeMap[props.schedule.type] || '其他'
})

/**
 * 格式化日期
 */
const formattedDate = computed(() => {
  if (!props.schedule.date) return ''
  const date = new Date(props.schedule.date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const weekDay = weekDays[date.getDay()]
  return `${year}年${month}月${day}日 周${weekDay}`
})

/**
 * 格式化创建时间
 */
const formattedCreateTime = computed(() => {
  if (!props.schedule.createdAt) return ''
  const date = new Date(props.schedule.createdAt)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
})

/**
 * 计算时长
 */
const duration = computed(() => {
  if (!props.schedule.startTime || !props.schedule.endTime) return 0
  const start = parseInt(props.schedule.startTime.split(':')[0])
  const end = parseInt(props.schedule.endTime.split(':')[0])
  return end - start
})

/**
 * 关闭弹窗
 */
const handleClose = () => {
  emit('close')
}

/**
 * 确认档期
 */
const handleConfirm = () => {
  emit('confirm', props.schedule)
}

/**
 * 取消档期
 */
const handleCancel = () => {
  uni.showModal({
    title: '取消档期',
    content: '确认取消此档期？',
    success: (res) => {
      if (res.confirm) {
        emit('cancel', props.schedule)
      }
    }
  })
}

/**
 * 编辑档期
 */
const handleEdit = () => {
  emit('edit', props.schedule)
}

/**
 * 联系客户
 */
const handleCall = () => {
  const phone = props.schedule.clientPhone?.replace(/\*/g, '')
  if (phone) {
    uni.makePhoneCall({
      phoneNumber: phone
    })
  }
  emit('call', props.schedule)
}

/**
 * 转为订单
 */
const handleConvertToOrder = () => {
  emit('convertToOrder', props.schedule)
}
</script>

<style lang="scss" scoped>
.schedule-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.3s ease;
}

.detail-popup {
  width: 100%;
  max-height: 85vh;
  background: var(--lens-bg-secondary);
  border-radius: 32rpx 32rpx 0 0;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* 顶部栏 */
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.05);
}

.close-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  transition: all 0.3s ease;

  &:active {
    background: rgba(255, 255, 255, 0.1);
  }
}

.close-icon {
  font-size: 32rpx;
  color: var(--lens-text-primary);
}

.header-title {
  font-size: 32rpx;
  color: var(--lens-text-primary);
  font-weight: 500;
}

.header-spacer {
  width: 48rpx;
}

/* 内容区域 */
.popup-content {
  flex: 1;
  padding: 32rpx;
  overflow-y: auto;
}

/* 状态卡片 */
.status-section {
  display: flex;
  justify-content: center;
  margin-bottom: 32rpx;
}

.status-badge {
  padding: 12rpx 40rpx;
  border-radius: 100rpx;
  font-size: 26rpx;

  &.status-pending {
    background: rgba(255, 152, 0, 0.2);
    color: #FF9800;
  }

  &.status-confirmed {
    background: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
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
  font-size: 26rpx;
  font-weight: 500;
}

/* 时间信息 */
.time-section {
  background: rgba(139, 115, 85, 0.1);
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  border: 1rpx solid rgba(139, 115, 85, 0.2);
}

.date-row,
.time-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.date-row {
  margin-bottom: 16rpx;
}

.date-icon,
.time-icon {
  font-size: 32rpx;
}

.date-text {
  font-size: 32rpx;
  color: var(--lens-text-primary);
  font-weight: 500;
}

.time-text {
  font-size: 28rpx;
  color: var(--lens-text-secondary);
}

.duration-text {
  font-size: 24rpx;
  color: var(--lens-text-muted);
  margin-left: 8rpx;
}

/* 区块 */
.section {
  margin-bottom: 32rpx;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.section-icon {
  font-size: 32rpx;
}

.section-title {
  font-size: 28rpx;
  color: var(--lens-text-primary);
  font-weight: 500;
}

/* 客户卡片 */
.client-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.05);
}

.client-avatar {
  width: 96rpx;
  height: 96rpx;
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

.call-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  padding: 16rpx 24rpx;
  background: rgba(139, 115, 85, 0.15);
  border-radius: 16rpx;
  border: none;
}

.call-icon {
  font-size: 28rpx;
}

.call-text {
  font-size: 22rpx;
  color: var(--lens-accent);
}

/* 信息卡片 */
.info-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.05);
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;

  &:not(:last-child) {
    border-bottom: 1rpx solid rgba(255, 255, 255, 0.03);
  }

  &.info-row-block {
    flex-direction: column;
    align-items: flex-start;
    gap: 12rpx;
  }
}

.info-label {
  font-size: 26rpx;
  color: var(--lens-text-muted);
}

.info-value {
  font-size: 26rpx;
  color: var(--lens-text-secondary);
  text-align: right;

  &.info-notes {
    color: var(--lens-text-primary);
    line-height: 1.6;
  }
}

.type-badge {
  padding: 8rpx 20rpx;
  background: rgba(139, 115, 85, 0.15);
  border-radius: 12rpx;
}

.type-text {
  font-size: 22rpx;
  color: var(--lens-accent);
}

.create-time {
  font-size: 26rpx;
  color: var(--lens-text-muted);
}

/* 底部操作栏 */
.action-bar {
  display: flex;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: var(--lens-bg-secondary);
  border-top: 1rpx solid rgba(255, 255, 255, 0.05);
}

.btn-cancel,
.btn-edit,
.btn-confirm,
.btn-convert,
.btn-contact {
  flex: 1;
  padding: 28rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  border: none;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  color: var(--lens-text-primary);
}

.btn-edit {
  background: rgba(255, 255, 255, 0.05);
  color: var(--lens-text-primary);
}

.btn-confirm {
  background: var(--lens-accent);
  color: #FFFFFF;
}

.btn-convert {
  background: rgba(33, 150, 243, 0.2);
  color: #2196F3;
}

.btn-contact {
  background: rgba(139, 115, 85, 0.15);
  color: var(--lens-accent);
}
</style>
