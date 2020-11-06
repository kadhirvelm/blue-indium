const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");

const PUZZLE_NAME = encodeURIComponent(
    JSON.parse(
        require("fs")
            .readFileSync("./package.json")
            .toString(),
    ).name.toString(),
);

module.exports = {
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
        library: undefined,
        libraryTarget: "commonjs2",
    },

    externals: {
        antd: "antd",
        react: "React",
        "react-dom": "ReactDOM",
    },

    stats: "errors-only",

    mode: process.env.NODE_ENV === "production" ? "production" : "development",

    devtool: process.env.NODE_ENV === "production" ? "production" : "source-map",

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                include: path.resolve(__dirname, "src"),
                exclude: /node_modules/,
                use: [
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
                        options: {
                            namespace: "puzzles",
                        },
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
            {
                type: "javascript/auto",
                test: /\.json$/,
                include: path.resolve(__dirname, "src"),
                exclude: /node_modules/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]",
                },
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: `${PUZZLE_NAME}.css`,
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
