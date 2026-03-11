/**
 * @file components/editor/ToolbarButton.vue
 * @description 工具栏按钮组件
 * 
 * 这是一个可复用的工具栏按钮组件，特性包括：
 * - 支持图标显示（使用 Iconify）
 * - 支持 Tooltip 提示（显示标题和快捷键）
 * - 支持激活状态（表示当前格式已应用）
 * - 支持禁用状态
 * - 支持小尺寸变体
 * 
 * 组件设计：
 * - 纯展示组件，不包含业务逻辑
 * - 通过 Props 接收所有配置
 * - 通过 emit 通知父组件点击事件
 */

<script setup lang="ts">
/**
 * 导入子组件
 */
import IconifyIcon from '../IconifyIcon.vue'
import Tooltip from '../Tooltip.vue'

/**
 * ==================== Props 定义 ====================
 */

/**
 * 组件 Props 接口
 * 所有属性都是可选的，提供灵活的用法
 */
interface Props {
  /** 
   * 是否处于激活状态
   * 用于表示当前格式已应用到选中文本
   */
  isActive?: boolean
  /** 是否禁用按钮 */
  disabled?: boolean
  /** 是否使用小尺寸 */
  small?: boolean
  /** 图标名称（Iconify 格式） */
  icon?: string
  /** 按钮标题（用于 Tooltip 显示） */
  title?: string
  /** 快捷键提示（用于 Tooltip 显示） */
  shortcut?: string
}

defineProps<Props>()

/**
 * ==================== Emits 定义 ====================
 */

/**
 * 点击事件
 * 当用户点击按钮时触发
 */
defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <!-- 
    使用 Tooltip 包装按钮
    显示按钮标题和快捷键
  -->
  <Tooltip 
    :content="title || ''" 
    :shortcut="shortcut" 
    position="top"
  >
    <button
      type="button"
      class="toolbar-btn"
      :class="{ 
        'is-active': isActive, 
        'is-disabled': disabled, 
        'small': small 
      }"
      :disabled="disabled"
      @click="$emit('click')"
    >
      <!-- 图标显示 -->
      <IconifyIcon 
        v-if="icon" 
        :icon="icon" 
        :size="small ? 16 : 22"
      />
      <!-- 插槽内容（当不传 icon 时使用） -->
      <slot v-else />
    </button>
  </Tooltip>
</template>

<style scoped>
/**
 * 按钮基础样式
 */
.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #656d76;
}

/**
 * 悬停效果（非禁用状态）
 */
.toolbar-btn:hover:not(:disabled) {
  background: #eaecef;
  border-color: #d0d7de;
  color: #24292f;
}

/**
 * 激活状态样式
 * 表示当前格式已应用到选中文本
 */
.toolbar-btn.is-active {
  background: #ddf4ff;
  border-color: #54aeff;
  color: #0969da;
}

/**
 * 禁用状态样式
 */
.toolbar-btn.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/**
 * 小尺寸变体
 */
.toolbar-btn.small {
  width: 24px;
  height: 24px;
}
</style>
