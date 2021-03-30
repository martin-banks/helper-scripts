

// ? In order to use LAT and LONG to plot items on a THREE.js sphere,
// ? they must first be converted to the appropriate angles represent
const phi = (90 - lat) * (Math.PI / 180)
const theta = (lng + 180) * (Math.PI / 180)


// ? These angles can then be used to calculate the x, y, z coords
// ? used to plot them in 3d space as a child of a parent model (shpere)
// ? These coords are relative to the center of the parent
const x = -1 * Math.sin(phi) * Math.cos(theta)
const z = Math.sin(phi) * Math.sin(theta)
const y = Math.cos(phi)


// ? These values can then be multiplied by a radius value that will shift them from the center
// ? So for a child to appear appear on the "surface" of the parent, multiply by the radius of the parent
// ? increase or decrease this value to render above/below the "surface" respectively
const surfaceX = x * parent.radius
const surfaceZ = z * parent.radius
const surfaceY = y * parent.radius
