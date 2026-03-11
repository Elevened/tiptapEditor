<template>
  <div class="bubble-menu">
    <button
      v-for="item in menuItems"
      :key="item.name"
      class="bubble-menu-btn"
      :class="{ 'is-active': editor?.isActive(item.name) }"
      @click="item.action()"
      :title="item.title"
    >
      <IconifyIcon :icon="item.icon" :size="18" />
    </button>
    
    <div class="bubble-divider" />
    
    <button class="bubble-menu-btn" @click="addLink" title="链接">
      <IconifyIcon :icon="icons.link" :size="18" />
    </button>

    <button class="bubble-menu-btn" @click="addMathInline" title="行内公式">
      <IconifyIcon :icon="icons.mathInline" :size="18" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import IconifyIcon from '@/components/IconifyIcon.vue'
import { editorIcons } from '@/utils/icons'

interface Props {
  editor: Editor | undefined
}

const props = defineProps<Props>()

const icons = editorIcons

interface MenuItem {
  name: string
  title: string
  icon: string
  action: () => boolean | undefined
}

const menuItems: MenuItem[] = [
  {
    name: 'bold',
    title: '粗体',
    icon: editorIcons.bold,
    action: () => props.editor?.chain().focus().toggleBold().run(),
  },
  {
    name: 'italic',
    title: '斜体',
    icon: editorIcons.italic,
    action: () => props.editor?.chain().focus().toggleItalic().run(),
  },
  {
    name: 'strike',
    title: '删除线',
    icon: editorIcons.strikethrough,
    action: () => props.editor?.chain().focus().toggleStrike().run(),
  },
  {
    name: 'code',
    title: '行内代码',
    icon: editorIcons.code,
    action: () => props.editor?.chain().focus().toggleCode().run(),
  },
  {
    name: 'highlight',
    title: '高亮',
    icon: editorIcons.highlight,
    action: () => props.editor?.chain().focus().toggleHighlight().run(),
  },
]

const addLink = () => {
  const previousUrl = props.editor?.getAttributes('link').href
  const url = window.prompt('链接地址', previousUrl)
  
  if (url === null) return
  
  if (url === '') {
    props.editor?.chain().focus().unsetLink().run()
  } else {
    props.editor?.chain().focus().setLink({ href: url }).run()
  }
}

const addMathInline = () => {
  const formula = window.prompt('输入 LaTeX 公式（如：E=mc^2）')
  if (formula) {
    props.editor?.chain().focus().setMath(formula).run()
  }
}
</script>

<style scoped>
.bubble-menu {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.bubble-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: #656d76;
}

.bubble-menu-btn:hover {
  background: #f3f4f6;
  color: #24292f;
}

.bubble-menu-btn.is-active {
  background: #e5e7eb;
  color: #111827;
}

.bubble-divider {
  width: 1px;
  height: 20px;
  background: #e5e7eb;
  margin: 0 4px;
}
</style>
