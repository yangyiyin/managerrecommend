//index.js
//获取应用实例
const app = getApp()
const common = require('../../utils/common.js');
const config = require('../../utils/config.js');
Page({
  data: {
    tmp_data: {},
    id:'',
    tmp_type:-1,
    page_type:-1,
    page_status:1,//1预览,2制作,3完成制作,9下一步设置参数,11,客户已报名页(第二页)
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
    page_stock:0,
    sign_list:[],
    cutprice_list:[],
    praise_list:[],
    vote_list:[],
    extra_uid:0,
    rule_show:0, //0不展示 1展示 2关闭
    pick_code:'',
    pick_code_actions: [
      {
        name: '确认',
        color: '#19be6b'
      }
    ],
    pick_code_visible:false,
    stock_none:false,
    cannot_sign:false,
    set_img_key:'',
    current_cut_img:'',
    main_img:'',
    auth_userinfo:true,
    start_time:'',
    end_time:'',
    start_time_min:'',
    end_time_min:'',
    is_seller:false,
    seller_info:null,
    extra_user_info:null,
    userInfo:app.globalData.userInfo,
    page_info:null

  },
  onLoad: function (option) {
    this.setData({
      userInfo:app.globalData.userInfo,
    })
    if (option.scene) {//扫二维码进来
      var scene = decodeURIComponent(option.scene);
      var scene_arr = scene.split('a');
      option.id = scene_arr[0];
      option.customerview = 1;//扫二维码进来的,就是活动页
      if (scene_arr[1]) {
        option.extra_uid = scene_arr[1];
      }
    }

    this.setData({
      id:option.id,
      preview:Boolean(option.preview),
      customerview:Boolean(option.customerview),
      pageview:Boolean(option.pageview),
      extra_uid:option.extra_uid ? option.extra_uid : 0
    })


    // data.extra_uid = this.data.extra_uid;

    if (option.pageview || option.customerview) {
      this.setData({
        page_id: this.data.id,
        page_status:3
      });

      if (option.customerview) {

        common.request('get','statistics_point',{page_id:this.data.page_id, type:1}, function (res) {});
        common.check_session(app, function(){
          //获取用户授权权限
          wx.getSetting({
            success:function(res){
              this.setData({
                auth_userinfo:res.authSetting['scope.userInfo'] ? true : false
              })
            }.bind(this)
          })
          
          this.get_page_info().then(function(){
              //blocks:[{id:2,name:'砍价'},{id:1,name:'限时特惠'},{id:7,name:'预约报名'},{id:3,name:'集赞'},{id:4,name:'投票'},{id:5,name:'图文'}],
            if (this.data.page_type == 2 || this.data.page_type == 3 || this.data.page_type == 7) {
              this.seller_info_animation();
            }

            if (this.data.page_type == 2 && !option.origin && (this.data.is_sign_cutprice || this.data.extra_uid)) {//砍价
              this.setData({
                page_status:11
              })
            } else if(this.data.page_type == 7 && !option.origin && this.data.is_sign) {
              this.setData({
                page_status:11
              })
            } else if(this.data.page_type == 3 && !option.origin && (this.data.is_sign_praise || this.data.extra_uid)) {
              this.setData({
                page_status:11
              })
            } else {

            }

          }.bind(this));
        }.bind(this));
      } else {
        this.get_page_info();
      }

      return;
    }
    this.setData({
      rule_show:1
    });

    common.check_session(app);
    common.request('get','tmp_info',{id:this.data.id},function (res) {
      common.check_login(res);
      if (!res.data.success) {
        if (res.data.error_code == 999) {
          wx.redirectTo({
            url: '/pages/vip/index'
          })
        }
        return;
      }
      var tmp_data = res.data.data.content;
      wx.setNavigationBarTitle({
        title: res.data.data.title
      })

      this.setData({
        tmp_data:tmp_data,
        tmp_type:res.data.data.type,
        can_add_extra_img:tmp_data.can_add_extra_img,
        can_add_extra_text:tmp_data.can_add_extra_text
      });
     // console.log(tmp_data);
    }.bind(this));

  },
  /**
   * 获取权限的时候
   * @param e
   */
  onGotUserInfo: function(e) {
    // console.log(e.detail.errMsg)
    // console.log(e.detail.userInfo)
    // console.log(e.detail.rawData);

    var data = {};
    data.wechat_user_info = e.detail.rawData;
    //上传更新
    common.request('post','info_modify',data, function (res) {

      app.globalData.userInfo.wechat_user_info = e.detail.userInfo;
      this.setData({
        auth_userinfo:true
      })
    }.bind(this))

  },
  bindDateStart:function(e){
    this.setData({
      start_time:e.detail.value
    })
  },
  bindDateEnd:function(e){
    this.setData({
      end_time:e.detail.value
    })
  },
  bindDateStartmin:function(e){
    this.setData({
      start_time_min:e.detail.value
    })
  },
  bindDateEndmin:function(e){
    this.setData({
      end_time_min:e.detail.value
    })
  },
  get_page_info:function(is_customer){
    return new Promise(function (resolve, reject) {
      var data = {
        id:this.data.page_id,
        extra_uid:this.data.extra_uid
      }
      common.request('get','page_info',data,function (res) {
        var tmp_data = res.data.data.content;
        this.setData({
          page_info:res.data.data,
          page_url:res.data.data.page_url,
          page_type:res.data.data.type,
          sign_list:res.data.data.sign_list,
          cutprice_list:res.data.data.cutprice_list,
          praise_list:res.data.data.praise_list,
          vote_list:res.data.data.vote_list,
          // fight_group_list:res.data.data.fight_group_list,
          // quick_buy_list:res.data.data.quick_buy_list,
          is_sign_cutprice:Boolean(res.data.data.is_sign_cutprice),
          is_help_cutprice:Boolean(res.data.data.is_help_cutprice),
          extra_uid:parseInt(res.data.data.extra_uid),
          is_sign:Boolean(res.data.data.is_sign),
          is_sign_praise:Boolean(res.data.data.is_sign_praise),
          is_help_praise:Boolean(res.data.data.is_help_praise),
          is_sign_fightgroup:Boolean(res.data.data.is_sign_fightgroup),
          is_help_fightgroup:Boolean(res.data.data.is_help_fightgroup),
          pick_code:res.data.data.pick_code,
          stock_none:res.data.data.stock_none,
          cannot_sign:Boolean(res.data.data.cannot_sign),
          is_seller:res.data.data.is_seller,
          seller_info:res.data.data.seller_info,
          extra_user_info:res.data.data.extra_user_info ? res.data.data.extra_user_info : null

        });

        //如果是用户页面,获取之后,立马切换页面
        if (is_customer) {
          if (this.data.page_type == 2 && (this.data.is_sign_cutprice || this.data.extra_uid)) {//砍价
            this.setData({
              page_status:11
            })
          } else if(this.data.page_type == 7 && this.data.is_sign) {
            this.setData({
              page_status:11
            })
          } else if(this.data.page_type == 3 && (this.data.is_sign_praise || this.data.extra_uid)) {
            this.setData({
              page_status:11
            })
          } else {

          }
        }

        wx.setNavigationBarTitle({
          title: res.data.data.title
        })

        if (tmp_data.time_limit_end) {
          tmp_data.time_limit_left = (Date.parse(tmp_data.time_limit_end) - Date.parse(new Date())) / 1000;
        }

        this.setData({
          tmp_data:tmp_data
        });

        if (this.data.customerview && this.data.stock_none) {
          wx.showModal({
            title: '提示',
            content: '当前库存不足,无法报名活动',
            showCancel:false
          });
        }
        if (this.data.customerview && this.data.cannot_sign) {
          wx.showModal({
            title: '提示',
            content: '当前活动未开始或已结束,无法报名活动',
            showCancel:false
          });
        }

        resolve();

      }.bind(this));
    }.bind(this));
  },
  onShow: function() {

    if (this.data.set_img_key) {
      if (this.data.set_img_key == 'main_img') {
        this.setData({
          main_img:app.globalData.current_cut_img
        })
      }
      this.data.set_img_key = '';
    } else {
      this.setData({
        current_cut_img:app.globalData.current_cut_img
      })
    }

  },
  start_make:function() {
    this.setData({
      page_status:2
    })
  },
  complete_make: function(){
    var error_msg = [];
    if (!this.data.main_img) {
      error_msg.push('请输入上传主图');
    }
    if (!this.data.page_title) {
      error_msg.push('请输入页面标题');
    }
    if ((this.data.tmp_type == 2 ||this.data.tmp_type == 7) && !this.data.page_stock) {
      error_msg.push('请输入页面标题');
    }

    if ((this.data.tmp_type == 2 ||this.data.tmp_type == 3 || this.data.tmp_type == 4 ||this.data.tmp_type == 7) && !this.data.start_time) {
      error_msg.push('请选择活动开始日期');
    }
    if ((this.data.tmp_type == 2 ||this.data.tmp_type == 3 || this.data.tmp_type == 4 ||this.data.tmp_type == 7) && !this.data.end_time) {
      error_msg.push('请选择活动结束日期');
    }
    if (error_msg.length) {
      wx.showToast({
        title: error_msg[0],
        image:'../../resource/images/tip.png'
      });
      return;
    }
    common.show_toast('上传主图中...');
    //开始上传主图
    wx.uploadFile({
      url: config.urls.img_upload,
      filePath: this.data.main_img,
      name: 'img',
      formData:{
        'user_session':app.globalData.user_session
      },
      success: function(res){
        wx.hideToast();
        common.show_toast('提交活动数据中...');
        res.data = JSON.parse(res.data);
        //common.check_login(res, app);
        this.setData({
          main_img:res.data.data
        });

        // this.setData({
        //   page_status:3
        // });

        var data = {};
        data.tmp_data = this.data.tmp_data;
        data.tmp_id = this.data.id;
        data.page_title = this.data.page_title;
        data.main_img = this.data.main_img;
        data.page_stock = this.data.page_stock;
        if (this.data.start_time) {
          data.start_time = this.data.start_time_min ? this.data.start_time+' ' +this.data.start_time_min : this.data.start_time;
        }
        if (this.data.end_time) {
          data.end_time = this.data.end_time_min ? this.data.start_time+' ' +this.data.end_time_min : this.data.end_time
        }
        common.request('post','page_submit',data, function (res) {
          wx.hideToast();
          common.request_callback(res);
          this.setData({
            page_url:res.data.data.url,
            page_id:parseInt(res.data.data.page_id)
          });
          wx.redirectTo({
            url: '/pages/share/index?from_publish=1&page_id='+this.data.page_id+'&title='+this.data.page_title+'&img='+this.data.main_img
          });
        }.bind(this))

      }.bind(this)
    });

  },

  complete_make_next: function(){

    common.show_confirm('请确认信息无误,进入下一步后将无法回退修改').then(function(){
      this.setData({
        page_status:9
      });
    }.bind(this))

  },
  share_make_by_uid(){

    wx.navigateTo({
      url: '/pages/share/index?page_id='+this.data.page_id+'&extra_uid='+app.globalData.userInfo.id+'&title='+this.data.page_info.title+'&img='+this.data.page_info.img
    });

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

    if (typeof extra_uid == 'number' || typeof extra_uid == 'string') {
      this.setData({
        extra_uid:extra_uid
      });
    }

    if (this.data.extra_uid) {
      data.extra_uid = this.data.extra_uid;
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
  // share_make2:function () {
  //   this.setData({
  //     show_link:true
  //   });
  // },
  preview_qrcode:function () {
    wx.previewImage({
      urls: [this.data.qrcode_link] // 需要预览的图片http链接列表
    });
    common.request('get','statistics_point',{page_id:this.data.page_id, type:2}, function (res) {});
  },
  close_show_qrcode:function () {
    this.setData({
      show_qrcode:false
    });
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
    this.data.add_extra_img_num++;
    if (this.data.add_extra_img_num >= this.data.tmp_data.add_extra_img_max) {
      this.setData({
        can_add_extra_img:false
      })
    }

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
    this.data.add_extra_text_num++;
    if (this.data.add_extra_text_num >= this.data.tmp_data.add_extra_text_max) {
      this.setData({
        can_add_extra_text:false
      })
    }

  },
  goto_page_detail:function () {

    wx.navigateTo({
      url: '/pages/page_detail/index?id='+this.data.page_id
    })
  },
  goto_page_origin:function () {

    wx.navigateTo({
      url: '/pages/tmp_make/index?origin=1&customerview=1&id='+this.data.page_id
    })
  },

  goto_action:function () {

    wx.navigateTo({
      url: '/pages/tmp_make/index?customerview=1&id='+this.data.page_id
    })
  },
  change_title: function(e){
    this.setData({
      page_title: e.detail.value
    });
  },
  change_stock: function(e){
    this.setData({
      page_stock: e.detail.value
    });
  },
  // onShareAppMessage:function() {
  //   var title = '店长营销工具';
  //   common.request('get','statistics_point',{page_id:this.data.page_id, type:2}, function (res) {});
  //   return {
  //     title:title,
  //     path:'pages/tmp_make/index?customerview=1&id='+this.data.page_id+'&extra_uid='+this.data.extra_uid,
  //     imageUrl:''
  //   }
  //
  // },
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
  show_pick_code() {
    // wx.showModal({
    //   title: '凭证码',
    //   content: this.data.pick_code,
    //   showCancel:false
    // });
    this.setData({
      pick_code_visible:true
    })
  },

  close_pick_code() {

    this.setData({
      pick_code_visible:false
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
      this[event.detail.event](event.detail.param, event);
    } else {
      this[event.detail.event](event);
    }
  },

  /**
   * 组件触发删除模块
   */
  del_block(event){
    var index = event.currentTarget.dataset.index;
    if (this.data.tmp_data.page[index].is_add_extra_img) {
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

    if (this.data.tmp_data.page[index].is_add_extra_text) {
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

    this.data.tmp_data.page.splice(index, 1);

    this.setData({
      tmp_data:this.data.tmp_data
    });


  },


  change_main_img(){

    this.setData({
      set_img_key:'main_img'
    })
    var w = 500;
    var h = 400;
    wx.navigateTo({
      url: '/pages/cutInside/cutInside?w='+w+'&h='+h
    });
  },
  show_rule_seller(){
    this.setData({
      rule_seller_visible:true
    })
  },
  close_rule_seller(){
    this.setData({
      rule_seller_visible:false
    })
  },
  show_rule_customer(){
    this.setData({
      rule_customer_visible:true
    })
  },
  close_rule_customer(){
    this.setData({
      rule_customer_visible:false
    })
  },

  show_seller_info(){
    this.setData({
      seller_info_visible:true
    })
  },
  close_seller_info(){
    this.setData({
      seller_info_visible:false
    })
  },

  seller_info_animation(){
    if (this.data.seller_info_animation_ins) {
      return;
    }
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    });
    var scale = 1;
    this.data.seller_info_animation_ins = setInterval(function () {
      if (scale == 1) {
        scale = 1.2;
      } else {
        scale = 1;
      }
      animation.scale(scale).step();
      this.setData({
        seller_info_animation:animation.export()
      });
    }.bind(this),2000)
  },
  custom_cutprice_cut:function(){
    var data = {
      id:this.data.page_id,
      extra_uid:this.data.extra_uid
    };
    common.request('post','cutprice_cut',data,function (res) {
      common.request_callback(res);
      if (res.data.success) {
        this.setData({
          cut_price_tips_visible:true,
          cut_price_tips:res.data.message
        })
        this.get_page_info();
      }
    }.bind(this));
  },
  close_cut_price_tips(){
    this.setData({
      cut_price_tips_visible:false
    })
  },
  custom_praise_praise:function(){
    var data = {
      id:this.data.pageId,
      extra_uid:this.data.extraUid
    };
    common.request('post','praise_praise',data,function (res) {
      common.request_callback(res);
      if (res.data.success) {
        this.setData({
          praise_tips_visible:true,
          praise_tips:res.data.message
        })
        this.get_page_info();
      }
    }.bind(this));
  },
  close_praise_tips(){
    this.setData({
      praise_tips_visible:false
    })
  },
})
