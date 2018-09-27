var pageBehavior = require('../behavior/page')
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

            this.setData({
                visible: false
            });
            // console.log(detail);
            if (detail.key == 'del') {//删除
                this.triggerEvent('triggerevent', {event:'del_block'})
            } else {
                this.triggerEvent('changeitem', {item:this.data.item})
            }

        },
        tapInput(event){
            this.data.item.text = event.detail.value;
        }
    }
});
