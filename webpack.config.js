'use strict';

// Assume production if not set
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
}

var webpack = require('webpack');
var path    = require('path');

module.exports = {
    entry: {
        docs  : './client/js/docs.js',
        vendor: [
            '!!script!jquery/dist/jquery.js',
            '!!script!what-input/what-input.js',
            '!!script!foundation-sites/dist/foundation.js'
        ]
    },
    externals: {
        jquery: 'jQuery'
    },
    output: {
        path         : path.join(__dirname, 'assets/js/', '[hash]'),
        publicPath   : 'assets/js/[hash]/',
        filename     : '[name].[hash].bundle.js',
        chunkFilename: '[id].[hash].bundle.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery',
            $              : 'jquery',
            jQuery         : 'jquery'
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.bundle.js'),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            mangle: {
                except: ['$', 'jQuery', 'exports', 'require', 'foundation']
            }
        })
    ],
    module: {
        loaders: [
            {
                test   : /\.jsx?$/,         // Match both .js and .jsx files
                exclude: /node_modules/,
                loader : 'babel',
                query  : {
                    presets: ['react']
                }
            }
        ]
    },
    devtool: 'source-map'
};
