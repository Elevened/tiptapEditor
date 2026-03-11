/**
 * @file types/index.ts
 * @description TypeScript 类型统一导出
 * 
 * 集中导出所有 TypeScript 类型定义
 * 
 * @example
 * import type { EditorSettings, RichEditorProps } from '@/types'
 */

export type {
  EditorSettings,
  RichEditorProps,
  RichEditorEmits,
  ToolbarButtonConfig,
  ToolbarGroupConfig,
  SlashMenuItem,
  MarkdownFile,
  EditorExtensionsOptions,
  DragState,
  EditorStats,
} from './editor'
