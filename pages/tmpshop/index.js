//index.js
//获取应用实例

const common = require('../../utils/common.js');
const app = getApp();
Page({
  data: {

    tmp_type:1,
    tmp_list:[],
    active:['active','','','',''],
    scroll_x:0,
    p:1
  },
  onLoad: function (option) {
    if (option.type) {
      this.data.active = ['','','','',''];
      this.data.active[option.type - 1] = 'active';
      this.setData({
        tmp_type : option.type,
        active : this.data.active,
        scroll_x:150*(option.type - 1)
      });

    }
    this.get_tmp_list(true);
  },
  onShow: function () {

   // this.get_tmp_list(true);
  },
  onReachBottom(){
    this.data.p ++;
    this.get_tmp_list();
  },
  get_tmp_list: function (refresh) {
    if (refresh) {
      this.data.p = 1;
      this.setData({
        tmp_list:[]
      })
    }
    var data = {
      type:this.data.tmp_type,
      p:this.data.p
    }

    common.request('get','alltmplist',data,function (res) {
      common.check_login(res);
      if (res.data.success && res.data.data.list && res.data.data.list.length) {
        var tmp_list = this.data.tmp_list.concat(res.data.data.list);
        this.setData({
          tmp_list:tmp_list
        })
      }
    }.bind(this));
  },

  goto_tmp_preview:function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/tmp_make/index?preview=1&id='+id
    })
  },
  add_tmp:function (event) {

    var data = {
      id:event.currentTarget.dataset.id
    }
    common.request('post','add_tmp',data,function (res) {
      common.request_callback(res);
      this.data.tmp_list[event.currentTarget.dataset.index].is_add = true;
      this.setData({
        tmp_list : this.data.tmp_list
      });
    }.bind(this));
  },
  switch_type: function (event) {

    this.data.active = ['','','','',''];
    this.data.active[event.currentTarget.dataset.type - 1] = 'active';
    this.setData({
      tmp_type : event.currentTarget.dataset.type,
      active : this.data.active
    });
    this.get_tmp_list(true);

  },
  active: function(event){
    for(var i in this.data.tmp_list) {
      this.data.tmp_list[i].active = false;
    }
    this.data.tmp_list[event.currentTarget.dataset.index].active = true;
    this.setData({
      tmp_list:this.data.tmp_list
    })
  }
})
