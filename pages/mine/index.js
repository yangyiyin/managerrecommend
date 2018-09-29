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

    inputtitle:'',
    inputtel:'',
    inputaddress:'',
    inputcode:'',
    isPoneAvailable:false
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
      url: '/pages/webview/index?link='+encodeURIComponent('https://api.yixsu.com/apps/managerrecommend/h5/help.php')
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
  },
  become_manager:function(){
    this.setData({
      become_manager_visible:true
    })

  },

  bindinputtitle:function (e) {
    this.setData({
      inputtitle: e.detail.value
    });
    if (e.detail.value) {
      this.setData({
        inputtitle_error:''
      })
    }

  },
  bindinputtel:function (e) {
    this.setData({
      inputtel: e.detail.value,
      isPoneAvailable: common.isPoneAvailable(e.detail.value)
    });
    if (e.detail.value) {
      this.setData({
        inputtel_error:''
      })
    }
  },
  bindinputcode:function (e) {
    this.setData({
      inputcode: e.detail.value
    });
    if (e.detail.value) {
      this.setData({
        inputcode_error:''
      })
    }
  },
  bindinputaddress:function (e) {
    this.setData({
      inputaddress: e.detail.value
    });
  },

  do_become_manager:function(){
    var data = {};
    data.entity_title = this.data.inputtitle;
    data.entity_tel = this.data.inputtel;
    data.address = this.data.inputaddress;
    if (!data.entity_title) {
      this.setData({
        inputtitle_error:'请输入店名'
      })
      return;
    }

    if (!data.entity_tel) {
      this.setData({
        inputtel_error:'请输入手机号'
      })
      return;
    }

    if (!this.data.inputcode) {
      this.setData({
        inputcode_error:'请输入验证码'
      })
      return;
    }

    if (!this.data.inputaddress) {
      this.setData({
        inputaddress_error:'请输入地址'
      })
      return;
    }
    // if (!data.address) {
    //   wx.showToast({
    //     title: '请输入店铺地址',
    //     image:'../../resource/images/tip.png'
    //   });
    //   return;
    // }
    data.type = 2;

    //验证
    var data_code_vrify = {
      phone:this.data.inputtel,
      code:this.data.inputcode,

    }
    common.request('post','verify_code',data_code_vrify,function (res) {

      if (res.data.success) {
        common.request('post','info_modify',data, function (res) {
          common.request_callback(res);
          if (res.data.success) {
            wx.showModal({
              title: '恭喜你,成为店长!',
              content: '',
              showCancel:false
            });
            app.login();
          } else {
            wx.showModal({
              title: res.data.message,
              content: '',
              showCancel:false
            });
          }

        }.bind(this));
      } else {
        wx.showModal({
          title: res.data.message,
          content: '',
          showCancel:false
        });
      }


    }.bind(this));
  },
  send_code(){
    var data = {
      phone:this.data.inputtel

    }
    common.request('post','send_code',data,function (res) {

      if (res.data.success) {

      } else {
        wx.showModal({
          title: res.data.message,
          content: '',
          showCancel:false
        });
      }


    }.bind(this));
  },

})
