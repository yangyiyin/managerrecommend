//index.js
//获取应用实例
const app = getApp()
const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
Page({
  data: {
    motto: 'Hello World222',
    globalData:app.globalData,
    current_cut_img:''
  },
  onLoad: function () {


  },
  onShow: function() {
    app.globalData.userInfo.avatar = app.globalData.current_cut_img ? app.globalData.current_cut_img : app.globalData.userInfo.avatar;
    this.setData({
      current_cut_img:app.globalData.current_cut_img,
      globalData:app.globalData

    });
  },
  change_user_name(e) {
    this.data.is_change = true;
    app.globalData.userInfo.user_name = e.detail.value
    this.setData({
      globalData: app.globalData
    });
  },
  change_address(e) {
    this.data.is_change = true;
    app.globalData.userInfo.address = e.detail.value
    this.setData({
      globalData: app.globalData
    });
  },
  change_open_tel(e) {
    this.data.is_change = true;
    app.globalData.userInfo.open_tel = e.detail.value
    this.setData({
      globalData: app.globalData
    });
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

      }.bind(this)
    })
  },
  onUnload() {

    // var data = app.get_common_request_data();
    // data.user_name = this.data.globalData.userInfo.user_name;

    if (this.data.current_cut_img) {
      app.globalData.userInfo.avatar = this.data.current_cut_img;
      app.globalData.userInfo.user_name = this.data.globalData.userInfo.user_name;
      app.globalData.userInfo.address = this.data.globalData.userInfo.address;
      app.globalData.userInfo.open_tel = this.data.globalData.userInfo.open_tel;
      wx.uploadFile({
        url: config.urls.info_modify,
        filePath: this.data.current_cut_img,
        name: 'avatar',
        formData:{
          'user_session':app.globalData.user_session,
          'user_name': this.data.globalData.userInfo.user_name,
          'address': this.data.globalData.userInfo.address,
          'open_tel': this.data.globalData.userInfo.open_tel,
        },
        success: function(res){
          //var data = res.data
          //do something
          res.data = JSON.parse(res.data);
          common.request_callback(res);
          app.globalData.userInfo.user_name = this.data.globalData.userInfo.user_name;
          app.globalData.userInfo.address = this.data.globalData.userInfo.address;
          app.globalData.userInfo.open_tel = this.data.globalData.userInfo.open_tel;
          app.globalData.userInfo.avatar = this.data.current_cut_img;

          app.globalData.current_cut_img = '';
        }.bind(this)
      });
    } else if (this.data.is_change) {
      app.globalData.userInfo.user_name = this.data.globalData.userInfo.user_name;
      app.globalData.userInfo.address = this.data.globalData.userInfo.address;
      app.globalData.userInfo.open_tel = this.data.globalData.userInfo.open_tel;
      var data = {};
      data.user_name = this.data.globalData.userInfo.user_name;
      data.address = this.data.globalData.userInfo.address;
      data.open_tel = this.data.globalData.userInfo.open_tel;

      common.request('post','info_modify',data, function (res) {
        common.request_callback(res);
        app.globalData.userInfo.user_name = data.user_name;
        app.globalData.userInfo.address = data.address;
        app.globalData.userInfo.open_tel = data.open_tel;

      }.bind(this))
    }

  }


})
