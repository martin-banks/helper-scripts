const b64 = require('base64-img')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

const args = process.argv.slice(2)
const dir = args.length && args.find(a => a.startsWith('dir='))

const cwd = process.cwd()

const destination = 'b64'

console.log({ cwd })

function getFiles () {
  return new Promise((resolve, reject) => {
    fs.readdir(cwd, (err, files) => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      const filePaths = files
        .filter(f => f.indexOf('.') !== -1)
        .filter(f => f[0] !== '.')
        // .map(f => `${cwd}/${f}`)
      resolve(filePaths)
    })
  })
}

// function readFile (filename) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(path.join(__dirname, `thumbnails/${filename}`), (err, data) => {
//       if (err) reject(err)
//       resolve(data)
//     })
//   })
// }

function writeFile ({ filename, content }) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(cwd, `${destination}/${filename}`), content, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

async function processFiles () {
  try {
    const files = await getFiles()
    await mkdirp.sync(path.join(cwd, destination))
    files.forEach(async file => {
      try {
        b64.base64(path.join(cwd, file), async (err, content) => {
          const ext = file
            .split('.')
            .slice(-1)[0]
          const name = file
            .split('.')
            .slice(0, -1)
            .join('.')

          const jsModule = `export default \`${content}\``
          console.log({ file, name })

          await writeFile({ filename: `${name}.txt`, content })
          await writeFile({ filename: `${name}.js`, content: jsModule })
        })
      } catch (err) {
        throw Error
      }
    })
  } catch (err) {
    console.log(err)
  }
}

processFiles()
