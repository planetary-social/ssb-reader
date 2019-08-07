const { PubSub } = require('@google-cloud/pubsub')
const pubsub = new PubSub()

const topicName = 'messages-unprocessed'

module.exports = async (msg) => {
  const dataBuffer = Buffer.from(JSON.stringify(msg))
  return pubsub.topic(topicName).publish(dataBuffer)
}
