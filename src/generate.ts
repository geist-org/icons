import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
import fs from 'fs-extra'
import path from 'path'
import { transform } from '@babel/core'
import {
  moduleBabelConfig, allModulesBabelConfig, replaceAll,
  toHumpName, toComponentName, makeBasicDefinition,
} from './utils'

const outputDir = path.join(__dirname, '../', 'dist')
const sourceFile = path.join(__dirname, '../', '.source')

export default (async () => {
  await fs.remove(outputDir)
  let html = ''
  try {
    html = await fs.readFile(sourceFile, 'utf8')
  } catch (err) {
    const res = await fetch('https://vercel.com/design/icons')
    html = await res.text()
    fs.writeFile(sourceFile, html).catch(console.log)
  }

  const document = new JSDOM(html).window.document
  let exports = ''
  let definition = makeBasicDefinition()
  const singleDefinition = `${makeBasicDefinition()}declare const _default: Icon;\nexport default _default\n`

  const icons = document.querySelectorAll('.geist-list .icon')
  const promises = Array.from(icons).map((icon: Element) => {
    const name: string = icon.querySelector('.geist-text').textContent
    const componentName = toComponentName(name)
    const fileName = toHumpName(name)

    const svg = icon.querySelector('svg')
    const styles = parseStyles(svg.getAttribute('style'))
    svg.removeAttribute('style')

    const component = `import React from 'react';
const ${componentName} = ({ color, size, ...props }) => {
  const sizeProps = size ? { height: size, width: size } : {};
  return ${parseSvg(svg.outerHTML, styles)};
}
export default ${componentName};`

    exports += `export { default as ${componentName} } from './${fileName}';\n`
    definition += `export const ${componentName}: Icon;\n`
    
    fs.outputFile(
      path.join(outputDir, `${fileName}.d.ts`),
      singleDefinition,
    )
    return fs.outputFile(
      path.join(outputDir, `${fileName}.js`),
      transform(component, moduleBabelConfig).code,
    )
  })

  await Promise.all(promises)
  await fs.outputFile(path.join(outputDir, 'index.d.ts'), definition)
  await fs.outputFile(
    path.join(outputDir, 'index.js'),
    transform(exports, allModulesBabelConfig).code,
  )
})()

const parseSvg = (svg: string, styles: any) => {
  // Reactify attrs
  svg = svg.replace(/-([a-z])/g, (g) => g[1].toUpperCase())

  // Inject props
  const stylesString = JSON.stringify(styles)
  svg = svg.replace(/<svg([^>]+)>/, `<svg$1 {...props} {...sizeProps} style={${stylesString}}>`)

  // With ZEIT UI
  // Refer to: https://github.com/zeit-ui/react/pull/139/files#diff-b174da32165cea69128b525762abb680R22
  svg = replaceAll(svg, '"var(--geist-foreground)"', 'color || "currentColor"')
  svg = replaceAll(svg, '"var(--geist-background)"', '"var(--zeit-icons-background)"')
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
