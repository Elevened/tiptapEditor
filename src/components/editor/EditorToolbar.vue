/**
 * @file components/editor/EditorToolbar.vue
 * @description 编辑器工具栏组件
 * 
 * 这是富文本编辑器的工具栏，集成以下功能：
 * - 历史操作（撤销/重做）
 * - 文本样式（粗体、斜体、下划线、删除线、行内代码）
 * - 标题层级选择
 * - 文本对齐（左对齐、居中、右对齐、两端对齐）
 * - 列表类型（无序列表、有序列表、任务列表）
 * - 插入功能（链接、图片、表格、YouTube 视频、代码块）
 * - 高级功能（数学公式、画板、分页符、目录）
 * - 格式工具（高亮、颜色、引用、分割线、清除格式）
 * - 导入/导出 Markdown
 * - 主题切换（暗色/亮色）
 * 
 * 组件设计：
 * - 根据 EditorSettings 配置动态显示/隐藏功能组
 * - 使用下拉菜单组织相关功能
 * - 支持键盘快捷键提示
 * - 点击外部自动关闭下拉菜单
 */
 * @/
 */

<script setup lang="ts">
/**
 * 导入 Vue 核心 API
 */
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { Editor } from '@tiptap/core'

/**
 * 导入子组件和工具
 */
import ToolbarButton from './ToolbarButton.vue'
import IconifyIcon from '@/components/IconifyIcon.vue'
import { editorIcons } from '@/utils/icons'

/**
 * 导入类型定义
 */
import type { EditorSettings } from '@/types/editor'

/**
 * ==================== Props 定义 ====================
 */

/**
 * 组件 Props 接口
 * 定义工具栏接收的所有属性
 */
interface Props {
  /** Tiptap 编辑器实例，提供编辑功能 */
  editor: Editor | undefined
  /** 当前是否为暗色模式 */
  isDarkMode?: boolean
  /** 编辑器设置，控制各功能组的显示/隐藏 */
  settings?: EditorSettings
}

/**
 * 设置默认值
 * 确保即使不传 settings 也能正常工作
 */
const props = withDefaults(defineProps<Props>(), {
  isDarkMode: false,
  settings: () => ({
    showToolbar: true,
    showBubbleMenu: true,
    showFloatingMenu: true,
    showHistory: true,
    showInsert: true,
    showAdvanced: true,
    showFormat: true,
    showImportExport: true,
    editable: true,
    characterLimit: 10000,
  }),
})

/**
 * ==================== Emits 定义 ====================
 */

/**
 * 组件事件
 * - toggle-mode: 切换暗色/亮色模式
 * - import-markdown: 导入 Markdown 文件
 * - export-markdown: 导出 Markdown 文件
 */
const emit = defineEmits<{
  (e: 'toggle-mode'): void
  (e: 'import-markdown'): void
  (e: 'export-markdown'): void
}>()

/**
 * ==================== 图标映射 ====================
 */

/** 图标对象，从工具函数导入 */
const icons = editorIcons

/**
 * ==================== 下拉菜单状态 ====================
 */

/** 对齐下拉菜单显示状态 */
const showAlignDropdown = ref(false)
/** 列表下拉菜单显示状态 */
const showListDropdown = ref(false)
/** 更多功能下拉菜单显示状态 */
const showMoreDropdown = ref(false)

/**
 * 切换下拉菜单显示/隐藏
 * 同一时间只能打开一个下拉菜单
 * 
 * @param type - 下拉菜单类型：'align' | 'list' | 'more'
 */
const toggleDropdown = (type: string): void => {
  // 根据类型切换对应下拉菜单，并关闭其他下拉菜单
  switch (type) {
    case 'align':
      showAlignDropdown.value = !showAlignDropdown.value
      showListDropdown.value = false
      showMoreDropdown.value = false
      break
    case 'list':
      showListDropdown.value = !showListDropdown.value
      showAlignDropdown.value = false
      showMoreDropdown.value = false
      break
    case 'more':
      showMoreDropdown.value = !showMoreDropdown.value
      showAlignDropdown.value = false
      showListDropdown.value = false
      break
  }
}

/**
 * 关闭所有下拉菜单
 */
const closeAllDropdowns = (): void => {
  showAlignDropdown.value = false
  showListDropdown.value = false
  showMoreDropdown.value = false
}

/**
 * 点击外部关闭下拉菜单的事件处理器
 * 
 * @param e - MouseEvent 对象
 */
const handleClickOutside = (e: MouseEvent): void => {
  const target = e.target as HTMLElement
  // 如果点击的不是下拉菜单组内部，则关闭所有下拉菜单
  if (!target.closest('.dropdown-group')) {
    closeAllDropdowns()
  }
}

/**
 * 组件挂载时添加点击事件监听
 * 组件卸载时移除事件监听，防止内存泄漏
 */
onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})

/**
 * ==================== 计算属性 ====================
 */

/**
 * 当前标题层级
 * 根据编辑器当前选中内容返回对应的标题层级
 * 返回 '0' 表示正文，'1'-'6' 表示 H1-H6
 */
const currentHeading = computed(() => {
  if (!props.editor) return '0'
  
  // 遍历 H1-H6 检查哪个处于激活状态
  for (let i = 1; i <= 6; i++) {
    if (props.editor.isActive('heading', { level: i })) {
      return String(i)
    }
  }
  return '0'
})

/**
 * 当前对齐方式
 * 返回 'left' | 'center' | 'right' | 'justify'
 */
const currentAlign = computed(() => {
  if (!props.editor) return 'left'
  
  if (props.editor.isActive({ textAlign: 'center' })) return 'center'
  if (props.editor.isActive({ textAlign: 'right' })) return 'right'
  if (props.editor.isActive({ textAlign: 'justify' })) return 'justify'
  return 'left'
})

/**
 * 根据当前对齐方式返回对应的图标
 * 
 * @returns 图标名称字符串
 */
const getAlignIcon = (): string => {
  switch (currentAlign.value) {
    case 'center': return icons.alignCenter
    case 'right': return icons.alignRight
    case 'justify': return icons.alignJustify
    default: return icons.alignLeft
  }
}

/**
 * ==================== 操作方法 ====================

/**
 * 设置文本对齐方式
 * 
 * @param align - 对齐方式：'left' | 'center' | 'right' | 'justify'
 */
const setAlign = (align: string): void => {
  props.editor?.chain().focus().setTextAlign(align).run()
  closeAllDropdowns()
}

/**
 * 设置标题层级
 * 
 * @param event - Select 元素的 change 事件
 */
const setHeading = (event: Event): void => {
  const select = event.target as HTMLSelectElement
  const levelValue = parseInt(select.value)
  
  if (levelValue === 0) {
    // 设置为正文段落
    props.editor?.chain().focus().setParagraph().run()
  } else {
    // 设置为对应层级的标题
    const level = levelValue as 1 | 2 | 3 | 4 | 5 | 6
    props.editor?.chain().focus().toggleHeading({ level }).run()
  }
}

/**
 * 添加链接
 * 弹出对话框让用户输入链接地址
 * 如果输入空字符串则取消链接
 */
const addLink = (): void => {
  closeAllDropdowns()
  const previousUrl = props.editor?.getAttributes('link').href
  const url = window.prompt('链接地址', previousUrl)
  
  if (url === null) return
  
  if (url === '') {
    props.editor?.chain().focus().unsetLink().run()
  } else {
    props.editor?.chain().focus().setLink({ href: url }).run()
  }
}

/**
 * 插入图片
 * 弹出对话框让用户输入图片 URL
 */
const addImage = (): void => {
  closeAllDropdowns()
  const url = window.prompt('图片 URL')
  if (url) {
    props.editor?.chain().focus().setImage({ src: url }).run()
  }
}

/**
 * 插入表格
 * 默认插入 3x3 的表格，带表头
 */
const addTable = (): void => {
  closeAllDropdowns()
  props.editor?.chain().focus().insertTable({ 
    rows: 3, 
    cols: 3, 
    withHeaderRow: true 
  }).run()
}

/**
 * 插入 YouTube 视频
 * 弹出对话框让用户输入视频链接
 */
const addYoutube = (): void => {
  closeAllDropdowns()
  const url = window.prompt('YouTube 视频链接')
  if (url) {
    props.editor?.chain().focus().setYoutubeVideo({ src: url }).run()
  }
}

/**
 * 切换代码块
 */
const addCodeBlock = (): void => {
  closeAllDropdowns()
  props.editor?.chain().focus().toggleCodeBlock().run()
}

/**
 * 添加数学公式块
 * 弹出对话框让用户输入 LaTeX 公式
 */
const addMathBlock = (): void => {
  closeAllDropdowns()
  const formula = window.prompt('输入 LaTeX 公式（如：\\sum_{i=1}^n x_i）')
  if (formula) {
    props.editor?.chain().focus().setMathBlock(formula).run()
  }
}

/**
 * 添加画板
 * 在编辑器中插入一个画板节点
 */
const addDrawing = (): void => {
  closeAllDropdowns()
  props.editor?.chain().focus().setDrawing('').run()
}

/**
 * 添加分页符
 * 在打印或导出时会在此处分页
 */
const addPageBreak = (): void => {
  closeAllDropdowns()
  props.editor?.chain().focus().setPageBreak().run()
}

/**
 * 添加目录
 * 自动根据文档中的标题生成目录
 */
const addToc = (): void => {
  closeAllDropdowns()
  props.editor?.chain().focus().setToc().run()
}

/**
 * 清除所有格式
 * 移除所有标记和节点样式，恢复为纯文本
 */
const clearFormatting = (): void => {
  props.editor?.chain().focus().clearNodes().unsetAllMarks().run()
}
</script>

<template>
  <!-- 工具栏主容器 -->
  <div class="editor-toolbar">
    <!-- 历史操作组：撤销/重做 -->
    <div v-if="settings.showHistory" class="toolbar-group">
      <ToolbarButton
        @click="editor?.chain().focus().undo().run()"
        :disabled="!editor?.can().undo()"
        :icon="icons.undo"
        title="撤销"
        shortcut="Ctrl+Z"
      />
      <ToolbarButton
        @click="editor?.chain().focus().redo().run()"
        :disabled="!editor?.can().redo()"
        :icon="icons.redo"
        title="重做"
        shortcut="Ctrl+Y"
      />
    </div>

    <div v-if="settings.showHistory" class="toolbar-divider" />

    <!-- 标题层级选择器 -->
    <div class="toolbar-group">
      <select 
        class="toolbar-select" 
        @change="setHeading"
        :value="currentHeading"
      >
        <option value="0">正文</option>
        <option value="1">H1</option>
        <option value="2">H2</option>
        <option value="3">H3</option>
        <option value="4">H4</option>
        <option value="5">H5</option>
        <option value="6">H6</option>
      </select>
    </div>

    <div class="toolbar-divider" />

    <!-- 文本样式组 -->
    <div class="toolbar-group">
      <ToolbarButton
        @click="editor?.chain().focus().toggleBold().run()"
        :is-active="editor?.isActive('bold')"
        :icon="icons.bold"
        title="粗体"
        shortcut="Ctrl+B"
      />
      
      <ToolbarButton
        @click="editor?.chain().focus().toggleItalic().run()"
        :is-active="editor?.isActive('italic')"
        :icon="icons.italic"
        title="斜体"
        shortcut="Ctrl+I"
      />
      
      <ToolbarButton
        @click="editor?.chain().focus().toggleUnderline().run()"
        :is-active="editor?.isActive('underline')"
        :icon="icons.underline"
        title="下划线"
        shortcut="Ctrl+U"
      />
      
      <ToolbarButton
        @click="editor?.chain().focus().toggleStrike().run()"
        :is-active="editor?.isActive('strike')"
        :icon="icons.strikethrough"
        title="删除线"
        shortcut="Ctrl+Shift+S"
      />
      
      <ToolbarButton
        @click="editor?.chain().focus().toggleCode().run()"
        :is-active="editor?.isActive('code')"
        :icon="icons.code"
        title="行内代码"
        shortcut="Ctrl+E"
      />
    </div>

    <div class="toolbar-divider" />

    <!-- 对齐方式下拉 -->
    <div class="toolbar-group dropdown-group">
      <button 
        class="toolbar-btn dropdown-btn"
        @click="toggleDropdown('align')"
        :class="{ 'is-active': currentAlign !== 'left' }"
        title="对齐方式"
      >
        <IconifyIcon :icon="getAlignIcon()" :size="22" />
        <IconifyIcon icon="mdi:chevron-down" :size="16" class="dropdown-arrow" />
      </button>
      
      <!-- 对齐选项下拉菜单 -->
      <div v-if="showAlignDropdown" class="dropdown-menu">
        <button 
          class="dropdown-item"
          :class="{ 'is-active': editor?.isActive({ textAlign: 'left' }) }"
          @click="setAlign('left')"
        >
          <IconifyIcon :icon="icons.alignLeft" :size="20" />
          <span>左对齐</span>
        </button>
        
        <button 
          class="dropdown-item"
          :class="{ 'is-active': editor?.isActive({ textAlign: 'center' }) }"
          @click="setAlign('center')"
        >
          <IconifyIcon :icon="icons.alignCenter" :size="20" />
          <span>居中对齐</span>
        </button>
        
        <button 
          class="dropdown-item"
          :class="{ 'is-active': editor?.isActive({ textAlign: 'right' }) }"
          @click="setAlign('right')"
        >
          <IconifyIcon :icon="icons.alignRight" :size="20" />
          <span>右对齐</span>
        </button>
        
        <button 
          class="dropdown-item"
          :class="{ 'is-active': editor?.isActive({ textAlign: 'justify' }) }"
          @click="setAlign('justify')"
        >
          <IconifyIcon :icon="icons.alignJustify" :size="20" />
          <span>两端对齐</span>
        </button>
      </div>
    </div>

    <div class="toolbar-divider" />

    <!-- 列表类型下拉 -->
    <div class="toolbar-group dropdown-group">
      <button 
        class="toolbar-btn dropdown-btn"
        @click="toggleDropdown('list')"
        :class="{ 'is-active': editor?.isActive('bulletList') || editor?.isActive('orderedList') || editor?.isActive('taskList') }"
        title="列表"
      >
        <IconifyIcon :icon="icons.bulletList" :size="22" />
        <IconifyIcon icon="mdi:chevron-down" :size="16" class="dropdown-arrow" />
      </button>
      
      <!-- 列表选项下拉菜单 -->
      <div v-if="showListDropdown" class="dropdown-menu">
        <button 
          class="dropdown-item"
          :class="{ 'is-active': editor?.isActive('bulletList') }"
          @click="editor?.chain().focus().toggleBulletList().run()"
        >
          <IconifyIcon :icon="icons.bulletList" :size="20" />
          <span>无序列表</span>
        </button>
        
        <button 
          class="dropdown-item"
          :class="{ 'is-active': editor?.isActive('orderedList') }"
          @click="editor?.chain().focus().toggleOrderedList().run()"
        >
          <IconifyIcon :icon="icons.orderedList" :size="20" />
          <span>有序列表</span>
        </button>
        
        <button 
          class="dropdown-item"
          :class="{ 'is-active': editor?.isActive('taskList') }"
          @click="editor?.chain().focus().toggleTaskList().run()"
        >
          <IconifyIcon :icon="icons.taskList" :size="20" />
          <span>任务列表</span>
        </button>
      </div>
    </div>

    <div class="toolbar-divider" />

    <!-- 插入功能组 -->
    <div v-if="settings.showInsert" class="toolbar-group">
      <ToolbarButton
        @click="addLink"
        :is-active="editor?.isActive('link')"
        :icon="icons.link"
        title="插入链接"
        shortcut="Ctrl+K"
      />
      
      <ToolbarButton
        @click="addImage"
        :icon="icons.image"
        title="插入图片"
      />
      
      <ToolbarButton
        @click="addTable"
        :icon="icons.table"
        title="插入表格"
      />
      
      <ToolbarButton
        @click="addYoutube"
        :icon="icons.youtube"
        title="插入 YouTube"
      />
      
      <ToolbarButton
        @click="addCodeBlock"
        :is-active="editor?.isActive('codeBlock')"
        :icon="icons.codeBlock"
        title="代码块"
        shortcut="Ctrl+Alt+C"
      />
    </div>

    <div v-if="settings.showInsert" class="toolbar-divider" />

    <!-- 高级功能下拉 -->
    <div v-if="settings.showAdvanced" class="toolbar-group dropdown-group">
      <button 
        class="toolbar-btn dropdown-btn"
        @click="toggleDropdown('more')"
        title="更多功能"
      >
        <IconifyIcon icon="mdi:dots-horizontal" :size="22" />
      </button>
      
      <!-- 高级功能下拉菜单 -->
      <div v-if="showMoreDropdown" class="dropdown-menu">
        <button class="dropdown-item" @click="addMathBlock">
          <IconifyIcon :icon="icons.math" :size="20" />
          <span>数学公式</span>
        </button>
        
        <button class="dropdown-item" @click="addDrawing">
          <IconifyIcon :icon="icons.drawing" :size="20" />
          <span>画板</span>
        </button>
        
        <button class="dropdown-item" @click="addPageBreak">
          <IconifyIcon :icon="icons.pageBreak" :size="20" />
          <span>分页符</span>
        </button>
        
        <button class="dropdown-item" @click="addToc">
          <IconifyIcon :icon="icons.toc" :size="20" />
          <span>目录</span>
        </button>
      </div>
    </div>

    <div v-if="settings.showAdvanced" class="toolbar-divider" />

    <!-- 格式工具组 -->
    <div v-if="settings.showFormat" class="toolbar-group">
      <ToolbarButton
        @click="editor?.chain().focus().toggleHighlight().run()"
        :is-active="editor?.isActive('highlight')"
        :icon="icons.highlight"
        title="高亮"
        shortcut="Ctrl+Shift+H"
      />
      
      <!-- 文字颜色选择器 -->
      <div class="color-wrapper">
        <input
          type="color"
          class="color-picker"
          @input="(e) => editor?.chain().focus().setColor((e.target as HTMLInputElement).value).run()"
          :value="editor?.getAttributes('textStyle').color || '#000000'"
          title="文字颜色"
        />
      </div>
      
      <ToolbarButton
        @click="editor?.chain().focus().toggleBlockquote().run()"
        :is-active="editor?.isActive('blockquote')"
        :icon="icons.blockquote"
        title="引用"
        shortcut="Ctrl+Shift+B"
      />
      
      <ToolbarButton
        @click="editor?.chain().focus().setHorizontalRule().run()"
        :icon="icons.horizontalRule"
        title="分割线"
        shortcut="Ctrl+Alt+-"
      />
      
      <ToolbarButton
        @click="clearFormatting"
        :icon="icons.clearFormat"
        title="清除格式"
        shortcut="Ctrl+\\"
      />
    </div>

    <div v-if="settings.showFormat" class="toolbar-divider" />

    <!-- 导入导出组 -->
    <div v-if="settings.showImportExport" class="toolbar-group">
      <ToolbarButton
        @click="$emit('import-markdown')"
        :icon="icons.importFile"
        title="导入 Markdown"
      />
      
      <ToolbarButton
        @click="$emit('export-markdown')"
        :icon="icons.exportFile"
        title="导出 Markdown"
      />
    </div>

    <div v-if="settings.showImportExport" class="toolbar-divider" />

    <!-- 主题切换按钮（靠右显示） -->
    <div class="toolbar-group" style="margin-left: auto;">
      <ToolbarButton
        @click="$emit('toggle-mode')"
        :icon="isDarkMode ? icons.lightMode : icons.darkMode"
        :title="isDarkMode ? '切换到亮色模式' : '切换到暗色模式'"
      />
    </div>
  </div>
</template>

<style scoped>
/**
 * 工具栏主容器样式
 * 使用 flex 布局，允许换行
 */
.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #f6f8fa;
  border-bottom: 1px solid #e1e4e8;
  flex-wrap: wrap;
}

/**
 * 工具按钮组
 * 组内按钮间距 2px
 */
.toolbar-group {
  display: flex;
  gap: 2px;
  align-items: center;
}

/**
 * 分隔线
 * 用于分隔不同的功能组
 */
.toolbar-divider {
  width: 1px;
  height: 24px;
  background: #d0d7de;
  margin: 0 4px;
}

/**
 * 标题选择下拉框
 */
.toolbar-select {
  height: 32px;
  padding: 0 6px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: white;
  font-size: 13px;
  cursor: pointer;
  outline: none;
}

.toolbar-select:focus {
  border-color: #0969da;
  box-shadow: 0 0 0 2px rgba(9, 105, 218, 0.1);
}

/**
 * 下拉菜单组
 * position: relative 用于定位下拉菜单
 */
.dropdown-group {
  position: relative;
}

/**
 * 通用工具按钮样式
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

.toolbar-btn:hover:not(:disabled) {
  background: #eaecef;
  border-color: #d0d7de;
  color: #24292f;
}

/**
 * 按钮激活状态
 * 表示当前格式已应用
 */
.toolbar-btn.is-active {
  background: #ddf4ff;
  border-color: #54aeff;
  color: #0969da;
}

/**
 * 下拉按钮特殊样式
 * 带有下拉箭头图标
 */
.dropdown-btn {
  display: flex;
  gap: 2px;
  padding: 0 4px;
}

.dropdown-arrow {
  opacity: 0.6;
}

/**
 * 下拉菜单面板
 * 绝对定位，显示在按钮下方
 */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 4px;
  min-width: 140px;
  z-index: 100;
  border: 1px solid #e1e4e8;
}

/**
 * 下拉菜单项
 */
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: #24292f;
  text-align: left;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.dropdown-item.is-active {
  background: #ddf4ff;
  color: #0969da;
}

/**
 * 颜色选择器容器
 */
.color-wrapper {
  display: flex;
  align-items: center;
}

/**
 * 颜色选择器输入框
 * 自定义样式覆盖浏览器默认样式
 */
.color-picker {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid #d0d7de;
  border-radius: 4px;
  cursor: pointer;
  background: none;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 2px;
}

.color-picker::-webkit-color-swatch {
  border-radius: 3px;
  border: none;
}
</style>
