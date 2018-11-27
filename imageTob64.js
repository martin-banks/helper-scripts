const b64 = require('base64-img')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

const args = process.argv.slice(2)
const dir = args.length && args.find(a => a.startsWith('dir='))
const skip = {
  txt: args.length && args.find(a => a.startsWith('txt=')) === 'txt=false',
  js: args.length && args.find(a => a.startsWith('js=')) === 'js=false',
}

console.log('\n', JSON.stringify({ args, skip }, null, 2), '\n')

const cwd = process.cwd()
const destination = 'b64'
const whitelist = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'svg',
]

console.log('🤖   ', 'Processing image files in: ', cwd)

function getFiles () {
  return new Promise((resolve, reject) => {
    fs.readdir(cwd, (err, files) => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      const filePaths = files
        .filter(f => f[0] !== '.')
        .filter(f => whitelist.indexOf(f.split('.').slice(-1)[0]) !== -1)
        .filter(f => f.indexOf('.') !== -1)
      resolve(filePaths)
    })
  })
}

function writeFile ({ filename, content }) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(cwd, `${destination}/${filename}`), content, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

function b64Sync (file) {
  return new Promise((resolve, reject) => {
    b64.base64(path.join(cwd, file), async (err, content) => {
      const ext = file
        .split('.')
        .slice(-1)[0]
      const name = file
        .replace(/^_\d+/i, '') // remove index numbher from PS layer to image export
        .split('.')
        .slice(0, -1)
        .join('.')
      const jsModule = `export default \`${content}\``
      console.log('📷  ', 'Processing',{ file, name })
      try {
        !skip.txt && await writeFile({ filename: `${name}-${ext}.txt`, content })
        !skip.js && await writeFile({ filename: `${name}-${ext}.js`, content: jsModule })
        resolve(`${file} successfully processed`)
      } catch (err) {
        return reject(err)
      }
    })
  })
}

async function processFiles () {
  try {
    console.log('👓   ', 'Reading file list...')
    const files = await getFiles()
    if (!files.length) {
      console.log('\n🚫  ', 'No files to process.\n-- End of Line --\n')
      return
    }
    console.log('📁   ', 'Creating export folder: ', destination, '\n')
    await mkdirp.sync(path.join(cwd, destination))
    console.log(`📁   Files to process: ${JSON.stringify(files, null, 2)} \n`)

    for await (const file of files) {
      try {
        await b64Sync(file)
      } catch (err) {
        throw Error
      }
    }

    console.log('\n🏁   ', 'All files processed\n-- End of Line --\n')
  } catch (err) {
    console.log(err)
  }
}

processFiles()
