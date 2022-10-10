const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    open:true,
    proxy:{
      '/api':{
        target:'https://devapi.qweather.com',
        ws:false,
        changeOrigin: true,//target为域名时必须设置此项
        secure: true,//设置支持 https 协议的代理
        pathRewrite: {
            '^/api': '',//本地地址
        },
      },
      '/geoapi':{
        target:'https://geoapi.qweather.com',
        ws:false,
        changeOrigin:true,
        pathRewrite:{
          '^/geoapi':'',
        }
      },
      '/getCityName':{
        target:'http://pv.sohu.com/cityjson?ie=utf-8',
        ws:false,
        changeOrigin:true,
        pathRewrite:{
          '^/getCityName':'',
        }
      }
    }
  }
})
