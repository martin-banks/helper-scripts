const args = process.argv
const newLocation = args
  .filter(a => a.toUpperCase().includes('LOCATION'))
  .map(a => a.replace(/LOCATION=/i, ''))

console.log(newLocation)
