import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

export interface MarkdownFile {
  name: string
  content: string
}

/**
 * 解析 Markdown 为 HTML
 */
export function parseMarkdown(markdown: string): string {
  return md.render(markdown)
}

/**
 * 读取本地 Markdown 文件
 */
export function readMarkdownFile(file: File): Promise<MarkdownFile> {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith('.md')) {
      reject(new Error('请选择 .md 格式的文件'))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      resolve({
        name: file.name,
        content,
      })
    }
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    reader.readAsText(file)
  })
}

/**
 * HTML 转 Markdown（简化版）
 * 注意：这是简化实现，完整实现需要更复杂的库
 */
export function htmlToMarkdown(html: string): string {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  // 递归转换
  function convertNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || ''
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return ''
    }

    const element = node as HTMLElement
    const tagName = element.tagName.toLowerCase()
    let content = Array.from(element.childNodes).map(convertNode).join('')

    switch (tagName) {
      case 'h1':
        return `# ${content}\n\n`
      case 'h2':
        return `## ${content}\n\n`
      case 'h3':
        return `### ${content}\n\n`
      case 'h4':
        return `#### ${content}\n\n`
      case 'h5':
        return `##### ${content}\n\n`
      case 'h6':
        return `###### ${content}\n\n`
      case 'p':
        return `${content}\n\n`
      case 'br':
        return '\n'
      case 'strong':
      case 'b':
        return `**${content}**`
      case 'em':
      case 'i':
        return `*${content}*`
      case 'code':
        return `\`${content}\``
      case 'pre':
        const code = element.querySelector('code')
        const lang = code?.className.replace('language-', '') || ''
        const codeContent = code?.textContent || content
        return `\`\`\`${lang}\n${codeContent}\n\`\`\`\n\n`
      case 'blockquote':
        return content.split('\n').map(line => `> ${line}`).join('\n') + '\n\n'
      case 'ul':
        return content + '\n'
      case 'ol':
        return content + '\n'
      case 'li':
        const parent = element.parentElement
        if (parent?.tagName.toLowerCase() === 'ul') {
          return `- ${content}\n`
        } else if (parent?.tagName.toLowerCase() === 'ol') {
          const index = Array.from(parent.children).indexOf(element) + 1
          return `${index}. ${content}\n`
        }
        return `- ${content}\n`
      case 'a':
        const href = element.getAttribute('href') || ''
        return `[${content}](${href})`
      case 'img':
        const src = element.getAttribute('src') || ''
        const alt = element.getAttribute('alt') || ''
        return `![${alt}](${src})`
      case 'hr':
        return '---\n\n'
      case 'table':
        return convertTable(element) + '\n'
      default:
        return content
    }
  }

  function convertTable(table: HTMLTableElement): string {
    const rows = table.querySelectorAll('tr')
    let markdown = ''

    rows.forEach((row, index) => {
      const cells = row.querySelectorAll('th, td')
      const rowContent = Array.from(cells).map(cell => cell.textContent?.trim() || '').join(' | ')
      markdown += `| ${rowContent} |\n`

      // 添加表头分隔符
      if (index === 0) {
        const separator = Array.from(cells).map(() => '---').join(' | ')
        markdown += `| ${separator} |\n`
      }
    })

    return markdown
  }

  return convertNode(tempDiv).trim()
}

/**
 * 下载 Markdown 文件
 */
export function downloadMarkdownFile(content: string, filename: string = 'document.md'): void {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 打开文件选择器（支持拖拽）
 */
export function openFilePicker(accept: string = '.md'): Promise<FileList | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = () => {
      resolve(input.files)
    }
    input.click()
  })
}

/**
 * 检查文件是否为 Markdown
 */
export function isMarkdownFile(file: File): boolean {
  return file.name.endsWith('.md') || file.type === 'text/markdown'
}
