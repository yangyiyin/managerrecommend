//index.js
//获取应用实例
const app = getApp()
const common = require('../../utils/common.js');
Page({
  data: {
    inputtitle:'',
    inputtel:'',
    inputaddress:'',
    submit:1,
    display:2

  },
  onLoad: function () {

    if (app.globalData.userInfo.type == 2) {
      this.setData({
        inputtitle:app.globalData.userInfo.entity_title,
        inputtel:app.globalData.userInfo.entity_tel,
        inputaddress:app.globalData.userInfo.address,
        submit:2,
        display:1
      })
    } else {

    }

  },
  onShow(){
    app.get_userinfo(function(){
      if (parseInt(app.globalData.userInfo.type) ) {
        app.login();
      }
    });
  },
  display1:function(){
    this.setData({
      display:1
    })

  },
  display2:function(){
    var data = {type:1}
    common.request('post','info_modify',data, function (res) {
      common.request_callback(res);
      if (res.data.success) {
        wx.reLaunch({
          // url: '/pages/custom_pages/index'
          url: '/pages/index/index'
        });
      } else {

      }

    }.bind(this))

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
  bindinputaddress:function (e) {
    this.setData({
      inputaddress: e.detail.value
    });
  },

  submit:function(){
    var data = {};
    data.entity_title = this.data.inputtitle;
    data.entity_tel = this.data.inputtel;
    data.address = this.data.inputaddress;
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

    if (!data.address) {
      wx.showToast({
        title: '请输入店铺地址',
        image:'../../resource/images/tip.png'
      });
      return;
    }
    data.type = 2;

    common.request('post','info_modify',data, function (res) {
      common.request_callback(res);
      if (res.data.success) {
        app.login();
      } else {

      }

    }.bind(this))
  }
})
