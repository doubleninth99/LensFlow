<template>
  <view class="activity-timeline">
    <!-- 标题 -->
    <view class="timeline-header">
      <text class="title title-serif">客户动态</text>
      <view class="more-btn">
        <text class="more-text">查看全部</text>
        <text class="more-icon">›</text>
      </view>
    </view>

    <!-- 时间轴列表 -->
    <view class="timeline-list">
      <view
        v-for="(activity, index) in activities"
        :key="activity.id"
        class="timeline-item"
        :class="{ 'first': index === 0 }"
      >
        <!-- 头像 -->
        <image class="avatar" :src="activity.avatar" mode="aspectFill" />

        <!-- 内容区域 -->
        <view class="content">
          <view class="content-header">
            <text class="client-name">{{ activity.clientName }}</text>
            <text class="time">{{ activity.time }}</text>
          </view>

          <view class="action-row">
            <text class="action">{{ activity.action }}</text>
            <text class="detail">{{ activity.detail }}</text>
          </view>
        </view>

        <!-- 时间轴点 -->
        <view class="timeline-dot" :class="`type-${activity.type}`" />

        <!-- 时间轴线（除最后一项） -->
        <view v-if="index < activities.length - 1" class="timeline-line" />
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 活动时间轴组件
 *
 * 展示客户动态
 */
import { computed } from 'vue'

const props = defineProps({
  // 活动列表
  activities: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['more'])

/**
 * 获取活动类型对应的颜色类名
 */
const getTypeClass = (type) => {
  const typeMap = {
    style_selected: 'accent',
    payment: 'success',
    delivery_confirmed: 'primary',
    appointment: 'info'
  }
  return typeMap[type] || 'default'
}
</script>

<style lang="scss" scoped>
.activity-timeline {
  padding: 40rpx 32rpx;
}

/* 标题栏 */
.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.title {
  font-size: 40rpx;
  color: var(--lens-text-primary);
  letter-spacing: 2rpx;
}

.more-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32rpx;
}

.more-text {
  font-size: 24rpx;
  color: var(--lens-text-muted);
}

.more-icon {
  font-size: 32rpx;
  color: var(--lens-text-muted);
}

/* 时间轴列表 */
.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-item {
  position: relative;
  display: flex;
  gap: 20rpx;
  padding-bottom: 40rpx;
}

/* 头像 */
.avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  z-index: 2;
}

/* 内容区域 */
.content {
  flex: 1;
  padding-top: 8rpx;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.client-name {
  font-size: 28rpx;
  color: var(--lens-text-primary);
  font-weight: 500;
}

.time {
  font-size: 22rpx;
  color: var(--lens-text-muted);
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8rpx;
}

.action {
  font-size: 26rpx;
  color: var(--lens-text-secondary);
}

.detail {
  font-size: 26rpx;
  color: var(--lens-accent);
  font-weight: 500;
}

/* 时间轴点 */
.timeline-dot {
  position: absolute;
  left: 112rpx;
  top: 52rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: var(--lens-text-muted);
  border: 3rpx solid var(--lens-bg-primary);
  z-index: 3;

  &.type-style_selected {
    background: #8B7355;
  }

  &.type-payment {
    background: #4CAF50;
  }

  &.type-delivery_confirmed {
    background: #2196F3;
  }

  &.type-appointment {
    background: #FF9800;
  }
}

/* 时间轴线 */
.timeline-line {
  position: absolute;
  left: 119rpx;
  top: 72rpx;
  bottom: 0;
  width: 2rpx;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
}

/* 第一项特殊样式 */
.timeline-item.first .timeline-dot {
  top: 48rpx;
  transform: scale(1.2);
}
</style>
