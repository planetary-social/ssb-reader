let total = 0
const ssbReader = require('./')
const crypto = require('crypto')

const randomHex = crypto.randomBytes(8).toString('hex')
ssbReader({
  name: `foo${randomHex}`,
  max: 1000,
  write: ({ messages, ssb }) => new Promise((resolve) => {
    console.log('write called')
    ssb.whoami((err, val) => { console.log(err, val) })
    total += messages.length
    console.log({ total })
    setTimeout(resolve, 1000 + (1000 * Math.random()))
  }),
  remote: {
    host: '10.142.0.5',
    port: 7117,
    caps: {
      shs: 'ci7xtn85ZYYxGegtWHaSk9LRKtH/PsxmBuVfC0vWYAk=',
      sign: 'jKCBtO4iVe/j/4rL65yxIxcMu2X88gcU0iChF7GFLH4='
    }
  }
})
