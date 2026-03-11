# Tiptap 完全使用指南

> 基于 ProseMirror 的无头富文本编辑器框架
> 版本：v3.x | 最后更新：2025年

---

## 📚 目录

1. [快速开始](#快速开始)
2. [核心概念](#核心概念)
3. [安装配置](#安装配置)
4. [基础用法](#基础用法)
5. [扩展系统](#扩展系统)
6. [官方扩展详解](#官方扩展详解)
7. [自定义扩展](#自定义扩展)
8. [事件与命令](#事件与命令)
9. [样式与主题](#样式与主题)
10. [高级功能](#高级功能)
11. [性能优化](#性能优化)
12. [最佳实践](#最佳实践)
13. [常见问题](#常见问题)

---

## 🚀 快速开始

### 五分钟上手

```bash
# 安装依赖
npm install @tiptap/core @tiptap/starter-kit @tiptap/vue-3
```

```vue
<!-- RichEditor.vue -->
<template>
  <EditorContent :editor="editor" />
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  content: '<p>Hello Tiptap!</p>',
  extensions: [StarterKit],
})
</script>
```

### 核心概念速览

| 概念 | 说明 | 示例 |
|------|------|------|
| **Extension** | 功能扩展单元 | `StarterKit`, `Bold`, `Image` |
| **Node** | 块级内容节点 | `paragraph`, `heading`, `codeBlock` |
| **Mark** | 行内样式标记 | `bold`, `italic`, `link` |
| **Command** | 编辑命令 | `toggleBold()`, `setContent()` |
| **Schema** | 文档结构定义 | 节点类型、属性、嵌套规则 |

---

## 🧠 核心概念

### 1. 架构分层

```
┌─────────────────────────────────────┐
│  UI Layer (Vue/React/Svelte)        │  ← 你的应用代码
│  - 工具栏、菜单、主题                │
├─────────────────────────────────────┤
│  Tiptap Core                        │  ← Tiptap API
│  - Editor, Extensions, Commands     │
├─────────────────────────────────────┤
│  ProseMirror                        │  ← 核心引擎
│  - State, View, Transactions        │
├─────────────────────────────────────┤
│  Browser DOM                        │  ← 浏览器渲染
└─────────────────────────────────────┘
```

### 2. 文档模型

Tiptap 使用 JSON 表示文档结构：

```json
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "标题" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "普通文本 " },
        { 
          "type": "text", 
          "marks": [{ "type": "bold" }],
          "text": "粗体文本"
        }
      ]
    }
  ]
}
```

### 3. 扩展类型

```typescript
// Extension - 功能扩展
import { Extension } from '@tiptap/core'
const MyExtension = Extension.create({
  name: 'myExtension',
  addProseMirrorPlugins() { /* ... */ }
})

// Node - 块级节点
import { Node } from '@tiptap/core'
const MyNode = Node.create({
  name: 'myNode',
  group: 'block',
  parseHTML() { /* ... */ },
  renderHTML() { /* ... */ }
})

// Mark - 行内标记
import { Mark } from '@tiptap/core'
const MyMark = Mark.create({
  name: 'myMark',
  parseHTML() { /* ... */ },
  renderHTML() { /* ... */ }
})
```

---

## 📦 安装配置

### 方案一：最小化安装

```bash
# 仅核心功能
npm install @tiptap/core @tiptap/pm @tiptap/starter-kit
```

### 方案二：完整安装（推荐）

```bash
# Vue 3 项目
npm install @tiptap/core @tiptap/pm @tiptap/vue-3 @tiptap/starter-kit

# React 项目
npm install @tiptap/core @tiptap/pm @tiptap/react @tiptap/starter-kit
```

### 常用扩展清单

```bash
# 基础格式
npm install @tiptap/extension-bold @tiptap/extension-italic @tiptap/extension-underline

# 高级功能
npm install @tiptap/extension-image @tiptap/extension-link @tiptap/extension-table

# 代码高亮
npm install @tiptap/extension-code-block-lowlight lowlight

# 任务列表
npm install @tiptap/extension-task-list @tiptap/extension-task-item
```

---

## 💻 基础用法

### Vue 3 完整示例

```vue
<template>
  <div class="editor-wrapper">
    <!-- 工具栏 -->
    <div class="toolbar">
      <button 
        @click="editor?.chain().focus().toggleBold().run()"
        :class="{ active: editor?.isActive('bold') }"
      >
        粗体
      </button>
    </div>

    <!-- 编辑器 -->
    <EditorContent :editor="editor" class="editor" />

    <!-- 内容预览 -->
    <pre>{{ editor?.getHTML() }}</pre>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { watch } from 'vue'

interface Props {
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '<p></p>',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 创建编辑器实例
const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// 监听外部内容变化
watch(() => props.modelValue, (newValue) => {
  if (editor.value?.getHTML() !== newValue) {
    editor.value?.commands.setContent(newValue)
  }
})
</script>

<style>
.editor-wrapper {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.toolbar {
  padding: 8px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.toolbar button {
  margin-right: 8px;
  padding: 4px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.toolbar button.active {
  background: #e3f2fd;
  border-color: #2196f3;
  color: #1976d2;
}

.editor {
  padding: 16px;
  min-height: 200px;
}

.editor :deep(.ProseMirror) {
  outline: none;
}

.editor :deep(.ProseMirror p) {
  margin: 0 0 12px 0;
}
</style>
```

### React 完整示例

```tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

interface RichEditorProps {
  content?: string
  onChange?: (html: string) => void
}

export function RichEditor({ content = '', onChange }: RichEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  // 同步外部内容变化
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  return (
    <div className="editor-wrapper">
      <div className="toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'active' : ''}
        >
          粗体
        </button>
      </div>
      <EditorContent editor={editor} className="editor" />
    </div>
  )
}
```

---

## 🔌 扩展系统

### StarterKit 包含的扩展

```typescript
import StarterKit from '@tiptap/starter-kit'

// StarterKit 包含以下扩展：
const extensions = [
  Document,      // 文档根节点
  Paragraph,     // 段落
  Text,          // 文本
  Bold,          // 粗体
  Italic,        // 斜体
  Strike,        // 删除线
  Code,          // 行内代码
  CodeBlock,     // 代码块
  Heading,       // 标题 H1-H6
  Blockquote,    // 引用
  BulletList,    // 无序列表
  OrderedList,   // 有序列表
  ListItem,      // 列表项
  HorizontalRule, // 分割线
  HardBreak,     // 硬换行
  History,       // 撤销/重做
  Dropcursor,    // 拖拽光标
  Gapcursor,     // 间隙光标
]
```

### 配置扩展

```typescript
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'

const editor = useEditor({
  extensions: [
    // 配置 StarterKit
    StarterKit.configure({
      // 禁用某些功能
      heading: false,
      codeBlock: false,
    }),
    
    // 自定义配置 Heading
    Heading.configure({
      levels: [1, 2, 3],  // 只启用 H1-H3
      HTMLAttributes: {
        class: 'custom-heading',
      },
    }),
  ],
})
```

---

## 📖 官方扩展详解

### 1. 基础格式扩展

```typescript
// 粗体
import Bold from '@tiptap/extension-bold'
Bold.configure({
  HTMLAttributes: { class: 'bold-text' }
})
// 命令：toggleBold(), setBold(), unsetBold()
// 快捷键：Ctrl+B

// 斜体
import Italic from '@tiptap/extension-italic'
// 命令：toggleItalic()
// 快捷键：Ctrl+I

// 下划线
import Underline from '@tiptap/extension-underline'
// 命令：toggleUnderline()
// 快捷键：Ctrl+U

// 删除线
import Strike from '@tiptap/extension-strike'
// 命令：toggleStrike()
// 快捷键：Ctrl+Shift+S
```

### 2. 链接扩展

```typescript
import Link from '@tiptap/extension-link'

Link.configure({
  openOnClick: false,      // 点击时不自动打开
  linkOnPaste: true,       // 粘贴 URL 时自动转换
  autolink: true,          // 自动识别链接
  protocols: ['http', 'https', 'mailto', 'tel'],
  HTMLAttributes: {
    rel: 'noopener noreferrer',
    target: '_blank',
  },
  validate: (href) => /^https?:\/\//.test(href),
})

// 使用示例
editor?.chain()
  .focus()
  .setLink({ href: 'https://example.com' })
  .run()

editor?.chain().focus().unsetLink().run()
```

### 3. 图片扩展

```typescript
import Image from '@tiptap/extension-image'

Image.configure({
  inline: true,           // 行内显示
  allowBase64: true,      // 允许 Base64
  HTMLAttributes: {
    class: 'editor-image',
  },
})

// 插入图片
editor?.chain().focus().setImage({
  src: 'https://example.com/image.jpg',
  alt: '图片描述',
  title: '图片标题',
}).run()
```

### 4. 表格扩展

```typescript
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'

const extensions = [
  Table.configure({
    resizable: true,        // 可调整大小
    HTMLAttributes: { class: 'editor-table' }
  }),
  TableRow,
  TableCell,
  TableHeader,
]

// 表格命令
editor?.commands.insertTable({ 
  rows: 3, 
  cols: 3, 
  withHeaderRow: true 
})

editor?.commands.addColumnBefore()
editor?.commands.addColumnAfter()
editor?.commands.deleteColumn()
editor?.commands.addRowBefore()
editor?.commands.addRowAfter()
editor?.commands.deleteRow()
editor?.commands.mergeCells()
editor?.commands.splitCell()
```

### 5. 代码块（带高亮）

```typescript
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'

// 导入语言
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'

const lowlight = createLowlight()
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('css', css)

CodeBlockLowlight.configure({
  lowlight,
  defaultLanguage: 'javascript',
  HTMLAttributes: { class: 'code-block' }
})
```

---

## 🔧 自定义扩展

### 创建自定义 Node

```typescript
// extensions/Video.ts
import { Node, mergeAttributes } from '@tiptap/core'

export interface VideoOptions {
  HTMLAttributes: Record<string, any>
}

export const Video = Node.create<VideoOptions>({
  name: 'video',
  
  group: 'block',
  
  atom: true,
  
  addAttributes() {
    return {
      src: { default: null },
      width: { default: '100%' },
      controls: { default: true },
    }
  },
  
  parseHTML() {
    return [{ tag: 'video' }]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },
  
  addCommands() {
    return {
      setVideo: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})
```

### 创建自定义 Mark

```typescript
// extensions/FontSize.ts
import { Mark } from '@tiptap/core'

export const FontSize = Mark.create({
  name: 'fontSize',
  
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (element) => element.style.fontSize,
        renderHTML: (attributes) => {
          if (!attributes.size) return {}
          return { style: `font-size: ${attributes.size}` }
        },
      },
    }
  },
  
  parseHTML() {
    return [{ style: 'font-size' }]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0]
  },
  
  addCommands() {
    return {
      setFontSize: (size) => ({ chain }) => {
        return chain().setMark('fontSize', { size }).run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().unsetMark('fontSize').run()
      },
    }
  },
})
```

---

## ⚡ 事件与命令

### 事件系统

```typescript
const editor = useEditor({
  content: '<p>Hello</p>',
  extensions: [StarterKit],
  
  onCreate: ({ editor }) => {
    console.log('编辑器创建完成')
  },
  
  onUpdate: ({ editor, transaction }) => {
    console.log('内容已更新', editor.getHTML())
  },
  
  onSelectionUpdate: ({ editor }) => {
    const { from, to } = editor.state.selection
    console.log('选区变化', from, to)
  },
  
  onFocus: ({ editor, event }) => {
    console.log('编辑器获得焦点')
  },
  
  onBlur: ({ editor, event }) => {
    console.log('编辑器失去焦点')
  },
  
  onDestroy: () => {
    console.log('编辑器销毁')
  },
})
```

### 常用命令

```typescript
// 内容操作
editor.commands.setContent('<p>新内容</p>')
editor.commands.clearContent()
editor.commands.insertContent('<strong>插入的内容</strong>')
editor.commands.insertContentAt(10, '在位置10插入')

// 格式操作
editor.commands.toggleBold()
editor.commands.toggleItalic()
editor.commands.setHeading({ level: 2 })
editor.commands.toggleBulletList()

// 撤销/重做
editor.commands.undo()
editor.commands.redo()

// 焦点操作
editor.commands.focus()                    // 聚焦到末尾
editor.commands.focus('start')             // 聚焦到开头
editor.commands.focus('end')               // 聚焦到末尾
editor.commands.focus(10)                  // 聚焦到位置10

// 选择操作
editor.commands.selectAll()
editor.commands.deleteSelection()
```

---

## 🎨 样式与主题

### 基础样式

```css
/* 编辑器容器 */
.ProseMirror {
  outline: none;
  padding: 16px;
  min-height: 200px;
}

/* 占位符 */
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: #999;
  float: left;
  pointer-events: none;
  height: 0;
}

/* 选中样式 */
.ProseMirror ::selection {
  background: #b4d7fe;
}

/* 选中节点 */
.ProseMirror-selectednode {
  outline: 2px solid #68cef8;
}

/* 拖拽手柄 */
.ProseMirror .tiptap-drag-handle {
  position: absolute;
  left: -24px;
  opacity: 0;
  transition: opacity 0.2s;
}

.ProseMirror:hover .tiptap-drag-handle {
  opacity: 1;
}
```

### 暗色主题

```css
/* 暗色模式基础 */
.dark-mode .ProseMirror {
  background: #1e1e1e;
  color: #d4d4d4;
}

.dark-mode .ProseMirror h1,
.dark-mode .ProseMirror h2,
.dark-mode .ProseMirror h3 {
  color: #fff;
}

.dark-mode .ProseMirror blockquote {
  border-left-color: #444;
  color: #aaa;
}

.dark-mode .ProseMirror pre {
  background: #2d2d2d;
}

.dark-mode .ProseMirror code {
  background: rgba(255,255,255,0.1);
}
```

---

## 🚀 高级功能

### 1. 拖拽排序

```typescript
import { DragHandle } from '@tiptap/extension-drag-handle'

const editor = useEditor({
  extensions: [
    StarterKit,
    DragHandle.configure({
      render: () => {
        const element = document.createElement('div')
        element.classList.add('drag-handle')
        element.innerHTML = '⋮⋮'
        return element
      }
    }),
  ],
})
```

### 2. 提及功能 (@用户)

```typescript
import Mention from '@tiptap/extension-mention'

Mention.configure({
  HTMLAttributes: { class: 'mention' },
  suggestion: {
    items: ({ query }) => {
      const users = ['张三', '李四', '王五']
      return users.filter(u => u.includes(query)).slice(0, 5)
    },
    render: () => ({
      onStart: (props) => { /* 显示建议列表 */ },
      onUpdate: (props) => { /* 更新建议列表 */ },
      onExit: () => { /* 关闭建议列表 */ },
      onKeyDown: (props) => { /* 处理键盘事件 */ },
    }),
  },
})
```

### 3. 协作编辑

```typescript
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

const ydoc = new Y.Doc()
const provider = new WebsocketProvider(
  'ws://localhost:1234',
  'room-name',
  ydoc
)

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      history: false,  // 协作编辑需要禁用内置历史
    }),
    Collaboration.configure({
      document: ydoc,
    }),
  ],
})
```

---

## ⚡ 性能优化

### 1. 防抖保存

```typescript
import { debounce } from 'lodash-es'

const saveContent = debounce((content) => {
  localStorage.setItem('editor-content', content)
}, 1000)

const editor = useEditor({
  onUpdate: ({ editor }) => {
    saveContent(editor.getHTML())
  },
})
```

### 2. 虚拟滚动（大文档）

```typescript
// 对于大文档，使用虚拟滚动只渲染可见区域
import { Virtualizer } from '@tanstack/react-virtual'

// 或使用分页加载
const loadMoreContent = async () => {
  const newContent = await fetchMoreContent()
  editor?.commands.insertContent(newContent)
}
```

### 3. 延迟加载扩展

```typescript
// 动态导入大型扩展
const loadTableExtension = async () => {
  const { default: Table } = await import('@tiptap/extension-table')
  return Table
}
```

---

## ✅ 最佳实践

### 1. 项目结构

```
src/
├── components/
│   └── editor/
│       ├── RichEditor.vue      # 主编辑器
│       ├── EditorToolbar.vue   # 工具栏
│       ├── SettingsDrawer.vue  # 设置面板
│       └── index.ts            # 导出
├── composables/
│   ├── useEditorSettings.ts    # 设置管理
│   ├── useMarkdown.ts          # Markdown 操作
│   └── useEditorConfig.ts      # 编辑器配置
├── extensions/
│   ├── index.ts                # 扩展配置
│   └── custom/
│       ├── Video.ts
│       └── FontSize.ts
├── types/
│   └── editor.ts               # 类型定义
└── styles/
    └── editor.css              # 编辑器样式
```

### 2. 编辑器封装模式

```vue
<!-- 封装好的 RichEditor 组件 -->
<template>
  <div class="rich-editor">
    <EditorToolbar
      v-if="settings.showToolbar"
      :editor="editor"
      :settings="settings"
    />
    
    <EditorContent :editor="editor" />
    
    <EditorStatusBar :editor="editor" />
  </div>
</template>

<script setup>
// 使用 composables 分离逻辑
const { settings } = useEditorSettings()
const { importMarkdown, exportMarkdown } = useMarkdown()
const editor = useEditor({ /* ... */ })
</script>
```

### 3. 类型安全

```typescript
// 始终使用 TypeScript
import type { Editor } from '@tiptap/core'

interface EditorProps {
  modelValue: string
  placeholder?: string
}

interface EditorEmits {
  (e: 'update:modelValue', value: string): void
}
```

### 4. 错误处理

```typescript
const safeInsertContent = (content: string) => {
  try {
    editor.value?.commands.insertContent(content)
  } catch (error) {
    console.error('插入内容失败:', error)
    // 显示用户友好的错误提示
  }
}
```

---

## ❓ 常见问题

### Q: 如何获取选中的文本？

```typescript
const getSelectedText = (editor: Editor) => {
  const { from, to } = editor.state.selection
  return editor.state.doc.textBetween(from, to)
}
```

### Q: 如何在指定位置插入内容？

```typescript
// 在当前光标位置插入
editor.commands.insertContent('<strong>粗体</strong>')

// 在指定位置插入
editor.commands.insertContentAt(10, '插入的文本')

// 在末尾插入
editor.commands.insertContentAt('end', '末尾内容')
```

### Q: 如何实现查找替换？

```typescript
const findAndReplace = (editor: Editor, find: string, replace: string) => {
  const { doc, tr } = editor.state
  
  doc.descendants((node, pos) => {
    if (node.isText && node.text?.includes(find)) {
      const newText = node.text.replaceAll(find, replace)
      tr.replaceWith(pos, pos + node.nodeSize, editor.schema.text(newText))
    }
  })
  
  editor.view.dispatch(tr)
}
```

### Q: 如何处理 SSR？

```vue
<script setup>
// 客户端渲染编辑器
const editor = ref(null)

onMounted(() => {
  editor.value = new Editor({
    extensions: [StarterKit],
    content: '<p>Hello</p>',
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <client-only>
    <editor-content :editor="editor" />
  </client-only>
</template>
```

---

## 📚 资源链接

- [Tiptap 官方文档](https://tiptap.dev/)
- [ProseMirror 指南](https://prosemirror.net/docs/guide/)
- [GitHub 仓库](https://github.com/ueberdosis/tiptap)
- [Discord 社区](https://discord.gg/WtJ49jGshW)

---

## 📝 更新日志

### v3.0 (2025)
- 重构为模块化架构
- 添加 composables 最佳实践
- 优化性能和类型安全

---

<details>
<summary>💡 提示：如何使用本文档</summary>

1. **新手**：从 [快速开始](#快速开始) 和 [基础用法](#基础用法) 开始
2. **进阶**：查看 [扩展系统](#扩展系统) 和 [自定义扩展](#自定义扩展)
3. **优化**：参考 [性能优化](#性能优化) 和 [最佳实践](#最佳实践)
4. **排错**：查阅 [常见问题](#常见问题)

</details>
