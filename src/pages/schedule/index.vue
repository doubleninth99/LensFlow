<template>
  <view class="schedule-page">
    <!-- 顶部标题栏 -->
    <view class="page-header">
      <text class="page-title title-serif">档期预约</text>
      <view class="header-actions">
        <view class="today-btn" @click="goToToday">今天</view>
      </view>
    </view>

    <!-- 日历视图 -->
    <CalendarView
      ref="calendarRef"
      :scheduleDates="markedDates"
      @change="handleDateChange"
      @monthSwitch="handleMonthSwitch"
    />

    <!-- Tab 切换：档期 / 预约申请 -->
    <view class="tab-bar">
      <view
        class="tab-item"
        :class="{ active: activeTab === 'schedule' }"
        @click="activeTab = 'schedule'"
      >
        <text class="tab-text">档期列表</text>
        <view v-if="scheduleCount > 0" class="tab-badge">{{ scheduleCount }}</view>
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'request' }"
        @click="activeTab = 'request'"
      >
        <text class="tab-text">预约申请</text>
        <view v-if="requestCount > 0" class="tab-badge">{{ requestCount }}</view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content-area">
      <!-- 档期列表 -->
      <view v-show="activeTab === 'schedule'" class="tab-content">
        <StatusFilter
          v-if="selectedDateSchedules.length > 0"
          v-model="currentStatus"
          @change="handleStatusFilter"
        />
        <ScheduleList
          :schedules="filteredSchedules"
          @cardClick="handleScheduleClick"
          @detail="handleScheduleDetail"
          @confirm="handleScheduleConfirm"
        />
      </view>

      <!-- 预约申请 -->
      <view v-show="activeTab === 'request'" class="tab-content">
        <RequestList
          :requests="pendingRequests"
          @cardClick="handleRequestClick"
          @approve="handleApprove"
          @reject="handleReject"
          @createSchedule="handleRequestToSchedule"
        />
      </view>
    </view>

    <!-- FAB 悬浮按钮 -->
    <view class="fab-container" :class="{ expanded: fabExpanded }">
      <view v-if="fabExpanded" class="fab-menu" @click="fabExpanded = false">
        <view class="fab-item" @click.stop="handleNewSchedule">
          <text class="fab-icon">📅</text>
          <text class="fab-label">新建档期</text>
        </view>
      </view>
      <view class="fab-button" @click="fabExpanded = !fabExpanded">
        <text class="fab-main-icon" :class="{ rotated: fabExpanded }">+</text>
      </view>
    </view>

    <!-- 档期详情弹窗 -->
    <ScheduleDetail
      :visible="detailVisible"
      :schedule="selectedSchedule"
      @close="handleDetailClose"
      @confirm="handleDetailConfirm"
      @cancel="handleDetailCancel"
      @edit="handleDetailEdit"
      @call="handleDetailCall"
    />

    <!-- 档期表单弹窗 -->
    <ScheduleForm
      :visible="formVisible"
      :schedule="editingSchedule"
      :request="selectedRequest"
      @close="handleFormClose"
      @submit="handleFormSubmit"
    />
  </view>
</template>

<script setup>
/**
 * 档期预约主页面
 *
 * 功能：
 * - 日历视图展示档期分布
 * - 档期列表管理
 * - 预约申请处理
 */
import { ref, computed, onMounted } from 'vue'
import CalendarView from './components/CalendarView.vue'
import ScheduleList from './components/ScheduleList.vue'
import RequestList from './components/RequestList.vue'
import StatusFilter from './components/StatusFilter.vue'
import ScheduleDetail from './components/ScheduleDetail.vue'
import ScheduleForm from './components/ScheduleForm.vue'

// 模拟数据
import schedulesData from '@/mock-data/schedules.json'
import requestsData from '@/mock-data/requests.json'

// 日历组件引用
const calendarRef = ref(null)

// 当前激活的 Tab
const activeTab = ref('schedule')

// 选中的日期
const selectedDate = ref(null)

// 当前筛选的状态
const currentStatus = ref('all')

// 档期数据
const schedules = ref(schedulesData)

// 预约申请数据
const requests = ref(requestsData)

// 详情弹窗
const detailVisible = ref(false)
const selectedSchedule = ref(null)

// 表单弹窗
const formVisible = ref(false)
const editingSchedule = ref(null)
const selectedRequest = ref(null)

// FAB 悬浮按钮
const fabExpanded = ref(false)

/**
 * 有档期的日期列表
 */
const markedDates = computed(() => {
  return schedules.value.map(s => s.date)
})

/**
 * 选中日期的档期
 */
const selectedDateSchedules = computed(() => {
  if (!selectedDate.value) {
    // 如果没有选中日期，显示所有档期
    return schedules.value
  }
  return schedules.value.filter(s => s.date === selectedDate.value)
})

/**
 * 根据状态筛选后的档期
 */
const filteredSchedules = computed(() => {
  let list = selectedDateSchedules.value

  if (currentStatus.value !== 'all') {
    list = list.filter(s => s.status === currentStatus.value)
  }

  return list
})

/**
 * 待处理的预约申请
 */
const pendingRequests = computed(() => {
  return requests.value.filter(r => r.status === 'pending')
})

/**
 * 档期数量
 */
const scheduleCount = computed(() => {
  return selectedDateSchedules.value.length
})

/**
 * 待处理预约数量
 */
const requestCount = computed(() => {
  return pendingRequests.value.length
})

/**
 * 日期变化
 */
const handleDateChange = (date) => {
  selectedDate.value = date
}

/**
 * 月份切换
 */
const handleMonthSwitch = (date) => {
  console.log('月份切换', date)
}

/**
 * 状态筛选变化
 */
const handleStatusFilter = (status) => {
  currentStatus.value = status
}

/**
 * 跳转到今天
 */
const goToToday = () => {
  if (calendarRef.value) {
    calendarRef.value.goToToday()
  }
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  selectedDate.value = `${year}-${month}-${day}`
}

/**
 * 点击档期卡片
 */
const handleScheduleClick = (schedule) => {
  selectedSchedule.value = schedule
  detailVisible.value = true
}

/**
 * 查看档期详情
 */
const handleScheduleDetail = (schedule) => {
  selectedSchedule.value = schedule
  detailVisible.value = true
}

/**
 * 关闭详情弹窗
 */
const handleDetailClose = () => {
  detailVisible.value = false
}

/**
 * 详情弹窗中确认档期
 */
const handleDetailConfirm = (schedule) => {
  const index = schedules.value.findIndex(s => s.id === schedule.id)
  if (index !== -1) {
    schedules.value[index].status = 'confirmed'
    uni.showToast({
      title: '已确认',
      icon: 'success'
    })
  }
  detailVisible.value = false
}

/**
 * 详情弹窗中取消档期
 */
const handleDetailCancel = (schedule) => {
  const index = schedules.value.findIndex(s => s.id === schedule.id)
  if (index !== -1) {
    schedules.value[index].status = 'cancelled'
    uni.showToast({
      title: '已取消档期',
      icon: 'success'
    })
  }
  detailVisible.value = false
}

/**
 * 详情弹窗中编辑档期
 */
const handleDetailEdit = (schedule) => {
  detailVisible.value = false
  editingSchedule.value = schedule
  formVisible.value = true
}

/**
 * 详情弹窗中联系客户
 */
const handleDetailCall = (schedule) => {
  // 实际拨打电话由组件内部处理
}

/**
 * 新建档期
 */
const handleNewSchedule = () => {
  fabExpanded.value = false
  editingSchedule.value = null
  selectedRequest.value = null
  formVisible.value = true
}

/**
 * 预约申请转档期
 */
const handleRequestToSchedule = (request) => {
  selectedRequest.value = request
  // 查找是否已经存在该客户的档期
  editingSchedule.value = null
  formVisible.value = true
}

/**
 * 关闭表单弹窗
 */
const handleFormClose = () => {
  formVisible.value = false
  editingSchedule.value = null
  selectedRequest.value = null
}

/**
 * 表单提交
 */
const handleFormSubmit = (data) => {
  if (editingSchedule.value) {
    // 编辑模式：更新现有档期
    const index = schedules.value.findIndex(s => s.id === data.id)
    if (index !== -1) {
      schedules.value[index] = data
      uni.showToast({
        title: '档期已更新',
        icon: 'success'
      })
    }
  } else {
    // 新建模式：添加新档期
    schedules.value.push(data)
    uni.showToast({
      title: '档期已创建',
      icon: 'success'
    })

    // 如果是从预约申请创建，更新预约状态
    if (selectedRequest.value) {
      const reqIndex = requests.value.findIndex(r => r.id === selectedRequest.value.id)
      if (reqIndex !== -1) {
        requests.value[reqIndex].status = 'approved'
      }
    }
  }

  formVisible.value = false
  editingSchedule.value = null
  selectedRequest.value = null
}

/**
 * 确认档期
 */
const handleScheduleConfirm = (schedule) => {
  console.log('确认档期', schedule)
  const index = schedules.value.findIndex(s => s.id === schedule.id)
  if (index !== -1) {
    schedules.value[index].status = 'confirmed'
    uni.showToast({
      title: '已确认',
      icon: 'success'
    })
  }
}

/**
 * 点击预约卡片
 */
const handleRequestClick = (request) => {
  console.log('点击预约', request)
}

/**
 * 接受预约
 */
const handleApprove = (request) => {
  console.log('接受预约', request)

  // 更新预约状态
  const index = requests.value.findIndex(r => r.id === request.id)
  if (index !== -1) {
    requests.value[index].status = 'approved'
    uni.showToast({
      title: '已接受预约',
      icon: 'success'
    })
  }
}

/**
 * 拒绝预约
 */
const handleReject = (request) => {
  console.log('拒绝预约', request)

  // 更新预约状态
  const index = requests.value.findIndex(r => r.id === request.id)
  if (index !== -1) {
    requests.value[index].status = 'rejected'
    uni.showToast({
      title: '已拒绝预约',
      icon: 'success'
    })
  }
}

onMounted(() => {
  // 初始化选中今天
  goToToday()
})
</script>

<style lang="scss" scoped>
.schedule-page {
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

.header-actions {
  display: flex;
  gap: 16rpx;
}

.today-btn {
  padding: 12rpx 24rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 100rpx;
  font-size: 24rpx;
  color: var(--lens-text-secondary);
  border: 1rpx solid rgba(255, 255, 255, 0.1);

  &:active {
    background: rgba(255, 255, 255, 0.1);
  }
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

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
