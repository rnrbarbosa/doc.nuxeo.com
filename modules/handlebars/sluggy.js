'use strict';

// var debug  = require('debug')('metalsmith-sluggy');
var slug = require('slug');
slug.defaults.modes.pretty.lower = true;

var sluggy = function (text, options) {
    return (options && text) ? slug(text) : '';
};

module.exports = sluggy;
