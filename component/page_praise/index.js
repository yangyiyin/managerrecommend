var pageBehavior = require('../behavior/page');
var common = require('../../utils/common.js');
const app = getApp()
Component({
    behaviors: [pageBehavior],
    properties: {
        isSignPraise:{
            type: null,
            value: false
        },
        isHelpPraise:{
            type: null,
            value: false
        }
    },
    data: {

    },
    methods: {

        custom_praise_sign:function(){
            var data = {
                id:this.data.pageId
            };
            common.request('post','praise_sign',data,function (res) {
                common.request_callback(res);
                if (res.data.success) {
                    this.triggerEvent('triggerevent', {event:'get_page_info'})
                }
            }.bind(this));
        },
        custom_praise_help:function(){

            this.triggerEvent('triggerevent', {event:'share_make', param:app.globalData.userInfo.id})
        },
        custom_praise_praise:function(){
            var data = {
                id:this.data.pageId,
                extra_uid:this.data.extraUid
            };
            common.request('post','praise_praise',data,function (res) {
                common.request_callback(res);
                if (res.data.success) {
                    this.triggerEvent('triggerevent', {event:'get_page_info'})
                }
            }.bind(this));
        },
    }
});
