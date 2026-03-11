/**
 * @file components/editor/SettingsDrawer.vue
 * @description 编辑器设置抽屉组件
 * 
 * 这是一个侧边滑出式设置面板，包含以下功能：
 * - 显示设置：控制工具栏、气泡菜单、浮动菜单的显示/隐藏
 * - 功能设置：控制各功能组的启用状态
 * - 编辑器设置：可编辑状态、字符限制
 * - 快捷键提示：显示 B+U+G 快捷键
 * 
 * 组件特性：
 * - 使用 v-model 双向绑定 visible 和 settings
 * - 支持遮罩层点击关闭
 * - 支持滑入/滑出动画
 * - 支持暗色模式
 */

<script setup lang="ts">
/**
 * 导入子组件
 */
import IconifyIcon from '../IconifyIcon.vue'

/**
 * 导入类型定义
 * 从 types/editor.ts 导入共享的类型定义
 */
import type { EditorSettings } from '@/types/editor'

/**
 * ==================== Props 定义 ====================
 */

/**
 * 组件 Props 接口
 */
interface Props {
  /** 抽屉是否可见 */
  visible: boolean
  /** 当前编辑器设置 */
  settings: EditorSettings
}

const props = defineProps<Props>()

/**
 * ==================== Emits 定义 ====================
 */

/**
 * 组件事件
 * - update:visible: 抽屉显示状态变更
 * - update:settings: 设置项变更
 */
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'update:settings', settings: EditorSettings): void
}>()

/**
 * ==================== 方法定义 ====================

/**
 * 更新布尔类型的设置项
 * 用于复选框类型的设置
 * 
 * @param key - 设置项键名
 * @param value - 新的布尔值
 */
const updateSetting = (key: keyof EditorSettings, value: boolean): void => {
  emit('update:settings', {
    ...props.settings,
    [key]: value,
  })
}

/**
 * 更新数值类型的设置项
 * 用于字符限制等数值输入
 * 
 * @param key - 设置项键名
 * @param event - Input 元素的 change 事件
 */
const updateNumberSetting = (key: keyof EditorSettings, event: Event): void => {
  const input = event.target as HTMLInputElement
  const value = parseInt(input.value, 10)
  
  // 验证输入值
  if (!isNaN(value) && value >= 100) {
    emit('update:settings', {
      ...props.settings,
      [key]: value,
    })
  }
}

/**
 * 关闭抽屉
 * 触发 update:visible 事件
 */
const closeDrawer = (): void => {
  emit('update:visible', false)
}
</script>

<template>
  <!-- 
    遮罩层
    点击时关闭抽屉
  -->
  <Transition name="fade">
    <div 
      v-if="visible" 
      class="drawer-overlay"
      @click="closeDrawer"
    />
  </Transition>

  <!-- 抽屉主体 -->
  <Transition name="drawer">
    <div v-if="visible" class="settings-drawer">
      <!-- 抽屉头部：标题和关闭按钮 -->
      <div class="drawer-header">
        <h3>设置</h3>
        <button class="close-btn" @click="closeDrawer">
          <IconifyIcon icon="mdi:close" :size="20" />
        </button>
      </div>

      <!-- 抽屉内容区 -->
      <div class="drawer-content">
        <!-- 快捷键提示区 -->
        <div class="setting-section">
          <h4>快捷键</h4>
          <div class="shortcut-hint">
            <span class="key">B</span>
            <span class="key">U</span>
            <span class="key">G</span>
            <span class="desc">打开设置</span>
          </div>
        </div>

        <!-- 显示设置区 -->
        <div class="setting-section">
          <h4>显示设置</h4>
          
          <label class="setting-item">
            <input 
              type="checkbox" 
              :checked="settings.showToolbar"
              @change="updateSetting('showToolbar', !settings.showToolbar)"
            />
            <span>显示工具栏</span>
          </label>

          <label class="setting-item">
            <input 
              type="checkbox" 
              :checked="settings.showBubbleMenu"
              @change="updateSetting('showBubbleMenu', !settings.showBubbleMenu)"
            />
            <span>显示气泡菜单</span>
          </label>

          <label class="setting-item">
            <input 
              type="checkbox" 
              :checked="settings.showFloatingMenu"
              @change="updateSetting('showFloatingMenu', !settings.showFloatingMenu)"
            />
            <span>显示浮动菜单</span>
          </label>
        </div>

        <!-- 功能设置区 -->
        <div class="setting-section">
          <h4>功能设置</h4>
          
          <label class="setting-item">
            <input 
              type="checkbox" 
              :checked="settings.showHistory"
              @change="updateSetting('showHistory', !settings.showHistory)"
            />
            <span>撤销/重做</span>
          </label>

          <label class="setting-item">
            <input 
              type="checkbox" 
              :checked="settings.showInsert"
              @change="updateSetting('showInsert', !settings.showInsert)"
            />
            <span>插入功能（链接、图片、表格等）</span>
          </label>

          <label class="setting-item">
            <input 
              type="checkbox" 
              :checked="settings.showAdvanced"
              @change="updateSetting('showAdvanced', !settings.showAdvanced)"
            />
            <span>高级功能（公式、画板等）</span>
          </label>

          <label class="setting-item">
            <input 
              type="checkbox" 
              :checked="settings.showFormat"
              @change="updateSetting('showFormat', !settings.showFormat)"
            />
            <span>格式工具（高亮、颜色等）</span>
          </label>

          <label class="setting-item">
            <input 
              type="checkbox" 
              :checked="settings.showImportExport"
              @change="updateSetting('showImportExport', !settings.showImportExport)"
            />
            <span>导入/导出 Markdown</span>
          </label>
        </div>

        <!-- 编辑器设置区 -->
        <div class="setting-section">
          <h4>编辑器</h4>
          
          <label class="setting-item">
            <input 
              type="checkbox" 
              :checked="settings.editable"
              @change="updateSetting('editable', !settings.editable)"
            />
            <span>可编辑</span>
          </label>

          <!-- 字符限制数值输入 -->
          <div class="setting-item number-item">
            <span>字符限制</span>
            <input 
              type="number" 
              class="number-input"
              :value="settings.characterLimit"
              @change="updateNumberSetting('characterLimit', $event)"
              min="100"
              max="100000"
              step="100"
            />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/**
 * 遮罩层样式
 */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 998;
}

/**
 * 抽屉主体样式
 * 固定定位，从左侧滑入
 */
.settings-drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  height: 100vh;
  background: white;
  z-index: 999;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

/**
 * 遮罩层淡入淡出动画
 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/**
 * 抽屉滑入滑出动画
 */
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}

/**
 * 抽屉头部样式
 */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e1e4e8;
}

.drawer-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #24292f;
}

/**
 * 关闭按钮样式
 */
.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #656d76;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #24292f;
}

/**
 * 抽屉内容区
 * flex: 1 占据剩余空间
 * overflow-y: auto 允许垂直滚动
 */
.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

/**
 * 设置分组区域
 */
.setting-section {
  margin-bottom: 24px;
}

.setting-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #656d76;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/**
 * 快捷键提示样式
 */
.shortcut-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px;
  background: #f6f8fa;
  border-radius: 8px;
}

.shortcut-hint .key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: white;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #24292f;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.shortcut-hint .desc {
  margin-left: 8px;
  font-size: 14px;
  color: #656d76;
}

/**
 * 设置项样式（复选框）
 */
.setting-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  cursor: pointer;
  font-size: 14px;
  color: #24292f;
  transition: color 0.2s;
}

.setting-item:hover {
  color: #0969da;
}

.setting-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #0969da;
}

/**
 * 数值输入项特殊样式
 * justify-content: space-between 使标签和输入框分居两侧
 */
.number-item {
  justify-content: space-between;
}

.number-input {
  width: 80px;
  padding: 6px 10px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-size: 14px;
  text-align: right;
}

.number-input:focus {
  outline: none;
  border-color: #0969da;
  box-shadow: 0 0 0 2px rgba(9, 105, 218, 0.1);
}

/* ==================== 暗色模式适配 ==================== */

:global(.dark-mode) .settings-drawer {
  background: #0d1117;
  border-right-color: #30363d;
}

:global(.dark-mode) .drawer-header {
  border-bottom-color: #30363d;
}

:global(.dark-mode) .drawer-header h3,
:global(.dark-mode) .setting-item {
  color: #c9d1d9;
}

:global(.dark-mode) .setting-section h4 {
  color: #8b949e;
}

:global(.dark-mode) .shortcut-hint {
  background: #161b22;
}

:global(.dark-mode) .shortcut-hint .key {
  background: #21262d;
  border-color: #30363d;
  color: #c9d1d9;
}

:global(.dark-mode) .close-btn {
  color: #8b949e;
}

:global(.dark-mode) .close-btn:hover {
  background: #21262d;
  color: #c9d1d9;
}

:global(.dark-mode) .number-input {
  background: #0d1117;
  border-color: #30363d;
  color: #c9d1d9;
}

:global(.dark-mode) .number-input:focus {
  border-color: #58a6ff;
  box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.1);
}
</style>
