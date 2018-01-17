//index.js
//获取应用实例
const app = getApp()
const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
Page({
  data: {
    motto: 'Hello World222',
    globalData:app.globalData,

  },
  onLoad: function () {


  },
  change_user_name(e) {
    this.data.globalData.userInfo.user_name = e.detail.value
    this.setData({
      globalData: this.data.globalData
    });
  },
  modify_user_name () {
    // var data = app.get_common_request_data();
    // data.user_name = this.data.globalData.userInfo.user_name;
    //
    // wx.request({
    //   url: 'https://www.88plus.net/public/index.php/Apimanagerrecommend/User/info_modify.html',
    //   data:data,
    //   method:'POST',
    //   success: function(res) {
    //     common.request_callback(res);
    //     app.globalData.userInfo.user_name = data.user_name;
    //   }.bind(this),
    //   fail: function(res) {
    //     console.log(res)
    //   },
    //   complete: function(res) {
    //     console.log(res)
    //   }
    // });


  },
  change_avatar() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var tempFiles = res.tempFiles;
        this.data.is_change_avatar = true;
       // console.log(tempFilePaths);
        //this.data.globalData.userInfo.avatar = tempFilePaths[0];
        this.data.globalData.userInfo.avatar = tempFilePaths[0];
        this.setData({
          globalData: this.data.globalData
        });

        // wx.previewImage({
        //   current: '', // 当前显示图片的http链接
        //   urls: tempFilePaths // 需要预览的图片http链接列表
        // })


      }.bind(this)
    })
  },
  onUnload() {

    // var data = app.get_common_request_data();
    // data.user_name = this.data.globalData.userInfo.user_name;

    if (this.data.is_change_avatar) {
      wx.uploadFile({
        url: config.urls.info_modify,
        filePath: this.data.globalData.userInfo.avatar,
        name: 'avatar',
        formData:{
          'user_session':app.globalData.user_session,
          'user_name': this.data.globalData.userInfo.user_name
        },
        success: function(res){
          //var data = res.data
          //do something
          res.data = JSON.parse(res.data);
          common.request_callback(res);
          app.globalData.userInfo.user_name = this.data.globalData.userInfo.user_name;
          app.globalData.userInfo.avatar = this.data.globalData.userInfo.avatar;
        }.bind(this)
      });
    } else {

      var data = {};
      data.user_name = this.data.globalData.userInfo.user_name;

      common.request('post','info_modify',data, function (res) {
        common.request_callback(res);
        app.globalData.userInfo.user_name = data.user_name;

      }.bind(this))
    }

  }


})
