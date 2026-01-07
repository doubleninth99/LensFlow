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
        />
      </view>
    </view>
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
  console.log('点击档期', schedule)
}

/**
 * 查看档期详情
 */
const handleScheduleDetail = (schedule) => {
  console.log('查看详情', schedule)
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
</style>
