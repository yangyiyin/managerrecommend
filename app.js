//app.js
const common = require('./utils/common.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

  },
  globalData: {
    userInfo: null,
    user_session:null
  },
  get_common_request_data:function () {
    return {
      user_session:this.globalData.user_session
    }
  },
  get_userinfo(is_not_direct){
    var data = this.get_common_request_data();
    wx.request({
      url: 'https://www.88plus.net/public/index.php/Apimanagerrecommend/User/info.html',
      data:data,
      method:'GET',
      success: function(res) {
        common.request_callback(res,this);
        if (res.data.success) {
          this.globalData.userInfo = res.data.data;
          if (!is_not_direct) {
            if (!parseInt(res.data.data.type)) {
              wx.reLaunch({
                url: '/pages/useredit/index'
              })
            } else if(res.data.data.type == '1') {//顾客
              wx.reLaunch({
                url: '/pages/custom_pages/index'
              })
            } else {
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }
          }
          if (typeof is_not_direct == 'function') {
            is_not_direct();
          }
        } else {
          //账号冻结等
        }

        // this.globalData.user_session = res.data.data;
        // wx.setStorageSync('user_session', res.data.data);
      }.bind(this),
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {
        //console.log(res)
      }
    });
  },
  login(is_not_direct) {
      wx.login({
            success: res => {
            try {
              var user_session = wx.getStorageSync('user_session');
              if (user_session) {
                this.globalData.user_session = user_session;
                this.get_userinfo(is_not_direct);
              } else {
                wx.request({
                  url: 'https://www.88plus.net/public/index.php/Apimanagerrecommend/laugh/login.html',
                  data:{code:res.code},
                  method:'POST',
                  success: function(res) {
                    common.request_callback(res);

                    this.globalData.user_session = res.data.data;
                    wx.setStorageSync('user_session', res.data.data);
                    this.get_userinfo(is_not_direct);

                  }.bind(this),
                  fail: function(res) {
                    console.log(res)
                  },
                  complete: function(res) {
                    console.log(res)
                  }
                });
              }
            } catch (e) {
                // Do something when catch error
              }
            }
    });
  }
})

//,
//  "tabBar": {
//    "list": [
//      {
//        "pagePath": "pages/index/index",
//        "text": "我要制作",
//        "iconPath":"resource/images/work1.png",
//        "selectedIconPath":"resource/images/work2.png"
//      },
//      {
//        "pagePath": "pages/mine/index",
//        "text": "个人中心",
//        "iconPath":"resource/images/mine1.png",
//        "selectedIconPath":"resource/images/mine2.png"
//      }
//    ],
//    "color":"#999999",
//    "selectedColor":"#999999",
//    "backgroundColor":"#ffffff"
//
//  }