# Stylobuild [![Build Status][build]][build-link] [![NPM version][version]][version-link]
[build]: https://travis-ci.org/kizu/stylobuild.png?branch=master
[build-link]: https://travis-ci.org/kizu/stylobuild
[version]: https://badge.fury.io/js/stylobuild.png
[version-link]: http://badge.fury.io/js/stylobuild

“Stylobuild” is a workflow for building Stylus files using the best tools for the job:

1. [Autoprefixer][] for adding all the vendor prefixes.

2. [Pixrem][] for the `rem` fallback.

3. [CSSO][], [CSSWring][] or [clean-css][] for CSS minification.

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
body{padding:5px 10px;padding:.5rem 1rem;box-shadow:3px 3px 5px #ccc;-webkit-transform:scale(2);-ms-transform:scale(2);transform:scale(2)}
```

You can also use stylobuild as js-plugin:

``` js
var stylus = require('stylus');
var stylobuild = require('stylobuild');

stylus(css).use(stylobuild());
```

## Options

You can pass an options object to stylobuild.

In `.styl`:

``` sass
use('node_modules/stylobuild', {
  // Your options here
})
```

In `.js`:

``` js
stylus(css).use(stylobuild({
  // Your options here
}));

```

### IE mode

If you're generating a file only for old IE, you would want to tell stylobuild about this:

``` sass
use('node_modules/stylobuild', {
  ie: true
})
```

When you pass `ie: true` option to stylobuild, it wouldn't apply autoprefixer and would replace rems with their fallbacks values instead of prepending them.

In future there would be an option to create styles for IE automatically, using [if-ie.styl](https://github.com/kizu/if-ie.styl)

### Source maps

If you're using sourcemaps in Stylus, the plugins that do not support them (CSSO, clean-css) would be disabled.

Also, only inline sourcemaps are working right now, the support for external source maps would be implemented later.

### Choosing the minifier

By default Stylobuild uses CSSO as a minifier, but if you would enable source maps, then CSSWring would become the default one.

However, you can choose the minifier manually by setting the `minifier` option to one of the available ones: `csso`, `csswring`, `cleancss`:

``` sass
use('node_modules/stylobuild', {
  minifier: 'cleancss'
})
```

You can disable minifier by adding `minifier: false` to the options.

Also, note that you can omit setting the `minifier` setting if you're setting the options for this minifier:

``` sass
use('node_modules/stylobuild', {
  cleancss: {
    noAdvanced: true
  }
})
```

would apply the clean-css with the given options. Alternatively, you can just set the name of the minifier to `true` to just enable it:

``` sass
use('node_modules/stylobuild', {
  cleancss: true
})
```

### Configuring [Autoprefixer][]

To configure autoprefixer, you would need to pass an object to `autoprefixer` key:

``` sass
use('node_modules/stylobuild', {
  autoprefixer: {
    browsers: "last 1 version, > 1%, Explorer 7"
  }
})
```

Right now only [browsers](https://github.com/ai/autoprefixer#browsers) option is supported.

### Configuring [CSSO][]

CSSO don't have that many options, it actually have only one option at the moment:

``` sass
use('node_modules/stylobuild', {
  csso: {
    restructure-off: true
  }
})
```

The `restructure-off` option would turn off the structure minification.

### Configuring [Pixrem][]

To configure Pixrem you need to use only one options object, while [in its raw form](https://github.com/robwierzbowski/node-pixrem#rootvalue) you need to use both an argument and an object.

``` sass
use('node_modules/stylobuild', {
  pixrem: {
    rootvalue: 16px
    replace: true
  }
})
```

### Configuring [clean-css][]

You can configure clean-css by passing a hash with the [list of options](https://github.com/jakubpawlowicz/clean-css/tree/v3.0.4#how-to-use-clean-css-programmatically) to the `cleancss`:

``` sass
use('node_modules/stylobuild', {
  minifier: 'cleancss'
  cleancss: {
    advanced: false
  }
})
```

### Disabling plugins

You can disable any of the used plugins using `false` instead of an options object for this plugin:

``` sass
use('node_modules/stylobuild', {
  csso: false
})
```

This would do all the things except minifying the code using CSSO.

- - -

This is a small work-in-progress project, as its version is in `0.x.x` semver, it could update with API-breaking changes, so it is better to use its strict versions.


[Autoprefixer]: https://github.com/ai/autoprefixer

[Pixrem]: https://github.com/robwierzbowski/node-pixrem

[CSSO]: https://github.com/css/csso

[CSSWring]: https://github.com/hail2u/node-csswring

[clean-css]: https://github.com/jakubpawlowicz/clean-css
