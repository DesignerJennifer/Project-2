const path = require("path");

module.exports = {
	entry: "./src/Blackjack.js",
	output: {
		path: path.join(__dirname, "public"),
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-react"],
						plugins: ["@babel/plugin-proposal-class-properties"]
					}
				}
			}
		]
	},
	devtool: "cheap-module-eval-source-map",
	devServer: {
		contentBase: path.join(__dirname, "public"),
		historyApiFallback: true
	}
};
