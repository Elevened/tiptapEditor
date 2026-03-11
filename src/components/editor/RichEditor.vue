/**
 * @file components/editor/RichEditor.vue
 * @description 富文本编辑器主组件
 * 
 * 这是 Tiptap 富文本编辑器的核心包装组件，集成以下功能：
 * - 完整的工具栏（格式化、插入、对齐等）
 * - 气泡菜单（选中文字时显示）
 * - 浮动菜单（空行时输入 "/" 显示）
 * - 设置面板（B+U+G 快捷键打开）
 * - Markdown 导入/导出
 * - 节点拖拽排序
 * - 暗色/亮色主题切换
 * 
 * 架构设计：
 * - 使用 composables 分离业务逻辑（useEditorConfig, useMarkdown, useEditorSettings）
 * - 单一职责：每个子组件负责特定功能
 * - 配置驱动：通过 EditorSettings 接口控制所有功能开关
 */

<script setup lang="ts">
/**
 * 导入 Vue 核心 API
 */
import { ref, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import { useMagicKeys, whenever } from '@vueuse/core'

/**
 * 导入组件
 */
import EditorToolbar from './EditorToolbar.vue'
import BubbleMenuContent from './BubbleMenuContent.vue'
import EditorStatusBar from './EditorStatusBar.vue'
import SettingsDrawer from './SettingsDrawer.vue'
import SlashMenu from './SlashMenu.vue'
import IconifyIcon from '@/components/IconifyIcon.vue'

/**
 * 导入自定义 composables
 * 这些 composables 封装了可复用的业务逻辑
 */
import { useEditorSettings } from '@/composables/useEditorSettings'
import { useMarkdown } from '@/composables/useMarkdown'
import {
  createEditorExtensions,
  createDebouncedUpdate,
  createEditorEventHandlers,
} from '@/composables/useEditorConfig'

/**
 * 导入类型定义
 * 类型与实现分离，提高代码可维护性
 */
import type { RichEditorProps, RichEditorEmits } from '@/types/editor'

/**
 * 组件 Props 定义
 * 使用接口定义，确保类型安全
 */
const props = withDefaults(defineProps<RichEditorProps>(), {
  /** 默认内容 */
  modelValue: '<p>Hello World! 欢迎使用 Tiptap 富文本编辑器。</p>',
  /** 默认占位符 */
  placeholder: '请输入内容...',
  /** 默认字符限制 */
  characterLimit: 10000,
  /** 默认可编辑 */
  editable: true,
})

/**
 * 组件事件定义
 * - update:modelValue: 内容更新事件，用于 v-model
 * - update: 编辑器实例更新事件
 */
const emit = defineEmits<RichEditorEmits>()

/**
 * ==================== 响应式状态 ====================
 */

/** 设置抽屉显示状态 */
const showSettings = ref(false)
/** 暗色模式状态 */
const isDarkMode = ref(false)
/** 快捷键提示显示状态 */
const showShortcutHint = ref(false)
/** Slash 菜单显示状态 */
const showSlashMenu = ref(false)

/**
 * ==================== Editor 实例创建 ====================
 */

/**
 * 使用 useEditorSettings composable 管理设置
 * 设置会自动持久化到 localStorage
 */
const { settings, updateSettings } = useEditorSettings(undefined, {
  characterLimit: props.characterLimit,
  editable: props.editable,
})

/**
 * 创建防抖更新函数
 * 避免频繁输入时触发更新，性能优化
 * 延迟 300ms
 */
const debouncedUpdate = createDebouncedUpdate(emit, 300)

/**
 * 创建键盘事件处理器
 * 处理 Slash 菜单打开/关闭逻辑
 */
const eventHandlers = createEditorEventHandlers({
  onSlashMenuOpen: () => {
    showSlashMenu.value = true
  },
  onSlashMenuClose: () => {
    showSlashMenu.value = false
  },
  isSlashMenuOpen: () => showSlashMenu.value,
})

/**
 * Tiptap 编辑器实例
 * 这是核心编辑器对象，提供所有编辑功能
 * 
 * 配置说明：
 * - content: 初始内容，从 props.modelValue 读取
 * - extensions: 所有扩展插件（官方 + 自定义）
 * - editable: 是否可编辑
 * - autofocus: 自动聚焦到末尾
 * - injectCSS: 禁用默认 CSS 注入，使用自定义样式
 * - onUpdate: 内容更新回调（防抖处理）
 * - editorProps.handleKeyDown: 自定义键盘事件处理
 */
const editor = useEditor({
  content: props.modelValue,
  extensions: createEditorExtensions({
    placeholder: props.placeholder,
    characterLimit: settings.value.characterLimit,
  }),
  editable: props.editable,
  autofocus: 'end',
  injectCSS: false,
  onUpdate: debouncedUpdate,
  onFocus: () => {
    console.log('编辑器获得焦点')
  },
  onBlur: () => {
    console.log('编辑器失去焦点')
  },
  editorProps: {
    handleKeyDown: eventHandlers.handleKeyDown,
  },
})

/**
 * 使用 Markdown composable
 * 提供导入/导出功能
 */
const { importMarkdown, exportMarkdown } = useMarkdown(editor.value)

/**
 * ==================== 键盘快捷键 ====================
 */

/**
 * 使用 VueUse 的 useMagicKeys 监听组合键
 * 监听 B+U+G 组合键打开设置抽屉
 */
const { B, U, G } = useMagicKeys()

/**
 * 当 B、U、G 三个键同时按下时触发
 * 显示设置抽屉和快捷键提示
 */
whenever(() => B?.value && U?.value && G?.value, () => {
  showSettings.value = true
  showShortcutHint.value = true
  // 1.5 秒后自动隐藏提示
  setTimeout(() => {
    showShortcutHint.value = false
  }, 1500)
})

/**
 * ==================== 方法定义 ====================

/**
 * 切换暗色/亮色模式
 * 切换后会应用到整个编辑器容器
 */
const toggleDarkMode = (): void => {
  isDarkMode.value = !isDarkMode.value
}

/**
 * 处理设置变更
 * 当用户在设置抽屉中修改设置时调用
 * 
 * @param newSettings - 新的设置对象
 */
const onSettingsChange = (newSettings: typeof settings.value): void => {
  const oldLimit = settings.value.characterLimit
  updateSettings(newSettings)

  // 如果字符限制改变，记录日志提醒
  // 注意：CharacterCount 扩展的限制在创建时设置，动态更新需要重新创建编辑器
  if (oldLimit !== newSettings.characterLimit) {
    console.log(`字符限制已更新: ${oldLimit} -> ${newSettings.characterLimit}`)
    console.log('注意：新限制将在下次加载编辑器时完全生效')
  }
}

/**
 * 暴露给父组件的方法
 * 父组件可以通过 ref 访问这些方法
 */
defineExpose({
  /** 获取编辑器实例 */
  editor,
  /** 获取 HTML 内容 */
  getHTML: () => editor.value?.getHTML(),
  /** 获取 JSON 结构 */
  getJSON: () => editor.value?.getJSON(),
  /** 获取纯文本 */
  getText: () => editor.value?.getText(),
  /** 清空内容 */
  clearContent: () => editor.value?.commands.clearContent(),
  /** 设置内容 */
  setContent: (content: string) => editor.value?.commands.setContent(content),
  /** 打开设置抽屉 */
  openSettings: () => {
    showSettings.value = true
  },
  /** 导入 Markdown 文件 */
  importMarkdown,
  /** 导出 Markdown 文件 */
  exportMarkdown,
})

/**
 * 组件销毁时清理资源
 * 防止内存泄漏
 */
onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <!-- 
    编辑器主容器
    :class 动态绑定暗色模式类名
  -->
  <div class="rich-editor" :class="{ 'dark-mode': isDarkMode }">
    <!-- 设置抽屉组件 -->
    <SettingsDrawer
      v-model:visible="showSettings"
      v-model:settings="settings"
      @update:settings="onSettingsChange"
    />

    <!-- 
      工具栏组件
      v-if 根据设置控制显示/隐藏
      @toggle-mode 切换主题事件
      @import-markdown 导入事件
      @export-markdown 导出事件
    -->
    <EditorToolbar
      v-if="settings.showToolbar"
      :editor="editor"
      :is-dark-mode="isDarkMode"
      :settings="settings"
      @toggle-mode="toggleDarkMode"
      @import-markdown="importMarkdown"
      @export-markdown="exportMarkdown"
    />

    <!-- 
      气泡菜单
      选中文字时显示的浮动工具栏
      v-if 根据设置和编辑器实例控制显示
    -->
    <BubbleMenu
      v-if="editor && settings.showBubbleMenu"
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      class="bubble-menu-wrapper"
    >
      <BubbleMenuContent :editor="editor" />
    </BubbleMenu>

    <!-- 编辑器内容区域 -->
    <div class="editor-container">
      <EditorContent :editor="editor" class="editor-content" />

      <!-- 
        Slash 菜单
        输入 "/" 时显示的命令菜单
        v-if 根据设置和编辑器实例控制显示
      -->
      <SlashMenu
        v-if="editor && settings.showFloatingMenu"
        :editor="editor"
        v-model:visible="showSlashMenu"
      />
    </div>

    <!-- 
      状态栏组件
      显示字符数、字数、当前节点类型等信息
    -->
    <EditorStatusBar
      :editor="editor"
      :character-limit="settings.characterLimit"
    />

    <!-- 
      快捷键提示
      按下 B+U+G 时显示的提示
      v-if 控制显示/隐藏
    -->
    <Transition name="toast">
      <div v-if="showShortcutHint" class="shortcut-toast">
        <span class="key">B</span>
        <span class="key">U</span>
        <span class="key">G</span>
        <span>打开设置</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/**
 * 编辑器主容器样式
 */
.rich-editor {
  border: 1px solid #e1e4e8;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  transition: all 0.3s ease;
  position: relative;
}

/**
 * 暗色模式样式
 */
.rich-editor.dark-mode {
  background: #0d1117;
  border-color: #30363d;
}

/**
 * 编辑器内容区域容器
 */
.editor-container {
  position: relative;
  min-height: 400px;
}

/**
 * 编辑器内容样式
 * :deep 穿透 scoped，影响 ProseMirror 内部元素
 */
.editor-content :deep(.ProseMirror) {
  outline: none;
  min-height: 400px;
  padding: 24px;
  line-height: 1.8;
  color: #24292f;
}

.rich-editor.dark-mode .editor-content :deep(.ProseMirror) {
  color: #c9d1d9;
}

/**
 * 气泡菜单和浮动菜单包装器
 */
.bubble-menu-wrapper,
.floating-menu-wrapper {
  display: flex;
}

/**
 * 快捷键提示样式
 * fixed 定位在屏幕底部中央
 */
.shortcut-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #24292f;
  color: white;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/**
 * 快捷键提示动画
 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/**
 * 按键样式
 * 用于显示 B、U、G 等按键
 */
.shortcut-toast .key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}
</style>
