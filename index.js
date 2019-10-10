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

const reduce = undefined

const pullCb = (err) => {
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
    let { last } = await get().catch(async () => {
      log('Creating new config')
      const newValue = { last: 0 }
      await set(newValue)
      return newValue
    })

    log('Starting from seq: %d', last)

    log('Creating link stream')
    const source = ssb.createLogStream({
      seq: last,
      live: true,
      keys: true
    })

    const asyncWrite = (messages, cb) => {
      const count = messages.length
      const isEmpty = count === 0

      if (isEmpty === true) {
        log('No messages to write')
        cb(null)
      } else {
        log(`Attempting to write ${count} messages`)
        write({ messages, ssb }).then(async () => {
          log('Success: %s messages', count)
          last += count
          log('Setting new seq: %s', last)
          await set({ last }).catch(e => { throw e })
          cb(null)
        }).catch((err) => {
          log('Failure: %s', err)
          cb(err)
        })
      }
    }

    log('Starting pull from link stream')
    pull(
      source,
      pull.through(() => {
        log('New message!')
      }),
      pullWrite(asyncWrite, reduce, max, pullCb)
    )
  })
}
