
const config = require('./config.js');

var request_callback = function (res, app) {
    if (!app) {
        app = getApp();
    }
    if (res.data.success) {
      // wx.showToast({
      //   title: res.data.message
      //
      // });
    } else {
        if (res.data.error_code == 101 || res.data.error_code == 102) {
            wx.showToast({
                title: '登录超时',
                duration:3000,
                icon:"loading"
            });
            app.globalData.user_session = '';
            wx.setStorageSync('user_session','');
            app.login();
        } else {
            wx.showModal({
                title: '',
                content: res.data.message ? res.data.message : '系统异常',
                showCancel:false

            });
        }

    }
}

var check_login = function (res, app) {
    if (!app) {
        app = getApp();
    }
    if (res.data.success) {

    } else {
        if (res.data.error_code == 101 || res.data.error_code == 102) {
            wx.showToast({
                title: '登录超时',
                duration:3000,
                icon:"loading"
            });
            app.globalData.user_session = '';
            wx.setStorageSync('user_session','');
            app.login();
        } else {
            wx.showModal({
                title: '',
                content: res.data.message ? res.data.message : '系统异常',
                showCancel:false
            });
        }

    }
}

var check_session = function (app,is_not_direct) {
    if (!app) {
        app = getApp();
    }
    if(!app.globalData.user_session) {
        wx.showToast({
            title: '载入中...',
            duration:3000,
            icon:"loading"
        });
        app.globalData.user_session = '';
        wx.setStorageSync('user_session','');
        app.login(is_not_direct);
    } else {
        if (typeof is_not_direct == 'function') {
            is_not_direct();
        }
    }
}


var request = function (method,url,user_data,callback) {

    var app = getApp();
    var data = app.get_common_request_data();
    if (user_data) {
        for(var i in user_data) {
            data[i] = user_data[i];
        }
    }
    if (config.urls[url]) {
        url = config.urls[url];
    }

    wx.showNavigationBarLoading();
    wx.request({
        url: url,
        data:data,
        method:method,
        success: function(res) {
            //request_callback(res, app);
            callback(res);
        },
        fail: function(res) {
            console.log(res)
        },
        complete: function(res) {
            wx.hideNavigationBarLoading();
        }
    });
}

var show_toast = function (msg, icon) {

    wx.showToast({
        title: msg ? msg : '系统繁忙,请稍后再试',
        duration:2000,
        icon:icon ? icon : "none"
    });
}

var show_confirm = function(message){
    return new Promise(function (resolve, reject) {
        wx.showModal({
            title: '',
            content: message,
            success: function (res) {
                if (res.confirm) {
                    resolve();
                } else {
                    reject();
                }
            }
        })
    });
}

function isPoneAvailable(str) {
    var myreg=/^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}
module.exports = {
    request_callback: request_callback,
    check_login:check_login,
    check_session:check_session,
    show_toast:show_toast,
    show_confirm:show_confirm,
    request:request,
    isPoneAvailable:isPoneAvailable
}
