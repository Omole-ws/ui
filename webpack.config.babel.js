import Webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import Autoprefixer from 'autoprefixer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const production = process.env.NODE_ENV == 'production'

const extractCss = (...loaders) => ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
        {
            loader: 'css-loader',
            options: {
                minimize: production,
                importLoaders: 1 + loaders.length
            }
        },
        {
            loader: 'postcss-loader',
            options: {
                plugins: () => [ Autoprefixer({ browsers: [ 'last 3 version', 'ie >= 10' ] }) ]
            }
        },
        ...loaders
    ]
})

const rules = [
    {
        test: /\.jsx?$/,
        include: __dirname + '/src',
        use: [ 'babel-loader' ]
    // }, {
    //     test: /\.(pug|jade)$/,
    //     include: __dirname + '/src',
    //     use: [ 'pug-loader' ]
    }, {
        test: /\.css$/,
        use: extractCss()
    }, {
        test: /\.(scss|sass)$/,
        include: [ __dirname + '/src', __dirname + '/semantic' ],
        use: extractCss('sass-loader')
    }, {
        test: /\.less$/,
        include: [ __dirname + '/src', __dirname + '/semantic' ],
        use: extractCss('less-loader')
    }, {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [
            {
                loader: 'url-loader',
                options: { limit: 10000 }
            }
        ]
    }
]

let plugins = [
    new HtmlWebpackPlugin({
        title: 'OmoleWS',
        lang: 'en',
        filename: 'index_en.html',
        favicon: './img/logo.png',
        template: './index.ejs',
        inject: 'body'
    }),
    new HtmlWebpackPlugin({
        title: 'OmoleWS',
        lang: 'ru',
        filename: 'index_ru.html',
        favicon: './img/logo.png',
        template: './index.ejs',
        inject: 'body'
    }),
    new Webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    }),
    new ExtractTextPlugin({
        filename: '[name].[contenthash].css',
        disable: false,
        allChunks: true
    }),
    new Webpack.optimize.CommonsChunkPlugin({
        // name:      'main', // Move dependencies to our main file
        // name: 'vendor',
        async: true, // Enable asynchronous chunks loading
        children:  true, // Look for common dependencies in all children,
        minChunks: 2 // How many times a dependency must come up before being extracted
    })
]

if (!production) {
    plugins = plugins.concat([
        new Webpack.DefinePlugin({
            'process.env':   {
                BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            },
            production: JSON.stringify(production)
        }),

        new Webpack.HotModuleReplacementPlugin(),
        new Webpack.SourceMapDevToolPlugin(),
        new Webpack.LoaderOptionsPlugin({ debug: true })
    ])
} else {
    plugins = plugins.concat([

        // This plugins defines various variables that we can set to false
        // in production to avoid code related to them from being compiled
        // in our final bundle
        new Webpack.DefinePlugin({
            __SERVER__:      !production,
            __DEVELOPMENT__: !production,
            __DEVTOOLS__:    !production,
            'process.env':   {
                BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            },
            production: JSON.stringify(production)
        }),

        // This plugin prevents Webpack from creating chunks
        // that would be too small to be worth loading separately
        new Webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 51200 // =50kb
        }),

        // This plugin minifies all the Javascript code of the final bundle
        new Webpack.optimize.UglifyJsPlugin({
            mangle:   true,
            sourceMap: false,
            comments: false,
            compress: { warnings: true }
        }),

        new Webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}

const config = {
    context: __dirname + '/src',
    entry: [ 'babel-polyfill', './' ],
    output: {
        path:          __dirname + '/dist',
        filename:      production ? '[name]-[hash].js' : 'bundle.js',
        chunkFilename: '[name]-[chunkhash].js'
        // , publicPath: 'http://localhost:3000/'
    },
    module: {
        rules
    },
    // postcss: function () {
    //     // "autoprefixer?browsers=last 2 version"
    //     return [autoprefixer]
    // },
    plugins,
    resolve: { extensions: [ '.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx' ] },
    // resolve: {
        // extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
    //     alias: {
    //         jQuery: 'jquery/src/jquery'
    //     }
    // },
    devtool: production ? false : 'cheap-module-eval-source-map'
}


export default config
