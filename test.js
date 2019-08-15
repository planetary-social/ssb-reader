let total = 0
const ssbReader = require('./')
const crypto = require('crypto')

const randomHex = crypto.randomBytes(8).toString('hex')
ssbReader({
  name: `foo${randomHex}`,
  max: 100000,
  write: (messages) => new Promise((resolve) => {
    total += messages.length
    console.log({ total })
    setTimeout(resolve, 1000 + (1000 * Math.random()))
  })
})
