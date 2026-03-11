/**
 * @file components/editor/index.ts
 * @description 编辑器组件统一导出
 * 
 * 这个文件集中导出所有编辑器相关的组件，便于其他模块导入。
 * 采用 Barrel export 模式简化导入路径。
 * 
 * @example
 * import { RichEditor, EditorToolbar, SettingsDrawer } from '@/components/editor'
 */

// 主编辑器组件
export { default as RichEditor } from './RichEditor.vue'

// 工具栏组件
export { default as EditorToolbar } from './EditorToolbar.vue'

// 工具栏按钮组件
export { default as ToolbarButton } from './ToolbarButton.vue'

// 状态栏组件
export { default as EditorStatusBar } from './EditorStatusBar.vue'

// 设置抽屉组件
export { default as SettingsDrawer } from './SettingsDrawer.vue'

// 气泡菜单内容组件
export { default as BubbleMenuContent } from './BubbleMenuContent.vue'

// 浮动菜单内容组件
export { default as FloatingMenuContent } from './FloatingMenuContent.vue'

// Slash 菜单组件
export { default as SlashMenu } from './SlashMenu.vue'
