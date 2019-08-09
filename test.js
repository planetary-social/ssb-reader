const pull = require('pull-stream')

let total = 0
require('./')(pull.through(() => {
  total += 1
  console.log(total)
}))
