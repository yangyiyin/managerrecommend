
Component({
    behaviors: [],
    properties: {
        img:{
            type:String,
            value:''
        }
    },
    data: {
        visible:true
    },
    attached(){


    },
    methods: {
        goto_link(){
            this.close();
            this.triggerEvent('goto_link');
        },
        close(){
            this.setData({
                visible:false
            })
        }
    }
});
