<template>
  <view v-if="visible" class="schedule-form-overlay" @tap="handleClose">
    <view class="form-popup" @tap.stop>
      <!-- 顶部栏 -->
      <view class="popup-header">
        <text class="header-title">{{ formTitle }}</text>
        <view class="close-btn" @tap="handleClose">
          <text class="close-icon">✕</text>
        </view>
      </view>

      <!-- 表单内容 -->
      <scroll-view class="form-content" scroll-y>
        <!-- 日期和时间 -->
        <view class="form-section">
          <view class="section-title">
            <text class="section-icon">📅</text>
            <text class="section-text">拍摄时间</text>
          </view>

          <!-- 日期选择 -->
          <view class="form-item">
            <text class="form-label">拍摄日期 <text class="required">*</text></text>
            <picker mode="date" :value="formData.date" :start="minDate" @change="handleDateChange">
              <view class="picker-value" :class="{ error: errors.date }">
                <text :class="['value-text', { placeholder: !formData.date }]">
                  {{ formData.date || '请选择日期' }}
                </text>
                <text class="picker-icon">›</text>
              </view>
            </picker>
            <text v-if="errors.date" class="error-text">{{ errors.date }}</text>
          </view>

          <!-- 时间选择 -->
          <view class="form-row">
            <view class="form-item flex-1">
              <text class="form-label">开始时间 <text class="required">*</text></text>
              <picker mode="time" :value="formData.startTime" @change="handleStartTimeChange">
                <view class="picker-value" :class="{ error: errors.startTime }">
                  <text :class="['value-text', { placeholder: !formData.startTime }]">
                    {{ formData.startTime || '开始' }}
                  </text>
                  <text class="picker-icon">›</text>
                </view>
              </picker>
              <text v-if="errors.startTime" class="error-text">{{ errors.startTime }}</text>
            </view>
            <view class="form-item flex-1">
              <text class="form-label">结束时间 <text class="required">*</text></text>
              <picker mode="time" :value="formData.endTime" @change="handleEndTimeChange">
                <view class="picker-value" :class="{ error: errors.endTime }">
                  <text :class="['value-text', { placeholder: !formData.endTime }]">
                    {{ formData.endTime || '结束' }}
                  </text>
                  <text class="picker-icon">›</text>
                </view>
              </picker>
              <text v-if="errors.endTime" class="error-text">{{ errors.endTime }}</text>
            </view>
          </view>
        </view>

        <!-- 客户信息 -->
        <view class="form-section">
          <view class="section-title">
            <text class="section-icon">👤</text>
            <text class="section-text">客户信息</text>
          </view>

          <view class="form-item">
            <text class="form-label">客户姓名 <text class="required">*</text></text>
            <input
              class="form-input"
              :class="{ error: errors.clientName }"
              v-model="formData.clientName"
              placeholder="请输入客户姓名"
              placeholder-style="color: var(--lens-text-muted);"
              confirm-type="done"
              cursor-spacing="10"
            />
            <text v-if="errors.clientName" class="error-text">{{ errors.clientName }}</text>
          </view>

          <view class="form-item">
            <text class="form-label">联系电话 <text class="required">*</text></text>
            <input
              class="form-input"
              :class="{ error: errors.clientPhone }"
              v-model="formData.clientPhone"
              type="number"
              maxlength="11"
              placeholder="请输入联系电话"
              placeholder-style="color: var(--lens-text-muted);"
              confirm-type="done"
              cursor-spacing="10"
            />
            <text v-if="errors.clientPhone" class="error-text">{{ errors.clientPhone }}</text>
          </view>
        </view>

        <!-- 拍摄信息 -->
        <view class="form-section">
          <view class="section-title">
            <text class="section-icon">📷</text>
            <text class="section-text">拍摄信息</text>
          </view>

          <!-- 拍摄类型 -->
          <view class="form-item">
            <text class="form-label">拍摄类型</text>
            <picker
              mode="selector"
              :range="TYPE_OPTIONS"
              range-key="label"
              :value="formData.typeIndex"
              @change="handleTypeChange"
            >
              <view class="picker-value">
                <text class="value-text">{{ currentTypeLabel }}</text>
                <text class="picker-icon">›</text>
              </view>
            </picker>
          </view>

          <!-- 拍摄地点 -->
          <view class="form-item">
            <text class="form-label">拍摄地点</text>
            <input
              class="form-input"
              v-model="formData.location"
              placeholder="请输入拍摄地点"
              placeholder-style="color: var(--lens-text-muted);"
              confirm-type="done"
              cursor-spacing="10"
            />
          </view>

          <!-- 备注 -->
          <view class="form-item">
            <text class="form-label">备注</text>
            <textarea
              class="form-textarea"
              v-model="formData.notes"
              placeholder="请输入备注信息（选填）"
              placeholder-style="color: var(--lens-text-muted);"
              maxlength="200"
              :show-confirm-bar="false"
            />
            <view class="char-count">{{ formData.notes.length }}/200</view>
          </view>
        </view>
      </scroll-view>

      <!-- 底部操作栏 -->
      <view class="action-bar">
        <view class="btn-cancel" @tap="handleClose">取消</view>
        <view class="btn-submit" :class="{ loading: submitting }" @tap="handleSubmit">
          <text v-if="submitting" class="loading-icon">⏳</text>
          <text>{{ submitButtonText }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 档期表单组件
 *
 * 用于新建和编辑档期
 * 支持三种模式：
 * - create: 新建档期
 * - edit: 编辑现有档期
 * - fromRequest: 从预约申请创建档期
 */
import { ref, computed, watch } from 'vue'

// ============ Props 定义 ============
const props = defineProps({
  // 是否显示弹窗
  visible: {
    type: Boolean,
    default: false
  },
  // 档期数据（编辑模式）
  schedule: {
    type: Object,
    default: null
  },
  // 预约申请数据（从预约创建）
  request: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])

// ============ 常量定义 ============
/**
 * 拍摄类型选项
 */
const TYPE_OPTIONS = [
  { label: '婚纱照', value: 'wedding' },
  { label: '个人写真', value: 'portrait' },
  { label: '商业摄影', value: 'commercial' }
]

/**
 * 表单默认值
 */
const DEFAULT_FORM_DATA = {
  date: '',
  startTime: '',
  endTime: '',
  clientName: '',
  clientPhone: '',
  typeIndex: 0,
  location: '',
  notes: ''
}

// ============ 响应式状态 ============
/**
 * 表单数据
 */
const formData = ref({ ...DEFAULT_FORM_DATA })

/**
 * 表单验证错误信息
 */
const errors = ref({})

/**
 * 提交中状态
 */
const submitting = ref(false)

// ============ 计算属性 ============
/**
 * 表单模式：create | edit | fromRequest
 */
const formMode = computed(() => {
  if (props.schedule) return 'edit'
  if (props.request) return 'fromRequest'
  return 'create'
})

/**
 * 弹窗标题
 */
const formTitle = computed(() => {
  const titleMap = {
    create: '新建档期',
    edit: '编辑档期',
    fromRequest: '创建档期'
  }
  return titleMap[formMode.value]
})

/**
 * 提交按钮文字
 */
const submitButtonText = computed(() => {
  if (submitting.value) return '提交中...'
  const textMap = {
    create: '创建',
    edit: '保存',
    fromRequest: '创建'
  }
  return textMap[formMode.value]
})

/**
 * 最小可选日期（今天）
 */
const minDate = computed(() => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

/**
 * 当前选中的拍摄类型标签
 */
const currentTypeLabel = computed(() => {
  return TYPE_OPTIONS[formData.value.typeIndex]?.label || TYPE_OPTIONS[0].label
})

/**
 * 当前选中的拍摄类型值
 */
const currentTypeValue = computed(() => {
  return TYPE_OPTIONS[formData.value.typeIndex]?.value || TYPE_OPTIONS[0].value
})

// ============ 表单操作方法 ============
/**
 * 重置表单
 */
const resetForm = () => {
  formData.value = { ...DEFAULT_FORM_DATA }
  errors.value = {}
}

/**
 * 填充表单数据
 */
const fillFormData = (data) => {
  if (!data) return

  // 查找类型索引
  let typeIndex = 0
  if (data.type) {
    const index = TYPE_OPTIONS.findIndex(t => t.value === data.type)
    typeIndex = index >= 0 ? index : 0
  }

  formData.value = {
    date: data.date || '',
    startTime: data.startTime || '',
    endTime: data.endTime || '',
    clientName: data.clientName || '',
    clientPhone: data.clientPhone || '',
    typeIndex,
    location: data.location || '',
    notes: data.notes || data.message || ''
  }

  // 清除之前的错误
  errors.value = {}
}

/**
 * 从预约申请填充数据
 */
const fillRequestData = (request) => {
  if (!request) return

  let typeIndex = 0
  if (request.type) {
    const index = TYPE_OPTIONS.findIndex(t => t.value === request.type)
    typeIndex = index >= 0 ? index : 0
  }

  formData.value = {
    date: request.preferredDates?.[0] || '',
    startTime: '',
    endTime: '',
    clientName: request.clientName || '',
    clientPhone: request.clientPhone || '',
    typeIndex,
    location: '',
    notes: request.message || ''
  }

  errors.value = {}
}

// ============ 事件处理方法 ============
/**
 * 日期变化
 */
const handleDateChange = (e) => {
  formData.value.date = e.detail.value
  // 清除该字段的错误
  if (errors.value.date) {
    errors.value.date = ''
  }
}

/**
 * 开始时间变化
 */
const handleStartTimeChange = (e) => {
  formData.value.startTime = e.detail.value
  if (errors.value.startTime) {
    errors.value.startTime = ''
  }
}

/**
 * 结束时间变化
 */
const handleEndTimeChange = (e) => {
  formData.value.endTime = e.detail.value
  if (errors.value.endTime) {
    errors.value.endTime = ''
  }
}

/**
 * 拍摄类型变化
 */
const handleTypeChange = (e) => {
  formData.value.typeIndex = e.detail.value
}

/**
 * 验证单个字段
 */
const validateField = (field, value) => {
  const validations = {
    date: {
      required: true,
      message: '请选择拍摄日期'
    },
    startTime: {
      required: true,
      message: '请选择开始时间'
    },
    endTime: {
      required: true,
      message: '请选择结束时间'
    },
    clientName: {
      required: true,
      message: '请输入客户姓名'
    },
    clientPhone: {
      required: true,
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号'
    }
  }

  const validation = validations[field]
  if (!validation) return true

  // 必填验证
  if (validation.required && !value) {
    return validation.message
  }

  // 正则验证
  if (validation.pattern && !validation.pattern.test(value)) {
    return validation.message
  }

  return ''
}

/**
 * 验证时间逻辑
 */
const validateTimeLogic = () => {
  const { startTime, endTime } = formData.value

  if (!startTime || !endTime) return ''

  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)

  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin

  if (startMinutes >= endMinutes) {
    return '结束时间必须晚于开始时间'
  }

  return ''
}

/**
 * 表单验证
 */
const validateForm = () => {
  const newErrors = {}

  // 验证各个字段
  newErrors.date = validateField('date', formData.value.date)
  newErrors.startTime = validateField('startTime', formData.value.startTime)
  newErrors.endTime = validateField('endTime', formData.value.endTime)
  newErrors.clientName = validateField('clientName', formData.value.clientName)
  newErrors.clientPhone = validateField('clientPhone', formData.value.clientPhone)

  // 验证时间逻辑
  const timeError = validateTimeLogic()
  if (timeError) {
    newErrors.endTime = timeError
  }

  // 过滤掉空值
  Object.keys(newErrors).forEach(key => {
    if (!newErrors[key]) {
      delete newErrors[key]
    }
  })

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  // 防止重复提交
  if (submitting.value) return

  // 验证表单
  if (!validateForm()) {
    // 显示第一个错误
    const firstError = Object.values(errors.value)[0]
    uni.showToast({
      title: firstError,
      icon: 'none',
      duration: 2000
    })
    return
  }

  submitting.value = true

  try {
    // 构建提交数据
    const submitData = {
      date: formData.value.date,
      startTime: formData.value.startTime,
      endTime: formData.value.endTime,
      clientName: formData.value.clientName,
      clientPhone: formData.value.clientPhone,
      type: currentTypeValue.value,
      location: formData.value.location,
      notes: formData.value.notes,
      // 元数据
      id: props.schedule?.id || `schedule_${Date.now()}`,
      status: props.schedule?.status || 'pending',
      clientId: props.schedule?.clientId || `client_${Date.now()}`,
      clientAvatar: props.schedule?.clientAvatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
      createdAt: props.schedule?.createdAt || new Date().toISOString()
    }

    // 延迟以显示加载状态
    await new Promise(resolve => setTimeout(resolve, 300))

    emit('submit', submitData)
  } finally {
    submitting.value = false
  }
}

/**
 * 关闭弹窗
 */
const handleClose = () => {
  // 如果正在提交，不允许关闭
  if (submitting.value) return

  emit('close')
}

// ============ 监听器 ============
/**
 * 监听 visible 变化，控制表单数据
 */
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // 弹窗打开时，根据模式填充数据
    if (formMode.value === 'edit' && props.schedule) {
      fillFormData(props.schedule)
    } else if (formMode.value === 'fromRequest' && props.request) {
      fillRequestData(props.request)
    } else {
      resetForm()
    }
  } else {
    // 弹窗关闭时，重置表单
    resetForm()
  }
})

/**
 * 监听 schedule 变化（编辑模式）
 */
watch(() => props.schedule, (newVal) => {
  if (newVal && props.visible) {
    fillFormData(newVal)
  }
})

/**
 * 监听 request 变化（从预约创建）
 */
watch(() => props.request, (newVal) => {
  if (newVal && props.visible) {
    fillRequestData(newVal)
  }
})
</script>

<style lang="scss" scoped>
// ============ 弹窗容器 ============
.schedule-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.3s ease;
}

.form-popup {
  width: 100%;
  max-height: 90vh;
  background: var(--lens-bg-secondary);
  border-radius: 32rpx 32rpx 0 0;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

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
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

// ============ 顶部栏 ============
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.05);
}

.header-title {
  font-size: 32rpx;
  color: var(--lens-text-primary);
  font-weight: 500;
}

.close-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:active {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(0.95);
  }
}

.close-icon {
  font-size: 40rpx;
  color: var(--lens-text-primary);
  line-height: 1;
}

// ============ 表单内容 ============
.form-content {
  flex: 1;
  padding: 32rpx;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 40rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.section-icon {
  font-size: 32rpx;
}

.section-text {
  font-size: 28rpx;
  color: var(--lens-text-primary);
  font-weight: 500;
}

.form-row {
  display: flex;
  gap: 16rpx;
}

.flex-1 {
  flex: 1;
}

.form-item {
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  font-size: 26rpx;
  color: var(--lens-text-muted);
  margin-bottom: 16rpx;
}

.required {
  color: #ff4d4f;
  margin-left: 4rpx;
}

// ============ 输入框样式 ============
.form-input {
  width: 100%;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  font-size: 28rpx;
  color: var(--lens-text-primary);
  box-sizing: border-box;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: var(--lens-accent);
    background: rgba(255, 255, 255, 0.08);
  }

  &.error {
    border-color: #ff4d4f;

    &:focus {
      border-color: #ff4d4f;
    }
  }
}

.form-textarea {
  width: 100%;
  min-height: 160rpx;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  font-size: 28rpx;
  color: var(--lens-text-primary);
  box-sizing: border-box;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: var(--lens-accent);
    background: rgba(255, 255, 255, 0.08);
  }
}

.char-count {
  text-align: right;
  font-size: 22rpx;
  color: var(--lens-text-muted);
  margin-top: 8rpx;
}

.picker-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  transition: border-color 0.3s ease;

  &.error {
    border-color: #ff4d4f;
  }

  &:active {
    background: rgba(255, 255, 255, 0.08);
  }
}

.value-text {
  font-size: 28rpx;
  color: var(--lens-text-primary);

  &.placeholder {
    color: var(--lens-text-muted);
  }
}

.picker-icon {
  font-size: 40rpx;
  color: var(--lens-text-muted);
  font-weight: 300;
}

// ============ 错误提示 ============
.error-text {
  display: block;
  font-size: 22rpx;
  color: #ff4d4f;
  margin-top: 8rpx;
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-8rpx);
  }
  75% {
    transform: translateX(8rpx);
  }
}

// ============ 底部操作栏 ============
.action-bar {
  display: flex;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: var(--lens-bg-secondary);
  border-top: 1rpx solid rgba(255, 255, 255, 0.05);
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 28rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  color: var(--lens-text-primary);

  &:active {
    background: rgba(255, 255, 255, 0.1);
  }
}

.btn-submit {
  background: var(--lens-accent);
  color: #FFFFFF;

  &:active {
    opacity: 0.8;
  }

  &.loading {
    opacity: 0.7;
    pointer-events: none;
  }
}

.loading-icon {
  font-size: 28rpx;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
