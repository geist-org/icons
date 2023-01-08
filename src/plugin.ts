import type { Config, CustomPlugin } from 'svgo'

const svg: CustomPlugin = {
  name: 'sterilization',
  fn() {
    const styles = Object.create(null)
    return {
      element: {
        enter: node => {
          if (node.name === 'svg' && node.attributes.style) {
          
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
