<template>
  <view class="stat-card" @click="handleClick">
    <!-- 图标 -->
    <view class="icon-wrapper">
      <text class="icon">{{ icon }}</text>
    </view>

    <!-- 数值 -->
    <view class="value-wrapper">
      <text class="value">{{ value }}</text>
      <text class="label">{{ label }}</text>
    </view>
  </view>
</template>

<script setup>
/**
 * 统计卡片组件
 *
 * 展示关键数据指标
 */
import { computed } from 'vue'

const props = defineProps({
  // 标签
  label: {
    type: String,
    required: true
  },
  // 数值
  value: {
    type: [Number, String],
    required: true
  },
  // 图标（emoji）
  icon: {
    type: String,
    default: '📊'
  }
})

const emit = defineEmits(['click'])

/**
 * 点击事件
 */
const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
.stat-card {
  position: relative;
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  padding: 32rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    background: rgba(255, 255, 255, 0.08);
  }
}

.icon-wrapper {
  width: 80rpx;
  height: 80rpx;
  background: rgba(139, 115, 85, 0.15);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  font-size: 40rpx;
}

.value-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.value {
  font-size: 48rpx;
  font-weight: bold;
  color: var(--lens-text-primary);
  font-family: Georgia, serif;
  line-height: 1;
}

.label {
  font-size: 24rpx;
  color: var(--lens-text-muted);
  letter-spacing: 1rpx;
}
</style>
