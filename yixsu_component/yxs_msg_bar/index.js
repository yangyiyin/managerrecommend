
Component({
    behaviors: [],
    properties: {
        item_num:{
            type:Number,
            value:0,
            observer: function(newVal, oldVal, changedPath) {
                clearInterval(this.intval);
                this.run();
            }
        },
        time:{
            type:Number,
            value:5000
        }
    },
    data: {
        margin_top:0
    },
    attached(){
        this.run();
    },
    methods: {
        close(){
            this.triggerEvent('close');
        },
        run() {
            if (this.data.item_num < 2) {
                return;
            }
            this.intval = setInterval(function(){
                if (!(this.data.margin_top % 80)) {
                    clearInterval(this.intval);
                    setTimeout(function(){
                        this.data.margin_top++;
                        if (this.data.margin_top >= (this.data.item_num - 1) * 80) {
                            this.data.margin_top = 0;
                            this.setData({
                                margin_top:this.data.margin_top
                            });
                        }
                        this.run();
                    }.bind(this),this.data.time)
                } else {
                    this.data.margin_top++;
                    this.setData({
                        margin_top:this.data.margin_top
                    });
                }


            }.bind(this), 10);
        }
    }
});
