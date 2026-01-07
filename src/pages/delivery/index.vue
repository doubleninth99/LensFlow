<template>
  <view class="placeholder-page">
    <view class="content">
      <text class="icon">📦</text>
      <text class="title title-serif">交付中心</text>
      <text class="description">功能开发中，敬请期待...</text>
      <view class="features">
        <view class="feature-item">
          <text class="feature-icon">📤</text>
          <text class="feature-text">批量上传作品</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">🔗</text>
          <text class="feature-text">生成分享链接</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">✅</text>
          <text class="feature-text">交付确认管理</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 交付中心页（占位）
 */
</script>

<style lang="scss" scoped>
.placeholder-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60rpx 32rpx;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon {
  font-size: 120rpx;
  margin-bottom: 40rpx;
}

.title {
  font-size: 48rpx;
  color: var(--lens-text-primary);
  margin-bottom: 24rpx;
}

.description {
  font-size: 28rpx;
  color: var(--lens-text-muted);
  margin-bottom: 60rpx;
}

.features {
  width: 100%;
  max-width: 500rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 32rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.feature-icon {
  font-size: 40rpx;
}

.feature-text {
  font-size: 26rpx;
  color: var(--lens-text-secondary);
}
</style>
