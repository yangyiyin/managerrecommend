
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    behaviors: [],
    properties: {
        visible:{
            type:Boolean,
            value:false,
            observer: function(newVal, oldVal, changedPath) {
                console.log(newVal);
                if (newVal) {

                } else {

                }
            }
        },
        success_btn:{
            type:Boolean,
            value:true
        }
    },
    data: {
        animation:null
    },
    attached(){
        // this.animation = wx.createAnimation({
        //     duration: 200,
        //     timingFunction: "ease",
        //     delay: 0
        // });

    },
    methods: {
        success_callback() {
            this.triggerEvent('callback_success');
        },
        close(){
            this.setData({
                visible:false
            })
        }
    }
});
