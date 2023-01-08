import path from 'path'
import fs from 'fs-extra'
import { Window } from 'happy-dom'
import { optimize } from 'svgo'
// import SVGO, { optimize } from 'svgo/lib/svgo'
import { transform } from '@babel/core'
import { svgoOptions } from './plugin'
import {
  moduleBabelConfig,
  allModulesBabelConfig,
  replaceAll,
  toHumpName,
  toComponentName,
  makeBasicDefinition,
} from './utils'

import type { IElement as Element } from 'happy-dom'

const defaultWd = process.cwd()

const outputDir = path.join(defaultWd, 'dist')
const sourceFile = path.join(defaultWd, '.source')

const selector = {
  nodes: '.geist-container > .icon',
  text: '.geist-text',
  node: 'svg',
}

const formatSvg = (element: Element) => {
  const name = element.querySelector(selector.text).textContent
  const el = element.querySelector(selector.node)
  const str = optimize(el.outerHTML, svgoOptions).data
  return {
    name,
    svg: str,
  }
}

export default (async () => {
  await fs.remove(outputDir)
  const html = await fs.readFile(sourceFile, 'utf-8')
  const { document } = new Window()
  document.body.innerHTML = html
  const elements = document.querySelectorAll(selector.nodes)
  if (!elements.length)
    throw new Error("\nCan't found any svg elements. please check the document selector.\n")
  const icons = elements.forEach(element => formatSvg(element))
})()
// await fs.remove(outputDir)

// export default (async () => {
//   await fs.remove(outputDir)
//   const html = await fs.readFile(sourceFile, 'utf8')
//   const document = new JSDOM(html).window.document

//   let exports = ''
//   let definition = makeBasicDefinition()

//   const icons = document.querySelectorAll('.geist-list .icon')
//   const svgo = new SVGO(svgoConfigs)
//   const promises = Array.from(icons).map(async (icon: Element) => {
//     const name: string = icon.querySelector('.geist-text').textContent
//     const componentName = toComponentName(name)
//     const fileName = toHumpName(name)

//     const svg = icon.querySelector('svg')
//     const { data: optimizedSvgString } = await svgo.optimize(svg.outerHTML)
//     const styles = parseStyles(svg.getAttribute('style'))

//     const component = `import React from 'react';
// const ${componentName} = ({ color = 'currentColor', size = 24, style, ...props }) => {
//   return ${parseSvg(optimizedSvgString, styles)};
// }
// export default ${componentName};`

//     exports += `export { default as ${componentName} } from './${fileName}';\n`
//     definition += `export const ${componentName}: Icon;\n`

//     const componentDefinition = `${makeBasicDefinition()}declare const ${componentName}: Icon;
// export default ${componentName}\n`
//     const componentCode = transform(component, moduleBabelConfig).code
//     await fs.outputFile(path.join(outputDir, `${fileName}.d.ts`), componentDefinition)
//     await fs.outputFile(path.join(outputDir, `${fileName}.js`), componentCode)
//   })

//   await Promise.all(promises)
//   const allModulesCode = transform(exports, allModulesBabelConfig).code
//   await fs.outputFile(path.join(outputDir, 'index.d.ts'), definition)
//   await fs.outputFile(path.join(outputDir, 'index.js'), allModulesCode)
// })()

// const parseSvg = (svg: string, styles: any) => {
//   const getSpecifiedColorVar = (val: string | undefined, ident: string) => {
//     if (!val) return '""'
//     return val.includes(ident) ? '{color}' : '"var(--geist-icons-background)"'
//   }

//   svg = svg.replace(/-([a-z])(?=[a-z\-]*[=\s/>])/g, g => g[1].toUpperCase())
//   svg = svg.replace(
//     /<svg([^>]+)>/,
//     `<svg$1 {...props} height={size} width={size} style={{...style,color}}>`,
//   )

//   const geistFillColor = getSpecifiedColorVar(styles['--geist-fill'], 'current')
//   const geistStrokeColor = getSpecifiedColorVar(styles['--geist-stroke'], 'current')

//   // With Geist UI
//   // Refer to: https://github.com/geist-org/react/pull/139/files#diff-b174da32165cea69128b525762abb680R22
//   svg = replaceAll(svg, '"var(--geist-foreground)"', '{color}')
//   svg = replaceAll(svg, '"var(--geist-background)"', '"var(--geist-icons-background)"')

//   // Reset dynamic colors
//   // In a few icons, the semantics of 'fill' and 'stroke' are not correct,
//   // they maybe forced to override by style.
//   svg = replaceAll(svg, '"var(--geist-fill)"', geistFillColor)
//   svg = replaceAll(svg, '"var(--geist-stroke)"', geistStrokeColor)
//   return svg
// }

// const parseStyles = (inlineStyle = '') =>
//   inlineStyle.split(';').reduce((styleObject, stylePropertyValue) => {
//     // extract the style property name and value
//     let [property, value] = stylePropertyValue
//       .split(/^([^:]+):/)
//       .filter((val, i) => i > 0)
//       .map(item => item.trim().toLowerCase())

//     styleObject[property] = value
//     return styleObject
//   }, {})
