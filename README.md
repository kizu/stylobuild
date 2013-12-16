# Stylobuild [![Build Status][build]][build-link] [![NPM version][version]][version-link]
[build]: https://travis-ci.org/kizu/stylobuild.png?branch=master
[build-link]: https://travis-ci.org/kizu/stylobuild
[version]: https://badge.fury.io/js/stylobuild.png
[version-link]: http://badge.fury.io/js/stylobuild

“Stylobuild” is a workflow for building Stylus files using the best tools for the job:

1. [Autoprefixer](https://github.com/ai/autoprefixer) for adding all the vendor prefixes.

2. [Pixrem](https://github.com/robwierzbowski/node-pixrem) for the `rem` fallback.

3. [CSSO](https://github.com/css/csso) for CSS minification.

This is only the start: in future some other tools would be added to this list.

## Installation

``` sh
npm install --save stylobuild
```

## Usage

Just `use` the stylobuild in your `.styl` stylesheet like this:

``` sass
use('node_modules/stylobuild')
```

Then add any styles:

``` sass
use('node_modules/stylobuild')

body
  padding: 0.5rem 1rem
  box-shadow: 3px 3px 5px #ccc
  transform: scale(2)
```

And they would have `rem` fallbacks, all the prefixes and the code would be nicely minified:

``` css
body{padding: 5px 10px;padding:.5rem 1rem;-webkit-box-shadow:3px 3px 5px #ccc;box-shadow:3px 3px 5px #ccc;-webkit-transform:scale(2);-ms-transform:scale(2);transform:scale(2)}
```

You can also use stylobuild as js-plugin:

``` js
var stylus = require('stylus');
var stylobuild = require('stylobuild');

stylus(css).use(stylobuild());
```

- - -

This is a small work-in-progress project, as its version is in `0.x.x` semver, it could update with API-breaking changes, so it is better to use its strict versions.
