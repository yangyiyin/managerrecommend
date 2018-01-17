//index.js
//获取应用实例

const common = require('../../utils/common.js');
const app = getApp();
Page({
  data: {
    motto: '速冻量贩是登陆寄过来是顶级管理机构量贩几个量贩就公检法达刚路机放大观看了辅导机构反馈的建国饭店考虑过就发达国家发掉了给教',
    show_list:{'a':1,'b':1,'c':1,'d':1,'e':1,'f':1,'g':0},
    init_show_list:{'a':1,'b':1,'c':1,'d':1,'e':1,'f':1,'g':0},
    tmp_type:0,
    tmp_list:[]
  },
  onLoad: function (option) {
    this[option.function_name]();
  },
  onShow: function () {
    this.get_tmp_list();
  },
  get_tmp_list: function () {
    var data = {
      type:this.data.tmp_type
    }

    common.request('get','my_tmplist',data,function (res) {
      common.check_login(res);
      this.setData({
        tmp_list:res.data.data
      })
    }.bind(this));
  },
  goto_timelimit: function(){

    this.setData({
      tmp_type:1
    })

    var show_list = {'a':0,'b':1,'c':0,'d':0,'e':0,'f':0,'g':1,'b1':1}
    this.setData({
      show_list:show_list
    })
  },
  goto_cutprice: function(){
    this.setData({
      tmp_type:2
    })
    var show_list = {'a':0,'b':0,'c':1,'d':0,'e':0,'f':0,'g':1}
    this.setData({
      show_list:show_list
    })
  },
  goto_praise: function(){
    this.setData({
      tmp_type:3
    })
    var show_list = {'a':0,'b':0,'c':0,'d':1,'e':0,'f':0,'g':1}
    this.setData({
      show_list:show_list
    })
  },
  goto_sort: function(){
    this.setData({
      tmp_type:4
    })
    var show_list = {'a':0,'b':0,'c':0,'d':0,'e':1,'f':0,'g':1}
    this.setData({
      show_list:show_list
    })
  },
  goto_word: function(){
    this.setData({
      tmp_type:5
    })
    var show_list = {'a':0,'b':0,'c':0,'d':0,'e':0,'f':1,'g':1}
    this.setData({
      show_list:show_list
    })
  },
  goto_tmp_preview:function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/tmp_make/index?id='+id
    })
  },
  back:function () {
    var show_list = this.data.init_show_list;
    this.setData({
      show_list:show_list
    })
  },
  goto_tmpshop: function() {
    wx.navigateTo({
      url: '/pages/tmpshop/index?type='+this.data.tmp_type
    })
  },
  del_tmp:function(event){
    wx.showModal({
      title: '删除此模板?',
      content: '',
      success: function(res) {
        if (res.confirm) {
          var data = {
            id:event.currentTarget.dataset.id
          }
          common.request('post','del_tmp',data,function (res) {
            common.request_callback(res);
            this.data.tmp_list.splice(event.currentTarget.dataset.index, 1);
            this.setData({
              tmp_list:this.data.tmp_list
            })
          }.bind(this));

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }.bind(this)
    })
  }
})
