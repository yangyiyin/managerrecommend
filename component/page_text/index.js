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

            this.triggerEvent('changeitem', {item:this.data.item})

            this.setData({
                visible: false
            });
        },
        tapInput(event){
            this.data.item.text = event.detail.value;
        }
    }
});
