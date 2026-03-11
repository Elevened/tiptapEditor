<template>
  <div class="editor-status-bar">
    <div class="status-left">
      <span class="status-item">
        <span class="status-label">字符:</span>
        <span class="status-value" :class="{ 'is-limit': isOverLimit }">{{ characterCount }}</span>
        <span v-if="characterLimit">/{{ characterLimit }}</span>
      </span>
      
      <span class="status-divider" />
      
      <span class="status-item">
        <span class="status-label">词数:</span>
        <span class="status-value">{{ wordCount }}</span>
      </span>
      
      <span class="status-divider" />
      
      <span class="status-item">
        <span class="status-label">当前:</span>
        <span class="status-value">{{ currentNode }}</span>
      </span>
    </div>
    
    <div class="status-right">
      <span class="status-item" v-if="lastSaved">
        已保存 {{ lastSaved }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Editor } from '@tiptap/core'

interface Props {
  editor: Editor | undefined
  characterLimit?: number
}

const props = withDefaults(defineProps<Props>(), {
  characterLimit: 10000
})

const lastSaved = ref('')

const characterCount = computed(() => {
  return props.editor?.storage.characterCount?.characters() || 0
})

const wordCount = computed(() => {
  return props.editor?.storage.characterCount?.words() || 0
})

const characterLimit = computed(() => {
  return props.characterLimit
})

const isOverLimit = computed(() => {
  if (!characterLimit.value) return false
  return characterCount.value > characterLimit.value
})

const currentNode = computed(() => {
  if (!props.editor) return '段落'
  
  if (props.editor.isActive('heading', { level: 1 })) return '标题 1'
  if (props.editor.isActive('heading', { level: 2 })) return '标题 2'
  if (props.editor.isActive('heading', { level: 3 })) return '标题 3'
  if (props.editor.isActive('heading', { level: 4 })) return '标题 4'
  if (props.editor.isActive('heading', { level: 5 })) return '标题 5'
  if (props.editor.isActive('heading', { level: 6 })) return '标题 6'
  if (props.editor.isActive('blockquote')) return '引用'
  if (props.editor.isActive('codeBlock')) return '代码块'
  if (props.editor.isActive('bulletList')) return '无序列表'
  if (props.editor.isActive('orderedList')) return '有序列表'
  if (props.editor.isActive('taskList')) return '任务列表'
  if (props.editor.isActive('table')) return '表格'
  
  return '段落'
})

// 监听内容变化，更新保存时间
watch(characterCount, () => {
  const now = new Date()
  lastSaved.value = now.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
})
</script>

<style scoped>
.editor-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #f6f8fa;
  border-top: 1px solid #e1e4e8;
  font-size: 12px;
  color: #656d76;
}

.status-left,
.status-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-label {
  color: #8c959f;
}

.status-value {
  font-weight: 500;
  color: #24292f;
}

.status-value.is-limit {
  color: #cf222e;
}

.status-divider {
  width: 1px;
  height: 12px;
  background: #d0d7de;
}
</style>
