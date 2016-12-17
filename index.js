var postcss = require('postcss');
var autoprefixer = require('autoprefixer');
var csso = require('csso');
var cleancss = require('clean-css');
var csswring = require('csswring');
var pixrem = require('pixrem');

var stylobuild_postcss = function(stylobuild) {
    var postcss_options = {};
    if (stylobuild.sourcemap) {
        postcss_options['map'] = true;
        postcss_options['from'] = stylobuild.sourcemap.from;
        postcss_options['to'] = stylobuild.sourcemap.to;
    }
    if (stylobuild.postcss_plugins.length) {
        stylobuild.css = postcss(stylobuild.postcss_plugins).process(stylobuild.css, postcss_options).css;
    }
};

var stylobuild_autoprefixer = function(stylobuild) {
    if (stylobuild.options.ie !== true && stylobuild.options.autoprefixer !== false) {
        var autoprefixer_browsers = (stylobuild.options.autoprefixer && stylobuild.options.autoprefixer.browsers) || [];
        var autoprefixer_options = {};
        if (autoprefixer_browsers.length) {
            autoprefixer_browsers = autoprefixer_browsers.split(/,\s*/);
        }

        if (stylobuild.options.autoprefixer && stylobuild.options.autoprefixer.cascade) {
            autoprefixer_options['cascade'] = true;
        } else {
            autoprefixer_options['cascade'] = false;
        }
        if (autoprefixer_browsers.length) {
            autoprefixer_options['browsers'] = autoprefixer_browsers;
        }

        stylobuild.postcss_plugins.push(autoprefixer(autoprefixer_options));
    }
}

var stylobuild_get_default_minifier = function(stylobuild) {
    if (!stylobuild.options.minifier && stylobuild.options.minifier !== false) {
        if (stylobuild.sourcemap || stylobuild.options.csso) {
            stylobuild.options['minifier'] = 'csso';
        } else if (stylobuild.options.cleancss) {
            stylobuild.options['minifier'] = 'cleancss';
        } else if (stylobuild.options.csswring) {
            stylobuild.options['minifier'] = 'csswring';
        } else {
            stylobuild.options['minifier'] = 'csso';
        }
    }
}

var stylobuild_csso = function(stylobuild) {
    if (stylobuild.options.csso !== false && stylobuild.options.minifier === 'csso') {
        var csso_options = stylobuild.options.csso !== true && stylobuild.options.csso || {};
        if (csso_options['restructure-off']) {
            csso_options.restructure = !csso_options['restructure-off'];
        }
        stylobuild.css = csso.minify(stylobuild.css, csso_options).css;
    }
}

var stylobuild_cleancss = function(stylobuild) {
    if (!stylobuild.sourcemap && stylobuild.options.cleancss !== false && stylobuild.options.minifier === 'cleancss') {
        var cleancss_options = stylobuild.options.cleancss !== true && stylobuild.options.cleancss || {};
        stylobuild.css = new cleancss(cleancss_options).minify(stylobuild.css).styles;
    }
}

var stylobuild_csswring = function(stylobuild) {
    if (stylobuild.options.csswring !== false && stylobuild.options.minifier === 'csswring') {
        var csswring_options = stylobuild.options.csswring !== true && stylobuild.options.csswring || {};
        csswring_postcss_options = csswring_options.postcss || {};
        stylobuild.postcss_plugins.push(csswring(csswring_options));
    }
}

var stylobuild_pixrem = function(stylobuild) {
    if (stylobuild.options.pixrem !== false) {
        var pixrem_options = stylobuild.options.pixrem !== true && stylobuild.options.pixrem || {};
        var pixrem_rootvalue = (stylobuild.options.pixrem && stylobuild.options.pixrem.rootvalue) || '10px';
        pixrem_options.rootValue = pixrem_options.rootValue || pixrem_rootvalue;
        if (pixrem_options.rootvalue) {
            delete pixrem_options.rootvalue;
        }

        if (stylobuild.options.ie === true && pixrem_options.replace === undefined) {
            pixrem_options.replace = true;
        }
        pixrem_postcss_options = pixrem_options.postcss || {};
        if (stylobuild.sourcemap) {
            if (!pixrem_options.from) {
                pixrem_postcss_options['from'] = stylobuild.sourcemap.from;
            }
            if (!pixrem_options.to) {
                pixrem_postcss_options['to'] = stylobuild.sourcemap.to;
            }
        }
        stylobuild.postcss_plugins.push(pixrem(pixrem_options));
    }
}

module.exports = function(options) {
    return function(style) {
        this.on('end', function(err, css) {
            var stylobuild = {
                css: css,
                postcss_plugins: []
            }
            if (style.sourcemap) {
                stylobuild['sourcemap'] = {
                    map: style.sourcemap
                }
            }
            if (stylobuild.sourcemap) {
                stylobuild.sourcemap['from'] = style.options.filename.match(/^(?:.*\/)?([^\/]+)$/)[1];
                stylobuild.sourcemap['to'] = stylobuild.sourcemap.map.file.match(/^(?:.*\/)?([^\/]+)$/)[1];
            }

            stylobuild.options = options || {};

            // Do not use the fallback options
            if (stylobuild.options.filename && stylobuild.options.Evaluator) {
                stylobuild.options = {};
            }

            // Setup the default minifier
            stylobuild_get_default_minifier(stylobuild);

            // Applying postprocessors
            stylobuild_autoprefixer(stylobuild);

            // Applying minifiers
            stylobuild_csswring(stylobuild);
            stylobuild_csso(stylobuild);
            stylobuild_cleancss(stylobuild);

            // Applying postprocessors that should be applied after minifiers
            stylobuild_pixrem(stylobuild);

            // Applying all the postprocessors
            stylobuild_postcss(stylobuild);

            return stylobuild.css;
        });
    };
};
