let total = 0
const ssbReader = require('./')

ssbReader('foo', () => new Promise((resolve) => {
  total += 1
  console.log(total)
  resolve()
}))
