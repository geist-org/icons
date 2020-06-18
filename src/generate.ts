import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
import fs from 'fs-extra'
import path from 'path'
import SVGO from 'svgo/lib/svgo'
import svgoConfigs from './svgo.config'
import { transform } from '@babel/core'
import {
  moduleBabelConfig,
  allModulesBabelConfig,
  replaceAll,
  toHumpName,
  toComponentName,
  makeBasicDefinition
} from './utils'

const outputDir = path.join(__dirname, '../', 'dist')
const sourceFile = path.join(__dirname, '../', '.source')

export default (async () => {
  await fs.remove(outputDir)
  const html = await fs.readFile(sourceFile, 'utf8')
  const document = new JSDOM(html).window.document

  let exports = ''
  let definition = makeBasicDefinition()

  const icons = document.querySelectorAll('.geist-list .icon')
  const svgo = new SVGO(svgoConfigs)
  const promises = Array.from(icons).map(async (icon: Element) => {
    const name: string = icon.querySelector('.geist-text').textContent
    const componentName = toComponentName(name)
    const fileName = toHumpName(name)

    const svg = icon.querySelector('svg')
    const { data: optimizedSvgString } = await svgo.optimize(svg.outerHTML)
    const styles = parseStyles(svg.getAttribute('style'))

    const component = `import React from 'react';
const ${componentName} = ({ color = 'currentColor', size = 24, ...props }) => {
  return ${parseSvg(optimizedSvgString, styles)};
}
export default ${componentName};`

    exports += `export { default as ${componentName} } from './${fileName}';\n`
    definition += `export const ${componentName}: Icon;\n`

    const componentDefinition = `${makeBasicDefinition()}declare const ${componentName}: Icon;
export default ${componentName}\n`
    const componentCode = transform(component, moduleBabelConfig).code
    await fs.outputFile(path.join(outputDir, `${fileName}.d.ts`), componentDefinition)
    await fs.outputFile(path.join(outputDir, `${fileName}.js`), componentCode)
  })

  await Promise.all(promises)
  const allModulesCode = transform(exports, allModulesBabelConfig).code
  await fs.outputFile(path.join(outputDir, 'index.d.ts'), definition)
  await fs.outputFile(path.join(outputDir, 'index.js'), allModulesCode)
})()

const parseSvg = (svg: string, styles: any) => {
  const getSpecifiedColorVar = (val: string | undefined, ident: string) => {
    if (!val) return '""'
    return val.includes(ident) ? '{color}' : '"var(--zeit-icons-background)"'
  }

  svg = svg.replace(/-([a-z])(?=[a-z\-]*[=\s/>])/g, (g) => g[1].toUpperCase())
  svg = svg.replace(/<svg([^>]+)>/, `<svg$1 {...props} height={size} width={size} style={{color}}>`)

  const geistFillColor = getSpecifiedColorVar(styles['--geist-fill'], 'current')
  const geistStrokeColor = getSpecifiedColorVar(styles['--geist-stroke'], 'current')

  // With ZEIT UI
  // Refer to: https://github.com/zeit-ui/react/pull/139/files#diff-b174da32165cea69128b525762abb680R22
  svg = replaceAll(svg, '"var(--geist-foreground)"', '{color}')
  svg = replaceAll(svg, '"var(--geist-background)"', '"var(--zeit-icons-background)"')

  // Reset dynamic colors
  // In a few icons, the semantics of 'fill' and 'stroke' are not correct,
  // they maybe forced to override by style.
  svg = replaceAll(svg, '"var(--geist-fill)"', geistFillColor)
  svg = replaceAll(svg, '"var(--geist-stroke)"', geistStrokeColor)
  return svg
}

const parseStyles = (inlineStyle = '') =>
  inlineStyle.split(';').reduce((styleObject, stylePropertyValue) => {
    // extract the style property name and value
    let [property, value] = stylePropertyValue
      .split(/^([^:]+):/)
      .filter((val, i) => i > 0)
      .map((item) => item.trim().toLowerCase())

    styleObject[property] = value
    return styleObject
  }, {})
