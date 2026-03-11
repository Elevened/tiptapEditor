/**
 * @file types/editor.ts
 * @description 编辑器相关的 TypeScript 类型定义
 * 
 * 这个文件集中管理所有编辑器相关的类型定义，包括：
 * - 编辑器设置接口
 * - 编辑器组件 Props 类型
 * - 编辑器事件类型
 * - 工具项类型
 * 
 * 遵循单一职责原则：类型定义与实现分离
 */

/**
 * 编辑器设置配置接口
 * 用于控制编辑器各项功能的显示和启用状态
 */
export interface EditorSettings {
  /** 是否显示工具栏 */
  showToolbar: boolean
  /** 是否显示气泡菜单（选中文字时的浮动工具栏） */
  showBubbleMenu: boolean
  /** 是否显示浮动菜单（空行时的快捷菜单） */
  showFloatingMenu: boolean
  /** 是否显示历史操作按钮（撤销/重做） */
  showHistory: boolean
  /** 是否显示插入功能按钮（链接、图片、表格等） */
  showInsert: boolean
  /** 是否显示高级功能按钮（公式、画板等） */
  showAdvanced: boolean
  /** 是否显示格式工具按钮（高亮、颜色等） */
  showFormat: boolean
  /** 是否显示导入/导出按钮 */
  showImportExport: boolean
  /** 编辑器是否可编辑 */
  editable: boolean
  /** 字符限制数量 */
  characterLimit: number
}

/**
 * 富文本编辑器组件 Props 接口
 * 定义了 RichEditor 组件接收的所有属性
 */
export interface RichEditorProps {
  /** 编辑器内容（v-model 绑定值） */
  modelValue?: string
  /** 占位符文本，当编辑器为空时显示 */
  placeholder?: string
  /** 字符限制，默认为 10000 */
  characterLimit?: number
  /** 是否可编辑，默认为 true */
  editable?: boolean
}

/**
 * 富文本编辑器组件事件接口
 * 定义了 RichEditor 组件触发的所有事件
 */
export interface RichEditorEmits {
  /** 内容更新事件，用于 v-model 双向绑定 */
  (e: 'update:modelValue', value: string): void
  /** 编辑器实例更新事件，返回当前编辑器实例 */
  (e: 'update', editor: any): void
}

/**
 * 工具栏按钮配置接口
 * 用于定义工具栏中的按钮项
 */
export interface ToolbarButtonConfig {
  /** 按钮唯一标识 */
  name: string
  /** 按钮标题（用于 tooltip 显示） */
  title: string
  /** 按钮图标名称 */
  icon: string
  /** 快捷键提示 */
  shortcut?: string
  /** 点击事件处理函数 */
  action: () => void
  /** 是否处于激活状态 */
  isActive?: boolean
  /** 是否禁用 */
  disabled?: boolean
}

/**
 * 工具栏分组配置接口
 * 用于将相关功能按钮分组显示
 */
export interface ToolbarGroupConfig {
  /** 分组名称 */
  name: string
  /** 是否在设置中可控制显示/隐藏 */
  settingsKey?: keyof EditorSettings
  /** 分组中的按钮配置 */
  buttons: ToolbarButtonConfig[]
}

/**
 * Slash 菜单项接口
 * 用于 "/" 命令菜单中的选项
 */
export interface SlashMenuItem {
  /** 菜单项名称 */
  name: string
  /** 显示标题 */
  title: string
  /** 快捷键说明 */
  shortcut: string
  /** 图标名称 */
  icon: string
  /** 执行的操作 */
  action: () => void
}

/**
 * Markdown 文件接口
 * 用于导入/导出 Markdown 文件
 */
export interface MarkdownFile {
  /** 文件名 */
  name: string
  /** 文件内容 */
  content: string
}

/**
 * 编辑器扩展配置选项接口
 * 用于 createExtensions 函数
 */
export interface EditorExtensionsOptions {
  /** 占位符文本 */
  placeholder?: string
  /** 字符限制数量 */
  characterLimit?: number
  /** 是否启用协作编辑 */
  enableCollaboration?: boolean
}

/**
 * 编辑器拖拽状态接口
 * 用于跟踪拖拽操作状态
 */
export interface DragState {
  /** 是否正在拖拽 */
  isDragging: boolean
  /** 拖拽源位置 */
  sourcePos: number | null
  /** 拖拽目标位置 */
  targetPos: number | null
}

/**
 * 编辑器统计信息接口
 * 用于状态栏显示
 */
export interface EditorStats {
  /** 字符数 */
  characters: number
  /** 单词数（中文为字数） */
  words: number
  /** 当前节点类型名称 */
  currentNode: string
  /** 最后保存时间 */
  lastSaved?: string
}
