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
    detail:[],
    p:1
  },
  onLoad: function (option) {
    var data = {id:option.id};
    common.request('get','page_detail_info',data,function (res) {
      common.check_login(res);
      this.setData({
        sign_list:res.data.data.sign_list,
        praise_list:res.data.data.praise_list,
        cutprice_list:res.data.data.cutprice_list,
        vote_list:res.data.data.vote_list,
        detail:res.data.data
      });

      wx.setNavigationBarTitle({
        title: res.data.data.title
      })

    }.bind(this));
  },
  onShow: function () {
    //console.log(1);
  },

})
