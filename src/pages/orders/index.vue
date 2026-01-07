<template>
  <view class="orders-page">
    <!-- 顶部标题栏 -->
    <view class="page-header">
      <text class="page-title title-serif">项目订单</text>
      <view class="header-stats">
        <view class="stat-item">
          <text class="stat-value">{{ totalOrders }}</text>
          <text class="stat-label">总订单</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ pendingPaymentCount }}</text>
          <text class="stat-label">待付款</text>
        </view>
      </view>
    </view>

    <!-- Tab 切换 -->
    <view class="tab-bar">
      <view
        class="tab-item"
        :class="{ active: activeTab === 'all' }"
        @click="activeTab = 'all'"
      >
        <text class="tab-text">全部</text>
        <view v-if="allCount > 0" class="tab-badge">{{ allCount }}</view>
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'unpaid' }"
        @click="activeTab = 'unpaid'"
      >
        <text class="tab-text">待付款</text>
        <view v-if="unpaidCount > 0" class="tab-badge">{{ unpaidCount }}</view>
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'inProgress' }"
        @click="activeTab = 'inProgress'"
      >
        <text class="tab-text">进行中</text>
        <view v-if="inProgressCount > 0" class="tab-badge">{{ inProgressCount }}</view>
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'pendingDelivery' }"
        @click="activeTab = 'pendingDelivery'"
      >
        <text class="tab-text">待交付</text>
        <view v-if="pendingDeliveryCount > 0" class="tab-badge">{{ pendingDeliveryCount }}</view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content-area">
      <!-- 订单列表 -->
      <OrderList
        :orders="filteredOrders"
        @cardClick="handleCardClick"
        @detail="handleDetail"
        @edit="handleEdit"
      />
    </view>

    <!-- FAB 悬浮按钮 -->
    <view class="fab-container" :class="{ expanded: fabExpanded }">
      <view v-if="fabExpanded" class="fab-menu" @click="fabExpanded = false">
        <view class="fab-item" @click.stop="handleNewOrder">
          <text class="fab-icon">📋</text>
          <text class="fab-label">新建订单</text>
        </view>
      </view>
      <view class="fab-button" @click="fabExpanded = !fabExpanded">
        <text class="fab-main-icon" :class="{ rotated: fabExpanded }">+</text>
      </view>
    </view>

    <!-- 订单详情弹窗 -->
    <OrderDetail
      :visible="detailVisible"
      :order="selectedOrder"
      @close="handleDetailClose"
      @edit="handleDetailEdit"
      @delete="handleDetailDelete"
      @statusChange="handleStatusChange"
    />

    <!-- 订单表单弹窗 -->
    <OrderForm
      :visible="formVisible"
      :order="editingOrder"
      @close="handleFormClose"
      @submit="handleFormSubmit"
    />
  </view>
</template>

<script setup>
/**
 * 项目订单主页面
 *
 * 功能：
 * - 订单列表展示与筛选
 * - 订单详情查看
 * - 订单创建与编辑
 * - 订单状态管理
 */
import { ref, computed, onMounted } from 'vue'
import OrderList from './components/OrderList.vue'
import OrderDetail from './components/OrderDetail.vue'
import OrderForm from './components/OrderForm.vue'

// 模拟数据
import ordersData from '@/mock-data/orders.json'

// 当前激活的 Tab
const activeTab = ref('all')

// 订单数据
const orders = ref(ordersData)

// 详情弹窗
const detailVisible = ref(false)
const selectedOrder = ref(null)

// 表单弹窗
const formVisible = ref(false)
const editingOrder = ref(null)

// FAB 悬浮按钮
const fabExpanded = ref(false)

/**
 * Tab 筛选逻辑
 */
const allCount = computed(() => orders.value.length)

const unpaidCount = computed(() => {
  return orders.value.filter(o => ['unpaid', 'deposit'].includes(o.paymentStatus)).length
})

const inProgressCount = computed(() => {
  return orders.value.filter(o => ['confirmed', 'production', 'editing'].includes(o.status)).length
})

const pendingDeliveryCount = computed(() => {
  return orders.value.filter(o => o.status === 'delivered').length
})

const totalOrders = computed(() => orders.value.length)

const pendingPaymentCount = computed(() => unpaidCount.value)

/**
 * 根据当前 Tab 筛选订单
 */
const filteredOrders = computed(() => {
  switch (activeTab.value) {
    case 'unpaid':
      return orders.value.filter(o => ['unpaid', 'deposit'].includes(o.paymentStatus))
    case 'inProgress':
      return orders.value.filter(o => ['confirmed', 'production', 'editing'].includes(o.status))
    case 'pendingDelivery':
      return orders.value.filter(o => o.status === 'delivered')
    default:
      return orders.value
  }
})

/**
 * 点击订单卡片
 */
const handleCardClick = (order) => {
  selectedOrder.value = order
  detailVisible.value = true
}

/**
 * 查看详情
 */
const handleDetail = (order) => {
  selectedOrder.value = order
  detailVisible.value = true
}

/**
 * 编辑订单
 */
const handleEdit = (order) => {
  editingOrder.value = order
  formVisible.value = true
}

/**
 * 关闭详情弹窗
 */
const handleDetailClose = () => {
  detailVisible.value = false
}

/**
 * 详情弹窗中编辑订单
 */
const handleDetailEdit = (order) => {
  detailVisible.value = false
  editingOrder.value = order
  formVisible.value = true
}

/**
 * 详情弹窗中删除订单
 */
const handleDetailDelete = (order) => {
  uni.showModal({
    title: '删除订单',
    content: '确认删除此订单？删除后不可恢复',
    success: (res) => {
      if (res.confirm) {
        const index = orders.value.findIndex(o => o.id === order.id)
        if (index !== -1) {
          orders.value.splice(index, 1)
          uni.showToast({
            title: '订单已删除',
            icon: 'success'
          })
        }
        detailVisible.value = false
      }
    }
  })
}

/**
 * 订单状态变更
 */
const handleStatusChange = ({ order, newStatus }) => {
  const index = orders.value.findIndex(o => o.id === order.id)
  if (index !== -1) {
    orders.value[index].status = newStatus
    orders.value[index].updatedAt = new Date().toISOString()
    uni.showToast({
      title: '状态已更新',
      icon: 'success'
    })
  }
}

/**
 * 新建订单
 */
const handleNewOrder = () => {
  fabExpanded.value = false
  editingOrder.value = null
  formVisible.value = true
}

/**
 * 关闭表单弹窗
 */
const handleFormClose = () => {
  formVisible.value = false
  editingOrder.value = null
}

/**
 * 表单提交
 */
const handleFormSubmit = (data) => {
  if (editingOrder.value) {
    // 编辑模式：更新现有订单
    const index = orders.value.findIndex(o => o.id === data.id)
    if (index !== -1) {
      orders.value[index] = {
        ...orders.value[index],
        ...data,
        updatedAt: new Date().toISOString()
      }
      uni.showToast({
        title: '订单已更新',
        icon: 'success'
      })
    }
  } else {
    // 新建模式：添加新订单
    const newOrder = {
      ...data,
      id: `order_${Date.now()}`,
      orderNo: `ORD${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(orders.value.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    orders.value.unshift(newOrder)
    uni.showToast({
      title: '订单已创建',
      icon: 'success'
    })
  }

  formVisible.value = false
  editingOrder.value = null
}

onMounted(() => {
  // 初始化
})
</script>

<style lang="scss" scoped>
.orders-page {
  min-height: 100vh;
  background: var(--lens-bg-primary);
}

/* 顶部标题栏 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
}

.page-title {
  font-size: 48rpx;
  color: var(--lens-text-primary);
}

.header-stats {
  display: flex;
  gap: 24rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.stat-value {
  font-size: 28rpx;
  color: var(--lens-accent);
  font-weight: 600;
  font-family: 'Georgia', serif;
}

.stat-label {
  font-size: 20rpx;
  color: var(--lens-text-muted);
}

/* Tab 切换 */
.tab-bar {
  display: flex;
  padding: 0 32rpx;
  margin-bottom: 24rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.05);
}

.tab-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx 32rpx;
  transition: all 0.3s ease;

  &.active {
    .tab-text {
      color: var(--lens-accent);
    }
  }
}

.tab-text {
  font-size: 28rpx;
  color: var(--lens-text-muted);
  transition: color 0.3s ease;
}

.tab-badge {
  padding: 4rpx 12rpx;
  background: var(--lens-accent);
  border-radius: 100rpx;
  font-size: 20rpx;
  color: #FFFFFF;
  font-weight: 500;
}

/* 内容区域 */
.content-area {
  padding-bottom: 120rpx;
}

/* FAB 悬浮按钮 */
.fab-container {
  position: fixed;
  bottom: calc(120rpx + env(safe-area-inset-bottom));
  right: 32rpx;
  z-index: 100;
}

.fab-menu {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 16rpx;
  animation: slideInUp 0.3s ease;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fab-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 28rpx;
  background: var(--lens-bg-secondary);
  border-radius: 100rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.3);
  margin-bottom: 12rpx;
}

.fab-icon {
  font-size: 32rpx;
}

.fab-label {
  font-size: 26rpx;
  color: var(--lens-text-primary);
}

.fab-button {
  width: 112rpx;
  height: 112rpx;
  background: var(--lens-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(139, 115, 85, 0.4);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
  }
}

.fab-main-icon {
  font-size: 64rpx;
  color: #FFFFFF;
  font-weight: 200;
  line-height: 1;
  transition: transform 0.3s ease;

  &.rotated {
    transform: rotate(45deg);
  }
}
</style>
