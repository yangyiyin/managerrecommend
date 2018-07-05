//index.js
//获取应用实例
const app = getApp()
const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
Page({
  data: {
    tmp_data: {},
    id:'',
    page_status:1,//1预览,2制作,3完成制作
    page_url:'http://www.baidu.com',
    qrcode_link:'',
    show_qrcode:false,
    show_link:false,
    time_limit_left_desc:'',
    inputtext:'',
    img_path:'',
    pop_change_text:false,
    pop_change_time_limit_left:false,
    pop_change_img:false,
    pop_change_cutprice_price:false,
    current_index:false,
    current_index_sub:false,
    can_del_block:false,
    can_add_extra_img:false,
    can_add_extra_text:false,
    add_extra_img_num:0,
    add_extra_text_num:0,
    day:0,
    hour:0,
    min:0,
    cutprice_price:0,
    cutprice_max_minus_price:0,
    cutprice_average_price:0,
    vote_num:0,
    preview:false,
    pageview:false,//
    customerview:false,//活动页面,用户报名页
    page_id:0,
    page_title:'',
    sign_list:[],
    cutprice_list:[],
    praise_list:[],
    vote_list:[],
    extra_uid:0,
    rule_show:1,

  },
  onLoad: function (option) {
    //获取tmp_data信息
    var data = {
      id:option.id
    }
    if (option.scene) {//扫二维码进来
      var scene = decodeURIComponent(option.scene);
      var scene_arr = scene.split('a');
      data = {
        id:scene_arr[0]
      }
      option.id = scene_arr[0];
      option.customerview = 1;//扫二维码进来的,就是活动页
      if (scene_arr[1]) {
        option.extra_uid = scene_arr[1];
      }
    }

    this.setData({
      preview:Boolean(option.preview),
      customerview:Boolean(option.customerview),
      pageview:Boolean(option.pageview),
      extra_uid:option.extra_uid ? option.extra_uid : 0
    })

    data.extra_uid = this.data.extra_uid;

    if (option.pageview || option.customerview) {
      this.setData({
        rule_show:0
      });
      if (option.customerview) {
       // console.log(1);
        common.check_session(app, function(){
          //授权
          wx.getSetting({
            success: function(res) {
              if (!res.authSetting['scope.userInfo']) {
                wx.authorize({
                  scope: 'scope.userInfo',
                  success:function() {
                    wx.getUserInfo({
                      success: function(res) {
                        var userInfo = res.userInfo;
                        var nickName = userInfo.nickName;
                        var avatarUrl = userInfo.avatarUrl;
                        var gender = userInfo.gender; //性别 0：未知、1：男、2：女
                        var province = userInfo.province;
                        var city = userInfo.city;
                        var country = userInfo.country;

                        var data2 = {
                          user_name:nickName,
                          avatarUrl:avatarUrl,
                          gender:gender,
                          province:province,
                          city:city
                        };

                        common.request('post','info_modify',data2, function (res) {
                          app.get_userinfo(1);
                        })
                      }
                    });
                  }
                })
              } else {

              }
            }
          })
          common.request('get','page_info',data,function (res) {
            var tmp_data = res.data.data.content;
            this.setData({
              page_status:3,
              page_url:res.data.data.page_url,
              sign_list:res.data.data.sign_list,
              cutprice_list:res.data.data.cutprice_list,
              praise_list:res.data.data.praise_list,
              vote_list:res.data.data.vote_list,
              is_sign_cutprice:res.data.data.is_sign_cutprice,
              is_help_cutprice:res.data.data.is_help_cutprice,
              extra_uid:parseInt(res.data.data.extra_uid),
              is_sign_praise:res.data.data.is_sign_praise,
              is_help_praise:res.data.data.is_help_praise,
              page_id:parseInt(option.id)
            });

            wx.setNavigationBarTitle({
              title: res.data.data.title
            })
            if (tmp_data.time_limit_end) {
              tmp_data.time_limit_left = (Date.parse(tmp_data.time_limit_end) - Date.parse(new Date())) / 1000;
              this.timelimit(tmp_data.time_limit_left);
            }

            this.setData({
              tmp_data:tmp_data
            });
          }.bind(this));
        }.bind(this));
      } else {
        common.request('get','page_info',data,function (res) {
          var tmp_data = res.data.data.content;
          this.setData({
            page_status:3,
            page_url:res.data.data.page_url,
            sign_list:res.data.data.sign_list,
            cutprice_list:res.data.data.cutprice_list,
            praise_list:res.data.data.praise_list,
            vote_list:res.data.data.vote_list,
            is_sign_cutprice:res.data.data.is_sign_cutprice,
            is_help_cutprice:res.data.data.is_help_cutprice,
            extra_uid:parseInt(res.data.data.extra_uid),
            is_sign_praise:res.data.data.is_sign_praise,
            is_help_praise:res.data.data.is_help_praise,
            page_id:parseInt(option.id)
          });

          wx.setNavigationBarTitle({
            title: res.data.data.title
          })
          if (tmp_data.time_limit_end) {
            tmp_data.time_limit_left = (Date.parse(tmp_data.time_limit_end) - Date.parse(new Date())) / 1000;
            this.timelimit(tmp_data.time_limit_left);
          }

          this.setData({
            tmp_data:tmp_data
          });
        }.bind(this));
      }

      return;
    } else {
      common.check_session(app);
    }
    common.request('get','tmp_info',data,function (res) {
      common.check_login(res);
      if (!res.data.success) {
        this.setData({
          page_status:4
        })
        return;
      }
      var tmp_data = res.data.data.content;
      for(var i in tmp_data.page) {
        // if (tmp_data.page[i].type == 'vote') {
        //   tmp_data.page[i].vote_num_arr = [];
        //   for(var j=0;j<tmp_data.page[i].vote_num;j++) {
        //     tmp_data.page[i].vote_num_arr.push({src:"../../resource/images/tip.png",is_active:''});
        //   }
        // }
      }
      wx.setNavigationBarTitle({
        title: res.data.data.title
      })
      if (tmp_data.time_limit_left) {
        this.timelimit(tmp_data.time_limit_left);
      }

      this.setData({
        id:option.id,
        tmp_data:tmp_data,
        can_add_extra_img:tmp_data.can_add_extra_img,
        can_add_extra_text:tmp_data.can_add_extra_text
      });
     // console.log(tmp_data);
    }.bind(this));

  },
  get_page_info:function(){
    var data = {
      id:this.data.page_id,
      extra_uid:this.data.extra_uid
    }
    common.request('get','page_info',data,function (res) {
      var tmp_data = res.data.data.content;
      this.setData({

        sign_list:res.data.data.sign_list,
        cutprice_list:res.data.data.cutprice_list,
        praise_list:res.data.data.praise_list,
        vote_list:res.data.data.vote_list,
        is_sign_cutprice:res.data.data.is_sign_cutprice,
        is_help_cutprice:res.data.data.is_help_cutprice,
        extra_uid:parseInt(res.data.data.extra_uid),
        is_sign_praise:res.data.data.is_sign_praise,
        is_help_praise:res.data.data.is_help_praise,

      });

      if (tmp_data.time_limit_end) {
        tmp_data.time_limit_left = (Date.parse(tmp_data.time_limit_end) - Date.parse(new Date())) / 1000;
        this.timelimit(tmp_data.time_limit_left);
      }

      this.setData({
        tmp_data:tmp_data
      });
    }.bind(this));
  },
  onShow: function() {
   // common.check_session(app, 1);
  },
  timelimit: function(left) {
    var time_limit_left = parseInt(left);
    var time_limit_left_desc = '';
    this.data.tmp_data.time_limit_left = time_limit_left;
    this.setData({
      time_limit_left:this.data.tmp_data.time_limit_left
    });
    if (time_limit_left > 0) {
        if (this.Interval) {
          clearInterval(this.Interval);
        }

        this.Interval = setInterval(function () {
        time_limit_left -= 1;
        var day = parseInt(time_limit_left / 3600 / 24);
        var hour = parseInt ((time_limit_left - day * 3600 * 24) / 3600);
        var min = parseInt ((time_limit_left - day * 3600 * 24 - hour * 3600) / 60);
        var sec = parseInt (time_limit_left - day * 3600 * 24 - hour * 3600 - min * 60);
        time_limit_left_desc = day + '天' + hour + '时' + min + '分' + sec + '秒';
        this.setData({
          time_limit_left_desc : time_limit_left_desc
        });

        if (time_limit_left <= 0) {
          clearInterval(this.Interval);
        }
      }.bind(this),1000);
    } else {
      this.setData({
        time_limit_left_desc : '活动已结束'
      });
    }
  },
  start_make:function() {
    this.setData({
      page_status:2
    })
  },
  complete_make: function(){
    if (!this.data.page_title) {
      wx.showToast({
        title: '请输入页面标题',
        image:'../../resource/images/tip.png'
      });
      return;
    }

    this.close_all_pop();
    this.setData({
      page_status:3
    });

    var data = {};
    data.tmp_data = this.data.tmp_data;
    data.tmp_id = this.data.id;
    data.page_title = this.data.page_title;
    common.request('post','page_submit',data, function (res) {
      common.request_callback(res);
      this.setData({
        page_url:res.data.data.url,
        page_id:parseInt(res.data.data.page_id)
      })

    }.bind(this))

  },
  share_make: function(extra_uid){
    if (this.data.qrcode_link) {
      this.setData({
        show_qrcode:true
      });
      return;
    }

    var data = {
      id:this.data.page_id
    };
    data.extra_uid = 0;
    if (this.data.extra_uid) {
      data.extra_uid = this.data.extra_uid;
    }

    if (typeof extra_uid == 'number' || typeof extra_uid == 'string') {
      data.extra_uid = extra_uid;
      this.setData({
        extra_uid:extra_uid
      });
    }
    data.url = this.data.page_url;
    common.request('post','make_qrcode',data, function (res) {
      common.check_login(res);
      this.setData({
        qrcode_link:res.data.data,
        show_qrcode:true
      });

    }.bind(this))

  },
  share_make2:function () {
    this.setData({
      show_link:true
    });
  },
  preview_qrcode:function () {
    wx.previewImage({
      urls: [this.data.qrcode_link] // 需要预览的图片http链接列表
    })
  },
  close_show_qrcode:function () {
    this.setData({
      show_qrcode:false
    });
  },
  close_show_link:function () {
    this.setData({
      show_link:false
    });
  },

  copy:function (event) {
    var content = event.target.dataset.content;
    wx.setClipboardData({
      data: content,
      success: function(res) {
        wx.showToast({
          title: '复制成功!'
        });
      }
    })

  },
  del_block:function(){
    if (this.data.current_index !== false) {
      //关闭编辑
      if (this.data.tmp_data.page[this.data.current_index].type == 'text') {
        this.close_pop_change_text();
      } else if(this.data.tmp_data.page[this.data.current_index].type == 'img') {
        this.close_pop_change_img();
      } else if(this.data.tmp_data.page[this.data.current_index].type == 'timelimit') {
        this.close_pop_change_time_limit_left();
      } else if(this.data.tmp_data.page[this.data.current_index].type == 'cutprice_price') {
        this.close_pop_change_cutprice_price();
      } else if(this.data.tmp_data.page[this.data.current_index].type == 'vote') {
        this.close_pop_change_vote();
      }

      //是否是额外添加的
      if (this.data.tmp_data.page[this.data.current_index].is_add_extra_img) {
        this.data.add_extra_img_num--;
        if (this.data.add_extra_img_num <= this.data.tmp_data.add_extra_img_max) {
          this.setData({
            can_add_extra_img:true
          })
        }
        this.setData({
          add_extra_img_num:this.data.add_extra_img_num
        });
      }

      if (this.data.tmp_data.page[this.data.current_index].is_add_extra_text) {
        this.data.add_extra_text_num--;
        if (this.data.add_extra_text_num <= this.data.tmp_data.add_extra_text_max) {
          this.setData({
            can_add_extra_text:true
          })
        }
        this.setData({
          add_extra_text_num:this.data.add_extra_text_num
        });
      }

      this.data.tmp_data.page.splice(this.data.current_index, 1);

      this.setData({
        tmp_data:this.data.tmp_data
      });

    }
  },
  add_extra_img:function () {
    var new_img = {
      type:'img',
      src:'',
      is_available:true,
      is_add_extra_img:true,
      can_del_block:true,
      style:'width:750rpx;min-height:240rpx;height:auto'
    }
    this.data.tmp_data.page.push(new_img);
    this.setData({
      tmp_data:this.data.tmp_data
    });
    var index = this.data.tmp_data.page.length - 1;

    this.active_current_node(index);
    this.data.current_index = index;
    this.data.add_extra_img_num++;
    if (this.data.add_extra_img_num >= this.data.tmp_data.add_extra_img_max) {
      this.setData({
        can_add_extra_img:false
      })
    }
    this.setData({
      img_path : '',
      can_del_block: this.data.tmp_data.page[this.data.current_index].can_del_block
    });

    this.pop_change_img(1);
  },
  add_extra_text:function () {
    var new_text = {
      type:'text',
      text:'添加文字',
      is_available:true,
      can_del_block:true,
      style:'width:710rpx;min-height:200rpx;margin-top:10rpx;display:block;padding:20rpx',
      is_add_extra_text:true

    }
    this.data.tmp_data.page.push(new_text);
    this.setData({
      inputtext : '添加文字',
      tmp_data:this.data.tmp_data
    });
    var index = this.data.tmp_data.page.length - 1;

    this.active_current_node(index);
    this.data.current_index = index;
    this.data.add_extra_text_num++;
    if (this.data.add_extra_text_num >= this.data.tmp_data.add_extra_text_max) {
      this.setData({
        can_add_extra_text:false
      })
    }
    this.setData({
      img_path : '',
      can_del_block: this.data.tmp_data.page[this.data.current_index].can_del_block
    });

    this.pop_change_text(1);
  },
  goto_page_detail:function () {

    wx.navigateTo({
      url: '/pages/page_detail/index?id='+this.data.page_id
    })
  },
  goto_action:function () {

    wx.navigateTo({
      url: '/pages/tmp_make/index?customerview=1&id='+this.data.page_id
    })
  },

  close_all_pop:function() {
    this.close_pop_change_text();
    this.close_pop_change_time_limit_left();
    this.close_pop_change_img();
    this.close_pop_change_cutprice_price();
    this.close_pop_change_vote();
    this.close_pop_change_vote_img();
  },
  active_current_node:function(index) {
    this.close_all_pop();
    for(var i in this.data.tmp_data.page) {
      this.data.tmp_data.page[i].is_active = '';
    }
    if (this.data.tmp_data.page[this.data.current_index] && this.data.tmp_data.page[this.data.current_index].vote_num_arr) {
      for(var i in this.data.tmp_data.page[this.data.current_index].vote_num_arr) {
        this.data.tmp_data.page[this.data.current_index].vote_num_arr[i].is_active = '';
      }
    }


    this.data.tmp_data.page[index].is_active = 'active';
    this.setData({
      tmp_data: this.data.tmp_data
    });
  },
  unactive_current_node:function(index) {
    if (this.data.tmp_data.page[index]) {
      this.data.tmp_data.page[index].is_active = '';
      this.setData({
        tmp_data: this.data.tmp_data
      });
    }

  },


  //文本修改
  change_text:function (event) {
    if (this.data.page_status != 2) {
      return;
    }

    this.active_current_node(event.currentTarget.dataset.index);
    this.data.current_index = event.currentTarget.dataset.index;
    this.setData({
      inputtext : event.currentTarget.dataset.text,
      can_del_block: this.data.tmp_data.page[this.data.current_index].can_del_block
    });
    this.pop_change_text(1);
  },
  bindinputtext:function (e) {
    this.setData({
      inputtext: e.detail.value
    });
  },
  pop_change_text:function(action){
    this.setData({
      pop_change_text: action
    });
  },
  close_pop_change_text: function () {
    this.pop_change_text(0);
    if (this.data.current_index !== false) {
      this.unactive_current_node(this.data.current_index);
    }

  },
  ok_change_text:function () {

    if (this.data.current_index !== false) {

      this.data.tmp_data.page[this.data.current_index].text = this.data.inputtext;
      this.setData({
        tmp_data: this.data.tmp_data
      });
    }
    this.close_pop_change_text();
  //  this.unactive_current_node(this.data.current_index);
  },

  //剩余时间修改
  change_time_limit_left:function (event) {
    if (this.data.page_status != 2) {
      return;
    }
    this.active_current_node(event.currentTarget.dataset.index);
    this.data.current_index = event.currentTarget.dataset.index;
    this.setData({
      can_del_block: this.data.tmp_data.page[this.data.current_index].can_del_block
    })
    this.pop_change_time_limit_left(1);
  },

  bindinputday:function (e) {
    this.setData({
      day: e.detail.value
    });
  },

  bindinputhour:function (e) {
    this.setData({
      hour: e.detail.value
    });
  },
  bindinputmin:function (e) {
    this.setData({
      min: e.detail.value
    });
  },

  pop_change_time_limit_left:function(action){
    this.setData({
      pop_change_time_limit_left: action
    });
  },
  close_pop_change_time_limit_left: function () {
    this.pop_change_time_limit_left(0);
    if (this.data.current_index !== false) {
      this.unactive_current_node(this.data.current_index);
    }
  },
  ok_change_time_limit_left:function () {


    var timeleft = this.data.day * 3600 * 24 + this.data.hour * 3600 + this.data.min * 60;
    this.timelimit(timeleft);
    this.close_pop_change_time_limit_left();
   // this.unactive_current_node(this.data.current_index);
  },


  //图片修改
  change_img:function (event) {
    if (this.data.page_status != 2) {
      return;
    }
    this.active_current_node(event.currentTarget.dataset.index);
    this.data.current_index = event.currentTarget.dataset.index;
    this.setData({
      img_path : '',
      can_del_block: this.data.tmp_data.page[this.data.current_index].can_del_block
    });

    this.pop_change_img(1);
  },

  choose_img: function() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var tempFiles = res.tempFiles;

        this.data.img_path = tempFilePaths[0];
        this.setData({
          img_path: this.data.img_path
        });

      }.bind(this)
    })
  },
  pop_change_img:function(action){
    this.setData({
      pop_change_img: action
    });
  },
  close_pop_change_img: function () {
    this.pop_change_img(0);
    if (this.data.current_index !== false) {
      this.unactive_current_node(this.data.current_index);
    }

  },
  ok_change_img:function () {


    if (this.data.img_path) {


      wx.uploadFile({
        url: config.urls.img_upload,
        filePath: this.data.img_path,
        name: 'img',
        formData:{
          'user_session':app.globalData.user_session
        },
        success: function(res){
          res.data = JSON.parse(res.data);
          common.check_login(res, app);
          this.data.img_path = res.data.data;

          if (this.data.current_index !== false && this.data.img_path) {

            this.data.tmp_data.page[this.data.current_index].src = this.data.img_path;
            this.setData({
              tmp_data: this.data.tmp_data
            });
          }

        }.bind(this)
      });
    }


    this.close_pop_change_img();
   // this.unactive_current_node(this.data.current_index);
  },

  //砍价价格相关修改
  change_cutprice_price:function (event) {
    if (this.data.page_status != 2) {
      return;
    }

    this.active_current_node(event.currentTarget.dataset.index);
    this.data.current_index = event.currentTarget.dataset.index;


    this.setData({
      can_del_block: this.data.tmp_data.page[this.data.current_index].can_del_block,
      cutprice_price:this.data.tmp_data.page[this.data.current_index].cutprice_price,
      cutprice_max_minus_price:this.data.tmp_data.page[this.data.current_index].cutprice_max_minus_price,
      cutprice_average_price:this.data.tmp_data.page[this.data.current_index].cutprice_average_price
    })
    this.pop_change_cutprice_price(1);
  },

  bindinputcutprice_price:function (e) {
    this.setData({
      cutprice_price: e.detail.value
    });
  },

  bindinputcutprice_max_minus_price:function (e) {

    this.setData({
      cutprice_max_minus_price: e.detail.value
    });
  },
  bindinputcutprice_average_price:function (e) {
    this.setData({
      cutprice_average_price: e.detail.value
    });
  },

  pop_change_cutprice_price:function(action){
    this.setData({
      pop_change_cutprice_price: action
    });
  },
  close_pop_change_cutprice_price: function () {
    this.pop_change_cutprice_price(0);
    if (this.data.current_index !== false) {
      this.unactive_current_node(this.data.current_index);
    }
  },
  ok_change_change_cutprice_price:function () {
    this.data.tmp_data.page[this.data.current_index].cutprice_price = this.data.cutprice_price;
    this.data.tmp_data.page[this.data.current_index].cutprice_max_minus_price = this.data.cutprice_max_minus_price;
    this.data.tmp_data.page[this.data.current_index].cutprice_average_price = this.data.cutprice_average_price;
    this.setData({
      tmp_data: this.data.tmp_data
    });
    this.close_pop_change_cutprice_price();
   // this.unactive_current_node(this.data.current_index);
  },


  //投票大栏目
  change_vote:function (event) {
    if (this.data.page_status != 2) {
      return;
    }

    this.active_current_node(event.currentTarget.dataset.index);
    this.data.current_index = event.currentTarget.dataset.index;


    this.setData({
      can_del_block: this.data.tmp_data.page[this.data.current_index].can_del_block,
      vote_num : this.data.tmp_data.page[this.data.current_index].vote_num
    })
    this.pop_change_vote(1);
  },

  bindinputvote_num:function (e) {
    this.setData({
      vote_num: e.detail.value
    });
  },


  pop_change_vote:function(action){
    this.setData({
      pop_change_vote: action
    });
  },
  close_pop_change_vote: function () {
    this.pop_change_vote(0);
    if (this.data.current_index !== false) {
      this.unactive_current_node(this.data.current_index);
    }
  },
  ok_change_change_vote:function () {
    if (this.data.vote_num <= 0) {
      wx.showToast({
        title: '项目数应大于0',
        image:'../../resource/images/tip.png'
      });
      return;
    }
    this.data.tmp_data.page[this.data.current_index].vote_num = this.data.vote_num;
    this.data.tmp_data.page[this.data.current_index].vote_num_arr = [];
    for(var j=0;j<this.data.vote_num;j++) {
      this.data.tmp_data.page[this.data.current_index].vote_num_arr.push({src:"../../resource/images/tip.png",is_active:''});
    }
    this.setData({
      tmp_data: this.data.tmp_data
    });
    this.close_pop_change_vote();
   // this.unactive_current_node(this.data.current_index);
  },


  //投票图片修改
  change_vote_img:function (event) {
    if (this.data.page_status != 2) {
      return;
    }
    this.data.current_index = event.currentTarget.dataset.index;
    this.data.current_index_sub = event.currentTarget.dataset.index_sub;
    this.close_all_pop();
    for(var i in this.data.tmp_data.page) {
      this.data.tmp_data.page[i].is_active = '';
    }
    for(var i in this.data.tmp_data.page[this.data.current_index].vote_num_arr) {
      this.data.tmp_data.page[this.data.current_index].vote_num_arr[i].is_active = '';
    }

    this.data.tmp_data.page[this.data.current_index].vote_num_arr[this.data.current_index_sub].is_active = 'active';
    this.setData({
      tmp_data: this.data.tmp_data
    });

    this.setData({
      img_path : '',
      can_del_block: false
    });

    this.pop_change_vote_img(1);
  },

  pop_change_vote_img:function(action){
    this.setData({
      pop_change_vote_img: action
    });
  },
  close_pop_change_vote_img: function () {
    this.pop_change_vote_img(0);
    if (this.data.current_index_sub !== false) {
      if (this.data.tmp_data.page[this.data.current_index].vote_num_arr && this.data.tmp_data.page[this.data.current_index].vote_num_arr[this.data.current_index_sub]) {
        this.data.tmp_data.page[this.data.current_index].vote_num_arr[this.data.current_index_sub].is_active = '';
        this.setData({
          tmp_data: this.data.tmp_data
        });
      }
    }

  },
  ok_change_vote_img:function () {


    if (this.data.img_path) {


      wx.uploadFile({
        url: config.urls.img_upload,
        filePath: this.data.img_path,
        name: 'img',
        formData:{
          'user_session':app.globalData.user_session
        },
        success: function(res){
          res.data = JSON.parse(res.data);
          common.check_login(res, app);
          this.data.img_path = res.data.data;

          if (this.data.current_index !== false && this.data.tmp_data.page[this.data.current_index].vote_num_arr && this.data.img_path) {

            this.data.tmp_data.page[this.data.current_index].vote_num_arr[this.data.current_index_sub].src = this.data.img_path;
            this.setData({
              tmp_data: this.data.tmp_data
            });
          }

        }.bind(this)
      });
    }


    this.close_pop_change_vote_img();
  },


  del_activity_block: function (event) {
    this.data.tmp_data[event.currentTarget.dataset.block] = false;
    this.setData({
      tmp_data:this.data.tmp_data
    })
  },
  change_title: function(e){
    this.setData({
      page_title: e.detail.value
    });
  },

  //用户活动页面操作
  custom_sign:function(){
    var data = {
      id:this.data.page_id
    };
    common.request('post','sign',data,function (res) {
      common.request_callback(res);
      if (res.data.success) {
        this.get_page_info();
      }
    }.bind(this));
  },
  custom_cutprice_sign:function(){
    var data = {
      id:this.data.page_id
    };
    common.request('post','cutprice_sign',data,function (res) {
      common.request_callback(res);
      if (res.data.success) {
        this.get_page_info();
      }
    }.bind(this));
  },
  custom_cutprice_help:function(){

    this.share_make(app.globalData.userInfo.id);
  },
  custom_cutprice_cut:function(){
    var data = {
      id:this.data.page_id,
      extra_uid:this.data.extra_uid
    };
    common.request('post','cutprice_cut',data,function (res) {
      common.request_callback(res);
      if (res.data.success) {
        this.get_page_info();
      }
    }.bind(this));
  },
  custom_praise_sign:function(){
    var data = {
      id:this.data.page_id
    };
    common.request('post','praise_sign',data,function (res) {
      common.request_callback(res);
      if (res.data.success) {
        this.get_page_info();
      }
    }.bind(this));
  },
  custom_praise_help:function(){

    this.share_make(app.globalData.userInfo.id);
  },
  custom_praise_praise:function(){
    var data = {
      id:this.data.page_id,
      extra_uid:this.data.extra_uid
    };
    common.request('post','praise_praise',data,function (res) {
      common.request_callback(res);
      if (res.data.success) {
        this.get_page_info();
      }
    }.bind(this));
  },
  custom_vote:function(event){
    var data = {
      id:this.data.page_id,
      vote_id: event.currentTarget.dataset.vote_id
    };
    common.request('post','vote',data,function (res) {
      common.request_callback(res);
      if (res.data.success) {
        this.get_page_info();
      }
    }.bind(this));
  },
  onShareAppMessage:function() {
    var title = '店长的推荐';
    return {
      title:title,
      path:'pages/tmp_make/index?customerview=1&id='+this.data.page_id+'&extra_uid='+this.data.extra_uid,
      imageUrl:'',
      success:function(){
      }
    }
  },
  onPullDownRefresh(){
    if (this.data.customerview) {
      this.get_page_info();
    } else {

    }
    wx.stopPullDownRefresh();
  },
  close_rule() {
    this.setData({
      rule_show:2
    })
  },

  /**
   * 组件item改变,实时更改tmp_data
   * @param event
   */
  change_tmp_data_page(event) {

    this.data.tmp_data.page[event.currentTarget.dataset.index] = event.detail.item;
    this.setData({
      tmp_data:this.data.tmp_data
    })

  },

  /**
   * 组件item改变,实时更改tmp_data
   * @param event
   */
  change_tmp_data(event) {

    this.data.tmp_data[event.detail.key] = event.detail.value;
    this.setData({
      tmp_data:this.data.tmp_data
    })

  },

  /**
   * 组件触发本父组件的方法
   * @param event
   */
  triggerevent(event) {
    if (event.detail.param) {
      this[event.detail.event](event.detail.param);
    } else {
      this[event.detail.event]();
    }
  }

})
