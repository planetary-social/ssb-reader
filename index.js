const pull = require('pull-stream')
const ssbClient = require('ssb-client')
const atomicFile = require('atomic-file')
const path = require('path')
const os = require('os')
const util = require('util')
const mkdirp = require('mkdirp')
const pullWrite = require('pull-write')
const debug = require('debug')

const log = debug('ssb-reader')

const reduce = (queue, data) => {
  if (queue === null) {
    queue = []
  } else {
    queue.push(data)
  }

  return queue
}
const cb = (err) => {
  if (err) throw err
}

const defaultManifest = {
  whoami: 'async',
  createLogStream: 'source'
}

module.exports = ({
  keys,
  name,
  max,
  write,
  remote: {
    host,
    port,
    key,
    caps, // Currently `caps` **does not work**. Use `~/.ssb/config` instead.
    manifest = defaultManifest
  } = {}
}) => {
  log('Connecting to SSB server')
  ssbClient(keys, { host, port, key, caps, manifest }, async (err, ssb) => {
    if (err) throw err
    log('Connected without errors')

    log('Ensuring config directory exists')
    const dir = path.join(os.homedir(), '.config', name)
    mkdirp.sync(dir)

    log('Ensuring that config file exists')
    const filePath = path.join(dir, 'status.json')

    log('Looking at location: %s', filePath)
    const file = atomicFile(filePath)

    const get = util.promisify(file.get)
    const set = util.promisify(file.set)

    log('Getting previous config')
    const { last } = await get().catch(async () => {
      log('Creating new config')
      const newValue = { last: 0 }
      await set(newValue)
      return newValue
    })

    log('Starting from timestamp: %d', last)

    log('Creating link stream')
    const source = ssb.createLogStream({
      gte: last,
      live: true
    })

    const asyncWrite = (messages, cb) => {
      write({ messages, ssb }).then(async () => {
        const count = messages.length

        if (count === 0) {
          log("0 new messages")
          return cb()
        } else {
          const lastMessage = messages[count - 1]
          await set({ last: lastMessage.timestamp }).catch(e => { throw e })

          log('Success: %s messages', count)
          cb()
        }
      }).catch((err) => {
        log('Failure: %s', err)
        cb(err)
      })
    }

    log('Starting pull from link stream')
    pull(
      source,
      pull.filter(msg => !msg.sync),
      pull.unique('key'),
      pullWrite(asyncWrite, reduce, max, cb)
    )
  })
}
