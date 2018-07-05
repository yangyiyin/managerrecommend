var pageBehavior = require('../behavior/page');
var common = require('../../utils/common.js');
var init_vote = {src:'http://paz3jxo1v.bkt.clouddn.com/logo144.png',desc:'描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容'};
Component({
    behaviors: [pageBehavior],
    properties: {
        pageview:{
            type:null,
            value:false
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
        current_item:{},
        current_index:''
    },
    attached() {
        if (!this.data.customerview && !this.data.pageview) {
            this.data.item.vote_num_arr = [
                init_vote
            ];
            this.triggerEvent('changeitem', {item:this.data.item})

        }
    },

    methods: {
        change_text(event) {
            if (!this.data.canEdit) {
                return;
            }

            this.setData({
                visible: true,
                current_item:event.currentTarget.dataset.current_item,
                current_index:event.currentTarget.dataset.current_index
            });
        },
        handleClick ({ detail }) {

            this.data.item.vote_num_arr[this.data.current_index] = this.data.current_item;

            this.triggerEvent('changeitem', {item:this.data.item})

            this.setData({
                visible: false
            });
        },
        tapInput(event){
            this.data.current_item.desc = event.detail.value;
        },
        changeimg(){

            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    var tempFilePaths = res.tempFilePaths;
                    var tempFiles = res.tempFiles;

                    this.data.current_item.src = tempFilePaths[0];
                    this.setData({
                        current_item:this.data.current_item
                    })
                    //this.data.item.vote_num_arr[this.data.current_index] = this.data.current_item;
                    // this.data.item.src = tempFilePaths[0];
                    // this.setData({
                    //     item: this.data.item
                    // });
                    // this.triggerEvent('changeitem', {item:this.data.item})

                }.bind(this)
            })

        },
        add_vote_item(){
            if (!this.data.item.vote_num_arr) {
                this.data.item.vote_num_arr = [];
            }
            this.data.item.vote_num_arr.push(init_vote);
            this.triggerEvent('changeitem', {item:this.data.item});
        },
        custom_vote(event){
            // var data = {
            //     id:this.data.pageId
            // };
            // common.request('post','sign',data,function (res) {
            //     common.request_callback(res);
            //     if (res.data.success) {
            //         //this.get_page_info();
            //         this.triggerEvent('triggerevent', {event:'get_page_info'})
            //
            //     }
            // }.bind(this));
            var data = {
                id:this.data.pageId,
                vote_id: event.currentTarget.dataset.vote_id
            };
            common.request('post','vote',data,function (res) {
                common.request_callback(res);
                if (res.data.success) {
                    this.triggerEvent('triggerevent', {event:'get_page_info'})
                }
            }.bind(this));
        },


    }
});
