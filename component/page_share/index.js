var pageBehavior = require('../behavior/page');
var common = require('../../utils/common.js');
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
        share(){
            this.triggerEvent('triggerevent', {event:'share_make_by_page'});
        }
    }
});
