 
var utils = require('./utils');
 
var getWxLoginResult = function getLoginCode(callback, options) {
    wx.login({
        success: function (loginResult) {
            wx.getUserInfo({
                success: function (userResult) {
                    callback(null, {
                        code: loginResult.code,
                        encryptedData: userResult.encryptedData,
                        iv: userResult.iv,
                        userInfo: userResult.userInfo,
                    });
                },

                fail: function (userError) {                    
                    /**
                     * 用户不授权获，就直接登陆
                     *
                     */

                    // 请求数据
                    var requestData = {
                        app_id: options.appid,
                        js_code: loginResult.code
                    };
                    
                    // 发请求获取mstr
                    wx.request({
                        url: options.url + 'sign_in',
                        method: options.method,
                        data: requestData,
                        success: function (result) {
                            var data = result.data;

                            // 成功地响应会话信息
                            if (data.status == 1) {
                                wx.setStorageSync('mstr', data.data.mstr);
                                wx.setStorageSync('mstr_time', data.data.mstr_time);
                                wx.setStorageSync('userinfo', {});
                                
                                var userInfo = {
                                    mstr: data.data.mstr,
                                    mstr_time: data.data.mstr_time,
                                };
                                
                                options.success(userInfo);
                            } else {
                                // 登录失败，可能是网络错误或者服务器发生异常
                                wx.showToast({
                                    title: data.info,
                                    icon: 'loading',
                                    duration: 3000
                                })
                            }
                        },

                        // 响应错误
                        fail: function (loginResponseError) {
                            console.log(loginResponseError)
                            // 登录失败，可能是网络错误或者服务器发生异常
                            wx.showToast({
                                title: '服务器异常',
                                icon: 'loading',
                                duration: 3000
                            })
                        },
                    });
                    
                    return
                },
            });
        },

        fail: function () {       
            wx.showToast({
              title: '微信登录失败',
              icon: 'loading',
              duration: 3000
            })
            return
        },
    });
};

var noop = function noop() {};

// 默认值
var defaultOptions = {
    method: 'POST',
    success: noop,
    fail: noop,
    url: null,
    appid: null,
};

/**
 * @method
 * 进行服务器登录，以获得登录会话
 *
 * @param {Object} options 登录配置
 * @param {string} options.url 登录使用的 URL，服务器应该在这个 URL 上处理登录请求
 * @param {string} options.appid 自定义APPID
 * @param {string} [options.method] 请求使用的 HTTP 方法，默认为 "POST"
 * @param {Function} options.success(userInfo) 登录成功后的回调函数，参数 userInfo 微信用户信息，mstr, mstr_time
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息
 */
var login = function login(options) {
    options = utils.extend({}, defaultOptions, options);
    
    // if (!defaultOptions.url) {
    //     // 登录错误：缺少登录地址，请通过 setLoginUrl() 方法设置登录地址
    //     wx.showToast({
    //         title: '缺少登录地址',
    //         icon: 'loading',
    //         duration: 3000
    //     })
        
    //     return;
    // }
    
    if (!options.appid) {
        wx.showToast({
            title: 'appid参数不存在',
            icon: 'loading',
            duration: 3000
        })
        
        return;
    }
    
    if (!options.url){
        wx.showToast({
            title: 'url参数不存在',
            icon: 'loading',
            duration: 3000
        })
        
        return;
    }
    
    var doLogin = () => getWxLoginResult(function (wxLoginError, wxLoginResult) {
        var userInfo = wxLoginResult.userInfo;
        
        // 请求数据
        var requestData = {
            app_id: options.appid,
            js_code: wxLoginResult.code,
            encrypted_data: wxLoginResult.encryptedData,
            iv: wxLoginResult.iv
        };
        
        // 请求服务器登录地址，获得会话信息
        wx.request({
            url: options.url + 'sign_in',
            method: options.method,
            data: requestData,
            success: function (result) {
                var data = result.data;

                // 成功地响应会话信息
                if (data.status == 1) {
                    wx.setStorageSync('mstr', data.data.mstr);
                    wx.setStorageSync('mstr_time', data.data.mstr_time);
                    wx.setStorageSync('userinfo', userInfo);
                    
                    userInfo.mstr = data.data.mstr;
                    userInfo.mstr_time = data.data.mstr_time;
                    
                    options.success(userInfo);
                } else {
                    // 登录失败，可能是网络错误或者服务器发生异常
                    wx.showToast({
                        title: data.info,
                        icon: 'loading',
                        duration: 3000
                    })
                    
                    return;
                }
            },

            // 响应错误
            fail: function (loginResponseError) {
                console.log(loginResponseError)
                // 登录失败，可能是网络错误或者服务器发生异常
                wx.showToast({
                    title: '服务器异常',
                    icon: 'loading',
                    duration: 3000
                })
                
                return;
            },
        });
    }, options);

    var mstr = wx.getStorageSync('mstr');
    var mstr_time = wx.getStorageSync('mstr_time');
    
    if (mstr && mstr_time) {        
        wx.checkSession({
            success: function () {
                var userinfo = wx.getStorageSync('userinfo');
                userinfo.mstr = mstr;
                userinfo.mstr_time = mstr_time;
                
                options.success(userinfo);
                
                var requestData = {
                    mstr: wx.getStorageSync('mstr')
                };
                
                // 更新用户最后登陆时间
                wx.request({
                    url: options.url + 'pub_upload_userinfo',
                    data: requestData,
                    method: 'POST',
                    success: function (result) {
                        
                    }
                })
            },

            fail: function () {
                wx.removeStorageSync('mstr');
                wx.removeStorageSync('mstr_time');
                doLogin();
            },
        });
    } else {
        doLogin();
    }
};

var setLoginUrl = function (loginUrl) {
    defaultOptions.loginUrl = loginUrl;
};

module.exports = {
    login: login,
    setLoginUrl: setLoginUrl,
};