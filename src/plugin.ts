import { parserStyle, getSpecifiedColorVar } from './utils'
import type { Config, CustomPlugin } from 'svgo'
import type { XastElement } from 'svgo/lib/types'

const resetNodeAttribute = (
  node: XastElement,
  attr: 'fill' | 'stroke',
  invork: (node: XastElement) => void,
) => {
  if (!(attr in node.attributes)) return
  switch (node.attributes[attr]) {
    case 'var(--geist-foreground)':
      node.attributes[attr] = '{color}'
      return
    case 'var(--geist-background)':
      node.attributes[attr] = 'var(--geist-icons-background)'
      return
    case 'var(--geist-fill)':
      invork && invork(node)
  }
}

const svg: CustomPlugin = {
  name: 'sterilization',
  fn() {
    const styles = Object.create(null)
    const nodes = ['path', 'circle', 'circle']
    return {
      element: {
        enter: node => {
          if (node.name === 'svg' && node.attributes.style) {
            node.attributes.style.split(';').reduce((acc, cur) => {
              const [prop, value] = parserStyle(cur)
              acc[prop] = value
              return acc
            }, {})
          }
          if (nodes.includes(node.name)) {
            const geistFillColor = getSpecifiedColorVar(styles['--geist-fill'], 'current')
            const geistStrokeColor = getSpecifiedColorVar(styles['--geist-stroke'], 'current')
            // With Geist UI
            // Refer to: https://github.com/geist-org/react/pull/139/files#diff-b174da32165cea69128b525762abb680R22
            // invork function will reset dynamic colors
            resetNodeAttribute(node, 'fill', node => (node.attributes.fill = geistFillColor))
            resetNodeAttribute(node, 'stroke', node => (node.attributes.stroke = geistStrokeColor))
          }
        },
        exit: node => {
          if (node.name === 'svg') {
            if (node.attributes.height) node.attributes.height = '{size}'
            if (node.attributes.width) node.attributes.width = '{size}'
            node.attributes.style = '{{...style,color}}'
          }
        },
      },
    }
  },
}

export const svgoOptions: Config = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          cleanupNumericValues: {
            floatPrecision: 1,
          },
        },
      },
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: ['svg:color', 'svg:data-testid'],
      },
    },
    svg,
  ],
}
