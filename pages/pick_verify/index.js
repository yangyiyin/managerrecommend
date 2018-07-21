//index.js
//获取应用实例
// const app = getApp()
const common = require('../../utils/common.js');
Page({
  data: {
    inputtel:'',
    inputcode:'',
    visible: false,
    actions: [

      {
        name: '完成验证',
        color: '#19be6b'
      }
    ],
    pick_data:{},
    msg:'',
    can_complete:true
  },
  onLoad: function () {


  },
  bindinputtel:function (e) {
    this.setData({
      inputtel: e.detail.value
    });
  },
  bindinputcode:function (e) {
    this.setData({
      inputcode: e.detail.value
    });
  },
  submit:function(){
    var data = {};
    data.phone = this.data.inputtel;
    data.code = this.data.inputcode;
    if (!data.phone) {
      wx.showToast({
        title: '请输入手机号',
        image:'../../resource/images/tip.png'
      });
      return;
    }

    if (!data.code) {
      wx.showToast({
        title: '请输入凭证码',
        image:'../../resource/images/tip.png'
      });
      return;
    }

    common.request('post','pick_verify',data,function (res) {
      if (res.data.data) {
        this.setData({
          pick_data:res.data.data
        })

      }
      this.setData({
        msg:res.data.message
      })

      if (res.data.success) {
        this.setData({
          can_complete:true,
          actions: [

            {
              name: '完成验证',
              color: '#19be6b'
            }
          ]
        })
      } else {
        this.setData({
          can_complete:false,
          actions: [

            {
              name: '确定',
              color: '#19be6b'
            }
          ]
        })
      }
      this.setData({
        visible:true
      })
    }.bind(this));
  },
  handleClick ({ detail }) {
    var data = this.data.pick_data;
    if (!this.data.can_complete) {
      this.setData({
        visible: false
      });
      return;
    }
    common.request('post','pick_verify',data,function (res) {
      if (res.data.success) {
        wx.showToast({
          title: '完成验证成功!',
          icon: 'success',
          duration: 2000
        })

      } else {
        wx.showModal({
          title: res.data.message,
          content: '',
          showCancel:false
        });
      }
      this.setData({
        visible: false
      });
    }.bind(this));

  },
})
