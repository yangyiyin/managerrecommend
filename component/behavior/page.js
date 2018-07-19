/**
 * Created by yyy on 18/7/3.
 */
var common = require('../../utils/common.js');
module.exports = Behavior({
    behaviors: [],
    properties: {
        item: {
            type: Object,
            value: {}
        },
        canEdit: {
            type: Boolean,
            value: true,
            observer: function(newVal, oldVal, changedPath) {
                if (newVal) {
                    this.setData({
                        status_class:'status_normal'
                    })
                } else {
                    this.setData({
                        status_class:'status_none'
                    })
                }
            }
        },
        customerview:{
            type: Boolean,
            value: false
        },
        pageId:{
            type: Number,
            value: 0
        },
        extraUid:{
            type: null,
            value: 0
        }
    },
    data: {
        status_class:'status_normal',
        phone_modal_visible:false,
        phone_modal_actions:[
            {
                name: '取消',
                color: '#999999'
            },
            {
                name: '确认',
                color: '#19be6b'
            }
        ],
        page_sign_phone:'',
        page_sign_phone_code:'',
        callback:''
    },
    attached: function(){
        if (this.data.item.can_del_block) {
            if (this.data.actions) {
                this.data.actions.push( {
                    name: '删除此模块',
                    color: 'red'
                });
                this.setData({
                    actions: this.data.actions
                });
            }
        }
    },
    methods: {
        show_phone_modal(event) {

            this.setData({
                phone_modal_visible: true,
                callback: event.currentTarget.dataset.callback
            });
        },
        send_code(){
            var data = {
                phone:this.data.page_sign_phone

            }
            common.request('post','send_code',data,function (res) {

                if (res.data.success) {

                } else {
                    wx.showModal({
                        title: res.data.message,
                        content: '',
                        showCancel:false
                    });
                }


            }.bind(this));
        },
        phoneModalHandleClick ({ detail }) {
            if (detail.index == 0) {
                this.setData({
                    phone_modal_visible: false
                });
                return;
            }
            if (!this.data.page_sign_phone || !this.data.page_sign_phone_code) {
                wx.showToast({
                    title: '手机号或验证码不能为空',
                    icon: 'none',
                    duration: 2000
                })
                return ;
            }
            //验证
            var data = {
                phone:this.data.page_sign_phone,
                code:this.data.page_sign_phone_code,

            }
            common.request('post','verify_code',data,function (res) {
                this.setData({
                    phone_modal_visible: false
                });
                if (res.data.success) {
                    if (this[this.data.callback]) {
                        this[this.data.callback](data);
                    } else {
                        // console.log(123);
                    }
                } else {
                    wx.showModal({
                        title: res.data.message,
                        content: '',
                        showCancel:false
                    });
                }


            }.bind(this));


        },
        tapInputPhone(event){
            this.data.page_sign_phone = event.detail.value;
        },
        tapInputCode(event){
            this.data.page_sign_phone_code = event.detail.value;
        },

    }
})