<template>
  <view class="style-card" @click="handleCardClick">
    <!-- 标题区域 -->
    <view class="card-header">
      <text class="style-title title-serif">{{ data.title }}</text>
      <!-- 选中标识 - 右上角勾选图标 -->
      <view v-if="selected" class="check-icon">
        <text class="check-mark">✓</text>
      </view>
    </view>

    <!-- 图片区域 - 非对称排版 -->
    <view class="card-images">
      <!-- 主图 - 较大 -->
      <view
        class="image-main"
        :class="{ 'selected': selected }"
        @click.stop="handleToggle"
      >
        <image
          :src="data.images[0]"
          mode="aspectFill"
          class="card-image"
          :lazy-load="true"
        />
        <!-- 呼吸灯边框效果（选中时） -->
        <view v-if="selected" class="breathing-border" />
      </view>

      <!-- 副图 - 较小，错位排列 -->
      <view
        v-if="data.images[1]"
        class="image-secondary"
        :class="{ 'selected': selected }"
        @click.stop="handleToggle"
      >
        <image
          :src="data.images[1]"
          mode="aspectFill"
          class="card-image"
          :lazy-load="true"
        />
      </view>
    </view>

    <!-- 描述和标签 -->
    <view class="card-footer">
      <text class="style-desc">{{ data.description }}</text>
      <view class="style-tags">
        <text
          v-for="(tag, index) in data.tags"
          :key="index"
          class="tag-item"
        >
          {{ tag }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 风格卡片组件
 *
 * 功能：
 * - 非对称排版展示风格图片
 * - 点击选中/取消交互
 * - 选中时显示呼吸灯边框效果
 * - 右上角显示勾选图标
 */
import { computed } from 'vue'

const props = defineProps({
  // 风格数据
  data: {
    type: Object,
    required: true
  },
  // 是否已选中
  selected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle', 'click'])

/**
 * 切换选中状态
 */
const handleToggle = () => {
  emit('toggle', props.data.id)
}

/**
 * 点击卡片（用于进入详情页）
 */
const handleCardClick = () => {
  emit('click', props.data)
}
</script>

<style lang="scss" scoped>
.style-card {
  position: relative;
  width: 100%;
  background: var(--lens-bg-secondary);
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 40rpx;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }
}

.card-header {
  position: relative;
  padding: 32rpx 32rpx 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.style-title {
  font-size: 40rpx;
  color: var(--lens-text-primary);
  letter-spacing: 2rpx;
}

/* 勾选图标 */
.check-icon {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  width: 48rpx;
  height: 48rpx;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10rpx);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleIn 0.3s ease;
}

.check-mark {
  font-size: 32rpx;
  color: #FFFFFF;
  font-weight: bold;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 图片区域 - 非对称排版 */
.card-images {
  position: relative;
  width: 100%;
  height: 800rpx;
  padding: 0 24rpx;
  box-sizing: border-box;
}

.image-main {
  position: absolute;
  top: 0;
  left: 24rpx;
  width: calc(100% - 48rpx);
  height: 500rpx;
  border-radius: 16rpx;
  overflow: hidden;
  z-index: 2;
}

.image-secondary {
  position: absolute;
  top: 420rpx;
  right: 24rpx;
  width: 55%;
  height: 340rpx;
  border-radius: 16rpx;
  overflow: hidden;
  z-index: 3;
  box-shadow: var(--lens-shadow-lg);
}

.card-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;

  &:active {
    transform: scale(0.95);
  }
}

/* 选中状态 */
.selected {
  border: 3rpx solid rgba(255, 255, 255, 0.6);
}

/* 呼吸灯边框 */
.breathing-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 3rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 16rpx;
  animation: breathing 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes breathing {
  0%, 100% {
    box-shadow: 0 0 10rpx rgba(255, 255, 255, 0.3),
                inset 0 0 10rpx rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 20rpx rgba(255, 255, 255, 0.6),
                inset 0 0 20rpx rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.6);
  }
}

/* 底部信息 */
.card-footer {
  padding: 24rpx 32rpx 32rpx;
}

.style-desc {
  display: block;
  font-size: 26rpx;
  color: var(--lens-text-secondary);
  line-height: 1.6;
  margin-bottom: 20rpx;
}

.style-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.tag-item {
  padding: 8rpx 20rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20rpx;
  font-size: 22rpx;
  color: var(--lens-text-muted);
  letter-spacing: 1rpx;
}
</style>
