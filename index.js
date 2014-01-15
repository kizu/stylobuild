var autoprefixer = require('autoprefixer');
var csso = require('csso');
var pixrem = require('pixrem');

module.exports = function(options) {
    return function() {
        this.on('end', function(err, css) {
            var result = css;
            options = options || {};

            // Do not use the fallback options
            if (options.filename && options.Evaluator) {
                options = {};
            }

            // Using the autoprefixer
            var autoprefixer_browsers = (options.autoprefixer && options.autoprefixer.browsers) || [];
            var autoprefixer_options = options.autoprefixer || {};
            if (autoprefixer_browsers.length) {
                autoprefixer_browsers = autoprefixer_browsers.split(/,\s*/);
            }
            result = autoprefixer.apply(true, autoprefixer_browsers).process(result, autoprefixer_options).css;

            // Using the CSSO
            result = csso.justDoIt(result);

            // Using the pixrem
            var pixrem_rootvalue = (options.pixrem && options.pixrem.rootvalue) || '10px';
            var pixrem_options = options.pixrem || {};
            result = pixrem(result, pixrem_rootvalue, pixrem_options);
            return result;
        });
    };
};
