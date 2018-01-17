//index.js
//获取应用实例
const app = getApp()
const common = require('../../utils/common.js');
Page({
  data: {
    inputtitle:'',
    inputtel:''

  },
  onLoad: function () {
    // setTimeout(function () {
    //   //登录
    //   app.login();
    // }, 1000);

  },
  bindinputtitle:function (e) {
    this.setData({
      inputtitle: e.detail.value
    });
  },
  bindinputtel:function (e) {
    this.setData({
      inputtel: e.detail.value
    });
  },
  submit:function(){
    var data = {};
    data.entity_title = this.data.inputtitle;
    data.entity_tel = this.data.inputtel;
    if (!data.entity_title) {
      wx.showToast({
        title: '请输入店名',
        image:'../../resource/images/tip.png'
      });
      return;
    }

    if (!data.entity_tel) {
      wx.showToast({
        title: '请输入手机号',
        image:'../../resource/images/tip.png'
      });
      return;
    }

    common.request('post','info_modify',data, function (res) {
      common.request_callback(res);
      if (res.data.success) {
        // wx.switchTab({
        //   url: '/pages/index/index'
        // })
        app.login();
      }

    }.bind(this))
  }
})
