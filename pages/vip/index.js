//index.js
//获取应用实例

const common = require('../../utils/common.js');
const app = getApp();
Page({
  data: {
    value:6,
    price:0,
    value_desc:'1个月',
    price_list : [],
    userInfo:{}
  },
  onLoad: function () {
    this.setData({
      userInfo:app.globalData.userInfo
    })
    this.price_list = [0,100,200,300,400,500,520,600,700,800,900,1000,1000,1800,2500];
    this.change_value({detail:{value:this.data.value}});
  },
  onShow: function () {

  },
  change_value: function (event) {

    var value = event.detail.value;
    if (value == 6) {
      this.data.value_desc = '半年';
    }
    else if (value == 12) {
      this.data.value_desc = '一年';
    }
    else if (value == 13) {
      this.data.value_desc = '两年';
    }
    else if (value == 14) {
      this.data.value_desc = '三年';
    }
    else {
      this.data.value_desc = value + '个月';
    }
    this.setData({
      value_desc:this.data.value_desc,
      price:this.price_list[value]
    });

  }
})
