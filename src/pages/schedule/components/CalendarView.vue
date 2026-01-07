<template>
  <view class="calendar-view">
    <!-- 月份导航 -->
    <view class="month-nav">
      <view class="nav-btn" @click="prevMonth">
        <text class="nav-icon">‹</text>
      </view>
      <text class="month-title">{{ monthTitle }}</text>
      <view class="nav-btn" @click="nextMonth">
        <text class="nav-icon">›</text>
      </view>
    </view>

    <!-- 星期标题 -->
    <view class="week-header">
      <text
        v-for="(day, index) in weekDays"
        :key="index"
        class="week-day"
      >
        {{ day }}
      </text>
    </view>

    <!-- 日期网格 -->
    <view class="date-grid">
      <view
        v-for="(date, index) in calendarDates"
        :key="index"
        class="date-cell"
        :class="{
          'other-month': date.isOtherMonth,
          'today': date.isToday,
          'selected': isSelected(date),
          'has-schedule': date.hasSchedule
        }"
        @click="selectDate(date)"
      >
        <text class="date-number">{{ date.day }}</text>
        <view v-if="date.hasSchedule" class="schedule-dot" />
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 自定义日历视图组件
 *
 * 功能：
 * - 显示当前月份的日历
 * - 标记有档期的日期
 * - 点击日期选择
 * - 月份切换
 */
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  // 有档期的日期列表 ['2024-02-14', '2024-02-15']
  scheduleDates: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['change', 'monthSwitch'])

// 当前日期
const currentDate = ref(new Date())
// 选中的日期
const selectedDate = ref(null)

// 星期标题
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

/**
 * 月份标题
 */
const monthTitle = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth() + 1
  return `${year}年 ${month}月`
})

/**
 * 生成日历日期数组
 */
const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // 获取当月第一天是星期几
  const firstDayWeek = firstDay.getDay()

  // 填充上月日期
  const dates = []
  const prevMonthLastDay = new Date(year, month, 0).getDate()

  for (let i = firstDayWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    const date = new Date(year, month - 1, day)
    dates.push({
      day,
      fullDate: formatDate(date),
      isOtherMonth: true,
      isToday: isSameDay(date, new Date()),
      hasSchedule: hasSchedule(date)
    })
  }

  // 当月日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    dates.push({
      day: i,
      fullDate: formatDate(date),
      isOtherMonth: false,
      isToday: isSameDay(date, new Date()),
      hasSchedule: hasSchedule(date)
    })
  }

  // 填充下月日期
  const remainingDays = 42 - dates.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    dates.push({
      day: i,
      fullDate: formatDate(date),
      isOtherMonth: true,
      isToday: isSameDay(date, new Date()),
      hasSchedule: hasSchedule(date)
    })
  }

  return dates
})

/**
 * 格式化日期为 YYYY-MM-DD
 */
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 检查两个日期是否相同
 */
const isSameDay = (date1, date2) => {
  return formatDate(date1) === formatDate(date2)
}

/**
 * 检查日期是否有档期
 */
const hasSchedule = (date) => {
  const dateStr = formatDate(date)
  return props.scheduleDates.some(d => d.startsWith(dateStr))
}

/**
 * 检查日期是否被选中
 */
const isSelected = (date) => {
  return selectedDate.value && formatDate(selectedDate.value) === date.fullDate
}

/**
 * 选择日期
 */
const selectDate = (date) => {
  if (date.isOtherMonth) return
  selectedDate.value = new Date(date.fullDate)
  emit('change', date.fullDate)
}

/**
 * 上个月
 */
const prevMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
  emit('monthSwitch', currentDate.value)
}

/**
 * 下个月
 */
const nextMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
  emit('monthSwitch', currentDate.value)
}

/**
 * 跳转到今天
 */
const goToToday = () => {
  currentDate.value = new Date()
  selectedDate.value = new Date()
  emit('change', formatDate(new Date()))
}

// 暴露方法供父组件调用
defineExpose({
  goToToday
})
</script>

<style lang="scss" scoped>
.calendar-view {
  background: var(--lens-bg-secondary);
  border-radius: 24rpx;
  padding: 32rpx;
  margin: 32rpx;
}

/* 月份导航 */
.month-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.nav-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  transition: all 0.3s ease;

  &:active {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(0.95);
  }
}

.nav-icon {
  font-size: 48rpx;
  color: var(--lens-text-primary);
  font-weight: 300;
}

.month-title {
  font-size: 32rpx;
  color: var(--lens-text-primary);
  font-weight: 500;
}

/* 星期标题 */
.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 16rpx;
}

.week-day {
  text-align: center;
  font-size: 24rpx;
  color: var(--lens-text-muted);
  padding: 16rpx 0;
}

/* 日期网格 */
.date-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8rpx;
}

.date-cell {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  transition: all 0.3s ease;

  &:active {
    background: rgba(255, 255, 255, 0.05);
  }

  &.other-month {
    opacity: 0.3;
  }

  &.today {
    background: rgba(139, 115, 85, 0.2);
  }

  &.selected {
    background: var(--lens-accent);
    box-shadow: 0 4rpx 12rpx rgba(139, 115, 85, 0.4);
  }
}

.date-number {
  font-size: 28rpx;
  color: var(--lens-text-primary);
  font-weight: 500;
}

.schedule-dot {
  position: absolute;
  bottom: 8rpx;
  width: 8rpx;
  height: 8rpx;
  background: var(--lens-accent);
  border-radius: 50%;
}
</style>
