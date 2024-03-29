const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

require("babel-core/register");
require("babel-polyfill");

const PAGES_PATH = './src/pages';

function generateHtmlPlugins(items) {
  return items.map( (name) => new HtmlPlugin(
      {
        filename: `./${name}.html`,
        chunks: [ name ],
      }
  ))
}

config = {
  entry: {
    background: [
      'babel-polyfill',
      `${PAGES_PATH}/background`,
    ],
    popup: [
      'babel-polyfill',
      `${PAGES_PATH}/popup`,
    ],
    content: [
      'babel-polyfill',
      `${PAGES_PATH}/content`
    ],
    homepage: [
      'babel-polyfill',
      `${PAGES_PATH}/homepage`
    ],
    facebook: [
      `${PAGES_PATH}/facebook`
    ],
    ease: [
      `${PAGES_PATH}/ease`
    ],
    "background-ui": [
      `${PAGES_PATH}/background-ui`
    ]
  },
  output: {
    path: path.resolve('dist/pages'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [ 'babel-loader' ]
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.ttf$|\.eot$|\.svg$/,
        use: 'file-loader?name=[name].[ext]?[hash]'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/fontwoff'
      },
      { test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin(
        {
          filename: '[name].[contenthash].css',
        }
    ),
    new CopyPlugin(
        [
          {
            from: 'src',
            to: path.resolve('dist'),
            ignore: [ 'pages/**/*', 'shared/**/*' ]
          },
          {
            from: 'src/pages/html-pages',
            to: path.resolve('dist/pages')
          }
        ]
    )
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
      new webpack.DefinePlugin({
        'process.env' : {
          'NODE_ENV' : JSON.stringify(process.env.NODE_ENV)
        }
      }),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin()
  )
}

if (process.env.plateform === 'chrome') {
  config.plugins.push(
      new CopyPlugin(
          [
            {
              from: '/src/manifest.json',
              to: '/dist/manifest.json',
              force: true
            }
          ]
      )
  )
}

if (process.env.plateform === 'firefox') {
  config.plugins.push(
      new CopyPlugin(
          [
            {
              from: 'src/firefox_manifest.json',
              to: path.resolve('dist/manifest.json'),
              force: true
            }
          ]
      )
  )
}

module.exports = config;