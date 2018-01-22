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
            if (!res.data.data.entity_title || res.data.data.verify_status == 1) {
              wx.reLaunch({
                url: '/pages/useredit/index'
              })
            } else {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          }
          if (typeof is_not_direct == 'function') {
            is_not_direct();
          }
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