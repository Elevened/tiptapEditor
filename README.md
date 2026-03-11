# Tiptap 富文本编辑器演示

一个基于 Vue 3 + Vite + Tiptap 的富文本编辑器完整实现，集成了所有官方扩展。

## 功能特性

### 基础编辑功能
- ✅ **文本样式**：粗体、斜体、下划线、删除线、行内代码
- ✅ **标题层级**：H1 - H6
- ✅ **对齐方式**：左对齐、居中、右对齐、两端对齐
- ✅ **列表**：无序列表、有序列表、任务列表
- ✅ **引用块**：支持嵌套引用
- ✅ **代码块**：支持语法高亮（10+ 语言）

### 表格功能
- ✅ 插入表格（可指定行列）
- ✅ 添加/删除行列
- ✅ 合并/拆分单元格
- ✅ 可调整表格大小
- ✅ 表头支持

### 媒体支持
- ✅ **图片**：支持 URL 和 Base64，可拖拽
- ✅ **视频**：本地视频文件
- ✅ **YouTube**：嵌入 YouTube 视频
- ✅ **Iframe**：嵌入网页

### 高级功能
- ✅ **链接**：可编辑链接，支持自动链接
- ✅ **高亮**：多色高亮支持
- ✅ **颜色**：文字颜色设置
- ✅ **占位符**：空内容提示
- ✅ **字符计数**：实时统计字符数和词数
- ✅ **气泡菜单**：选中文字时显示快捷工具栏
- ✅ **浮动菜单**：空行输入 `/` 显示格式菜单
- ✅ **撤销/重做**：完整历史记录支持
- ✅ **暗色模式**：一键切换主题

### 扩展集成
- ✅ StarterKit（18+ 个基础扩展）
- ✅ Image、Link、Placeholder
- ✅ Underline、TextAlign、Highlight
- ✅ Typography、Color、TextStyle
- ✅ Table（含行列单元格扩展）
- ✅ CharacterCount、Focus
- ✅ TaskList、TaskItem
- ✅ Subscript、Superscript
- ✅ Youtube、Mention
- ✅ CodeBlockLowlight（语法高亮）

## 技术栈

- **框架**：Vue 3 + Composition API
- **构建工具**：Vite
- **编辑器**：Tiptap + ProseMirror
- **路由**：Vue Router
- **语法高亮**：Lowlight + Highlight.js
- **语言**：TypeScript

## 项目结构

```
src/
├── components/
│   └── editor/
│       ├── RichEditor.vue          # 主编辑器组件
│       ├── EditorToolbar.vue       # 工具栏
│       ├── BubbleMenuContent.vue   # 气泡菜单
│       ├── FloatingMenuContent.vue # 浮动菜单
│       ├── EditorStatusBar.vue     # 状态栏
│       ├── ToolbarButton.vue       # 工具栏按钮
│       └── index.ts                # 组件导出
├── extensions/
│   ├── index.ts                    # 扩展配置
│   └── custom.ts                   # 自定义扩展
├── styles/
│   └── editor.css                  # 编辑器样式
├── views/
│   └── HomeView.vue                # 主页
├── App.vue
└── main.ts
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 使用说明

### 基础用法

```vue
<template>
  <RichEditor v-model="content" placeholder="请输入内容..." />
</template>

<script setup>
import { ref } from 'vue'
import { RichEditor } from '@/components/editor'

const content = ref('<p>Hello World!</p>')
</script>
```

### 完整配置

```vue
<template>
  <RichEditor
    v-model="content"
    placeholder="开始输入..."
    :character-limit="10000"
    :editable="true"
    @update="onUpdate"
    ref="editorRef"
  />
</template>

<script setup>
import { ref } from 'vue'

const editorRef = ref()
const content = ref('')

const onUpdate = (editor) => {
  console.log('HTML:', editor.getHTML())
  console.log('JSON:', editor.getJSON())
  console.log('Text:', editor.getText())
}

// 程序化操作
const clearContent = () => {
  editorRef.value?.clearContent()
}

const setContent = () => {
  editorRef.value?.setContent('<p>新内容</p>')
}
</script>
```

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+B` | 粗体 |
| `Ctrl+I` | 斜体 |
| `Ctrl+U` | 下划线 |
| `Ctrl+K` | 插入链接 |
| `Ctrl+Z` | 撤销 |
| `Ctrl+Y` / `Ctrl+Shift+Z` | 重做 |
| `Tab` | 列表缩进 |
| `Shift+Tab` | 列表反缩进 |

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 开源协议

MIT License

## 参考资源

- [Tiptap 官方文档](https://tiptap.dev/)
- [ProseMirror 文档](https://prosemirror.net/docs/)
- [Vue 3 文档](https://vuejs.org/)
