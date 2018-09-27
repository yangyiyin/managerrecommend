var pageBehavior = require('../behavior/page');
var common = require('../../utils/common.js');
const app = getApp()
Component({
    behaviors: [pageBehavior],
    properties: {
        isSignCutprice:{
            type: null,
            value: false
        },
        isHelpCutprice:{
            type: null,
            value: false
        }
    },
    data: {
        visible: false,
    },
    methods: {

        custom_cutprice_sign:function(){
            var data = {
                id:this.data.pageId,
                phone:this.data.page_sign_phone
            };
            wx.showLoading();
            common.request('post','cutprice_sign',data,function (res) {
                wx.hideLoading();
                common.request_callback(res);
                if (res.data.success) {
                    this.triggerEvent('triggerevent', {event:'get_page_info', param:true});
                    // this.triggerEvent('triggerevent', {event:'show_pick_code'});
                    common.request('get','statistics_point',{page_id:this.data.pageId, type:3}, function (res) {});

                }
            }.bind(this));
        },
        custom_cutprice_help:function(){
            this.triggerEvent('triggerevent', {event:'share_make', param:app.globalData.userInfo.id})
        },
        custom_cutprice_cut:function(){
            var data = {
                id:this.data.pageId,
                extra_uid:this.data.extraUid,
                phone:this.data.page_sign_phone
            };
            common.request('post','cutprice_cut',data,function (res) {
                common.request_callback(res);
                if (res.data.success) {
                    this.triggerEvent('triggerevent', {event:'get_page_info'});
                }
            }.bind(this));
        },
    }
});
