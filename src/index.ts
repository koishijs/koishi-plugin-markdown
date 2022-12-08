import { Context, h, Schema } from 'koishi'
import { marked } from 'marked'

function renderToken(token: marked.Token): h {
  if (token.type === 'code') {
    return h('text', { content: token.text + '\n' })
  } else if (token.type === 'paragraph') {
    return h('p', render(token.tokens))
  } else if (token.type === 'image') {
    return h.image(token.href)
  } else if (token.type === 'blockquote') {
    return h('text', { content: token.text + '\n' })
  }
  return h('text', { content: token.raw })
}

function render(tokens: marked.Token[]): h[] {
  return tokens.map(renderToken)
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
