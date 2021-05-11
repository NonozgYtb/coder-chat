const path = require("path");
const fs = require("fs");
module.exports = {
	entry: path.resolve(__dirname, "src/index.js"),
	module: {
		rules: [
			{
				test: /\.(jsx|js)$/,
				include: path.resolve(__dirname, "src"),
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: [
								[
									"@babel/preset-env",
									{
										targets: "defaults",
									},
								],
								"@babel/preset-react",
							],
						},
					},
				],
			},
			{
				test: /\.s[ac]ss$/,
				include: path.resolve(__dirname, "src"),
				exclude: /node_modules/,
				use: [
					// Creates `style` nodes from JS strings
					"style-loader",
					// Translates CSS into CommonJS
					"css-loader",
					// Compiles Sass to CSS
					{
						loader: "sass-loader",
						options: {
							sourceMap: true,
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: [".js", "*"],
	},
	output: {
		path: path.resolve(__dirname, "dist/js"),
		filename: "app.js",
	},
	devtool: "source-map",
};
