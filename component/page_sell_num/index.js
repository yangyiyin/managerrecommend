var pageBehavior = require('../behavior/page');
var common = require('../../utils/common.js');
Component({
    behaviors: [pageBehavior],
    properties: {
        sell_num:{
            type:null,
            default:0
        }
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

    }
});
