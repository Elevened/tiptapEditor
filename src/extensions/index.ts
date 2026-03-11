import { type Extensions } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import CharacterCount from '@tiptap/extension-character-count'
import Focus from '@tiptap/extension-focus'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Youtube from '@tiptap/extension-youtube'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Mention from '@tiptap/extension-mention'
import { DragHandle } from '@tiptap/extension-drag-handle'
import { createLowlight } from 'lowlight'

// 创建 lowlight 实例
const lowlight = createLowlight()

// 注册常用的语言高亮
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import sql from 'highlight.js/lib/languages/sql'
import yaml from 'highlight.js/lib/languages/yaml'
import markdown from 'highlight.js/lib/languages/markdown'
import php from 'highlight.js/lib/languages/php'
import rust from 'highlight.js/lib/languages/rust'
import go from 'highlight.js/lib/languages/go'

// 注册语言
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('css', css)
lowlight.register('html', xml)
lowlight.register('json', json)
lowlight.register('bash', bash)
lowlight.register('python', python)
lowlight.register('java', java)
lowlight.register('sql', sql)
lowlight.register('yaml', yaml)
lowlight.register('markdown', markdown)
lowlight.register('php', php)
lowlight.register('rust', rust)
lowlight.register('go', go)

export interface EditorExtensionsOptions {
  placeholder?: string
  characterLimit?: number
  enableCollaboration?: boolean
}

export function createExtensions(options: EditorExtensionsOptions = {}): Extensions {
  const { placeholder = '请输入内容...', characterLimit = 10000 } = options

  return [
    // StarterKit (包含核心功能)
    StarterKit.configure({
      codeBlock: false, // 使用 CodeBlockLowlight 替代
    }),

    // 代码块（带语法高亮）
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: 'javascript',
      HTMLAttributes: {
        class: 'code-block',
      },
    }),

    // 图片
    Image.configure({
      inline: true,
      allowBase64: true,
      HTMLAttributes: {
        class: 'editor-image',
      },
    }),

    // 链接
    Link.configure({
      openOnClick: false,
      linkOnPaste: true,
      autolink: true,
      HTMLAttributes: {
        rel: 'noopener noreferrer nofollow',
        target: '_blank',
        class: 'editor-link',
      },
    }),

    // 占位符
    Placeholder.configure({
      placeholder,
    }),

    // 下划线
    Underline.configure({
      HTMLAttributes: {
        class: 'editor-underline',
      },
    }),

    // 文本对齐
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    }),

    // 高亮
    Highlight.configure({
      multicolor: true,
    }),

    // 排版优化
    Typography,

    // 文本样式（配合 Color 使用）
    TextStyle,

    // 颜色
    Color.configure({
      types: ['textStyle'],
    }),

    // 表格
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: 'editor-table',
      },
    }),
    TableRow,
    TableHeader.configure({
      HTMLAttributes: {
        class: 'table-header',
      },
    }),
    TableCell.configure({
      HTMLAttributes: {
        class: 'table-cell',
      },
    }),

    // 字符计数
    CharacterCount.configure({
      limit: characterLimit,
    }),

    // 焦点管理
    Focus.configure({
      className: 'has-focus',
      mode: 'all',
    }),

    // 任务列表
    TaskList.configure({
      HTMLAttributes: {
        class: 'task-list',
      },
    }),
    TaskItem.configure({
      nested: true,
      HTMLAttributes: {
        class: 'task-item',
      },
    }),

    // 上下标
    Subscript,
    Superscript,

    // YouTube 视频
    Youtube.configure({
      inline: false,
      width: 640,
      height: 480,
      HTMLAttributes: {
        class: 'youtube-video',
      },
    }),

    // @提及
    Mention.configure({
      HTMLAttributes: {
        class: 'mention',
      },
      suggestion: {
        items: ({ query }) => {
          const users = [
            '张三', '李四', '王五', '赵六', '钱七',
            '孙悟空', '猪八戒', '沙僧', '唐僧', '白龙马',
            '刘备', '关羽', '张飞', '诸葛亮', '曹操',
          ]
          return users
            .filter(user => user.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5)
        },
      },
    }),

    // 拖拽手柄
    DragHandle.configure({
      // 应用于哪些节点类型
      render: () => {
        const element = document.createElement('div')
        element.classList.add('custom-drag-handle')
        element.innerHTML = '⋮⋮'
        element.style.cssText = 'font-size: 16px;'
        return element
      },
    }),
  ]
}

export { lowlight }
