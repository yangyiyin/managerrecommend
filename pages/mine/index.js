//index.js
//获取应用实例

const common = require('../../utils/common.js');
const app = getApp();
Page({
  data: {
    userInfo:{}
  },
  onLoad: function () {
    // this.setData({
    //   userInfo:app.globalData.userInfo
    // })
  },
  onShow: function () {
    setTimeout(function () {
      this.setData({
        userInfo:app.globalData.userInfo
      });
    }.bind(this), 500)
  },
  onShareAppMessage(options) {
    var title = '神奇店长';
    var that = this;
    return {
      title:title,
      path:'pages/login/index',
      imageUrl:'',
      success:function(){
        wx.showToast({
          title: '分享成功'
        });
      }
    }

  },
  goto_tmpshop: function() {
    wx.navigateTo({
      url: '/pages/tmpshop/index'
    })
  },
  goto_vip: function() {
    wx.navigateTo({
      url: '/pages/vip/index'
    })
  },
  goto_mypages: function() {
    wx.navigateTo({
      url: '/pages/mypages/index'
    })
  },
  goto_set:function() {
    wx.navigateTo({
      url: '/pages/set/index'
    })
  },
  goto_contact:function() {
    wx.navigateTo({
      url: '/pages/contact/index'
    })
  },
  goto_suggest:function() {
    wx.navigateTo({
      url: '/pages/suggest/index'
    })
  },
  goto_user_page:function() {
    wx.navigateTo({
      url: '/pages/custom_pages/index'
    })
  }
})
