//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World222',

  },
  onLoad: function () {
    setTimeout(function () {
      //登录
      app.login();
    }, 500);


  }
})
