# ssb-to-pubsub

> Read SSB messages and publish them to Google Cloud Pub/Sub

Each relay server will have a different view of the network, which makes it
difficult to run common tasks (like sending notifications) that require some
information on the global state of the network. This utility should run on each
relay, ingesting each message and sending it to Google Cloud Pub/Sub so that
they can be streamed without bottlenecking on any individual server(s).

## Usage

```shell
npm start
```

## Installation

### Code

```shell
git clone git@github.com:VerseApp/ssb-to-pubsub.git
cd ssb-to-pubsub
```

### Dependencies

With [npm](https://npmjs.org/):

```shell
npm install
```

With [yarn](https://yarnpkg.com/en/):

```shell
yarn
```

## See Also

- [ssb-db](https://github.com/ssbc/ssb-db)
- [What Is Cloud Pub/Sub](https://cloud.google.com/pubsub/docs/overview)

## License

Apache-2.0

