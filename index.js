const pull = require('pull-stream')
const ssbClient = require('ssb-client')
const atomicFile = require('atomic-file')
const path = require('path')
const os = require('os')
const util = require('util')
const mkdirp = require('mkdirp')
const debug = require('debug')

const packageName = require('./package.json').name

const log = debug(packageName)

module.exports = (through) => {
  log('Connecting to SSB server')
  ssbClient(async (err, sbot) => {
    if (err) throw err
    log('Connected without errors')

    log('Ensuring config directory exists')
    const dir = path.join(os.homedir(), '.config', packageName)
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
    const source = sbot.createLogStream({
      gt: last,
      live: true
    })

    log('Starting pull from link stream')
    pull(
      source,
      pull.filter(msg => !msg.sync),
      pull.unique('key'),
      through,
      pull.drain()
    )
  })
}
