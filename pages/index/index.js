//index.js
//获取应用实例

const common = require('../../utils/common.js');
const util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    motto: '速冻量贩是登陆寄过来是顶级管理机构量贩几个量贩就公检法达刚路机放大观看了辅导机构反馈的建国饭店考虑过就发达国家发掉了给教',
    show_list:{'a':1,'b':1,'c':1,'d':1,'e':1,'f':1,'g':0},
    init_show_list:{'a':1,'b':1,'c':1,'d':1,'e':1,'f':1,'g':0},
    sys_tips:[],
    index_ads:[],
    menus:[
      {img:'http://paz3jxo1v.bkt.clouddn.com/btn_home_verify.png',bind_function:'show_verify_code'},
      {img:'http://paz3jxo1v.bkt.clouddn.com/btn_home_me.png', bind_function:'goto_mine'}
    ],
    verify_code_show:false,
    verify_code_show_info:false,

    inputtel:'',
    inputcode:'',
    pick_data:{},
    all_tmplist:[],
    my_tmplist:[],
    all_tmplist_has_more:false
  },
  onLoad: function () {
    this.get_ads();
    if (app.globalData.userInfo.tips) {
      wx.showModal({
        title: 'vip到期提醒',
        content: app.globalData.userInfo.tips,
        showCancel:false
      });
    }
    this.get_sys_tips();
    this.get_all_tmplist();


  },
  onShow: function () {
    this.get_my_tmplist();
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
  goto_mine: function(){
    wx.navigateTo({
      url: '/pages/mine/index'
    })
  },
  goto_tmp: function(event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/tmp_make/index?id='+id
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
  get_all_tmplist:function () {
    //获取欢迎信息
    common.request('get','alltmplist',{},function (res) {
      this.setData({
        all_tmplist : res.data.data.list,
        all_tmplist_has_more:res.data.data.has_more
      });
    }.bind(this));
  },
  get_my_tmplist:function () {
    //获取欢迎信息
    common.request('get','my_tmplist',{},function (res) {
      this.setData({
        my_tmplist : res.data.data
      });
    }.bind(this));
  },

  close_tip: function () {
    this.setData({
      sys_tips : []
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
  go_webview(event) {
    var link = event.currentTarget.dataset.link;
    if (!link) {
      return;
    }

    wx.navigateTo({
      url: '/pages/webview/index?link='+link
    })
  },
  show_verify_code(){
    this.setData({
      verify_code_show:true,
      verify_code_show_info:false
    })
  },
  bindinputtel:function (e) {
    this.setData({
      inputtel: e.detail.value
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
  submit:function(){
    var data = {};
    data.phone = this.data.inputtel;
    data.code = this.data.inputcode;
    if (!data.phone) {
      this.setData({
        inputtel_error:'请输入手机号'
      })
      return;
    }

    if (!data.code) {

      this.setData({
        inputcode_error:'请输入凭证码'
      })
      return;
    }

    common.request('post','pick_verify',data,function (res) {
      if (res.data) {
        this.setData({
          pick_data:res.data
        });

      }
      this.setData({
        verify_code_show_info:true
      })
    }.bind(this));
  },
  saoyisao(){
    wx.scanCode({
          onlyFromCamera: true,
          success: (res) => {

            if (res.result){
              var result = JSON.parse(res.result);
              if (!result || !result.phone || !result.code) {
                wx.showModal({
                  title: '该二维码内容不正确',
                  content: '',
                  showCancel:false
                });
                return;
              }
              this.setData({
                inputtel:result.phone,
                inputcode:result.code
              });
              this.submit();
            };
        }
    })
  }
})
