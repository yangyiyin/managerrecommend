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
    stock_none:false

  },
  onLoad: function (option) {
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

          this.get_page_info();
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
        this.setData({
          page_status:4
        })
        return;
      }
      var tmp_data = res.data.data.content;
      wx.setNavigationBarTitle({
        title: res.data.data.title
      })

      this.setData({
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
        page_url:res.data.data.page_url,
        sign_list:res.data.data.sign_list,
        cutprice_list:res.data.data.cutprice_list,
        praise_list:res.data.data.praise_list,
        vote_list:res.data.data.vote_list,
        // fight_group_list:res.data.data.fight_group_list,
        // quick_buy_list:res.data.data.quick_buy_list,
        is_sign_cutprice:Boolean(res.data.data.is_sign_cutprice),
        is_help_cutprice:Boolean(res.data.data.is_help_cutprice),
        extra_uid:parseInt(res.data.data.extra_uid),
        is_sign_praise:Boolean(res.data.data.is_sign_praise),
        is_help_praise:Boolean(res.data.data.is_help_praise),
        is_sign_fightgroup:Boolean(res.data.data.is_sign_fightgroup),
        is_help_fightgroup:Boolean(res.data.data.is_help_fightgroup),
        pick_code:res.data.data.pick_code,
        stock_none:res.data.data.stock_none

      });

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

    }.bind(this));
  },
  onShow: function() {},
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

    this.setData({
      page_status:3
    });

    var data = {};
    data.tmp_data = this.data.tmp_data;
    data.tmp_id = this.data.id;
    data.page_title = this.data.page_title;
    data.page_stock = this.data.page_stock;
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
  onShareAppMessage:function() {
    var title = '神奇店长';
    common.request('get','statistics_point',{page_id:this.data.page_id, type:2}, function (res) {});
    return {
      title:title,
      path:'pages/tmp_make/index?customerview=1&id='+this.data.page_id+'&extra_uid='+this.data.extra_uid,
      imageUrl:''
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


  }

})
