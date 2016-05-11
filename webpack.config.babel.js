// 'use strict';
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const production = process.env.NODE_ENV == 'production'

const loaders = [
    {
        test: /\.jsx?$/,
        exclude: 'node_modules',
        loader: 'babel'
        // loader: 'babel?presets[]=react&presets[]=es2015'
    },
    {
        test: /\.css$/,
        loader: 'style!css'
    },
    {
        test: /\.jade$/,
        exclude: 'node_modules',
        loader: 'jade'
    },
    {
        test: /\.(scss|sass)$/,
        exclude: 'node_modules',
        loader: 'style!css!sass'
    },
    {
        test: /\.less$/,
        exclude: 'node_modules',
        loader: 'style!css!postcss!less'
    },
    {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=25000'
    },
    {
        test: /\.svg$/,
        loader: 'file'
    },
    {
        test: /\.(woff2?|eot|ttf)$/,
        loader: 'url?limit=100000'
    }
]

let plugins = [
    new HtmlWebpackPlugin({
        // title: 'OmoleWS',
        favicon: './img/logo.png',
        template: './index.jade',
        inject: 'body'
    }),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin({
        // name:      'main', // Move dependencies to our main file
        async: true, // Enable asynchronous chunks loading
        children:  true, // Look for common dependencies in all children,
        minChunks: 2 // How many times a dependency must come up before being extracted
    })
]

if (!production) {
    plugins = plugins.concat([
        new webpack.DefinePlugin({
            'process.env':   {
                BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            },
            production: JSON.stringify(production)
        }),

        new webpack.HotModuleReplacementPlugin(),
        new webpack.SourceMapDevToolPlugin()
    ])
} else {
    plugins = plugins.concat([

        // This plugins defines various variables that we can set to false
        // in production to avoid code related to them from being compiled
        // in our final bundle
        new webpack.DefinePlugin({
            __SERVER__:      !production,
            __DEVELOPMENT__: !production,
            __DEVTOOLS__:    !production,
            'process.env':   {
                BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            },
            production: JSON.stringify(production)
        }),

        // This plugin looks for similar chunks and files
        // and merges them for better caching by the user
        new webpack.optimize.DedupePlugin(),

        // This plugins optimizes chunks and modules by
        // how much they are used in your app
        new webpack.optimize.OccurenceOrderPlugin(),

        // This plugin prevents Webpack from creating chunks
        // that would be too small to be worth loading separately
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 51200 // =50kb
        }),

        // This plugin minifies all the Javascript code of the final bundle
        new webpack.optimize.UglifyJsPlugin({
            mangle:   true,
            compress: {
                warnings: false // Suppress uglification warnings
            }
        })
    ])
}

const config = {
    context: __dirname + '/src',
    entry: ['babel-polyfill', './'],
    output: {
        path:          __dirname + '/dist',
        filename:      production ? '[name]-[hash].js' : 'bundle.js',
        chunkFilename: '[name]-[chunkhash].js'
        // , publicPath: 'http://localhost:3000/'
    },
    module: {
        loaders
    },
    plugins,
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
    //     alias: {
    //         jQuery: 'jquery/src/jquery'
    //     }
    },
    debug: !production,
    devtool: production ? false : 'cheap-module-eval-source-map'
}


export default config

