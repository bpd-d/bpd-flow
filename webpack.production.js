const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
function DtsBundlePlugin() { }
DtsBundlePlugin.prototype.apply = function (compiler) {
    compiler.plugin('done', function () {
        var dts = require('dts-bundle');
        dts.bundle({
            name: 'cui-light',
            main: 'dist/typings/index.d.ts',
            out: '../index.d.ts',
            removeSource: true,
            outputAsModuleFolder: true // to use npm in-package typings
        });

        // Delete unneeded files

    });
};
module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        runtimeChunk: false,
        minimize: true,
        minimizer: [new TerserPlugin({
            sourceMap: true,
            extractComments: false
        })]
    },
    plugins: [
        new DtsBundlePlugin()
    ]
});