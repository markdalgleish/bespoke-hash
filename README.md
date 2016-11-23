[![Build Status](https://img.shields.io/travis/markdalgleish/bespoke-hash/master.svg?style=flat)](http://travis-ci.org/markdalgleish/bespoke-hash) [![Coverage Status](https://img.shields.io/coveralls/markdalgleish/bespoke-hash/master.svg?style=flat)](https://coveralls.io/r/markdalgleish/bespoke-hash)

# bespoke-hash

Hash Routing for [Bespoke.js](https://github.com/markdalgleish/bespoke.js)

## Download

Download the [production version][min] or the [development version][max], or use a [package manager](#package-managers).

[min]: https://raw.github.com/markdalgleish/bespoke-hash/master/dist/bespoke-hash.min.js
[max]: https://raw.github.com/markdalgleish/bespoke-hash/master/dist/bespoke-hash.js

## Usage

This plugin is shipped in a [UMD format](https://github.com/umdjs/umd), meaning that it is available as a CommonJS/AMD module or browser global.

For example, when using CommonJS modules:

```js
var bespoke = require('bespoke'),
  hash = require('bespoke-hash');

bespoke.from('article', [
  hash()
]);
```

When using browser globals:

```js
bespoke.from('article', [
  bespoke.plugins.hash()
]);
```

Starting from `#1`, all routes are numbered by default.

### Named Routes

If you'd like to use named hash routes instead, add `data-bespoke-hash` attributes to your slide markup.

```html
<article>
  <section data-bespoke-hash="catchy-title"></section>
  <section data-bespoke-hash="shameless-plug"></section>
  <section data-bespoke-hash="controversial-statement"></section>
  <section data-bespoke-hash="explanation-of-controversial-statement"></section>
  <section data-bespoke-hash="shameless-self-promotion"></section>
</article>
```

### Disabling updates

You can prevent the URL from being updated after the initial page load by setting the `update` option to `false`. This switch allows you to respond to incoming changes from the URL, but not continue updating the URL when the slide changes.

```
bespoke.from('article', [
  bespoke.plugins.hash({ update: false })
]);
```

Default value: `true`

### History control

You can control whether this browser history is updated using the `history` option. A value of `false` overwrites the last history entry each time the slide is changed (assuming the `update` option is not `false`).

```
bespoke.from('article', [
  bespoke.plugins.hash({ history: false })
]);
```

If updates are disabled and the value of the `history` option is false, the hash will be removed from the URL after the deck is loaded.

Default value: `true`

## Package managers

### npm

```bash
$ npm install bespoke-hash
```

### Bower

```bash
$ bower install bespoke-hash
```

## Credits

This plugin was built with [generator-bespokeplugin](https://github.com/markdalgleish/generator-bespokeplugin).

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
