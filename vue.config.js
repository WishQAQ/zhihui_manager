module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  productionSourceMap: false,
  devServer: {
    proxy: {
      "/manager": {
        target: "http://smartbank.demo.cq1080.com/",
        ws: true, // 是否启用websockets
        changOrigin: true, // 开启跨域
        pathRewrite: {
          '^/manager': '/'
        }
      },
    },
    overlay: {
      errors: true,
      warnings: true
    }
  }
};
