<template>
  <view class="status-filter">
    <scroll-view scroll-x class="filter-scroll">
      <view class="filter-list">
        <view
          v-for="option in options"
          :key="option.value"
          class="filter-item"
          :class="{ active: modelValue === option.value }"
          @click="handleSelect(option.value)"
        >
          <text class="filter-text">{{ option.label }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
/**
 * 状态筛选器组件
 *
 * 横向滚动的状态筛选条
 */
const props = defineProps({
  // 当前选中的状态
  modelValue: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 筛选选项
const options = [
  { label: '全部', value: 'all' },
  { label: '待确认', value: 'pending' },
  { label: '已确认', value: 'confirmed' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' }
]

/**
 * 选择状态
 */
const handleSelect = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style lang="scss" scoped>
.status-filter {
  padding: 0 32rpx;
  margin-bottom: 24rpx;
}

.filter-scroll {
  white-space: nowrap;
}

.filter-list {
  display: inline-flex;
  gap: 16rpx;
}

.filter-item {
  flex-shrink: 0;
  padding: 16rpx 32rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 100rpx;
  transition: all 0.3s ease;

  &.active {
    background: var(--lens-accent);
  }
}

.filter-text {
  font-size: 26rpx;
  color: var(--lens-text-primary);

  .filter-item.active & {
    color: #FFFFFF;
    font-weight: 500;
  }
}
</style>
