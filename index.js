var autoprefixer = require('autoprefixer');
var csso = require('csso');
var pixrem = require('pixrem');

module.exports = function(options) {
    return function(style) {
        this.on('end', function(err, css) {
            var result = css;
            var sourcemap = style.sourcemap;
            options = options || {};

            // Do not use the fallback options
            if (options.filename && options.Evaluator) {
                options = {};
            }

            // Using the autoprefixer
            if (options.ie !== true && options.autoprefixer !== false) {
                var autoprefixer_browsers = (options.autoprefixer && options.autoprefixer.browsers) || [];
                var autoprefixer_preoptions = {};
                var autoprefixer_options = options.autoprefixer || {};
                if (autoprefixer_browsers.length) {
                    autoprefixer_browsers = autoprefixer_browsers.split(/,\s*/);
                }

                // Apply proper from/to urls
                if (sourcemap) {
                    if (!autoprefixer_options.from) {
                        autoprefixer_options['from'] = style.options.filename.match(/^(?:.*\/)?([^\/]+)$/)[1];
                    }
                    if (!autoprefixer_options.to) {
                        autoprefixer_options['to'] = sourcemap.file.match(/^(?:.*\/)?([^\/]+)$/)[1];
                    }
                }

                if (options.autoprefixer && options.autoprefixer.cascade) {
                    autoprefixer_preoptions['cascade'] = true;
                } else {
                    autoprefixer_preoptions['cascade'] = false;
                }
                autoprefixer_browsers.push(autoprefixer_preoptions);
                result = autoprefixer.apply(true, autoprefixer_browsers).process(result, autoprefixer_options).css;
            }

            // Using the CSSO (disable when using sourcemaps)
            if (!sourcemap && options.csso !== false) {
                var csso_restructure_off = (options.csso && options.csso['restructure-off']) || false
                result = csso.justDoIt(result, csso_restructure_off);
            }

            // Using the pixrem
            if (!sourcemap && options.pixrem !== false) {
                var pixrem_rootvalue = (options.pixrem && options.pixrem.rootvalue) || '10px';
                var pixrem_options = options.pixrem || {};
                if (options.ie === true && pixrem_options.replace === undefined) {
                    pixrem_options.replace = true;
                }
                result = pixrem(result, pixrem_rootvalue, pixrem_options);
            }

            return result;
        });
    };
};
