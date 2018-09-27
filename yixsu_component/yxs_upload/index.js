
Component({
    behaviors: [],
    properties: {
        currentcutimg: {
            type: String,
            value: '',
            observer: function(newVal, oldVal, changedPath) {
                if (newVal) {
                    this.setData({
                        src:newVal
                    })
                } else {
                    // this.setData({
                    //     src:''
                    // })
                }
            }
        },
        src:{
            type:String,
            value:''
        },
    },
    data: {
    },
    attached(){


    },
    methods: {
        choose_img(){
            var w = 500;
            var h = 500;
            wx.navigateTo({
                url: '/pages/cutInside/cutInside?w='+w+'&h='+h
            });
        }
    }
});
