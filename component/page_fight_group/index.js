var pageBehavior = require('../behavior/page');
var common = require('../../utils/common.js');
const app = getApp()
Component({
    behaviors: [pageBehavior],
    properties: {
        isSignFightgroup:{
            type: null,
            value: false
        },
        isHelpFightgroup:{
            type: null,
            value: false
        }
    },
    data: {
        visible: false,
        actions: [

            {
                name: '确认',
                color: '#19be6b'
            }
        ],
    },
    methods: {
        change_text() {
            if (!this.data.canEdit) {
                return;
            }

            this.setData({
                visible: true
            });
        },
        handleClick ({ detail }) {

            this.triggerEvent('changeitem', {item:this.data.item})

            this.setData({
                visible: false
            });
        },
        tapInput(event){
            this.data.item.fight_group_price = event.detail.value;
        },
        tapInput2(event){
            this.data.item.fight_group_number = event.detail.value;
        },
        custom_fight_group_sign:function(){
            var data = {
                id:this.data.pageId,
                extra_uid:this.data.extraUid,
                activity_label:'fight_group'
            };
            common.request('post','fightgroup_sign_pay',data,function (res) {
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

                             _this.fight_group_sign(res.data.data.pay_no, data.id,_this);
                         },
                         'fail':function(ret){
                         }
                     })

                 }
            }.bind(this));
        },
        handle_verify_code_sign_success(data) {
            this.custom_fight_group_sign();
        },
        fight_group_sign(pay_no, pageId, _this) {

            var data = {
                id:pageId,
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
                        title: res.data.message,
                        content: '',
                        showCancel:false
                    });

                    return ;
                }
                common.request('post','fightgroup_sign',data,function (res) {
                    if (res.data.success) {
                        _this.triggerEvent('triggerevent', {event:'get_page_info'});
                        wx.hideLoading()
                        clearInterval(int_ins);
                        return ;
                    } else {
                    }

                });
                time --;
            }, 500);


        },
        custom_fight_group_help:function(){

            this.triggerEvent('triggerevent', {event:'share_make', param:app.globalData.userInfo.id})
        },
        custom_fight_group_join:function(){
            var data = {
                id:this.data.pageId,
                extra_uid:this.data.extraUid
            };
            common.request('post','fightgroup_join',data,function (res) {
                common.request_callback(res);
                if (res.data.success) {
                    this.triggerEvent('triggerevent', {event:'get_page_info'})
                }
            }.bind(this));
        },
    }
});
