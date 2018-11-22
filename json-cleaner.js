const fs = require('fs')
const path = require('path')

const cwd = process.cwd()
const args = process.argv.slice(2)
const filesToProcess = args.filter(a => !a.startsWith('-'))

// Can take some arguments to change processing settings
//   -u -> will create a uniquely name file
const options = args.filter(a => a.startsWith('-'))

console.log({ args, filesToProcess, options })

filesToProcess.forEach(file => {
  console.log(`Processing file: ${file}`)

  fs.readFile(path.join(cwd, file), 'utf8', (err, data) => {
    if (err) return console.log(err)
    const suffix = options.includes('-u') ? `.${Date.now()}` : ''
    const filename = file
      .split('.')
      .join(`.cleaned${suffix}.`)

    const parsedContent = JSON.parse(data)
      .reduce((parsedOutput, item) => {
        const parsedUpdate = parsedOutput

        const corrections = Object.keys(item)
          .reduce((output, key) => {
            const update = output
            if (!item[key]) return update
            update[key] = item[key]

            if (typeof item[key] === 'string') {
              update[key] = item[key]
                .replace(/“|”|``|’’|‘‘/gi, '"')
                .replace(/‘|’|`/gi, "'")
                .replace(/\s\s+/gi, ' ')
                .replace(/\r|\n/gi, '')
                .trim()
            }
            return update
          }, {})

        parsedUpdate.push(corrections)
        return parsedUpdate
      }, [])

    fs.writeFile(path.join(cwd, `${filename}`), JSON.stringify(parsedContent, null, 2), writeErr => {
      console.log(writeErr || `${filename}, complete`)
    })
  })
})
