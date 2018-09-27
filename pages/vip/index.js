//index.js
//获取应用实例

const common = require('../../utils/common.js');
const app = getApp();
Page({
  data: {
    value:6,
    price:0,
    id:0,
    value_desc:'1个月',
    price_list : [],
    price_info_list : [
      // {id:1,time:'12个月',price:88,price_month:'低至7.3元/月',price_old:'¥180元',remark:'特惠'},
      // {id:2,time:'6个月',price:49,price_month:'低至8元/月',price_old:'¥90元'},
      // {id:3,time:'1个月',price:9,price_month:'&nbsp;',price_old:'¥15元',active:true},
    ],
    userInfo:{}
  },
  onLoad: function () {
    this.setData({
      userInfo:app.globalData.userInfo
    })
    this.get_price_list();
  },
  onShow: function () {

  },
  get_price_list() {
    common.request('post','get_price_list',{},function (res) {
      common.request_callback(res);
      if (res.data.success) {
        this.setData({
          price_info_list:res.data.data
        });
        for (var i in this.data.price_info_list) {
          if (this.data.price_info_list[i].active) {
            this.setData({
              id:this.data.price_info_list[i].id
            });
          }
        }
      }
    }.bind(this));
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

  },
  choose_item(event) {
    var item = event.currentTarget.dataset.item;
    var index = event.currentTarget.dataset.index;
    for(var i in this.data.price_info_list) {
      this.data.price_info_list[i].active = false;
    }
    this.data.price_info_list[index].active=true;
    this.setData({
      id:item.id,
      price_info_list:this.data.price_info_list
    });
  },

  pay:function(){
    var data = {
      id:this.data.id,
    };
    common.request('post','vip_pay',data,function (res) {
      common.request_callback(res);
      if (res.data.success) {
        //调起支付
        var _this = this;
        wx.requestPayment({
          'timeStamp': String(res.data.data.timeStamp),
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.package,
          'signType':res.data.data.signType,
          'paySign': res.data.data.sign,
          'success':function(ret){

            _this.extend(res.data.data.pay_no, data.id,_this);
          },
          'fail':function(ret){
          }
        })

      }
    }.bind(this));
  },
  extend(pay_no, id, _this) {

    var data = {
      id:id,
      pay_no:pay_no

    };
    var time = 20;
    wx.showLoading({
      title: '支付中。。。',
    })
    //轮询回调支付状态,创建订单
    var int_ins = setInterval(function(){
      if (time <= 0) {
        wx.hideLoading()
        clearInterval(int_ins);
        wx.showModal({
          title: '支付失败,请联系客服',
          content: '',
          showCancel:false
        });

        return ;
      }
      common.request('post','vip_extend',data,function (res) {
        if (res.data.success) {
          wx.hideLoading()
          clearInterval(int_ins);
          common.show_toast('恭喜你,购买成功!');
          app.get_userinfo(true).then(function(){
            _this.setData({
              userInfo:app.globalData.userInfo
            })
          })
          return ;
        } else {
        }

      });
      time --;
    }, 500);


  },



})
