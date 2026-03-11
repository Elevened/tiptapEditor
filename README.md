# Tiptap 富文本编辑器

> 基于 Vue 3 + Tiptap 的完整富文本编辑器解决方案

<img src="https://img.shields.io/badge/Vue-3.x-green" alt="Vue 3"/> 
<img src="https://img.shields.io/badge/Tiptap-3.x-blue" alt="Tiptap 3"/> 
<img src="https://img.shields.io/badge/TypeScript-5.x-blue" alt="TypeScript"/> 
<img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT"/>

## ✨ 功能特性

### 📝 编辑功能
- **基础格式**：粗体、斜体、下划线、删除线、行内代码
- **标题层级**：H1 - H6 六级标题
- **列表支持**：无序列表、有序列表、任务列表
- **代码块**：支持语法高亮（JavaScript、TypeScript、CSS 等 13+ 语言）
- **表格**：可调整大小的表格，支持合并单元格
- **链接与图片**：链接自动识别，图片支持 Base64

### 🎨 排版功能
- **文本对齐**：左对齐、居中、右对齐、两端对齐
- **高亮与颜色**：文本高亮、文字颜色选择器
- **引用块**：带样式的引用块
- **分割线**：水平分割线
- **数学公式**：LaTeX 公式支持
- **YouTube 视频**：直接嵌入 YouTube 视频

### 🛠️ 工具功能
- **撤销/重做**：完整的操作历史
- **Markdown 导入/导出**：支持 .md 文件导入导出
- **字符统计**：实时显示字符数、字数
- **节点拖拽**：支持段落和标题拖拽排序
- **暗色模式**：支持亮色/暗色主题切换

### ⚡ 交互体验
- **气泡菜单**：选中文字时显示快捷工具栏
- **Slash 菜单**：输入 `/` 快速插入内容
- **设置面板**：按 B+U+G 快捷键打开设置
- **快捷键支持**：完整的键盘快捷键支持

## 🚀 快速开始

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 启动开发服务器

```bash
pnpm dev
# 或
npm run dev
```

访问 http://localhost:5173 查看编辑器

### 构建生产版本

```bash
pnpm build
# 或
npm run build
```

## 📁 项目结构

```
tiptap-editor-demo/
├── src/
│   ├── components/editor/     # 编辑器组件
│   │   ├── RichEditor.vue     # 主编辑器组件
│   │   ├── EditorToolbar.vue  # 工具栏
│   │   ├── SettingsDrawer.vue # 设置抽屉
│   │   └── ...
│   ├── composables/           # 可复用逻辑
│   │   ├── useEditorConfig.ts # 编辑器配置
│   │   ├── useEditorSettings.ts # 设置管理
│   │   └── useMarkdown.ts     # Markdown 操作
│   ├── extensions/            # Tiptap 扩展
│   │   ├── index.ts           # 官方扩展配置
│   │   └── custom.ts          # 自定义扩展
│   ├── types/                 # TypeScript 类型
│   │   └── editor.ts          # 编辑器类型定义
│   ├── styles/                # 样式文件
│   │   └── editor.css         # 编辑器样式
│   └── utils/                 # 工具函数
│       ├── icons.ts           # 图标映射
│       └── markdown.ts        # Markdown 工具
├── tiptap-guide.md            # Tiptap 使用指南
└── README.md                  # 本文件
```

## 🎯 使用示例

### 基础用法

```vue
<template>
  <RichEditor v-model="content" placeholder="请输入内容..." />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RichEditor from '@/components/editor/RichEditor.vue'

const content = ref('<p>Hello World!</p>')
</script>
```

### 带配置的用法

```vue
<template>
  <RichEditor
    v-model="content"
    placeholder="请输入内容..."
    :character-limit="10000"
    :editable="true"
  />
</template>
```

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + B` | 粗体 |
| `Ctrl + I` | 斜体 |
| `Ctrl + U` | 下划线 |
| `Ctrl + K` | 插入链接 |
| `Ctrl + Z` | 撤销 |
| `Ctrl + Y` | 重做 |
| `Ctrl + /` | 代码块 |
| `B + U + G` | 打开设置 |

## 🧩 技术栈

- **Vue 3**：渐进式 JavaScript 框架
- **TypeScript**：类型安全的 JavaScript 超集
- **Tiptap**：无头富文本编辑器框架
- **ProseMirror**：强大的文档模型
- **Vite**：下一代前端构建工具
- **Iconify**：统一的图标系统
- **Lowlight**：代码语法高亮

## 📦 核心依赖

```json
{
  "@tiptap/core": "^3.20.1",
  "@tiptap/vue-3": "^3.20.1",
  "@tiptap/starter-kit": "^3.20.1",
  "@vueuse/core": "^14.2.1",
  "vue": "^3.5.25"
}
```

## 📖 文档

- [Tiptap 完全使用指南](./tiptap-guide.md) - 详细的 Tiptap 学习文档
- [Tiptap 官方文档](https://tiptap.dev/)
- [ProseMirror 指南](https://prosemirror.net/docs/guide/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT](./LICENSE)

---

<details>
<summary>📸 界面预览</summary>

### 编辑器主界面
- 工具栏：包含所有格式化工具
- 编辑区：支持富文本编辑
- 状态栏：显示字符统计

### 功能展示
- 支持 Markdown 导入/导出
- 支持代码块语法高亮
- 支持表格编辑
- 支持暗色模式

</details>
