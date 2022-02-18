# ssb-reader

Process batches of SSB messages with promises.

## Usage

```javascript
const ssbReader = require('ssb-reader')

ssbReader({
  name: `vacuum`,
  max: 1000,
  write: (messages) => new Promise((resolve) => {
    console.log(messages)
    resolve()
  })
})

```

## Installation

ssb-reader wants write access to $HOME/.config/ssb-to-pubsub/status.json so it can save the timestamp of the last processed message. This allows it to pick up where it left off after a restart.

### Source code

```shell
git clone https://github.com/planetary-social/ssb-reader.git
cd ssb-reader
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

## License

Apache-2.0

