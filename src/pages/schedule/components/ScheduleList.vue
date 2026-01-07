<template>
  <view class="schedule-list">
    <!-- 列表 -->
    <view v-if="schedules.length > 0" class="list">
      <ScheduleCard
        v-for="schedule in schedules"
        :key="schedule.id"
        :data="schedule"
        @click="handleCardClick"
        @detail="handleDetail"
        @confirm="handleConfirm"
      />
    </view>

    <!-- 空状态 -->
    <EmptyState
      v-else
      icon="📅"
      text="该日期暂无档期安排"
    />
  </view>
</template>

<script setup>
/**
 * 档期列表组件
 *
 * 显示档期列表或空状态
 */
import { computed } from 'vue'
import ScheduleCard from './ScheduleCard.vue'
import EmptyState from './EmptyState.vue'

const props = defineProps({
  // 档期列表
  schedules: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['cardClick', 'detail', 'confirm'])

/**
 * 点击卡片
 */
const handleCardClick = (schedule) => {
  emit('cardClick', schedule)
}

/**
 * 查看详情
 */
const handleDetail = (schedule) => {
  emit('detail', schedule)
}

/**
 * 确认档期
 */
const handleConfirm = (schedule) => {
  emit('confirm', schedule)
}
</script>

<style lang="scss" scoped>
.schedule-list {
  padding: 0 32rpx 32rpx;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
