const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
        library: undefined,
        libraryTarget: "commonjs2",
    },

    mode: process.env.NODE_ENV === "production" ? "production" : "development",

    devtool: process.env.NODE_ENV === "production" ? "production" : "source-map",

    externals: {
        react: "React",
        "react-dom": "ReactDOM",
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                include: path.resolve(__dirname, "src"),
                exclude: /node_modules/,
                use: [
                    {
                        loader: "react-hot-loader/webpack",
                    },
                    {
                        loader: "ts-loader",
                        options: {
                            experimentalWatchApi: true,
                        },
                    },
                ],
            },
            {
                test: /\.module.s(a|c)ss$/,
                include: path.resolve(__dirname, "src"),
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: require.resolve("@blue-indium/scss-modules"),
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: {
                                mode: "local",
                                localIdentName: "[path][name]__[local]__[hash:base64:10]",
                                exportLocalsConvention: "camelCaseOnly",
                            },
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: false,
                        },
                    },
                ],
            },
            {
                test: /\.s(a|c)ss$/,
                include: path.resolve(__dirname, "src"),
                exclude: /\.module.s(a|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: false,
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "components.css",
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: path.join(__dirname, "static"), to: path.join(__dirname, "dist") }],
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        ...(process.env.NODE_ENV === "production"
            ? [
                  new CompressionPlugin({
                      filename: "[path].gz[query]",
                      algorithm: "gzip",
                      test: /\.js$|\.css$|\.html$|\.json$/,
                      threshold: 10240,
                      deleteOriginalAssets: true,
                      minRatio: 0.8,
                  }),
              ]
            : [new BundleAnalyzerPlugin({ analyzerMode: "static", openAnalyzer: false })]),
    ],

    resolve: {
        extensions: [".js", ".ts", ".tsx", ".scss", ".json"],
    },
};
