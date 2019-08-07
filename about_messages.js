const Connection = require('ssb-client')
const paramap = require('pull-paramap')
const pull = require('pull-stream')
const FormData = require('form-data')
const debug = require('debug')('about-monitor')
const fs = require('fs')
const path = require('path')
const os = require('os')
// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');

// Creates a client
const pubsub = new PubSub();

const topicName = 'my-topic';

debug.enabled = true
module.exports = {
  projectId: '[your Google Developers Console project ID]',
  keyFilename: './key.json',
  // ...
};

debug('Connecting')

Connection((err, server) => {
  if (err) throw err
  debug('Connection established')

  const opts = {
    limit: 1000,
    reverse: true
  }

  pull(
    server.query.read(opts),
    pull.filter(msg => msg.value.content.type === 'about'),
    pull.collect(onDone(server))
  )
})

const onDone = (server) => function onDone (err, msgs) {
  if (err) {
    console.error(err)
    server.close()
    return
  }

  // First step is extracting the relevant details from the about messages.
  const aboutMap = msgs.reduce((acc, msg) => {

    //hack to avoid putting about messages from gatherings in the directory
    if (msg.value.startDateTime == undefined ) {
        // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
        const dataBuffer = Buffer.from(JSON.stringify(msg));

        async function postMessage() {
            const messageId = await pubsub.topic(topicName).publish(dataBuffer);
            console.log(`Message ${messageId} published.`);
        }
        postMessage();
    }
    return acc
  }, {})}

pull.collect(function (err, responses) {
    if (err) {
    debug('ERROR:', err)
    }
    debug(`Processed ${responses.length} about messages`)
    server.close()
})