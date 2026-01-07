<template>
  <view class="dashboard-header">
    <!-- 品牌信息区 -->
    <view class="brand-section">
      <view class="logo-wrapper">
        <text class="logo-text">L</text>
      </view>
      <view class="brand-info">
        <text class="store-name title-serif">LensFlow 工作室</text>
        <text class="welcome-text">下午好，摄影师</text>
      </view>
    </view>

    <!-- 数据面板 -->
    <view class="stats-panel">
      <StatCard
        v-for="stat in stats"
        :key="stat.key"
        :label="stat.label"
        :value="stat.value"
        :icon="stat.icon"
        @click="handleStatClick(stat.key)"
      />
    </view>
  </view>
</template>

<script setup>
/**
 * Dashboard 顶部栏组件
 *
 * 展示品牌信息和关键数据指标
 */
import { computed } from 'vue'
import StatCard from './StatCard.vue'

const props = defineProps({
  // 统计数据
  stats: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['statClick'])

/**
 * 转换统计数据为卡片数组
 */
const stats = computed(() => {
  return [
    {
      key: 'todayShooting',
      label: '今日拍摄',
      value: props.stats.todayShooting || 0,
      icon: '📷'
    },
    {
      key: 'pendingEdit',
      label: '待修图',
      value: props.stats.pendingEdit || 0,
      icon: '✂️'
    },
    {
      key: 'pendingDelivery',
      label: '待交付',
      value: props.stats.pendingDelivery || 0,
      icon: '📦'
    }
  ]
})

/**
 * 点击统计卡片
 */
const handleStatClick = (key) => {
  emit('statClick', key)

  // 根据不同类型跳转不同页面
  const routeMap = {
    todayShooting: '/pages/schedule/index',
    pendingEdit: '/pages/orders/index',
    pendingDelivery: '/pages/delivery/index'
  }

  const url = routeMap[key]
  if (url) {
    uni.navigateTo({ url })
  }
}
</script>

<style lang="scss" scoped>
.dashboard-header {
  padding: 40rpx 32rpx 32rpx;
  padding-top: calc(40rpx + env(safe-area-inset-top));
  background: linear-gradient(
    180deg,
    rgba(18, 18, 18, 0.95) 0%,
    rgba(18, 18, 18, 0.8) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* 品牌信息区 */
.brand-section {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 40rpx;
}

.logo-wrapper {
  width: 96rpx;
  height: 96rpx;
  background: linear-gradient(135deg, rgba(139, 115, 85, 0.3), rgba(160, 137, 107, 0.2));
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.logo-text {
  font-size: 56rpx;
  font-weight: bold;
  color: var(--lens-text-primary);
  font-family: Georgia, serif;
}

.brand-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.store-name {
  font-size: 36rpx;
  color: var(--lens-text-primary);
  letter-spacing: 2rpx;
}

.welcome-text {
  font-size: 24rpx;
  color: var(--lens-text-muted);
  letter-spacing: 1rpx;
}

/* 数据面板 */
.stats-panel {
  display: flex;
  gap: 16rpx;
}
</style>
