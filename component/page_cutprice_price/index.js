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
        tapInput1(event){
            this.data.item.cutprice_price = event.detail.value;
        },
        tapInput2(event){//设置底价
            this.data.item.cutprice_min_price = event.detail.value;
            this.data.item.cutprice_max_minus_price = this.data.item.cutprice_price - event.detail.value;
        },
        tapInput3(event){
            this.data.item.cutprice_average_price = event.detail.value;
        },
    }
});
