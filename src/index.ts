import { Context, h, Schema } from 'koishi'
import { marked } from 'marked'

interface Superscript {
  type: 'sup'
  raw: string
  text: string
  tokens?: Token[] | undefined
}

interface Subscript {
  type: 'sub'
  raw: string
  text: string
  tokens?: Token[] | undefined
}

type Token = marked.Token | Superscript | Subscript

const tagRegExp = /^<(\/?)([^!\s>/]+)([^>]*?)\s*(\/?)>$/

const sup: marked.TokenizerExtension = {
  name: 'sup',
  level: 'inline',
  start: src => src.search(/<sub>/),
  tokenizer(src) {
    const rule = /^<sup>([^$\n]*)<\/sup>/
    const match = rule.exec(src)
    if (match) {
      const token = {
        type: 'sup',
        raw: match[0],
        text: match[1].trim(),
        tokens: []
      }
      this.lexer.inline(token.text, token.tokens)
      return token
    }
  },
}

const sub: marked.TokenizerExtension = {
  name: 'sub',
  level: 'inline',
  start: src => src.search(/<sub>/),
  tokenizer(src) {
    const rule = /^<sub>([^$\n]*)<\/sub>/
    const match = rule.exec(src)
    if (match) {
      const token = {
        type: 'sub',
        raw: match[0],
        text: match[1].trim(),
        tokens: []
      }
      this.lexer.inline(token.text, token.tokens)
      return token
    }
  },
}

marked.use({ extensions: [sup, sub] })

function renderToken(token: Token): h {
  if (token.type === 'code') {
    return h('text', { content: token.text + '\n' })
  } else if (token.type === 'paragraph') {
    return h('p', render(token.tokens))
  } else if (token.type === 'image') {
    return h.image(token.href)
  } else if (token.type === 'blockquote') {
    return h('text', { content: token.text + '\n' })
  } else if (token.type === 'text') {
    return h('text', { content: token.text })
  } else if (token.type === 'em') {
    return h('em', render(token.tokens))
  } else if (token.type === 'strong') {
    return h('strong', render(token.tokens))
  } else if (token.type === 'del') {
    return h('del', render(token.tokens))
  } else if (token.type === 'link') {
    return h('a', { href: token.href }, render(token.tokens))
  } else if (token.type === 'sup') {
    return h('sup', render(token.tokens))
  } else if (token.type === 'sub') {
    return h('sup', render(token.tokens))
  } else if (token.type === 'html') {
    const cap = tagRegExp.exec(token.text)
    if (!cap) {
      return h('text', { content: token.text })
    }
    if (cap[2] === 'img') {
      if (cap[1]) return
      const src = cap[3].match(/src="([^"]+)"/)
      if (src) return h.image(src[1])
    }
  }
  return h('text', { content: token.raw })
}

function render(tokens: Token[]): h[] {
  return tokens.map(renderToken).filter(Boolean)
}

export function transform(source: string): h[]
export function transform(source: TemplateStringsArray, ...args: any[]): h[]
export function transform(source: any, ...args: any[]) {
  if (!source) return []
  if (Array.isArray(source)) {
    source = args.map((arg, index) => source[index] + arg).join('') + source[args.length]
  }
  return render(marked.lexer(source))
}

export { transform as md }

export const name = 'markdown'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context, config: Config) {
  ctx.component('markdown', (attrs, children, session) => {
    return transform(children.join(''))
  }, { passive: true })
}
