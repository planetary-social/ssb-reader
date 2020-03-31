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

