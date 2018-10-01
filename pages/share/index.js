const common = require('../../utils/common.js');
Page({
  data: {
    title:'店长营销工具',
    img:'',
    page_id:'',
    extra_uid:'',
    qrcode:'',
    from_publish:false
  },
  onLoad: function (option) {
    wx.hideShareMenu();

    if (option.from_publish) {
      this.setData({
        from_publish : option.from_publish
      })
    }


    if (option.title) {
      this.setData({
        title : option.title
      })
    }
    if (option.img) {
      this.setData({
        img : option.img
      })
    }
    if (option.page_id) {
      this.setData({
        page_id : option.page_id
      })
    }
    if (option.extra_uid && (typeof option.extra_uid == 'number' || typeof option.extra_uid == 'string')) {
      this.setData({
        extra_uid : option.extra_uid
      })
    }
    this.share_make();
  },
  preview_qrcode:function (event) {
    var img = event.currentTarget.dataset.img
    wx.previewImage({
      urls: [img] // 需要预览的图片http链接列表
    });
  },

  share_make: function(){

    var data = {
      id:this.data.page_id,
    };

    if (this.data.extra_uid) {
      data.extra_uid = this.data.extra_uid;
    }

    common.request('post','make_qrcode',data, function (res) {
      common.check_login(res);
      this.setData({
        qrcode:res.data.data
      });
    }.bind(this))

  },
  onShareAppMessage:function() {
    common.request('get','statistics_point',{page_id:this.data.page_id, type:2}, function (res) {});
    return {
      title:this.data.title,
      path:'pages/tmp_make/index?customerview=1&id='+this.data.page_id+'&extra_uid='+this.data.extra_uid,
      imageUrl:this.data.img
    }

  },



})
