var pageBehavior = require('../behavior/page')
Component({
    behaviors: [pageBehavior],
    properties: {

    },
    data: {
        src:'',
        visible: false,
        actions: [

            {
                name: '确认',
                color: '#19be6b'
            }
        ]
    },
    methods: {
        handleClick ({ detail }) {

            this.setData({
                visible: false
            });

            if (detail.index == 1) {//删除
                this.triggerEvent('triggerevent', {event:'del_block'})
            } else {
                this.data.item.src = this.data.src;
                this.triggerEvent('changeitem', {item:this.data.item})
            }
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

                    this.data.src = tempFilePaths[0];
                    this.setData({
                        src: this.data.src
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
        change_img(){
            if (!this.data.canEdit) {
                return;
            }

            this.setData({
                visible: true,
                src:this.data.item.src ? this.data.item.src : ''
            });
        }


        // change_img() {
        //     if (!this.data.canEdit) {
        //         return;
        //     }
        //
        //     wx.chooseImage({
        //         count: 1, // 默认9
        //         sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        //         sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        //         success: function (res) {
        //             // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //             var tempFilePaths = res.tempFilePaths;
        //             var tempFiles = res.tempFiles;
        //             this.data.item.src = tempFilePaths[0];
        //             this.setData({
        //                 item: this.data.item
        //             });
        //             this.triggerEvent('changeitem', {item:this.data.item})
        //
        //         }.bind(this)
        //     })
        //
        // }
    }
});
