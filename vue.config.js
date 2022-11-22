module.exports = {
  transpileDependencies: true,
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        logLevel: "debug",
        pathRewrite: { "^/api": "https://pr02-json-server.herokuapp.com/tasks" },
      },
    },
  },
  publicPath: './',
};
