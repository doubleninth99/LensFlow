<template>
  <view class="order-filter">
    <view
      v-for="option in options"
      :key="option.value"
      class="filter-item"
      :class="{ active: modelValue === option.value }"
      @click="handleSelect(option.value)"
    >
      <text class="filter-text">{{ option.label }}</text>
      <view v-if="option.count !== undefined" class="filter-count">
        {{ option.count }}
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 订单筛选器组件
 *
 * 提供订单状态筛选选项
 */
const props = defineProps({
  // 当前选中的值
  modelValue: {
    type: String,
    default: 'all'
  },
  // 筛选选项配置
  filterType: {
    type: String,
    default: 'status'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

/**
 * 筛选选项
 */
const options = computed(() => {
  if (props.filterType === 'status') {
    return [
      { label: '全部', value: 'all' },
      { label: '草稿', value: 'draft' },
      { label: '待确认', value: 'pending' },
      { label: '已确认', value: 'confirmed' },
      { label: '拍摄中', value: 'production' },
      { label: '后期中', value: 'editing' },
      { label: '已交付', value: 'delivered' },
      { label: '已完成', value: 'completed' },
      { label: '已取消', value: 'cancelled' }
    ]
  } else if (props.filterType === 'payment') {
    return [
      { label: '全部', value: 'all' },
      { label: '未付款', value: 'unpaid' },
      { label: '定金', value: 'deposit' },
      { label: '部分付款', value: 'partial' },
      { label: '全额', value: 'full' }
    ]
  } else if (props.filterType === 'delivery') {
    return [
      { label: '全部', value: 'all' },
      { label: '未开始', value: 'not_started' },
      { label: '拍摄中', value: 'shooting' },
      { label: '后期中', value: 'editing' },
      { label: '待确认', value: 'reviewing' },
      { label: '已交付', value: 'delivered' }
    ]
  }
  return []
})

/**
 * 选择筛选选项
 */
const handleSelect = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style lang="scss" scoped>
.order-filter {
  display: flex;
  gap: 16rpx;
  padding: 0 32rpx;
  margin-bottom: 24rpx;
  overflow-x: auto;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 24rpx;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 100rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  flex-shrink: 0;

  &.active {
    background: rgba(139, 115, 85, 0.2);
    border-color: rgba(139, 115, 85, 0.3);

    .filter-text {
      color: var(--lens-accent);
    }
  }
}

.filter-text {
  font-size: 26rpx;
  color: var(--lens-text-muted);
  transition: color 0.3s ease;
}

.filter-count {
  padding: 4rpx 10rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 100rpx;
  font-size: 20rpx;
  color: var(--lens-text-secondary);
  min-width: 20rpx;
  text-align: center;
}
</style>
