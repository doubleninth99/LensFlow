<template>
  <view class="dashboard-page">
    <!-- 顶部栏 -->
    <DashboardHeader
      :stats="dashboardStats"
      @stat-click="handleStatClick"
    />

    <!-- 金刚区 -->
    <view class="quick-actions-section">
      <view class="section-header">
        <text class="section-title title-serif">快捷功能</text>
      </view>
      <view class="actions-grid">
        <QuickAction
          v-for="action in quickActions"
          :key="action.id"
          :data="action"
          :disabled="action.disabled"
          @click="handleActionClick"
        />
      </view>
    </view>

    <!-- 活动流 -->
    <ActivityTimeline :activities="activities" />

    <!-- 悬浮按钮 -->
    <FabButton @action="handleFabAction" />

    <!-- 底部占位 -->
    <view class="bottom-placeholder" />
  </view>
</template>

<script setup>
/**
 * 摄影师管理端首页 (Dashboard)
 *
 * 核心工作台，整合所有功能入口
 */
import { ref, onMounted } from 'vue'
import DashboardHeader from './components/DashboardHeader.vue'
import QuickAction from './components/QuickAction.vue'
import ActivityTimeline from './components/ActivityTimeline.vue'
import FabButton from './components/FabButton.vue'

// 统计数据
const dashboardStats = ref({
  todayShooting: 0,
  pendingEdit: 0,
  pendingDelivery: 0
})

// 活动流数据
const activities = ref([])

// 金刚区功能配置
const quickActions = ref([
  {
    id: 'schedule',
    title: '档期预约',
    subtitle: '管理档期和预约',
    icon: '📅',
    url: '/pages/schedule/index',
    disabled: false
  },
  {
    id: 'orders',
    title: '项目订单',
    subtitle: '查看所有订单',
    icon: '📋',
    url: '/pages/orders/index',
    disabled: false
  },
  {
    id: 'delivery',
    title: '交付中心',
    subtitle: '文件上传与分享',
    icon: '📦',
    url: '/pages/delivery/index',
    disabled: false
  },
  {
    id: 'styles',
    title: '风格管理',
    subtitle: '管理风格库',
    icon: '🎨',
    url: '',
    disabled: true
  }
])

/**
 * 页面加载
 */
onMounted(() => {
  loadDashboardStats()
  loadActivities()
})

/**
 * 加载统计数据
 */
const loadDashboardStats = () => {
  // 从本地 JSON 加载
  // 实际开发中应从 API 获取
  dashboardStats.value = {
    todayShooting: 2,
    pendingEdit: 8,
    pendingDelivery: 5
  }
}

/**
 * 加载活动流数据
 */
const loadActivities = () => {
  // 从本地 JSON 加载
  // 实际开发中应从 API 获取
  activities.value = [
    {
      id: 'act_001',
      type: 'style_selected',
      clientName: '林小姐',
      action: '选择了风格',
      detail: '法式浪漫',
      time: '10分钟前',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 'act_002',
      type: 'payment',
      clientName: '王先生',
      action: '已支付定金',
      detail: '¥500',
      time: '1小时前',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: 'act_003',
      type: 'delivery_confirmed',
      clientName: '张小姐',
      action: '已确认交付',
      detail: '36张精修照片',
      time: '3小时前',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    {
      id: 'act_004',
      type: 'style_selected',
      clientName: '李女士',
      action: '选择了风格',
      detail: '极简主义',
      time: '5小时前',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    {
      id: 'act_005',
      type: 'appointment',
      clientName: '赵先生',
      action: '预约了档期',
      detail: '2024年2月14日',
      time: '昨天',
      avatar: 'https://i.pravatar.cc/150?img=5'
    }
  ]
}

/**
 * 点击统计卡片
 */
const handleStatClick = (key) => {
  console.log('点击统计卡片:', key)
  // 已在 DashboardHeader 组件中处理跳转
}

/**
 * 点击金刚区卡片
 */
const handleActionClick = (action) => {
  if (action.url) {
    uni.navigateTo({ url: action.url })
  }
}

/**
 * FAB 按钮操作
 */
const handleFabAction = (actionId) => {
  console.log('FAB 操作:', actionId)
  // 已在 FabButton 组件中处理
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  min-height: 100vh;
  background: var(--lens-bg-primary);
  padding-bottom: 180rpx;
}

/* 金刚区 */
.quick-actions-section {
  padding: 32rpx;
}

.section-header {
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 36rpx;
  color: var(--lens-text-primary);
  letter-spacing: 2rpx;
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

/* 底部占位 */
.bottom-placeholder {
  height: 80rpx;
}
</style>
