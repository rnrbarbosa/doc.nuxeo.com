'use strict';
/* eslint-env es6 */

// Debugging
const {debug, warn, error} = require('../debugger')('metalsmith-get-assets');

// npm packages
const Joi = require('joi');
const path = require('path');
const readdirs = require('recursive-readdir');

// options schema
const schema = Joi.object().keys({
    path       : Joi.string().required(),
    path_prefix: Joi.string().optional().allow('').default('')
});

const get_assets = function (options) {
    debug('Options: %o', options);
    return function (files, metalsmith, done) {
        const metadata = metalsmith.metadata();
        metadata.assets = metadata.assets || {};

        debug('path_prefix: %s', options.path_prefix);
        // Check options fits schema
        let schema_err;
        schema.validate(options, function (err, value) {
            if (err) {
                error('Validation failed, %o', err.details[0].message);
                schema_err = err;
            }
            options = value;
        });
        if (schema_err) {
            return done(schema_err);
        }

        // Get assets list
        readdirs(options.path, function (err, asset_filenames) {
            if (err) {
                error('Problem reading assets directory');
                return done(err);
            }

            // Files is an array of filename
            asset_filenames.forEach(asset_filename => {
                // Strip the path and add the path prefix
                asset_filename = path.relative(options.path, asset_filename);

                const asset_info = path.parse(asset_filename);
                const asset_path = asset_info.dir.split(path.sep);
                const space = asset_path.shift();
                const page = asset_path.join(path.sep);

                if (metadata.assets[asset_filename]) {
                    warn('Duplicate key found: "%s"', asset_filename);
                }
                else {
                    let filename = path.join(options.path_prefix, asset_filename);
                    metadata.assets[filename] = {
                        url    : path.sep + filename,
                        id     : asset_info.base,
                        version: options.path_prefix,
                        space,
                        page
                    };
                }
            });

            return done();
        });
        return void 0;
    };
};

module.exports = get_assets;
