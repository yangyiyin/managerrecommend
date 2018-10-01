//index.js
//获取应用实例

const common = require('../../utils/common.js');
const app = getApp();
Page({
  data: {
    pages:[],
    p:1
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
  onPullDownRefresh(){
    this.get_list(1);
    wx.stopPullDownRefresh();
  },
  get_list: function (refresh) {
    if (refresh) {
      this.data.p = 1;
      this.setData({
        pages:[]
      })
    }
    var data = {
      p:this.data.p
    }

    common.request('get','user_pages',data,function (res) {
      common.check_login(res);
      if (res.data.success && res.data.data.list && res.data.data.list.length) {
        var pages = this.data.pages.concat(res.data.data.list);
        this.setData({
          pages:pages
        })
      }
    }.bind(this));
  },

  goto_page:function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/tmp_make/index?customerview=1&id='+id
    })
  },
  del_page:function(event){
    wx.showModal({
      title: '删除此活动页面?删除后不可恢复',
      content: '',
      success: function(res) {
        if (res.confirm) {
          var data = {
            id:event.currentTarget.dataset.id
          }
          common.request('post','del_user_page',data,function (res) {
            common.request_callback(res);
            this.data.pages.splice(event.currentTarget.dataset.index, 1);
            this.setData({
              pages:this.data.pages
            })
          }.bind(this));

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }.bind(this)
    })
  },
  share(event){
    wx.navigateTo({
      url: '/pages/share/index?page_id='+event.currentTarget.dataset.item.id+'&title='+event.currentTarget.dataset.item.title+'&img='+event.currentTarget.dataset.item.img
    });
  }
})
