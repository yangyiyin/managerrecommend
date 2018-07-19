//index.js
//获取应用实例

const common = require('../../utils/common.js');
const app = getApp();
Page({
  data: {
    motto: '速冻量贩是登陆寄过来是顶级管理机构量贩几个量贩就公检法达刚路机放大观看了辅导机构反馈的建国饭店考虑过就发达国家发掉了给教',
    show_list:{'a':1,'b':1,'c':1,'d':1,'e':1,'f':1,'g':0},
    init_show_list:{'a':1,'b':1,'c':1,'d':1,'e':1,'f':1,'g':0},
    sys_tips:'',
    index_ads:[]
  },
  onLoad: function () {
    this.get_ads();
  },
  onShow: function () {
    this.get_sys_tips();
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
  goto_timelimit: function(){
    wx.navigateTo({
      url: '/pages/tmplist/index?function_name=goto_timelimit'
    })
  },
  goto_cutprice: function(){
    wx.navigateTo({
      url: '/pages/tmplist/index?function_name=goto_cutprice'
    })
  },
  goto_praise: function(){
    wx.navigateTo({
      url: '/pages/tmplist/index?function_name=goto_praise'
    })
  },
  goto_sort: function(){
    wx.navigateTo({
      url: '/pages/tmplist/index?function_name=goto_sort'
    })
  },
  goto_word: function(){
    wx.navigateTo({
      url: '/pages/tmplist/index?function_name=goto_word'
    })
  },
  get_sys_tips:function () {
    //获取欢迎信息
    common.request('get','sys_tips',{},function (res) {
      this.setData({
        sys_tips : res.data.data
      });
    }.bind(this));
  },
  tap_sys_tips: function () {
    this.setData({
      sys_tips : ''
    });
  },
  get_ads:function () {
    //获取欢迎信息
    common.request('get','ads',{'names':'index'},function (res) {
      if (res.data.success) {
        this.setData({
          index_ads : res.data.data.index
        });
      }

    }.bind(this));
  },
})
