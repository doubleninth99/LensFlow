<template>
  <view v-if="visible" class="order-detail-overlay" @click="handleClose">
    <view class="detail-popup" @click.stop>
      <!-- 顶部栏 -->
      <view class="popup-header">
        <view class="close-btn" @click="handleClose">
          <text class="close-icon">✕</text>
        </view>
        <text class="header-title">订单详情</text>
        <view class="header-spacer" />
      </view>

      <!-- 内容区域 -->
      <scroll-view class="popup-content" scroll-y>
        <!-- 状态卡片 -->
        <view class="status-section">
          <view class="status-badge" :class="`status-${order.status}`">
            <text class="status-text">{{ statusText }}</text>
          </view>
        </view>

        <!-- 订单信息 -->
        <view class="section">
          <view class="section-header">
            <text class="section-icon">📋</text>
            <text class="section-title">订单信息</text>
          </view>
          <view class="info-card">
            <view class="info-row">
              <text class="info-label">订单号</text>
              <text class="info-value">{{ order.orderNo }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">创建时间</text>
              <text class="info-value">{{ formattedCreateTime }}</text>
            </view>
            <view v-if="order.confirmedAt" class="info-row">
              <text class="info-label">确认时间</text>
              <text class="info-value">{{ formattedConfirmedTime }}</text>
            </view>
          </view>
        </view>

        <!-- 客户信息 -->
        <view class="section">
          <view class="section-header">
            <text class="section-icon">👤</text>
            <text class="section-title">客户信息</text>
          </view>
          <view class="client-card">
            <image class="client-avatar" :src="order.clientAvatar" mode="aspectFill" />
            <view class="client-info">
              <text class="client-name">{{ order.clientName }}</text>
              <text class="client-phone">{{ order.clientPhone }}</text>
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
              <text class="info-label">拍摄日期</text>
              <text class="info-value">{{ formattedShootDate }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">拍摄时间</text>
              <text class="info-value">{{ order.startTime }} - {{ order.endTime }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">拍摄类型</text>
              <view class="type-badge">
                <text class="type-text">{{ typeText }}</text>
              </view>
            </view>
            <view class="info-row">
              <text class="info-label">拍摄地点</text>
              <text class="info-value">{{ order.location || '未设置' }}</text>
            </view>
            <view v-if="order.scheduleId" class="info-row">
              <text class="info-label">关联档期</text>
              <text class="info-value info-link">已关联</text>
            </view>
          </view>
        </view>

        <!-- 金额信息 -->
        <view class="section">
          <view class="section-header">
            <text class="section-icon">💰</text>
            <text class="section-title">金额信息</text>
          </view>
          <view class="info-card amount-card">
            <view class="amount-row">
              <text class="amount-label">订单总额</text>
              <text class="amount-value amount-total">¥{{ formatAmount(order.amount) }}</text>
            </view>
            <view class="amount-row">
              <text class="amount-label">已付金额</text>
              <text class="amount-value amount-paid">¥{{ formatAmount(order.paidAmount) }}</text>
            </view>
            <view class="amount-divider" />
            <view class="amount-row">
              <text class="amount-label">未付金额</text>
              <text class="amount-value amount-remaining">¥{{ formatAmount(order.balanceAmount) }}</text>
            </view>
            <view class="amount-divider" />
            <view class="amount-row">
              <text class="amount-label">付款状态</text>
              <view class="payment-badge" :class="`payment-${order.paymentStatus}`">
                <text class="payment-text">{{ paymentStatusText }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 交付信息 -->
        <view class="section">
          <view class="section-header">
            <text class="section-icon">📦</text>
            <text class="section-title">交付进度</text>
          </view>
          <view class="info-card">
            <view class="info-row">
              <text class="info-label">交付状态</text>
              <view class="delivery-badge" :class="`delivery-${order.deliveryStatus}`">
                <text class="delivery-text">{{ deliveryStatusText }}</text>
              </view>
            </view>
            <view class="info-row">
              <text class="info-label">预计交付</text>
              <text class="info-value">{{ formattedExpectedDate }}</text>
            </view>
            <view v-if="order.actualDeliveryDate" class="info-row">
              <text class="info-label">实际交付</text>
              <text class="info-value">{{ formattedActualDate }}</text>
            </view>
          </view>
        </view>

        <!-- 备注 -->
        <view v-if="order.notes || order.internalNotes" class="section">
          <view class="section-header">
            <text class="section-icon">📝</text>
            <text class="section-title">备注</text>
          </view>
          <view class="info-card">
            <view v-if="order.notes" class="notes-block">
              <text class="notes-label">客户备注</text>
              <text class="notes-text">{{ order.notes }}</text>
            </view>
            <view v-if="order.internalNotes" class="notes-block">
              <text class="notes-label">内部备注</text>
              <text class="notes-text">{{ order.internalNotes }}</text>
            </view>
          </view>
        </view>
      </scroll-view>

      <!-- 底部操作栏 -->
      <view class="action-bar">
        <!-- 删除按钮 -->
        <button
          v-if="canDelete"
          class="btn-delete"
          @click="handleDelete"
        >
          删除
        </button>

        <!-- 编辑按钮 -->
        <button
          v-if="canEdit"
          class="btn-edit"
          @click="handleEdit"
        >
          编辑
        </button>

        <!-- 状态切换按钮 -->
        <button
          v-if="canChangeStatus"
          class="btn-status"
          @click="handleStatusChange"
        >
          {{ nextStatusText }}
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
 * 订单详情弹窗组件
 *
 * 半屏弹窗形式展示订单详细信息
 */
import { computed } from 'vue'

const props = defineProps({
  // 是否显示
  visible: {
    type: Boolean,
    default: false
  },
  // 订单数据
  order: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'edit', 'delete', 'statusChange', 'call'])

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
  return statusMap[props.order.status] || '未知'
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
  return typeMap[props.order.type] || '其他'
})

/**
 * 付款状态文本
 */
const paymentStatusText = computed(() => {
  const statusMap = {
    unpaid: '未付款',
    deposit: '已付定金',
    partial: '部分付款',
    full: '全额付款',
    refunding: '退款中',
    refunded: '已退款'
  }
  return statusMap[props.order.paymentStatus] || '未知'
})

/**
 * 交付状态文本
 */
const deliveryStatusText = computed(() => {
  const statusMap = {
    not_started: '未开始',
    shooting: '拍摄中',
    editing: '后期中',
    reviewing: '客户确认中',
    delivered: '已交付',
    revised: '需修改'
  }
  return statusMap[props.order.deliveryStatus] || '未知'
})

/**
 * 格式化创建时间
 */
const formattedCreateTime = computed(() => {
  if (!props.order.createdAt) return ''
  return formatDate(props.order.createdAt)
})

/**
 * 格式化确认时间
 */
const formattedConfirmedTime = computed(() => {
  if (!props.order.confirmedAt) return ''
  return formatDate(props.order.confirmedAt)
})

/**
 * 格式化拍摄日期
 */
const formattedShootDate = computed(() => {
  if (!props.order.shootDate) return ''
  const date = new Date(props.order.shootDate)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const weekDay = weekDays[date.getDay()]
  return `${year}年${month}月${day}日 周${weekDay}`
})

/**
 * 格式化预计交付日期
 */
const formattedExpectedDate = computed(() => {
  if (!props.order.expectedDeliveryDate) return '未设置'
  return props.order.expectedDeliveryDate
})

/**
 * 格式化实际交付日期
 */
const formattedActualDate = computed(() => {
  if (!props.order.actualDeliveryDate) return ''
  return props.order.actualDeliveryDate
})

/**
 * 是否可删除
 */
const canDelete = computed(() => {
  return ['draft', 'pending'].includes(props.order.status)
})

/**
 * 是否可编辑
 */
const canEdit = computed(() => {
  return !['completed', 'cancelled', 'refunded'].includes(props.order.status)
})

/**
 * 是否可变更状态
 */
const canChangeStatus = computed(() => {
  return !['completed', 'cancelled', 'refunded'].includes(props.order.status)
})

/**
 * 下一状态文本
 */
const nextStatusText = computed(() => {
  const statusFlow = {
    draft: '提交确认',
    pending: '确认订单',
    confirmed: '开始拍摄',
    production: '进入后期',
    editing: '交付客户',
    delivered: '完成订单'
  }
  return statusFlow[props.order.status] || '变更状态'
})

/**
 * 格式化日期
 */
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

/**
 * 格式化金额
 */
const formatAmount = (amount) => {
  return (amount || 0).toLocaleString()
}

/**
 * 关闭弹窗
 */
const handleClose = () => {
  emit('close')
}

/**
 * 编辑订单
 */
const handleEdit = () => {
  emit('edit', props.order)
}

/**
 * 删除订单
 */
const handleDelete = () => {
  emit('delete', props.order)
}

/**
 * 状态变更
 */
const handleStatusChange = () => {
  const statusFlow = {
    draft: 'pending',
    pending: 'confirmed',
    confirmed: 'production',
    production: 'editing',
    editing: 'delivered',
    delivered: 'completed'
  }
  const newStatus = statusFlow[props.order.status]
  if (newStatus) {
    emit('statusChange', { order: props.order, newStatus })
  }
}

/**
 * 联系客户
 */
const handleCall = () => {
  const phone = props.order.clientPhone?.replace(/\*/g, '')
  if (phone) {
    uni.makePhoneCall({
      phoneNumber: phone
    })
  }
  emit('call', props.order)
}
</script>

<style lang="scss" scoped>
.order-detail-overlay {
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
  font-size: 26rpx;
  font-weight: 500;
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
}

.info-label {
  font-size: 26rpx;
  color: var(--lens-text-muted);
}

.info-value {
  font-size: 26rpx;
  color: var(--lens-text-secondary);
  text-align: right;

  &.info-link {
    color: var(--lens-accent);
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

/* 金额卡片 */
.amount-card {
  background: rgba(139, 115, 85, 0.05);
  border: 1rpx solid rgba(139, 115, 85, 0.1);
}

.amount-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
}

.amount-label {
  font-size: 28rpx;
  color: var(--lens-text-secondary);
}

.amount-value {
  font-size: 32rpx;
  font-weight: 600;
  font-family: 'Georgia', serif;

  &.amount-total {
    color: var(--lens-accent);
  }

  &.amount-paid {
    color: #4CAF50;
  }

  &.amount-remaining {
    color: var(--lens-text-muted);
  }
}

.amount-divider {
  height: 1rpx;
  background: rgba(255, 255, 255, 0.05);
  margin: 8rpx 0;
}

.payment-badge {
  padding: 8rpx 20rpx;
  border-radius: 12rpx;

  &.payment-unpaid {
    background: rgba(158, 158, 158, 0.2);
  }

  &.payment-deposit {
    background: rgba(255, 152, 0, 0.2);
  }

  &.payment-partial {
    background: rgba(33, 150, 243, 0.2);
  }

  &.payment-full {
    background: rgba(76, 175, 80, 0.2);
  }
}

.payment-text {
  font-size: 22rpx;
  color: var(--lens-text-primary);
}

.delivery-badge {
  padding: 8rpx 20rpx;
  border-radius: 12rpx;
  background: rgba(139, 115, 85, 0.15);
}

.delivery-text {
  font-size: 22rpx;
  color: var(--lens-accent);
}

/* 备注 */
.notes-block {
  margin-bottom: 20rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.notes-label {
  display: block;
  font-size: 24rpx;
  color: var(--lens-text-muted);
  margin-bottom: 12rpx;
}

.notes-text {
  display: block;
  font-size: 26rpx;
  color: var(--lens-text-primary);
  line-height: 1.6;
}

/* 底部操作栏 */
.action-bar {
  display: flex;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: var(--lens-bg-secondary);
  border-top: 1rpx solid rgba(255, 255, 255, 0.05);
  flex-wrap: wrap;
}

.btn-delete,
.btn-edit,
.btn-status,
.btn-contact {
  flex: 1;
  min-width: 120rpx;
  padding: 28rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  border: none;
}

.btn-delete {
  background: rgba(244, 67, 54, 0.15);
  color: #F44336;
}

.btn-edit {
  background: rgba(255, 255, 255, 0.05);
  color: var(--lens-text-primary);
}

.btn-status {
  background: var(--lens-accent);
  color: #FFFFFF;
}

.btn-contact {
  background: rgba(139, 115, 85, 0.15);
  color: var(--lens-accent);
}
</style>
