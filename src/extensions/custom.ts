import { Node, mergeAttributes } from '@tiptap/core'

export interface VideoOptions {
  HTMLAttributes: Record<string, any>
}

// 视频扩展
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { src: string; width?: string; height?: string }) => ReturnType
    }
  }
}

export const Video = Node.create<VideoOptions>({
  name: 'video',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: '100%',
      },
      height: {
        default: 'auto',
      },
      controls: {
        default: true,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div')
      dom.className = 'video-wrapper'

      const video = document.createElement('video')
      video.src = node.attrs.src
      video.width = node.attrs.width === '100%' ? '100%' : node.attrs.width
      video.height = node.attrs.height
      video.controls = node.attrs.controls
      video.style.maxWidth = '100%'
      video.style.borderRadius = '8px'

      dom.appendChild(video)

      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'video') return false
          video.src = updatedNode.attrs.src
          return true
        },
        destroy: () => {
          video.pause()
          video.removeAttribute('src')
          video.load()
        },
      }
    }
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})

// Iframe 嵌入扩展
export interface IframeOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      setIframe: (options: { src: string; width?: string; height?: string }) => ReturnType
    }
  }
}

export const Iframe = Node.create<IframeOptions>({
  name: 'iframe',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: '0',
      },
      allowfullscreen: {
        default: 'true',
      },
      width: {
        default: '100%',
      },
      height: {
        default: '400',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { class: 'iframe-wrapper' }, ['iframe', mergeAttributes(HTMLAttributes)]]
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div')
      dom.className = 'iframe-container'

      const iframe = document.createElement('iframe')
      iframe.src = node.attrs.src
      iframe.width = node.attrs.width
      iframe.height = node.attrs.height
      iframe.frameBorder = node.attrs.frameborder
      iframe.allowFullscreen = true
      iframe.style.borderRadius = '8px'

      dom.appendChild(iframe)

      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'iframe') return false
          iframe.src = updatedNode.attrs.src
          return true
        },
      }
    }
  },

  addCommands() {
    return {
      setIframe:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})

// 字体大小扩展
import { Mark } from '@tiptap/core'

export interface FontSizeOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType
      unsetFontSize: () => ReturnType
    }
  }
}

export const FontSize = Mark.create<FontSizeOptions>({
  name: 'fontSize',

  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (element) => element.style.fontSize,
        renderHTML: (attributes) => {
          if (!attributes.size) {
            return {}
          }
          return {
            style: `font-size: ${attributes.size}`,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        style: 'font-size',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ chain }) => {
          return chain().setMark('fontSize', { size }).run()
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().unsetMark('fontSize').run()
        },
    }
  },
})

// 数学公式扩展 (LaTeX)
export interface MathOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    math: {
      setMath: (content: string) => ReturnType
      setMathBlock: (content: string) => ReturnType
    }
  }
}

export const MathInline = Node.create<MathOptions>({
  name: 'mathInline',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      content: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-math-inline]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ 'data-math-inline': '' }, HTMLAttributes), 0]
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('span')
      dom.className = 'math-inline'
      dom.style.fontFamily = 'KaTeX_Main, Times New Roman, serif'
      dom.style.padding = '0 4px'
      dom.style.background = '#f6f8fa'
      dom.style.borderRadius = '4px'
      dom.textContent = `$${node.attrs.content}$`
      return { dom }
    }
  },

  addCommands() {
    return {
      setMath:
        (content) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { content },
          })
        },
    }
  },
})

export const MathBlock = Node.create<MathOptions>({
  name: 'mathBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      content: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-math-block]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-math-block': '' }, HTMLAttributes), 0]
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div')
      dom.className = 'math-block'
      dom.style.fontFamily = 'KaTeX_Main, Times New Roman, serif'
      dom.style.padding = '16px'
      dom.style.background = '#f6f8fa'
      dom.style.borderRadius = '8px'
      dom.style.textAlign = 'center'
      dom.style.margin = '16px 0'
      dom.textContent = `$$${node.attrs.content}$$`
      return { dom }
    }
  },

  addCommands() {
    return {
      setMathBlock:
        (content: string) =>
        ({ commands }: { commands: any }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { content },
          })
        },
    }
  },
})

// 画板/绘图扩展
export interface DrawingOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    drawing: {
      setDrawing: (src: string) => ReturnType
    }
  }
}

export const Drawing = Node.create<DrawingOptions>({
  name: 'drawing',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: '100%',
      },
      height: {
        default: '300',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-drawing]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-drawing': '' }, HTMLAttributes)]
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div')
      dom.className = 'drawing-container'
      dom.style.border = '2px dashed #d0d7de'
      dom.style.borderRadius = '8px'
      dom.style.padding = '16px'
      dom.style.textAlign = 'center'
      dom.style.background = '#f6f8fa'
      
      if (node.attrs.src) {
        const img = document.createElement('img')
        img.src = node.attrs.src
        img.style.maxWidth = '100%'
        img.style.borderRadius = '4px'
        dom.appendChild(img)
      } else {
        const placeholder = document.createElement('div')
        placeholder.textContent = '🎨 画板功能（可在此扩展实现涂鸦功能）'
        placeholder.style.padding = '40px'
        placeholder.style.color = '#656d76'
        dom.appendChild(placeholder)
      }
      
      return { dom }
    }
  },

  addCommands() {
    return {
      setDrawing:
        (src) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { src },
          })
        },
    }
  },
})

// 分页符扩展
export interface PageBreakOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pageBreak: {
      setPageBreak: () => ReturnType
    }
  }
}

export const PageBreak = Node.create<PageBreakOptions>({
  name: 'pageBreak',
  group: 'block',
  atom: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-page-break]',
      },
    ]
  },

  renderHTML() {
    return ['div', { 'data-page-break': '', style: 'page-break-after: always; border-bottom: 2px dashed #d0d7de; margin: 24px 0;' }]
  },

  addNodeView() {
    return () => {
      const dom = document.createElement('div')
      dom.className = 'page-break'
      dom.style.pageBreakAfter = 'always'
      dom.style.borderBottom = '2px dashed #d0d7de'
      dom.style.margin = '24px 0'
      dom.style.padding = '8px 0'
      dom.style.textAlign = 'center'
      dom.style.color = '#8c959f'
      dom.style.fontSize = '12px'
      dom.innerHTML = '<span>--- 分页符 ---</span>'
      return { dom }
    }
  },

  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          })
        },
    }
  },
})

// 目录扩展
export interface TocOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    toc: {
      setToc: () => ReturnType
    }
  }
}

export const Toc = Node.create<TocOptions>({
  name: 'toc',
  group: 'block',
  atom: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-toc]',
      },
    ]
  },

  renderHTML() {
    return ['div', { 'data-toc': '' }]
  },

  addNodeView() {
    return () => {
      const dom = document.createElement('div')
      dom.className = 'toc-container'
      dom.style.background = '#f6f8fa'
      dom.style.borderRadius = '8px'
      dom.style.padding = '16px'
      dom.style.margin = '16px 0'
      
      const title = document.createElement('div')
      title.textContent = '📑 目录'
      title.style.fontWeight = 'bold'
      title.style.marginBottom = '12px'
      title.style.fontSize = '18px'
      dom.appendChild(title)
      
      // 这里可以实现动态生成目录的逻辑
      const placeholder = document.createElement('div')
      placeholder.textContent = '（文档标题将自动显示在这里）'
      placeholder.style.color = '#656d76'
      placeholder.style.fontSize = '14px'
      dom.appendChild(placeholder)
      
      return { dom }
    }
  },

  addCommands() {
    return {
      setToc:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          })
        },
    }
  },
})
