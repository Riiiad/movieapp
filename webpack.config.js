const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    "mode": "development",
    "entry":  "./src/main.js",
    "output": {
        // options related to how webpack emits results
        "path": path.resolve(__dirname, "build"), // string
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)
        "filename": "[name].bundle.js"
    },
    "devServer": {
        "contentBase": path.join(__dirname, 'build'),
        "compress": true,
        "port": 9000
    },
    "module": {
        "rules": [
            {
                "test": /\.js$/,
                "exclude": /node_modules/,
                "use": {
                    "loader": "babel-loader",
                    "options": {
                        "presets": ["@babel/env"],
                        "plugins": [
                            "@babel/plugin-syntax-dynamic-import",
                            "@babel/plugin-transform-runtime"
                        ]
                    },

                },

            }
        ]
    },
    "plugins": [
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/index.html'
        }),
        new CopyWebpackPlugin([
            { from: './src/style.css', to: '' }
        ])
    ],
    "node": {
        "fs": "empty",
        "net": "empty",
        "tls": "empty"
      }
};
