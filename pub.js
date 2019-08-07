// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');

// Creates a client
const pubsub = new PubSub();

/**
 * TODO(developer): Uncomment the following lines to run the sample.
 */
const topicName = 'messages-unprocessed';
const data = JSON.stringify({ foo: 'bar' });

// Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
const dataBuffer = Buffer.from(data);

async function postMessage() {
    const messageId = await pubsub.topic(topicName).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);

}
postMessage();

