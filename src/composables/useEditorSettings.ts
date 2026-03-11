/**
 * @file composables/useEditorSettings.ts
 * @description 编辑器设置管理组合式函数
 * 
 * 这个 composable 管理编辑器的所有设置状态，包括：
 * - 设置状态响应式管理
 * - 设置变更处理
 * - 本地存储持久化
 * - 设置验证和默认值
 * 
 * 遵循单一职责原则：设置逻辑与编辑器逻辑分离
 */

import { ref, watch } from 'vue'
import type { Editor } from '@tiptap/core'
import type { EditorSettings } from '@/types/editor'
import { defaultEditorSettings } from './useEditorConfig'

/**
 * 本地存储键名
 */
const STORAGE_KEY = 'tiptap-editor-settings'

/**
 * 从本地存储加载设置
 * 
 * @returns 存储的设置或默认设置
 */
function loadSettingsFromStorage(): Partial<EditorSettings> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (err) {
    console.warn('从本地存储加载设置失败:', err)
  }
  return {}
}

/**
 * 保存设置到本地存储
 * 
 * @param settings - 要保存的设置
 */
function saveSettingsToStorage(settings: EditorSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (err) {
    console.warn('保存设置到本地存储失败:', err)
  }
}

/**
 * 合并默认设置和用户设置
 * 
 * @param defaults - 默认设置
 * @param overrides - 用户自定义设置
 * @returns 合并后的完整设置
 */
function mergeSettings(
  defaults: EditorSettings,
  overrides: Partial<EditorSettings>
): EditorSettings {
  return {
    ...defaults,
    ...overrides,
  }
}

/**
 * 编辑器设置管理的 Composable
 * 
 * @param editor - Tiptap 编辑器实例（可选）
 * @param initialSettings - 初始设置（可选）
 * @returns 设置状态和操作方法
 * 
 * @example
 * const { settings, updateSettings, resetSettings } = useEditorSettings(editor)
 */
export function useEditorSettings(
  editor?: Editor,
  initialSettings: Partial<EditorSettings> = {}
) {
  /**
   * 设置状态
   * 合并默认值、本地存储值和初始值
   */
  const settings = ref<EditorSettings>(
    mergeSettings(
      defaultEditorSettings,
      mergeSettings(loadSettingsFromStorage(), initialSettings)
    )
  )

  /**
   * 监听设置变化并保存到本地存储
   * 使用深度监听确保嵌套对象变更也被捕获
   */
  watch(
    settings,
    (newSettings) => {
      saveSettingsToStorage(newSettings)
    },
    { deep: true }
  )

  /**
   * 更新单个设置项
   * 
   * @param key - 设置键名
   * @param value - 设置新值
   */
  function updateSetting<K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K]
  ): void {
    settings.value[key] = value

    // 同步更新编辑器可编辑状态
    if (key === 'editable' && editor) {
      editor.setEditable(value)
    }
  }

  /**
   * 批量更新设置
   * 
   * @param newSettings - 新的设置对象
   */
  function updateSettings(newSettings: Partial<EditorSettings>): void {
    Object.assign(settings.value, newSettings)

    // 同步更新编辑器可编辑状态
    if (newSettings.editable !== undefined && editor) {
      editor.setEditable(newSettings.editable)
    }
  }

  /**
   * 重置所有设置为默认值
   */
  function resetSettings(): void {
    settings.value = { ...defaultEditorSettings }
  }

  /**
   * 切换布尔类型的设置项
   * 适用于复选框类型的设置
   * 
   * @param key - 布尔类型的设置键名
   */
  function toggleSetting(key: keyof EditorSettings): void {
    const currentValue = settings.value[key]
    if (typeof currentValue === 'boolean') {
      updateSetting(key, !currentValue as any)
    }
  }

  /**
   * 检查设置是否被修改过（与默认值比较）
   * 
   * @returns 如果有任何设置与默认值不同返回 true
   */
  function hasCustomSettings(): boolean {
    return Object.keys(defaultEditorSettings).some(
      key => settings.value[key as keyof EditorSettings] !== defaultEditorSettings[key as keyof EditorSettings]
    )
  }

  /**
   * 导出设置为 JSON 字符串
   * 可用于备份或分享设置
   * 
   * @returns JSON 格式的设置字符串
   */
  function exportSettings(): string {
    return JSON.stringify(settings.value, null, 2)
  }

  /**
   * 从 JSON 字符串导入设置
   * 
   * @param json - JSON 格式的设置字符串
   * @returns 是否导入成功
   */
  function importSettings(json: string): boolean {
    try {
      const parsed = JSON.parse(json)
      updateSettings(parsed)
      return true
    } catch (err) {
      console.error('导入设置失败:', err)
      return false
    }
  }

  return {
    // 状态
    settings,
    // 操作方法
    updateSetting,
    updateSettings,
    resetSettings,
    toggleSetting,
    hasCustomSettings,
    exportSettings,
    importSettings,
  }
}
