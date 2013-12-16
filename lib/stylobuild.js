var autoprefixer = require('autoprefixer');
var csso = require('csso');
var pixrem = require('pixrem');

module.exports = function() {
    return function() {
        this.on('end', function(err, css) {
            var result = css;
            result = autoprefixer.compile(result);
            result = csso.justDoIt(result);
            result = pixrem(result, '10px');
            return result;
        });
    };
};
