<template>
  <view v-if="visible" class="order-form-overlay" @click="handleClose">
    <view class="form-popup" @click.stop>
      <!-- 顶部栏 -->
      <view class="popup-header">
        <view class="close-btn" @click="handleClose">
          <text class="close-icon">✕</text>
        </view>
        <text class="header-title">{{ isEdit ? '编辑订单' : '新建订单' }}</text>
        <view class="header-spacer" />
      </view>

      <!-- 内容区域 -->
      <scroll-view class="popup-content" scroll-y>
        <view class="form-section">
          <view class="section-title">客户信息</view>
          <view class="form-item">
            <text class="form-label">客户姓名 <text class="required">*</text></text>
            <input
              v-model="formData.clientName"
              class="form-input"
              placeholder="请输入客户姓名"
              placeholder-class="input-placeholder"
            />
          </view>
          <view class="form-item">
            <text class="form-label">联系电话 <text class="required">*</text></text>
            <input
              v-model="formData.clientPhone"
              class="form-input"
              type="number"
              placeholder="请输入联系电话"
              placeholder-class="input-placeholder"
            />
          </view>
        </view>

        <view class="form-section">
          <view class="section-title">拍摄信息</view>
          <view class="form-item">
            <text class="form-label">拍摄日期 <text class="required">*</text></text>
            <picker
              mode="date"
              :value="formData.shootDate"
              @change="handleDateChange"
            >
              <view class="picker-value">
                {{ formData.shootDate || '请选择拍摄日期' }}
              </view>
            </picker>
          </view>
          <view class="form-item-row">
            <view class="form-item half">
              <text class="form-label">开始时间</text>
              <picker
                mode="time"
                :value="formData.startTime"
                @change="handleStartTimeChange"
              >
                <view class="picker-value">
                  {{ formData.startTime || '09:00' }}
                </view>
              </picker>
            </view>
            <view class="form-item half">
              <text class="form-label">结束时间</text>
              <picker
                mode="time"
                :value="formData.endTime"
                @change="handleEndTimeChange"
              >
                <view class="picker-value">
                  {{ formData.endTime || '17:00' }}
                </view>
              </picker>
            </view>
          </view>
          <view class="form-item">
            <text class="form-label">拍摄类型</text>
            <picker
              mode="selector"
              :range="typeOptions"
              range-key="label"
              :value="typeIndex"
              @change="handleTypeChange"
            >
              <view class="picker-value">
                {{ typeOptions[typeIndex]?.label || '请选择' }}
              </view>
            </picker>
          </view>
          <view class="form-item">
            <text class="form-label">拍摄地点</text>
            <input
              v-model="formData.location"
              class="form-input"
              placeholder="请输入拍摄地点"
              placeholder-class="input-placeholder"
            />
          </view>
        </view>

        <view class="form-section">
          <view class="section-title">金额信息</view>
          <view class="form-item">
            <text class="form-label">订单总额 (元) <text class="required">*</text></text>
            <input
              v-model.number="formData.amount"
              class="form-input"
              type="digit"
              placeholder="请输入订单总额"
              placeholder-class="input-placeholder"
            />
          </view>
          <view class="form-item">
            <text class="form-label">已付金额 (元)</text>
            <input
              v-model.number="formData.paidAmount"
              class="form-input"
              type="digit"
              placeholder="请输入已付金额"
              placeholder-class="input-placeholder"
            />
          </view>
          <view class="form-item">
            <text class="form-label">定金金额 (元)</text>
            <input
              v-model.number="formData.depositAmount"
              class="form-input"
              type="digit"
              placeholder="请输入定金金额"
              placeholder-class="input-placeholder"
            />
          </view>
        </view>

        <view class="form-section">
          <view class="section-title">备注信息</view>
          <view class="form-item">
            <text class="form-label">客户备注</text>
            <textarea
              v-model="formData.notes"
              class="form-textarea"
              placeholder="客户备注信息（可见给客户）"
              placeholder-class="input-placeholder"
              :maxlength="200"
            />
          </view>
          <view class="form-item">
            <text class="form-label">内部备注</text>
            <textarea
              v-model="formData.internalNotes"
              class="form-textarea"
              placeholder="内部备注信息（仅内部可见）"
              placeholder-class="input-placeholder"
              :maxlength="200"
            />
          </view>
        </view>
      </scroll-view>

      <!-- 底部操作栏 -->
      <view class="action-bar">
        <button class="btn-cancel" @click="handleClose">取消</button>
        <button class="btn-submit" @click="handleSubmit">提交</button>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 订单表单组件
 *
 * 用于创建和编辑订单
 */
import { ref, computed, watch } from 'vue'

const props = defineProps({
  // 是否显示
  visible: {
    type: Boolean,
    default: false
  },
  // 订单数据（编辑模式）
  order: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])

/**
 * 是否为编辑模式
 */
const isEdit = computed(() => !!props.order)

/**
 * 拍摄类型选项
 */
const typeOptions = [
  { label: '婚纱照', value: 'wedding' },
  { label: '个人写真', value: 'portrait' },
  { label: '商业摄影', value: 'commercial' }
]

const typeIndex = ref(0)

/**
 * 表单数据
 */
const formData = ref({
  clientName: '',
  clientPhone: '',
  shootDate: '',
  startTime: '09:00',
  endTime: '17:00',
  type: 'portrait',
  location: '',
  amount: '',
  paidAmount: '',
  depositAmount: '',
  notes: '',
  internalNotes: ''
})

/**
 * 监听订单数据变化，自动填充表单
 */
watch(() => props.order, (newOrder) => {
  if (newOrder) {
    formData.value = {
      clientName: newOrder.clientName || '',
      clientPhone: newOrder.clientPhone || '',
      shootDate: newOrder.shootDate || '',
      startTime: newOrder.startTime || '09:00',
      endTime: newOrder.endTime || '17:00',
      type: newOrder.type || 'portrait',
      location: newOrder.location || '',
      amount: newOrder.amount || '',
      paidAmount: newOrder.paidAmount || '',
      depositAmount: newOrder.depositAmount || '',
      notes: newOrder.notes || '',
      internalNotes: newOrder.internalNotes || ''
    }
    // 设置类型索引
    const index = typeOptions.findIndex(t => t.value === newOrder.type)
    typeIndex.value = index >= 0 ? index : 0
  } else {
    resetForm()
  }
}, { immediate: true })

/**
 * 重置表单
 */
const resetForm = () => {
  formData.value = {
    clientName: '',
    clientPhone: '',
    shootDate: '',
    startTime: '09:00',
    endTime: '17:00',
    type: 'portrait',
    location: '',
    amount: '',
    paidAmount: '',
    depositAmount: '',
    notes: '',
    internalNotes: ''
  }
  typeIndex.value = 1 // 默认选中个人写真
}

/**
 * 日期变化
 */
const handleDateChange = (e) => {
  formData.value.shootDate = e.detail.value
}

/**
 * 开始时间变化
 */
const handleStartTimeChange = (e) => {
  formData.value.startTime = e.detail.value
}

/**
 * 结束时间变化
 */
const handleEndTimeChange = (e) => {
  formData.value.endTime = e.detail.value
}

/**
 * 类型变化
 */
const handleTypeChange = (e) => {
  typeIndex.value = e.detail.value
  formData.value.type = typeOptions[e.detail.value].value
}

/**
 * 验证表单
 */
const validateForm = () => {
  if (!formData.value.clientName.trim()) {
    uni.showToast({
      title: '请输入客户姓名',
      icon: 'none'
    })
    return false
  }

  if (!formData.value.clientPhone.trim()) {
    uni.showToast({
      title: '请输入联系电话',
      icon: 'none'
    })
    return false
  }

  if (!formData.value.shootDate) {
    uni.showToast({
      title: '请选择拍摄日期',
      icon: 'none'
    })
    return false
  }

  if (!formData.value.amount || formData.value.amount <= 0) {
    uni.showToast({
      title: '请输入有效的订单总额',
      icon: 'none'
    })
    return false
  }

  return true
}

/**
 * 关闭弹窗
 */
const handleClose = () => {
  emit('close')
}

/**
 * 提交表单
 */
const handleSubmit = () => {
  if (!validateForm()) {
    return
  }

  // 计算余额
  const paidAmount = parseFloat(formData.value.paidAmount) || 0
  const amount = parseFloat(formData.value.amount) || 0
  const balanceAmount = amount - paidAmount

  // 确定付款状态
  let paymentStatus = 'unpaid'
  const depositAmount = parseFloat(formData.value.depositAmount) || 0
  if (paidAmount >= amount) {
    paymentStatus = 'full'
  } else if (paidAmount >= depositAmount && depositAmount > 0) {
    paymentStatus = 'deposit'
  } else if (paidAmount > 0) {
    paymentStatus = 'partial'
  }

  // 确定订单状态
  let status = 'pending'
  if (isEdit.value && props.order) {
    status = props.order.status
  }

  const submitData = {
    ...formData.value,
    amount,
    paidAmount,
    depositAmount,
    balanceAmount,
    paymentStatus,
    status,
    clientId: `client_${Date.now()}`,
    clientAvatar: 'https://i.pravatar.cc/150?img=' + (Math.floor(Math.random() * 70) + 1)
  }

  emit('submit', submitData)
}
</script>

<style lang="scss" scoped>
.order-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
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
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* 顶部栏 */
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.05);
}

.close-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  transition: all 0.3s ease;

  &:active {
    background: rgba(255, 255, 255, 0.1);
  }
}

.close-icon {
  font-size: 32rpx;
  color: var(--lens-text-primary);
}

.header-title {
  font-size: 32rpx;
  color: var(--lens-text-primary);
  font-weight: 500;
}

.header-spacer {
  width: 48rpx;
}

/* 内容区域 */
.popup-content {
  flex: 1;
  padding: 32rpx;
  overflow-y: auto;
  padding-bottom: 120rpx;
}

.form-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 28rpx;
  color: var(--lens-text-primary);
  font-weight: 500;
  margin-bottom: 24rpx;
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.05);
}

.form-item {
  margin-bottom: 24rpx;
}

.form-item-row {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;

  .form-item {
    flex: 1;
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  font-size: 26rpx;
  color: var(--lens-text-secondary);
  margin-bottom: 12rpx;
}

.required {
  color: #F44336;
}

.form-input {
  width: 100%;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.05);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  font-size: 28rpx;
  color: var(--lens-text-primary);
  box-sizing: border-box;

  &:focus {
    border-color: var(--lens-accent);
    background: rgba(255, 255, 255, 0.08);
  }
}

.form-textarea {
  width: 100%;
  min-height: 120rpx;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.05);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  font-size: 28rpx;
  color: var(--lens-text-primary);
  box-sizing: border-box;
}

.picker-value {
  width: 100%;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.05);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  font-size: 28rpx;
  color: var(--lens-text-primary);
  box-sizing: border-box;

  &:empty::before {
    content: attr(placeholder);
    color: var(--lens-text-muted);
  }
}

.input-placeholder {
  color: var(--lens-text-muted);
}

/* 底部操作栏 */
.action-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
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
  border: none;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  color: var(--lens-text-primary);
}

.btn-submit {
  background: var(--lens-accent);
  color: #FFFFFF;
}
</style>
