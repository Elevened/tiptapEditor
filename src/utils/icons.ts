// Iconify 图标映射
// 使用 Material Design Icons (mdi)

export const editorIcons = {
  // 历史操作
  undo: 'mdi:undo',
  redo: 'mdi:redo',
  
  // 文本样式
  bold: 'mdi:format-bold',
  italic: 'mdi:format-italic',
  underline: 'mdi:format-underline',
  strikethrough: 'mdi:format-strikethrough',
  code: 'mdi:code-tags',
  subscript: 'mdi:format-subscript',
  superscript: 'mdi:format-superscript',
  
  // 对齐
  alignLeft: 'mdi:format-align-left',
  alignCenter: 'mdi:format-align-center',
  alignRight: 'mdi:format-align-right',
  alignJustify: 'mdi:format-align-justify',
  
  // 列表
  bulletList: 'mdi:format-list-bulleted',
  orderedList: 'mdi:format-list-numbered',
  taskList: 'mdi:check-box-outline',
  
  // 插入
  link: 'mdi:link',
  image: 'mdi:image',
  table: 'mdi:table',
  youtube: 'mdi:youtube',
  codeBlock: 'mdi:code-block-tags',
  video: 'mdi:video',
  iframe: 'mdi:web',
  
  // 格式
  heading1: 'mdi:format-header-1',
  heading2: 'mdi:format-header-2',
  heading3: 'mdi:format-header-3',
  heading4: 'mdi:format-header-4',
  heading5: 'mdi:format-header-5',
  heading6: 'mdi:format-header-6',
  paragraph: 'mdi:format-paragraph',
  blockquote: 'mdi:format-quote-close',
  horizontalRule: 'mdi:minus',
  
  // 颜色和高亮
  color: 'mdi:palette',
  clearColor: 'mdi:palette-off',
  highlight: 'mdi:marker',
  
  // 数学公式
  math: 'mdi:calculator',
  mathInline: 'mdi:calculator-variant',
  
  // 绘图
  drawing: 'mdi:drawing',
  
  // 分页和目录
  pageBreak: 'mdi:page-layout-sidebar-left',
  toc: 'mdi:table-of-contents',
  
  // 其他
  clearFormat: 'mdi:format-clear',
  darkMode: 'mdi:weather-night',
  lightMode: 'mdi:weather-sunny',
  print: 'mdi:printer',
  export: 'mdi:export',
  import: 'mdi:import',
  search: 'mdi:magnify',
  replace: 'mdi:find-replace',
  
  // 表格操作
  addColumnBefore: 'mdi:table-column-plus-before',
  addColumnAfter: 'mdi:table-column-plus-after',
  deleteColumn: 'mdi:table-column-remove',
  addRowBefore: 'mdi:table-row-plus-before',
  addRowAfter: 'mdi:table-row-plus-after',
  deleteRow: 'mdi:table-row-remove',
  deleteTable: 'mdi:table-off',
  mergeCells: 'mdi:table-merge-cells',
  splitCell: 'mdi:table-split-cell',
  
  // 扩展菜单
  more: 'mdi:dots-horizontal',
  arrowDown: 'mdi:chevron-down',
  arrowUp: 'mdi:chevron-up',
  close: 'mdi:close',
  check: 'mdi:check',
  
  // 表情和符号
  emoji: 'mdi:emoticon-outline',
  
  // 文件操作
  file: 'mdi:file-outline',
  folder: 'mdi:folder-outline',
  save: 'mdi:content-save',
  download: 'mdi:download',
  upload: 'mdi:upload',
  importFile: 'mdi:file-import',
  exportFile: 'mdi:file-export',
  fileUpload: 'mdi:file-upload',
} as const

export type EditorIconKey = keyof typeof editorIcons

// 获取图标
export function getIcon(key: EditorIconKey): string {
  return editorIcons[key] || 'mdi:help-circle'
}
