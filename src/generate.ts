import path from 'path'
import fs from 'fs-extra'
import { Window } from 'happy-dom'
import { optimize } from 'svgo'
import { transform } from '@babel/core'
import { svgoOptions } from './plugin'
import {
  moduleBabelConfig,
  allModulesBabelConfig,
  toHumpName,
  toComponentName,
  makeBasicDefinition,
  defineComponent,
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
  let definition = makeBasicDefinition()
  let exports = ''
  await Promise.all(
    elements.map(async element => {
      const { name, svg } = formatSvg(element)
      const componentName = toComponentName(name)
      const component = defineComponent(componentName, svg)
      const declare = `${makeBasicDefinition()}declare const ${componentName}:Icon;\n
      export default ${componentName};\n
      `
      const fileName = toHumpName(name)
      definition += `export const ${componentName}: Icon;\n`
      exports += `export { default as ${componentName} } from './${fileName}';\n`
      const code = transform(component, moduleBabelConfig).code
      await fs.outputFile(path.join(outputDir, `${fileName}.d.ts`), declare)
      await fs.outputFile(path.join(outputDir, `${fileName}.js`), code)
    }),
  )
  const allModulesCode = transform(exports, allModulesBabelConfig).code
  await fs.outputFile(path.join(outputDir, 'index.d.ts'), definition)
  await fs.outputFile(path.join(outputDir, 'index.js'), allModulesCode)
})()
