<template>
  <view v-if="visible" class="gallery-detail" @click="handleClose">
    <!-- 背景 -->
    <view class="detail-bg" />

    <!-- Swiper 横滑图库 -->
    <swiper
      class="gallery-swiper"
      :indicator-dots="true"
      :autoplay="false"
      :interval="5000"
      :circular="true"
      indicator-color="rgba(255, 255, 255, 0.3)"
      indicator-active-color="rgba(255, 255, 255, 0.8)"
      @click.stop
    >
      <swiper-item
        v-for="(image, index) in images"
        :key="index"
        class="swiper-item"
      >
        <image
          :src="image"
          mode="aspectFill"
          class="gallery-image"
          @click.stop="handleImageClick(index)"
        />
      </swiper-item>
    </swiper>

    <!-- 顶部信息栏 -->
    <view class="detail-header" @click.stop>
      <!-- 关闭按钮 -->
      <view class="close-btn" @click="handleClose">
        <text class="close-icon">×</text>
      </view>

      <!-- 风格标题 -->
      <view class="detail-title">
        <text class="title-text title-serif">{{ title }}</text>
      </view>
    </view>

    <!-- 底部描述 -->
    <view class="detail-footer" @click.stop>
      <text class="footer-desc">{{ description }}</text>
    </view>
  </view>
</template>

<script setup>
/**
 * 图库详情组件
 *
 * 功能：
 * - 全屏横滑浏览作品
 * - Swiper 组件实现
 * - 点击关闭返回
 * - 显示风格标题和描述
 */
import { ref, watch } from 'vue'

const props = defineProps({
  // 是否可见
  visible: {
    type: Boolean,
    default: false
  },
  // 图片列表
  images: {
    type: Array,
    default: () => []
  },
  // 风格标题
  title: {
    type: String,
    default: ''
  },
  // 风格描述
  description: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'imageClick'])

/**
 * 关闭详情页
 */
const handleClose = () => {
  emit('close')
}

/**
 * 点击图片
 */
const handleImageClick = (index) => {
  emit('imageClick', index)
}
</script>

<style lang="scss" scoped>
.gallery-detail {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease;
}

.detail-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000000;
  z-index: 1;
}

.gallery-swiper {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
}

.swiper-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
  box-sizing: border-box;
}

.gallery-image {
  width: 100%;
  height: 100%;
}

/* 顶部信息栏 */
.detail-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 40rpx 32rpx;
  padding-top: calc(40rpx + env(safe-area-inset-top));
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

.close-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.9);
    background: rgba(255, 255, 255, 0.2);
  }
}

.close-icon {
  font-size: 56rpx;
  color: #FFFFFF;
  line-height: 1;
}

.detail-title {
  flex: 1;
  text-align: center;
  padding-right: 64rpx;
}

.title-text {
  font-size: 36rpx;
  color: #FFFFFF;
  letter-spacing: 2rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.5);
}

/* 底部描述 */
.detail-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

.footer-desc {
  display: block;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  line-height: 1.6;
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
