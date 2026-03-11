/**
 * @file composables/useEditorConfig.ts
 * @description 编辑器配置管理组合式函数
 * 
 * 这个 composable 集中管理编辑器的所有配置逻辑，包括：
 * - 默认配置生成
 * - 扩展配置创建
 * - 编辑器实例配置
 * 
 * 遵循关注点分离原则：配置逻辑与 UI 逻辑分离
 */

import { computed } from 'vue'
import type { Extensions } from '@tiptap/core'
import { useEditor } from '@tiptap/vue-3'
import { debounce } from 'lodash-es'
import type { Editor } from '@tiptap/core'

// 导入扩展配置
import { createExtensions } from '@/extensions'
import { Video, Iframe, FontSize, MathInline, MathBlock, Drawing, PageBreak, Toc } from '@/extensions/custom'

// 导入类型
import type { EditorExtensionsOptions, EditorSettings } from '@/types/editor'

/**
 * 创建编辑器扩展配置的工厂函数
 * 
 * @param options - 扩展配置选项
 * @returns Extensions 数组
 * 
 * @example
 * const extensions = createEditorExtensions({
 *   placeholder: '请输入内容...',
 *   characterLimit: 10000
 * })
 */
export function createEditorExtensions(options: EditorExtensionsOptions): Extensions {
  const { placeholder = '请输入内容...', characterLimit = 10000 } = options

  return [
    // 官方扩展配置
    ...createExtensions({ placeholder, characterLimit }),
    // 自定义扩展
    Video,
    Iframe,
    FontSize,
    MathInline,
    MathBlock,
    Drawing,
    PageBreak,
    Toc,
  ]
}

/**
 * 创建防抖更新函数
 * 避免频繁触发内容更新事件
 * 
 * @param emit - Vue emit 函数
 * @param delay - 防抖延迟时间（毫秒），默认 300ms
 * @returns 防抖处理后的更新函数
 */
export function createDebouncedUpdate(
  emit: (event: 'update:modelValue' | 'update', ...args: any[]) => void,
  delay: number = 300
) {
  return debounce(({ editor }: { editor: Editor }) => {
    const html = editor.getHTML()
    emit('update:modelValue', html)
    emit('update', editor)
  }, delay)
}

/**
 * 默认编辑器设置
 * 提供所有设置的默认值
 */
export const defaultEditorSettings: EditorSettings = {
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
}

/**
 * 使用编辑器配置的 Composable
 * 
 * @param settings - 当前编辑器设置
 * @returns 配置相关的计算属性和方法
 */
export function useEditorConfig(settings: EditorSettings) {
  /**
   * 根据设置动态生成扩展配置
   * 当 characterLimit 改变时自动更新
   */
  const extensions = computed<Extensions>(() =>
    createEditorExtensions({
      placeholder: settings.placeholder || '请输入内容...',
      characterLimit: settings.characterLimit,
    })
  )

  return {
    extensions,
  }
}

/**
 * 编辑器键盘快捷键配置
 * 定义所有自定义键盘快捷键
 */
export const editorKeyboardShortcuts = {
  /**
   * 打开设置抽屉
   * 组合键：B + U + G
   */
  openSettings: ['B', 'U', 'G'],
}

/**
 * 编辑器事件处理器配置
 * 用于 ProseMirror 的 handleKeyDown 等事件
 */
export function createEditorEventHandlers(options: {
  onSlashMenuOpen: () => void
  onSlashMenuClose: () => void
  isSlashMenuOpen: () => boolean
}) {
  const { onSlashMenuOpen, onSlashMenuClose, isSlashMenuOpen } = options

  return {
    /**
     * 处理键盘按下事件
     * 实现 Slash 菜单和 ESC 关闭功能
     */
    handleKeyDown: (view: any, event: KeyboardEvent): boolean => {
      // 监听 / 键打开 Slash 菜单
      if (event.key === '/' && !isSlashMenuOpen()) {
        const { state } = view
        const { selection } = state
        const { from } = selection
        const textBefore = state.doc.textBetween(Math.max(0, from - 1), from)

        // 只有在行首或空格后输入 / 才显示菜单
        if (textBefore === '' || textBefore === ' ' || textBefore === '\n') {
          onSlashMenuOpen()
          return false
        }
      }

      // 监听 ESC 关闭 Slash 菜单
      if (event.key === 'Escape' && isSlashMenuOpen()) {
        onSlashMenuClose()
        return true
      }

      // 如果菜单打开，拦截方向键和回车键
      if (isSlashMenuOpen()) {
        if (['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) {
          return true
        }
      }

      return false
    },
  }
}
