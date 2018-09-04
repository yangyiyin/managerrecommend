
Component({
    behaviors: [],
    properties: {
        items:{
            type:Array,
            value:[]
        },
        deg:{
            type:Number,
            value:0
        },
        radius:{
            type:Number,
            value:150
        }

    },
    data: {
        active:false
    },
    attached(){

        if (!this.data.deg) {
            this.setData({
                deg:(360 / items.length)
            })
        }

        this.data.items.forEach(function (e,i) {
            e.top = (-Math.cos(i*this.data.deg*0.017453293) * 150) + 'rpx';
            e.left = (Math.sin(i*this.data.deg*0.017453293) * 150) + 'rpx';
        }.bind(this))

        this.setData({
            items:this.data.items
        });
        var deg = 0;
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: "ease",
            delay: 0
        });
        var deg_a = 0;
        setInterval(function () {
            if (deg==0) {
                deg = 360;
                deg_a = deg_a ? 0 : 360;
                animation.rotateY(deg_a).step();
                this.setData({
                    animation:animation.export()
                });
            } else {
                deg = 0;
            }
        }.bind(this),2000)



    },
    methods: {

        open_close(){
            if (!this.data.active) {
                this.open();
            } else {
                this.close();
            }
        },
        open(){
            var animation = wx.createAnimation({
                duration: 200,
                timingFunction: "ease",
                delay: 0
            });
            this.data.items.forEach(function (e,i) {
                animation.top(e.top).left(e.left).opacity(1).step();
                e.animation = animation.export();
            }.bind(this));
            this.setData({
                active:true,
                items:this.data.items
            });

        },
        close(){
            var animation = wx.createAnimation({
                duration: 200,
                timingFunction: "ease",
                delay: 0
            });
            this.data.items.forEach(function (e,i) {
                animation.top('0rpx').left('0rpx').opacity(0).step();
                e.animation = animation.export();
            }.bind(this));
            this.setData({
                active:false,
                items:this.data.items
            });
        },
        tapitem(event) {

            var item = event.currentTarget.dataset.item;
            if (!item.bind_function) {
                return;
            }
            this.triggerEvent(item.bind_function);
        }
    }
});
