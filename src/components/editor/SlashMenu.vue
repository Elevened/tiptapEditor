<template>
  <div v-if="visible" class="slash-menu" :style="menuStyle">
    <div class="menu-header">
      <span>基本 blocks</span>
    </div>
    <div class="menu-items">
      <button
        v-for="(item, index) in filteredItems"
        :key="item.name"
        :class="['menu-item', { active: selectedIndex === index }]"
        @click="selectItem(item)"
        @mouseenter="selectedIndex = index"
      >
        <div class="item-icon">
          <IconifyIcon :icon="item.icon" :size="18" />
        </div>
        <div class="item-content">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-shortcut">{{ item.shortcut }}</div>
        </div>
      </button>
    </div>
    <div class="menu-footer">
      <span>↑↓ 选择</span>
      <span>↵ 确认</span>
      <span>Esc 关闭</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Editor } from '@tiptap/core'
import IconifyIcon from '@/components/IconifyIcon.vue'
import { editorIcons } from '@/utils/icons'

interface Props {
  editor: Editor | undefined
  visible: boolean
}

interface MenuItem {
  name: string
  title: string
  shortcut: string
  icon: string
  action: () => void
}

const props = defineProps<Props>()
const emit = defineEmits(['update:visible', 'select'])

const menuStyle = ref({ top: '0px', left: '0px' })
const selectedIndex = ref(0)
const query = ref('')

const menuItems: MenuItem[] = [
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

const filteredItems = computed(() => {
  if (!query.value) return menuItems
  const q = query.value.toLowerCase()
  return menuItems.filter(item => 
    item.title.toLowerCase().includes(q) ||
    item.name.toLowerCase().includes(q)
  )
})

const updatePosition = () => {
  if (!props.editor) return
  
  const { state } = props.editor
  const { selection } = state
  const { from } = selection
  
  // 获取光标位置
  const coords = props.editor.view.coordsAtPos(from)
  const editorRect = props.editor.view.dom.getBoundingClientRect()
  
  menuStyle.value = {
    top: `${coords.top - editorRect.top + 30}px`,
    left: `${coords.left - editorRect.left}px`,
  }
}

const selectItem = (item: MenuItem) => {
  // 删除 "/" 和查询文本
  const { state } = props.editor!
  const { selection } = state
  const { from } = selection
  
  // 找到 "/" 的位置
  const textBefore = state.doc.textBetween(Math.max(0, from - 20), from)
  const slashIndex = textBefore.lastIndexOf('/')
  
  if (slashIndex !== -1) {
    const deleteFrom = from - (textBefore.length - slashIndex)
    props.editor?.chain().focus().deleteRange({ from: deleteFrom, to: from }).run()
  }
  
  item.action()
  emit('update:visible', false)
  query.value = ''
  selectedIndex.value = 0
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.visible) return
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % filteredItems.value.length
      break
    case 'ArrowUp':
      e.preventDefault()
      selectedIndex.value = (selectedIndex.value - 1 + filteredItems.value.length) % filteredItems.value.length
      break
    case 'Enter':
      e.preventDefault()
      if (filteredItems.value[selectedIndex.value]) {
        selectItem(filteredItems.value[selectedIndex.value])
      }
      break
    case 'Escape':
      e.preventDefault()
      emit('update:visible', false)
      query.value = ''
      break
  }
}

// 监听键盘事件
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

// 当显示时更新位置
watch(() => props.visible, (newVal) => {
  if (newVal) {
    updatePosition()
    selectedIndex.value = 0
  }
})

// 暴露方法给父组件
defineExpose({
  updateQuery: (q: string) => {
    query.value = q
    selectedIndex.value = 0
  }
})
</script>

<style scoped>
.slash-menu {
  position: absolute;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  padding: 8px 0;
  min-width: 240px;
  max-height: 320px;
  overflow-y: auto;
  z-index: 100;
}

.menu-header {
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #656d76;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-items {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  gap: 10px;
  color: #24292f;
  transition: background 0.15s;
}

.menu-item:hover,
.menu-item.active {
  background: #f3f4f6;
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #f6f8fa;
  color: #656d76;
  flex-shrink: 0;
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
  margin-top: 1px;
}

.menu-footer {
  display: flex;
  gap: 12px;
  padding: 8px 12px;
  margin-top: 4px;
  border-top: 1px solid #e1e4e8;
  font-size: 11px;
  color: #8c959f;
}

.menu-footer span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 暗色模式 */
:global(.dark-mode) .slash-menu {
  background: #161b22;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
}

:global(.dark-mode) .menu-header {
  color: #8b949e;
}

:global(.dark-mode) .menu-item {
  color: #c9d1d9;
}

:global(.dark-mode) .menu-item:hover,
:global(.dark-mode) .menu-item.active {
  background: #21262d;
}

:global(.dark-mode) .item-icon {
  background: #0d1117;
  color: #8b949e;
}

:global(.dark-mode) .item-title {
  color: #c9d1d9;
}

:global(.dark-mode) .menu-footer {
  border-top-color: #30363d;
  color: #8b949e;
}
</style>
