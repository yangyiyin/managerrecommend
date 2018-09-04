
Component({
    behaviors: [],
    properties: {
        title:{
            type:null,
            value:''
        },
        more:{
            type:null,
            value:false
        }

    },
    data: {

    },
    attached(){


    },
    methods: {
        goto(){
            this.triggerEvent('goto');
        }
    }
});
