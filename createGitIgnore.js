const fs = require('fs')
const path = require('path')
const https = require('https')

// Create a new .gitignore file using the api from:
// https://www.gitignore.io

// Default options
const options = [
	'macos',
	'windows',
	'node',
	'adobe',
	'sublimetext',
	'visualstudiocode',
	'vim',
].join('%2C')

// Build options into the require url
const ignoreSource = `https://www.gitignore.io/api/${options}`

// This is the directory the app was called from
const cwd = process.cwd()

// Get args from the call sctring
const args = process.argv.slice(2)

const addIgnores = ignores => `
### Additional custom ignores ###
${ignores.join('\n')}


`

// Make the reques to the api
https.get(ignoreSource, res => {
	// Temp variable to store data from stream
	let output = addIgnores(args)

	// tell it what enc type to use so we can do stuff with it
	res.setEncoding('utf8')

	// When the data comes in ...
	res.on('data', d => {
		// ... write it into the output variable
		output += d
	})
	// When the data stops coming ...
	res.on('end', () => {
		// ... get the output object and write to file
		// using the cwd path captured when the app started
		fs.writeFile(path.join(cwd, `/.gitignore`), output, err => {
			if (err) return console.log('OH NOO!!\n', err)
			return console.log('Ignore file created')
		})
	})
	// Nothing left to do, the 'end' command stops the request function
})
	.on('error', console.log) // just in case

