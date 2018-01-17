//index.js
//获取应用实例

const common = require('../../utils/common.js');
const app = getApp();
Page({
  data: {
    list:[],
    p:1,
    inputtext:'',
    hide_submit:false
  },
  onLoad: function () {
    this.get_list(true);
  },
  onShow: function () {
    //console.log(1);
  },
  onReachBottom(){
    this.data.p ++;
    this.get_list();
  },
  get_list: function (refresh) {
    if (refresh) {
      this.data.p = 1;
      this.setData({
        list:[]
      })
    }
    var data = {
      p:this.data.p
    }

    common.request('get','suggest_list',data,function (res) {
      common.check_login(res);
      if (res.data.success && res.data.data.list && res.data.data.list.length) {
        var list = this.data.list.concat(res.data.data.list);
        this.setData({
          list:list
        })
      }
    }.bind(this));
  },
  active:function(event) {
    for(var i in this.data.list) {
      this.data.list[i].active = false;
    }
    this.data.list[event.currentTarget.dataset.index].active = true;
    this.setData({
      list:this.data.list
    })
  },
  bindinputtext:function (e) {
    this.setData({
      inputtext: e.detail.value
    });
  },
  submit:function () {
    var data = {};

    data.content = this.data.inputtext;
    if (!data.content) {
      wx.showToast({
        title: '请输入内容',
        image:'../../resource/images/tip.png'
      });
      return;
    }
    this.setData({
      hide_submit:true
    });
    common.request('post','add_suggest',data, function (res) {
      common.request_callback(res);
      if (res.data.success) {
        wx.showToast({
          title: '提交成功'
        });

      }
    });
  }
})
