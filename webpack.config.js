const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    "mode": "development",
    "entry":  "./src/main.js",
    "output": {
        // options related to how webpack emits results
        "path": path.resolve(__dirname, "build"), // string
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)
        "filename": "[name].bundle.js",
        "chunkFilename": "[name].bundle.js",
    },
    "module": {
        "rules": [
            {
                "test": /\.js$/,
                "exclude": /node_modules/,
                "use": {
                    "loader": "babel-loader",
                    "options": {
                        "presets": ["env"],
                        "plugins": ["@babel/plugin-syntax-dynamic-import"]
                    },
                },

            }
        ]
    },
    "plugins": [
        new CopyWebpackPlugin([
            { from: './src/index.html', to: '' },
            { from: './src/style.css', to: '' }
        ])
    ],
    "node": {
        "fs": "empty",
        "net": "empty",
        "tls": "empty"
      }
};
