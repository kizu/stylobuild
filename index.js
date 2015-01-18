var autoprefixer = require('autoprefixer');
var csso = require('csso');
var cleancss = require('clean-css');
var csswring = require('csswring');
var pixrem = require('pixrem');

var stylobuild_autoprefixer = function(stylobuild) {
    if (stylobuild.options.ie !== true && stylobuild.options.autoprefixer !== false) {
        var autoprefixer_browsers = (stylobuild.options.autoprefixer && stylobuild.options.autoprefixer.browsers) || [];
        var autoprefixer_preoptions = {};
        var autoprefixer_options = stylobuild.options.autoprefixer !== true && stylobuild.options.autoprefixer || {};
        if (autoprefixer_browsers.length) {
            autoprefixer_browsers = autoprefixer_browsers.split(/,\s*/);
        }

        // Apply proper from/to urls
        if (stylobuild.sourcemap) {
            if (!autoprefixer_options.from) {
                autoprefixer_options['from'] = stylobuild.sourcemap.from;
            }
            if (!autoprefixer_options.to) {
                autoprefixer_options['to'] = stylobuild.sourcemap.to;
            }
        }

        if (stylobuild.options.autoprefixer && stylobuild.options.autoprefixer.cascade) {
            autoprefixer_preoptions['cascade'] = true;
        } else {
            autoprefixer_preoptions['cascade'] = false;
        }
        if (autoprefixer_browsers.length) {
            autoprefixer_preoptions['browsers'] = autoprefixer_browsers;
        }
        stylobuild.css = autoprefixer(autoprefixer_preoptions).process(stylobuild.css, autoprefixer_options).css;
    }
}

var stylobuild_get_default_minifier = function(stylobuild) {
    if (!stylobuild.options.minifier && stylobuild.options.minifier !== false) {
        if (stylobuild.sourcemap || stylobuild.options.csswring) {
            stylobuild.options['minifier'] = 'csswring';
        } else if (stylobuild.options.cleancss) {
            stylobuild.options['minifier'] = 'cleancss';
        } else {
            stylobuild.options['minifier'] = 'csso';
        }
    }
}

var stylobuild_csso = function(stylobuild) {
    if (!stylobuild.sourcemap && stylobuild.options.csso !== false && stylobuild.options.minifier === 'csso') {
        var csso_restructure_off = (stylobuild.options.csso && stylobuild.options.csso['restructure-off']) || false
        stylobuild.css = csso.justDoIt(stylobuild.css, csso_restructure_off);
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
        if (stylobuild.sourcemap) {
            csswring_postcss_options['map'] = true;
            if (!csswring_options.from) {
                csswring_postcss_options['from'] = stylobuild.sourcemap.from;
            }
            if (!csswring_options.to) {
                csswring_postcss_options['to'] = stylobuild.sourcemap.to;
            }
        }
        stylobuild.css = csswring.wring(stylobuild.css, csswring_postcss_options).css;
    }
}

var stylobuild_pixrem = function(stylobuild) {
    if (stylobuild.options.pixrem !== false) {
        var pixrem_rootvalue = (stylobuild.options.pixrem && stylobuild.options.pixrem.rootvalue) || '10px';
        var pixrem_options = stylobuild.options.pixrem !== true && stylobuild.options.pixrem || {};
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
        stylobuild.css = pixrem.process(stylobuild.css, pixrem_rootvalue, pixrem_options, pixrem_postcss_options);
    }
}

module.exports = function(options) {
    return function(style) {
        this.on('end', function(err, css) {
            var stylobuild = {
                css: css
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

            return stylobuild.css;
        });
    };
};
