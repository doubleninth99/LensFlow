<template>
  <view class="cover-page">
    <!-- 背景图片 -->
    <image
      class="cover-image"
      :src="coverImage"
      mode="aspectFill"
    />

    <!-- 遮罩层 -->
    <view class="cover-mask" />

    <!-- 内容容器 -->
    <view class="cover-content">
      <!-- 标题 -->
      <view class="title-section">
        <text class="main-title title-serif">风格探索</text>
        <text class="sub-title">发现属于你的美学语言</text>
      </view>

      <!-- 提示文字 -->
      <view class="hint-section">
        <text class="hint-text">向下滑动开启审美之旅</text>
        <!-- 滚动指示器 -->
        <view class="scroll-indicator">
          <view class="indicator-dot animate-bounce" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 封面页组件
 *
 * 满屏大图展示，带有滚动引导提示
 */
import { ref } from 'vue'

// 封面图片 - 使用高端摄影风格的占位图
const coverImage = ref('https://picsum.photos/seed/cover/1080/1920')
</script>

<style lang="scss" scoped>
.cover-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.cover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.cover-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(18, 18, 18, 0.3) 0%,
    rgba(18, 18, 18, 0.5) 50%,
    rgba(18, 18, 18, 0.7) 100%
  );
  z-index: 2;
}

.cover-content {
  position: relative;
  z-index: 3;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 120rpx 60rpx 100rpx;
  box-sizing: border-box;
}

.title-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 200rpx;
  animation: fadeIn 1s ease-in;
}

.main-title {
  font-size: 64rpx;
  color: #FFFFFF;
  letter-spacing: 8rpx;
  margin-bottom: 24rpx;
  text-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.5);
}

.sub-title {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 4rpx;
  font-weight: 300;
}

.hint-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 1s ease-in 0.5s both;
}

.hint-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 2rpx;
  margin-bottom: 40rpx;
}

.scroll-indicator {
  width: 60rpx;
  height: 80rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 30rpx;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 12rpx;
}

.indicator-dot {
  width: 8rpx;
  height: 16rpx;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 4rpx;
}

/* 弹跳动画 */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(12rpx);
    opacity: 0.6;
  }
}

.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
