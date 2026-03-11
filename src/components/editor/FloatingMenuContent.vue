<template>
  <div class="floating-menu">
    <button
      v-for="item in menuItems"
      :key="item.name"
      class="floating-menu-item"
      @click="item.action()"
    >
      <div class="item-icon">
        <IconifyIcon :icon="item.icon" :size="20" />
      </div>
      <div class="item-content">
        <div class="item-title">{{ item.title }}</div>
        <div class="item-shortcut">{{ item.shortcut }}</div>
      </div>
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

const menuItems = [
  {
    name: 'heading1',
    title: '标题 1',
    shortcut: '# + 空格',
    icon: editorIcons.heading1,
    action: () => props.editor?.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    name: 'heading2',
    title: '标题 2',
    shortcut: '## + 空格',
    icon: editorIcons.heading2,
    action: () => props.editor?.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    name: 'heading3',
    title: '标题 3',
    shortcut: '### + 空格',
    icon: editorIcons.heading3,
    action: () => props.editor?.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    name: 'bulletList',
    title: '无序列表',
    shortcut: '- + 空格',
    icon: editorIcons.bulletList,
    action: () => props.editor?.chain().focus().toggleBulletList().run(),
  },
  {
    name: 'orderedList',
    title: '有序列表',
    shortcut: '1. + 空格',
    icon: editorIcons.orderedList,
    action: () => props.editor?.chain().focus().toggleOrderedList().run(),
  },
  {
    name: 'taskList',
    title: '任务列表',
    shortcut: '[] + 空格',
    icon: editorIcons.taskList,
    action: () => props.editor?.chain().focus().toggleTaskList().run(),
  },
  {
    name: 'blockquote',
    title: '引用',
    shortcut: '> + 空格',
    icon: editorIcons.blockquote,
    action: () => props.editor?.chain().focus().toggleBlockquote().run(),
  },
  {
    name: 'codeBlock',
    title: '代码块',
    shortcut: '```',
    icon: editorIcons.codeBlock,
    action: () => props.editor?.chain().focus().toggleCodeBlock().run(),
  },
  {
    name: 'horizontalRule',
    title: '分割线',
    shortcut: '---',
    icon: editorIcons.horizontalRule,
    action: () => props.editor?.chain().focus().setHorizontalRule().run(),
  },
]
</script>

<style scoped>
.floating-menu {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  padding: 8px;
  min-width: 200px;
}

.floating-menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  gap: 12px;
  color: #24292f;
  transition: background 0.2s;
}

.floating-menu-item:hover {
  background: #f3f4f6;
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #f6f8fa;
  color: #656d76;
}

.item-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  color: #24292f;
}

.item-shortcut {
  font-size: 12px;
  color: #8c959f;
  margin-top: 2px;
}
</style>
