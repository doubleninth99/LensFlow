<template>
  <view class="moodboard-page">
    <!-- 滚动容器 -->
    <scroll-view
      class="scroll-container"
      scroll-y
      :scroll-top="scrollTop"
      @scroll="handleScroll"
      @scrolltoupper="handleScrollToTop"
    >
      <!-- 封面页 -->
      <CoverPage />

      <!-- 风格列表区域 -->
      <view class="style-list-section">
        <!-- 列表标题 -->
        <view class="list-header">
          <text class="header-title title-serif">选择你喜欢的风格</text>
          <text class="header-subtitle">可多选，建议选择 3-5 组</text>
        </view>

        <!-- 风格卡片列表 -->
        <view class="style-list">
          <StyleCard
            v-for="style in styles"
            :key="style.id"
            :data="style"
            :selected="selectedStyles.has(style.id)"
            @toggle="handleToggle"
            @click="handleCardClick"
          />
        </view>

        <!-- 底部占位，防止内容被固定栏遮挡 -->
        <view class="bottom-placeholder" />
      </view>
    </scroll-view>

    <!-- 底部固定栏 -->
    <FixedBar
      :count="selectedStyles.size"
      @confirm="handleSubmit"
    />

    <!-- 图库详情弹窗 -->
    <GalleryDetail
      :visible="galleryVisible"
      :images="currentGalleryImages"
      :title="currentStyleTitle"
      :description="currentStyleDescription"
      @close="handleCloseGallery"
      @imageClick="handleGalleryImageClick"
    />
  </view>
</template>

<script setup>
/**
 * 客户侧-风格确认落地页
 *
 * 核心功能：
 * 1. 沉浸式封面页
 * 2. 风格卡片列表展示
 * 3. 多选交互（呼吸灯边框效果）
 * 4. 底部固定栏显示已选数量
 * 5. 全屏图库详情
 */
import { ref, onMounted } from 'vue'
import CoverPage from './components/CoverPage.vue'
import StyleCard from './components/StyleCard.vue'
import FixedBar from './components/FixedBar.vue'
import GalleryDetail from './components/GalleryDetail.vue'

// 风格数据
const styles = ref([])

// 已选风格 ID 集合（使用 Set 去重）
const selectedStyles = ref(new Set())

// 滚动位置
const scrollTop = ref(0)

// 图库详情相关状态
const galleryVisible = ref(false)
const currentGalleryImages = ref([])
const currentStyleTitle = ref('')
const currentStyleDescription = ref('')

/**
 * 页面加载时获取风格数据
 */
onMounted(() => {
  loadStyles()
})

/**
 * 加载风格数据
 * 实际开发中应从后端 API 获取
 */
const loadStyles = () => {
  // 从本地 JSON 文件加载数据
  // 注意：在实际 Uni-app 项目中，需要使用 import 或 require
  // 这里使用模拟数据
  styles.value = [
    {
      id: 'style_001',
      title: '法式浪漫',
      coverImage: 'https://picsum.photos/seed/romantic/800/1200',
      images: [
        'https://picsum.photos/seed/romantic1/800/1200',
        'https://picsum.photos/seed/romantic2/600/800'
      ],
      description: '温柔浪漫的法式风格，适合喜欢优雅气质的新人',
      tags: ['浪漫', '优雅', '法式']
    },
    {
      id: 'style_002',
      title: '复古胶片',
      coverImage: 'https://picsum.photos/seed/vintage/800/1200',
      images: [
        'https://picsum.photos/seed/vintage1/800/1200',
        'https://picsum.photos/seed/vintage2/600/800'
      ],
      description: '怀旧胶片质感，记录时光的故事',
      tags: ['复古', '胶片', '怀旧']
    },
    {
      id: 'style_003',
      title: '极简主义',
      coverImage: 'https://picsum.photos/seed/minimal/800/1200',
      images: [
        'https://picsum.photos/seed/minimal1/800/1200',
        'https://picsum.photos/seed/minimal2/600/800'
      ],
      description: '简约而不简单，纯粹的画面表达',
      tags: ['极简', '纯粹', '现代']
    },
    {
      id: 'style_004',
      title: '自然森系',
      coverImage: 'https://picsum.photos/seed/forest/800/1200',
      images: [
        'https://picsum.photos/seed/forest1/800/1200',
        'https://picsum.photos/seed/forest2/600/800'
      ],
      description: '与自然对话，清新森系风格',
      tags: ['自然', '清新', '森系']
    },
    {
      id: 'style_005',
      title: '电影感',
      coverImage: 'https://picsum.photos/seed/cinematic/800/1200',
      images: [
        'https://picsum.photos/seed/cinematic1/800/1200',
        'https://picsum.photos/seed/cinematic2/600/800'
      ],
      description: '电影质感的画面，讲述你的爱情故事',
      tags: ['电影感', '叙事', '艺术']
    },
    {
      id: 'style_006',
      title: '街头潮流',
      coverImage: 'https://picsum.photos/seed/street/800/1200',
      images: [
        'https://picsum.photos/seed/street1/800/1200',
        'https://picsum.photos/seed/street2/600/800'
      ],
      description: '个性街头风格，展现真实的自己',
      tags: ['潮流', '街头', '个性']
    }
  ]
}

/**
 * 切换风格选中状态
 * @param {string} styleId - 风格 ID
 */
const handleToggle = (styleId) => {
  if (selectedStyles.value.has(styleId)) {
    selectedStyles.value.delete(styleId)
  } else {
    selectedStyles.value.add(styleId)
  }
  // 触发响应式更新
  selectedStyles.value = new Set(selectedStyles.value)
}

/**
 * 点击风格卡片（进入图库详情）
 * @param {object} style - 风格数据
 */
const handleCardClick = (style) => {
  currentGalleryImages.value = style.images
  currentStyleTitle.value = style.title
  currentStyleDescription.value = style.description
  galleryVisible.value = true
}

/**
 * 关闭图库详情
 */
const handleCloseGallery = () => {
  galleryVisible.value = false
}

/**
 * 点击图库中的图片
 * @param {number} index - 图片索引
 */
const handleGalleryImageClick = (index) => {
  console.log('点击了第', index, '张图片')
  // 可以实现双击放大、保存等功能
}

/**
 * 处理滚动事件
 * @param {object} e - 滚动事件对象
 */
const handleScroll = (e) => {
  scrollTop.value = e.detail.scrollTop
}

/**
 * 滚动到顶部
 */
const handleScrollToTop = () => {
  console.log('已滚动到顶部')
}

/**
 * 提交选中的风格
 */
const handleSubmit = () => {
  if (selectedStyles.value.size === 0) {
    uni.showToast({
      title: '请至少选择一组风格',
      icon: 'none',
      duration: 2000
    })
    return
  }

  // 获取选中的风格详情
  const selectedStyleList = styles.value.filter(style =>
    selectedStyles.value.has(style.id)
  )

  console.log('提交选中的风格：', selectedStyleList)

  // 实际开发中应调用后端 API 提交数据
  // await submitStyles(selectedStyleList)

  // 显示提交成功提示
  uni.showToast({
    title: `已选择 ${selectedStyles.value.size} 组风格`,
    icon: 'success',
    duration: 2000
  })

  // 可以跳转到下一页面
  // uni.navigateTo({
  //   url: '/pages/client/result/index'
  // })
}
</script>

<style lang="scss" scoped>
.moodboard-page {
  position: relative;
  width: 100%;
  height: 100vh;
  background: var(--lens-bg-primary);
}

.scroll-container {
  width: 100%;
  height: 100%;
}

.style-list-section {
  position: relative;
  padding: 60rpx 32rpx 0;
  background: var(--lens-bg-primary);
  border-radius: 40rpx 40rpx 0 0;
  margin-top: -40rpx;
  z-index: 10;
}

/* 列表标题 */
.list-header {
  padding: 40rpx 0 48rpx;
  text-align: center;
}

.header-title {
  display: block;
  font-size: 48rpx;
  color: var(--lens-text-primary);
  letter-spacing: 4rpx;
  margin-bottom: 16rpx;
}

.header-subtitle {
  display: block;
  font-size: 24rpx;
  color: var(--lens-text-muted);
  letter-spacing: 1rpx;
}

/* 风格列表 */
.style-list {
  width: 100%;
}

/* 底部占位 */
.bottom-placeholder {
  height: 180rpx;
  height: calc(180rpx + env(safe-area-inset-bottom));
}
</style>
