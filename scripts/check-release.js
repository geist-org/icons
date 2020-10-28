const fs = require('fs-extra')
const path = require('path')

const dist = path.join(process.cwd(), 'dist')

;(async () => {
  if (fs.existsSync(dist)) {
    console.log('> Abort. Release at root is not allowed.\n')
    process.exit(1)
  }
})()
