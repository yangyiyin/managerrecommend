//index.js
//获取应用实例

const common = require('../../utils/common.js');
const app = getApp();
Page({
  data: {
    sign_list:[],
    praise_list:[],
    cutprice_list:[],
    vote_list:[],
    fight_group_list:[],
    quick_buy_list:[],
    detail:[],
    p:1,
    can_edit:true,
    page_id:0,
    focus:false,
    page_id:0
  },
  onLoad: function (option) {
    this.setData({
      page_id:option.id
    });
    this.get_page_info();
    this.clear_unread();

  },
  get_page_info(){
    var data = {id:this.data.page_id};
    common.request('get','page_info',data,function (res) {
      common.check_login(res);
      this.setData({
        sign_list:res.data.data.sign_list,
        praise_list:res.data.data.praise_list,
        cutprice_list:res.data.data.cutprice_list,
        vote_list:res.data.data.vote_list,
        fight_group_list:res.data.data.fight_group_list,
        quick_buy_list:res.data.data.quick_buy_list,
        page_info:res.data.data
      });

      wx.setNavigationBarTitle({
        title: res.data.data.title
      })

    }.bind(this));
  },
  clear_unread(){
    var data = {id:this.data.page_id,type:'page'};
    common.request('post','clear_unread',data,function (res) {
    }.bind(this));
  },

  onShow: function () {
    //console.log(1);
  },
  goto_page_origin:function () {

    wx.navigateTo({
      url: '/pages/tmp_make/index?origin=1&customerview=1&id='+this.data.page_id
    })
  },
  // focus_remark:function(event){
  //   var type = event.currentTarget.dataset.type;
  //   var index = event.currentTarget.dataset.index;
  //   if (type == 'sign') {
  //     this.data.sign_list[index].focus = true;
  //     this.setData({
  //       sign_list:this.data.sign_list
  //     })
  //   } else if (type == 'cutprice') {
  //     this.data.cutprice_list[index].focus = true;
  //     this.setData({
  //       cutprice_list:this.data.cutprice_list
  //     })
  //   } else if (type == 'praise') {
  //     this.data.praise_list[index].focus = true;
  //     this.setData({
  //       praise_list:this.data.praise_list
  //     })
  //   }
  //
  // },
  // blur_remark:function(event){
  //   var type = event.currentTarget.dataset.type;
  //   var index = event.currentTarget.dataset.index;
  //   if (type == 'sign') {
  //     this.data.sign_list[index].focus = false;
  //     this.setData({
  //       sign_list:this.data.sign_list
  //     })
  //   } else if (type == 'cutprice') {
  //     this.data.cutprice_list[index].focus = false;
  //     this.setData({
  //       cutprice_list:this.data.cutprice_list
  //     })
  //   } else if (type == 'praise') {
  //     this.data.praise_list[index].focus = false;
  //     this.setData({
  //       praise_list:this.data.praise_list
  //     })
  //   }
  // },
  // remark:function(event){
  //   var data = {
  //     id:event.currentTarget.dataset.id,
  //     type:event.currentTarget.dataset.type,
  //     remark:event.detail.value
  //   };
  //   common.request('post','remark_sign',data,function (res) {
  //     common.request_callback(res);
  //     if (res.data.success) {
  //       this.get_page_info();
  //     }
  //   }.bind(this));
  // }

})
