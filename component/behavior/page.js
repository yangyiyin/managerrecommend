/**
 * Created by yyy on 18/7/3.
 */
module.exports = Behavior({
    behaviors: [],
    properties: {
        item: {
            type: Object,
            value: {}
        },
        canEdit: {
            type: Boolean,
            value: true,
            observer: function(newVal, oldVal, changedPath) {
                if (newVal) {
                    this.setData({
                        status_class:'status_normal'
                    })
                } else {
                    this.setData({
                        status_class:'status_none'
                    })
                }
            }
        },
        customerview:{
            type: Boolean,
            value: false
        },
        pageId:{
            type: Number,
            value: 0
        },
        extraUid:{
            type: null,
            value: 0
        }
    },
    data: {
        status_class:'status_normal'
    },
    attached: function(){},
    methods: {
        myBehaviorMethod: function(){}
    }
})