/**
 * @file composables/useMarkdown.ts
 * @description Markdown 导入导出功能组合式函数
 * 
 * 这个 composable 封装了所有 Markdown 相关操作，包括：
 * - Markdown 文件读取和解析
 * - HTML 转 Markdown
 * - Markdown 文件下载
 * - 剪贴板粘贴处理
 * 
 * 使用单一职责原则：每个函数只做一件事
 */

import { ref } from 'vue'
import MarkdownIt from 'markdown-it'
import type { Editor } from '@tiptap/core'
import type { MarkdownFile } from '@/types/editor'

// 创建 MarkdownIt 实例，配置选项
const mdParser = new MarkdownIt({
  /** 启用 HTML 标签 */
  html: true,
  /** 自动转换 URL 为链接 */
  linkify: true,
  /** 启用排版优化 */
  typographer: true,
})

/**
 * 检查文件是否为 Markdown 文件
 * 
 * @param file - 要检查的文件对象
 * @returns 如果是 .md 文件返回 true
 */
export function isMarkdownFile(file: File): boolean {
  return file.name.endsWith('.md') || file.type === 'text/markdown'
}

/**
 * 读取 Markdown 文件内容
 * 使用 FileReader API 异步读取文件
 * 
 * @param file - Markdown 文件对象
 * @returns Promise，成功返回文件信息，失败抛出错误
 * 
 * @example
 * const { name, content } = await readMarkdownFile(file)
 */
export function readMarkdownFile(file: File): Promise<MarkdownFile> {
  return new Promise((resolve, reject) => {
    // 验证文件类型
    if (!isMarkdownFile(file)) {
      reject(new Error('请选择 .md 格式的文件'))
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const content = e.target?.result as string
      resolve({
        name: file.name,
        content,
      })
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }

    reader.readAsText(file)
  })
}

/**
 * 解析 Markdown 文本为 HTML
 * 
 * @param markdown - Markdown 格式的文本
 * @returns HTML 格式的字符串
 */
export function parseMarkdown(markdown: string): string {
  return mdParser.render(markdown)
}

/**
 * 将 HTML 转换为 Markdown
 * 这是一个简化版实现，完整实现需要更复杂的库
 * 
 * @param html - HTML 字符串
 * @returns Markdown 格式的字符串
 */
export function htmlToMarkdown(html: string): string {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  /**
   * 递归转换 DOM 节点为 Markdown
   * @param node - DOM 节点
   * @returns Markdown 字符串
   */
  function convertNode(node: Node): string {
    // 文本节点直接返回文本内容
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || ''
    }

    // 非元素节点返回空字符串
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return ''
    }

    const element = node as HTMLElement
    const tagName = element.tagName.toLowerCase()
    
    // 递归处理子节点
    const content = Array.from(element.childNodes).map(convertNode).join('')

    // 根据标签类型转换
    switch (tagName) {
      case 'h1': return `# ${content}\n\n`
      case 'h2': return `## ${content}\n\n`
      case 'h3': return `### ${content}\n\n`
      case 'h4': return `#### ${content}\n\n`
      case 'h5': return `##### ${content}\n\n`
      case 'h6': return `###### ${content}\n\n`
      case 'p': return `${content}\n\n`
      case 'br': return '\n'
      case 'strong':
      case 'b': return `**${content}**`
      case 'em':
      case 'i': return `*${content}*`
      case 'code': return `\`${content}\``
      case 'blockquote': return content.split('\n').map(line => `> ${line}`).join('\n') + '\n\n'
      case 'ul': return content + '\n'
      case 'ol': return content + '\n'
      case 'li':
        const parent = element.parentElement
        if (parent?.tagName.toLowerCase() === 'ul') {
          return `- ${content}\n`
        } else if (parent?.tagName.toLowerCase() === 'ol') {
          const index = Array.from(parent.children).indexOf(element) + 1
          return `${index}. ${content}\n`
        }
        return `- ${content}\n`
      case 'a':
        const href = element.getAttribute('href') || ''
        return `[${content}](${href})`
      case 'img':
        const src = element.getAttribute('src') || ''
        const alt = element.getAttribute('alt') || ''
        return `![${alt}](${src})`
      case 'hr': return '---\n\n'
      default: return content
    }
  }

  return convertNode(tempDiv).trim()
}

/**
 * 下载 Markdown 文件
 * 自动创建 Blob 并触发下载
 * 
 * @param content - Markdown 内容
 * @param filename - 下载文件名，默认 'document.md'
 */
export function downloadMarkdownFile(content: string, filename: string = 'document.md'): void {
  // 创建 Blob 对象
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  
  // 创建临时链接元素
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  
  // 触发下载
  document.body.appendChild(link)
  link.click()
  
  // 清理
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 打开文件选择器
 * 用于导入 Markdown 文件
 * 
 * @param accept - 接受的文件类型，默认 '.md'
 * @returns Promise，返回选中的文件列表
 */
export function openFilePicker(accept: string = '.md'): Promise<FileList | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    
    input.onchange = () => {
      resolve(input.files)
    }
    
    // 触发文件选择对话框
    input.click()
  })
}

/**
 * 使用 Markdown 的 Composable
 * 提供完整的 Markdown 操作功能
 * 
 * @param editor - Tiptap 编辑器实例
 * @returns Markdown 操作方法集
 */
export function useMarkdown(editor: Editor | undefined) {
  /** 导入状态 */
  const isImporting = ref(false)
  /** 导出状态 */
  const isExporting = ref(false)
  /** 错误信息 */
  const error = ref<string | null>(null)

  /**
   * 导入 Markdown 文件到编辑器
   * 打开文件选择器并解析文件内容
   */
  async function importMarkdown(): Promise<void> {
    if (!editor) return

    isImporting.value = true
    error.value = null

    try {
      const files = await openFilePicker('.md')
      if (!files || files.length === 0) return

      const file = files[0]
      const { content } = await readMarkdownFile(file)
      const html = parseMarkdown(content)
      
      // 设置编辑器内容
      editor.commands.setContent(html)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '导入失败'
      console.error('导入 Markdown 失败:', err)
    } finally {
      isImporting.value = false
    }
  }

  /**
   * 导出编辑器内容为 Markdown 文件
   * 自动触发文件下载
   */
  function exportMarkdown(): void {
    if (!editor) return

    isExporting.value = true
    error.value = null

    try {
      const html = editor.getHTML()
      const markdown = htmlToMarkdown(html)
      downloadMarkdownFile(markdown, 'document.md')
    } catch (err) {
      error.value = err instanceof Error ? err.message : '导出失败'
      console.error('导出 Markdown 失败:', err)
    } finally {
      isExporting.value = false
    }
  }

  return {
    isImporting,
    isExporting,
    error,
    importMarkdown,
    exportMarkdown,
  }
}
