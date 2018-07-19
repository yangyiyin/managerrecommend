var pageBehavior = require('../behavior/page');
var common = require('../../utils/common.js');
Component({
    behaviors: [pageBehavior],
    properties: {

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
            this.data.item.text = event.detail.value;
        },
        custom_sign(){
            var data = {
                id:this.data.pageId,
                phone:this.data.page_sign_phone
            };
            common.request('post','sign',data,function (res) {
                common.request_callback(res);
                if (res.data.success) {
                    //this.get_page_info();
                    this.triggerEvent('triggerevent', {event:'get_page_info'})

                }
            }.bind(this));
        }
    }
});
