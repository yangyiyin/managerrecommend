//index.js
//获取应用实例
Page({
  data: {
    link:''
  },
  onLoad: function (option) {
    if (option.link) {
      this.setData({
        link : decodeURIComponent(option.link)
      })
    }

  }
})
