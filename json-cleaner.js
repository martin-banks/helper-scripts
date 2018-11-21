const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2)
const cwd = process.cwd()

console.log({ args })

args.forEach(arg => {
  console.log(`Processing file: ${arg}`)

  fs.readFile(path.join(cwd, arg), 'utf8', (err, data) => {
    if (err) return console.log(err)

    const filename = arg
      .split('.')
      .join('-cleaned.')

    const parsedContent = JSON.parse(data)
      .reduce((output, item) => {
        const update = output

        const corrections = Object.keys(item)
          .reduce((output, key) => {
            const update = output
            if (!item[key]) return update
            update[key] = item[key]

            if (typeof item[key] === 'string') {
              update[key] = item[key]
                .replace(/“|”|``|’’|‘‘/gi, '"')
                .replace(/‘|’/gi, "'")
                .replace(/\s\s+/gi, ' ')
                .replace(/\r|\n/gi, '')
                .trim()
            }
            return update
          }, {})

        update.push(corrections)
        return update
      }, [])

    fs.writeFile(path.join(cwd, `_${filename}`), JSON.stringify(parsedContent, null, 2), err => {
      console.log(err || `_${filename}, complete`)
    })

    const cleaned = data
      .replace(/“|”|``|’’|‘‘/gi, '\\"')
      .replace(/‘|’/gi, "'")
      .replace(/\s\s+/gi, ' ')
      .replace(/\r|\n/gi, '')

    fs.writeFile(path.join(cwd, filename), cleaned, err => {
      console.log(err || `${filename}, complete`)
    })
  })
})
