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
            this.data.item.quick_buy_price = event.detail.value;
        },
        quick_buy:function(){
            var data = {
                id:this.data.pageId,
                phone:this.data.page_sign_phone
            };
            common.request('post','quick_buy',data,function (res) {
                common.request_callback(res);
                if (res.data.success) {
                    this.triggerEvent('triggerevent', {event:'get_page_info'})
                }
            }.bind(this));
        }
    }
});
