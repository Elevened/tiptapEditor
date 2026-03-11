<template>
  <div class="home">
    <header class="header">
      <h1>Tiptap 富文本编辑器演示</h1>
      <p class="subtitle">集成所有官方扩展的完整示例</p>
    </header>

    <main class="main">
      <RichEditor 
        v-model="content" 
        placeholder="开始输入内容..."
        :character-limit="10000"
        ref="editorRef"
      />

      <!-- 内容预览 -->
      <div class="preview-section">
        <div class="preview-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.value"
            :class="['tab-btn', { active: currentTab === tab.value }]"
            @click="currentTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="preview-content">
          <pre v-if="currentTab === 'html'"><code>{{ content }}</code></pre>
          
          <pre v-else-if="currentTab === 'json'"><code>{{ jsonContent }}</code></pre>
          
          <div v-else-if="currentTab === 'text'" class="text-preview">
            {{ textContent }}
          </div>
          
          <div v-else class="render-preview" v-html="content"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import RichEditor from '../components/editor/RichEditor.vue'

const editorRef = ref()
const currentTab = ref('render')

const tabs = [
  { value: 'render', label: '渲染预览' },
  { value: 'html', label: 'HTML' },
  { value: 'json', label: 'JSON' },
  { value: 'text', label: '纯文本' },
]

const defaultContent = `<h1>欢迎使用 Tiptap 富文本编辑器</h1>
<p>这是一个功能完整的富文本编辑器演示，集成了 Tiptap 的所有官方扩展。</p>
<h2>功能特性</h2>
<ul>
  <li><strong>基础格式</strong>：粗体、斜体、下划线、删除线、代码</li>
  <li><strong>标题层级</strong>：H1 - H6</li>
  <li><strong>列表</strong>：无序列表、有序列表、任务列表</li>
  <li><strong>表格</strong>：可调整大小的表格</li>
  <li><strong>代码块</strong>：支持语法高亮</li>
  <li><strong>媒体</strong>：图片、YouTube 视频</li>
  <li><strong>其他</strong>：链接、引用、分割线、高亮、颜色等</li>
</ul>
<h2>代码示例</h2>
<pre><code class="language-javascript">// Hello World
console.log('Hello Tiptap!');

const editor = new Editor({
  extensions: [StarterKit],
  content: '<p>Hello World!</p>',
});</code></pre>
<h2>任务列表</h2>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true"><div><p>已完成的功能</p></div></li>
  <li data-type="taskItem" data-checked="false"><div><p>待实现的功能</p></div></li>
</ul>
<p>开始体验吧！</p>
`

const content = ref(defaultContent)

const jsonContent = computed(() => {
  return JSON.stringify(editorRef.value?.getJSON(), null, 2)
})

const textContent = computed(() => {
  return editorRef.value?.getText() || ''
})
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2328;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 1.125rem;
  color: #656d76;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.preview-section {
  background: #f6f8fa;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e1e4e8;
}

.preview-tabs {
  display: flex;
  background: white;
  border-bottom: 1px solid #e1e4e8;
}

.tab-btn {
  padding: 12px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #656d76;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.tab-btn:hover {
  color: #24292f;
  background: #f6f8fa;
}

.tab-btn.active {
  color: #0969da;
  border-bottom-color: #0969da;
  font-weight: 500;
}

.preview-content {
  padding: 20px;
  min-height: 200px;
  max-height: 400px;
  overflow: auto;
}

.preview-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.preview-content code {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
}

.text-preview {
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.6;
}

.render-preview {
  background: white;
  padding: 24px;
  border-radius: 8px;
}

.render-preview :deep(h1),
.render-preview :deep(h2),
.render-preview :deep(h3),
.render-preview :deep(h4),
.render-preview :deep(h5),
.render-preview :deep(h6) {
  margin-top: 24px;
  margin-bottom: 16px;
}

.render-preview :deep(p) {
  margin-bottom: 16px;
}

.render-preview :deep(ul),
.render-preview :deep(ol) {
  margin-bottom: 16px;
  padding-left: 24px;
}

.render-preview :deep(li) {
  margin: 8px 0;
}

.render-preview :deep(pre) {
  background: #f6f8fa;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}

.render-preview :deep(code) {
  background: rgba(175, 184, 193, 0.2);
  padding: 0.2em 0.4em;
  border-radius: 6px;
  font-size: 85%;
}

.render-preview :deep(pre code) {
  background: transparent;
  padding: 0;
}

.render-preview :deep(blockquote) {
  border-left: 4px solid #d0d7de;
  padding-left: 16px;
  color: #656d76;
  font-style: italic;
}

.render-preview :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

.render-preview :deep(th),
.render-preview :deep(td) {
  border: 1px solid #d0d7de;
  padding: 8px 12px;
  text-align: left;
}

.render-preview :deep(th) {
  background: #f6f8fa;
}
</style>
