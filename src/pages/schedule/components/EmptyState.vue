<template>
  <view class="empty-state">
    <text class="empty-icon">{{ icon }}</text>
    <text class="empty-text">{{ text }}</text>
    <text v-if="subtext" class="empty-subtext">{{ subtext }}</text>
  </view>
</template>

<script setup>
/**
 * 空状态组件
 *
 * 用于列表为空时的友好提示
 */
const props = defineProps({
  // 图标
  icon: {
    type: String,
    default: '📭'
  },
  // 主文本
  text: {
    type: String,
    required: true
  },
  // 副文本
  subtext: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 64rpx;
  text-align: center;
}

.empty-icon {
  font-size: 96rpx;
  margin-bottom: 32rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: var(--lens-text-muted);
  margin-bottom: 16rpx;
}

.empty-subtext {
  font-size: 24rpx;
  color: var(--lens-text-muted);
  opacity: 0.7;
}
</style>
