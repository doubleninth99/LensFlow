<template>
  <view class="fixed-bar glass-effect">
    <!-- 已选数量显示 -->
    <view class="bar-content">
      <view class="count-section">
        <text class="count-text">已选</text>
        <text class="count-number">{{ count }}</text>
        <text class="count-text">组风格</text>
      </view>

      <!-- 确认按钮 -->
      <view
        class="confirm-btn"
        :class="{ 'disabled': count === 0 }"
        @click="handleConfirm"
      >
        <text class="btn-text">确认提交</text>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 底部固定栏组件
 *
 * 功能：
 * - 显示已选风格数量
 * - 毛玻璃背景效果
 * - 确认提交按钮
 */
import { computed } from 'vue'

const props = defineProps({
  // 已选风格数量
  count: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['confirm'])

/**
 * 处理确认提交
 */
const handleConfirm = () => {
  if (props.count === 0) {
    uni.showToast({
      title: '请至少选择一组风格',
      icon: 'none',
      duration: 2000
    })
    return
  }
  emit('confirm')
}
</script>

<style lang="scss" scoped>
.fixed-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));

  // 毛玻璃效果
  background: rgba(18, 18, 18, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);

  // 平滑过渡
  transition: all 0.3s ease;
}

.bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 已选数量区域 */
.count-section {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.count-text {
  font-size: 28rpx;
  color: var(--lens-text-secondary);
  letter-spacing: 1rpx;
}

.count-number {
  font-size: 36rpx;
  color: var(--lens-text-primary);
  font-weight: bold;
  font-family: Georgia, serif;
}

/* 确认按钮 */
.confirm-btn {
  padding: 24rpx 48rpx;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  border-radius: 48rpx;
  box-shadow: 0 4rpx 16rpx rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
  }

  &.disabled {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: none;
    opacity: 0.5;
  }
}

.btn-text {
  font-size: 28rpx;
  color: #121212;
  font-weight: 500;
  letter-spacing: 2rpx;

  .disabled & {
    color: var(--lens-text-muted);
  }
}
</style>
