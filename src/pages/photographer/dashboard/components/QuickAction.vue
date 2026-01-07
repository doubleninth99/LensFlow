<template>
  <view class="quick-action" :class="{ disabled: disabled }" @click="handleClick">
    <!-- 图标 -->
    <view class="icon-section">
      <text class="icon">{{ data.icon }}</text>
    </view>

    <!-- 文字 -->
    <view class="text-section">
      <text class="title">{{ data.title }}</text>
      <text v-if="data.subtitle" class="subtitle">{{ data.subtitle }}</text>
    </view>

    <!-- 箭头 -->
    <view v-if="!disabled" class="arrow">
      <text class="arrow-icon">›</text>
    </view>
  </view>
</template>

<script setup>
/**
 * 金刚区快捷功能卡片
 *
 * 四大功能入口
 */
import { computed } from 'vue'

const props = defineProps({
  // 功能数据
  data: {
    type: Object,
    required: true
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

/**
 * 点击事件
 */
const handleClick = () => {
  if (props.disabled) {
    uni.showToast({
      title: '功能开发中',
      icon: 'none'
    })
    return
  }
  emit('click', props.data)
}
</script>

<style lang="scss" scoped>
.quick-action {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
  border-radius: 24rpx;
  padding: 40rpx 32rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06));
  }

  &.disabled {
    opacity: 0.5;
  }
}

.icon-section {
  width: 96rpx;
  height: 96rpx;
  background: rgba(139, 115, 85, 0.2);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon {
  font-size: 48rpx;
}

.text-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.title {
  font-size: 32rpx;
  color: var(--lens-text-primary);
  font-weight: 500;
  letter-spacing: 1rpx;
}

.subtitle {
  font-size: 24rpx;
  color: var(--lens-text-muted);
}

.arrow {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.arrow-icon {
  font-size: 56rpx;
  color: var(--lens-text-muted);
  font-weight: 300;
}
</style>
