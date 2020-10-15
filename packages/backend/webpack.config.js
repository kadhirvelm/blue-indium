const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
    },

    entry: "./src/index.ts",

    mode: process.env.NODE_ENV === "production" ? "production" : "development",

    devtool: process.env.NODE_ENV === "production" ? "production" : "source-map",

    target: "node",

    node: {
        __dirname: false,
        __filename: false,
    },

    stats: "errors-only",

    externals: [nodeExternals(), "bufferutil", "utf-8-validate"],

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                include: path.resolve(__dirname, "src"),
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
            },
        ],
    },

    plugins: [],

    resolve: {
        extensions: [".js", ".ts"],
    },
};
