import { expect } from 'chai'
import { transform } from '../src'

describe('koishi-plugin-markdown', () => {
  it('transform', () => {
    expect(transform('hello').join('')).to.equal('<p>hello</p>')
  })
})
