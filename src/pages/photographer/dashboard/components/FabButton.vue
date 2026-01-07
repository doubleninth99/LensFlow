<template>
  <view class="fab-container">
    <!-- FAB 按钮 -->
    <view class="fab-button" :class="{ active: menuVisible }" @click="handleFabClick">
      <text class="fab-icon" :class="{ rotate: menuVisible }">+</text>
    </view>

    <!-- 菜单遮罩 -->
    <view v-if="menuVisible" class="menu-mask" @click="closeMenu" />

    <!-- 菜单列表 -->
    <view v-if="menuVisible" class="menu-list">
      <view
        v-for="(item, index) in menuItems"
        :key="item.id"
        class="menu-item"
        :style="{ animationDelay: `${index * 50}ms` }"
        @click="handleMenuClick(item)"
      >
        <view class="menu-icon">
          <text>{{ item.icon }}</text>
        </view>
        <text class="menu-label">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 悬浮按钮组件 (FAB)
 *
 * 快捷操作入口
 */
import { ref } from 'vue'

/**
 * 菜单项配置
 */
const menuItems = [
  {
    id: 'generate_link',
    label: '生成风格确认链接',
    icon: '🔗'
  },
  {
    id: 'new_order',
    label: '创建新订单',
    icon: '📋'
  },
  {
    id: 'add_schedule',
    label: '添加档期',
    icon: '📅'
  }
]

// 菜单显示状态
const menuVisible = ref(false)

const emit = defineEmits(['action'])

/**
 * 点击 FAB 按钮
 */
const handleFabClick = () => {
  menuVisible.value = !menuVisible.value
}

/**
 * 关闭菜单
 */
const closeMenu = () => {
  menuVisible.value = false
}

/**
 * 点击菜单项
 */
const handleMenuClick = (item) => {
  closeMenu()
  emit('action', item.id)

  // 根据不同操作执行相应逻辑
  switch (item.id) {
    case 'generate_link':
      handleGenerateLink()
      break
    case 'new_order':
      uni.navigateTo({ url: '/pages/orders/index' })
      break
    case 'add_schedule':
      uni.navigateTo({ url: '/pages/schedule/index' })
      break
  }
}

/**
 * 生成风格确认链接
 */
const handleGenerateLink = () => {
  uni.showModal({
    title: '生成风格确认链接',
    content: '是否生成新的风格确认链接分享给客户？',
    confirmText: '生成',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 模拟生成链接
        const link = `https://lensflow.app/moodboard/${Date.now()}`
        uni.setClipboardData({
          data: link,
          success: () => {
            uni.showToast({
              title: '链接已复制到剪贴板',
              icon: 'success'
            })
          }
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.fab-container {
  position: fixed;
  right: 32rpx;
  bottom: calc(32rpx + env(safe-area-inset-bottom));
  z-index: 100;
}

/* FAB 按钮 */
.fab-button {
  position: relative;
  width: 112rpx;
  height: 112rpx;
  background: linear-gradient(135deg, rgba(139, 115, 85, 0.9), rgba(160, 137, 107, 0.8));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  z-index: 102;

  &:active {
    transform: scale(0.95);
  }

  &.active {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  }
}

.fab-icon {
  font-size: 64rpx;
  color: #FFFFFF;
  font-weight: 300;
  line-height: 1;
  transition: transform 0.3s ease;

  &.rotate {
    transform: rotate(45deg);
  }
}

/* 菜单遮罩 */
.menu-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  animation: fadeIn 0.2s ease;
}

/* 菜单列表 */
.menu-list {
  position: absolute;
  bottom: 140rpx;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  z-index: 101;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 24rpx;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10rpx);
  border-radius: 48rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease both;
  white-space: nowrap;

  &:active {
    transform: scale(0.95);
  }
}

.menu-icon {
  width: 56rpx;
  height: 56rpx;
  background: rgba(139, 115, 85, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.menu-label {
  font-size: 26rpx;
  color: var(--lens-text-primary);
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
