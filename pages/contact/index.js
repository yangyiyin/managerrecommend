//index.js
//获取应用实例

const common = require('../../utils/common.js');
const app = getApp();
Page({
  data: {
    info:""
  },
  onLoad: function () {
    //获取欢迎信息
    common.request('get','contact',{},function (res) {
      this.setData({
        info : res.data.data
      });
    }.bind(this));
  }

})
