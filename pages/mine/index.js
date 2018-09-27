//index.js
//获取应用实例

const common = require('../../utils/common.js');
const app = getApp();
Page({
  data: {
    userInfo:{},
    init:{
      top:0
    },
    init_top:0,
    touch:{
      init_y:0
    },
    animation:null,
    menus:[],
  },
  onLoad: function () {
    app.get_userinfo(true).then(function(){
      this.setData({
        userInfo:app.globalData.userInfo
      })
    }.bind(this))


  },
  onShow: function () {
    setTimeout(function () {
      this.setData({
        userInfo:app.globalData.userInfo
      });
    }.bind(this))
  },
  onShareAppMessage(options) {
    var title = '店长营销工具';
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
  },
  goto_help(){
    wx.navigateTo({
      url: '/pages/webview/index?link='+encodeURIComponent('http://api.yixsu.com/apps/managerrecommend/h5/help.php')
    })
  },
  touchmove(e){
    var move_distance = e.touches[0].clientY - this.data.init_y;
    if (move_distance > 0) {
      if (move_distance > 100) {
        move_distance = 100;
      }
      var top = parseInt(move_distance);
      this.setData({
        init:{top:top}
      });

    }
  },
  touchstart(e) {
    if (this.moveback_ins) {
      clearInterval(this.moveback_ins);
    }
    this.setData({
      init_y:e.touches[0].clientY
    });
  },
  touchcancel(e){
    this.moveback(this.data.init.top);
  },
  touchend(e) {
    this.moveback(this.data.init.top);
  },
  moveback(distance){
    this.moveback_ins = setInterval(function(){
      distance -= 5;
      if (distance <= this.data.init_top) {
        this.setData({
          init:{top:this.data.init_top}
        });
        clearInterval(this.moveback_ins);
      } else {
        this.setData({
          init:{top:distance}
        });
      }
    }.bind(this),1)
  }
})
