const fs = require('fs-extra')
const path = require('path')
const outputPath = path.join(__dirname, '../dist')
const rootPath = path.join(__dirname, '../')
const shouldMovedFiles = [
  'LICENSE',
  'README.md',
  'package.json',
  'scripts',
  '.npmignore',
]

;(async () => {
  await Promise.all(shouldMovedFiles.map(async name => {
    const filePath = path.join(rootPath, name)
    const outputFilePath = path.join(outputPath, name)
    await fs.copy(filePath, outputFilePath)
  }))
  console.log('All files moved.')
})()
