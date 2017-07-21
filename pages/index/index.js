//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    r_url: '',
    page: 0,
    slide_index: 2,   //当前索引
    temp_data: {      //模板 数据
      logo: '../icon/ico_home.png',
      shop_main: '../icon/ico_shop_main_0.png',
      // shop_main: '../icon/ico_shop_main_1.png',
      img_car: '../icon/ico_car_0.png',
      // img_car: '../icon/ico_car_1.png',
      img_my: '../icon/ico_my_0.png',
      // img_my: '../icon/ico_my_1.png'
      class_name: -1,// 当前高亮页面 -1 首页   0  商城 1 购物车  2 我的
    },
    slide_i: 2,
    heads: [],             //头像's
    is_move: false,       //是否模糊
    words: {},      // 作品's
    img_left: '',   //左缩略图索引
    img_right: '',  //右缩略图索引
    scroll_height: ''     //滚动高度
  },
  // swiper 修改
  swiper: function (e) {
    let i = e.detail.current;       //索引
    this.swiper_edit(i);            //封装的方法      
  },
  // 作者详情
  author_datail: function (e) {
    let that = this;
    let i = null;
    /*
      1.得到索引
      2.当前索引id
      3.带着id跳转到作者详情
     */
    if (e.currentTarget.dataset.index != undefined) {
      i = e.currentTarget.dataset.index;
      // 这个索引是head 里面的索引，需要从words 里面匹配索引，然后跳转
      let pid = that.data.heads[i].pid;
      console.log(i);
      let t = that.data.words;
      for (let x = 0; x < t.length; x++) {
        if (t[x].pid == pid) {
          wx.navigateTo({
            url: `../intro/intro?index=${x}`
          });
        }
      }



      return false;
    } else {
      i = that.data.slide_i;
      console.log(i);
      wx.navigateTo({
        url: `../intro/intro?index=${i}`,
      });
      return false;
    }
  },
  // 开始滑动
  move: function (e) {
    this.setData({
      is_move: true
    });

  },
  // 结束滑动
  end_move: function () {
    this.setData({
      is_move: false
    });
  },
  // 作品详情
  datail: function (e) {
    let that = this;
    let i = e.currentTarget.dataset.index;
    let id = that.data.words[i].works[0].id;
    wx.navigateTo({
      url: `../dateil/dateil?id=${id}`,
    });
  },
  onLoad: function (o) {
    let rqcode_goods_id = o.rqcode_goods_id; //如果扫描二维码进来的
    console.log(o);
    //等待弹窗
    wx.showLoading({
      title: '正在加载',
      mask: true,
      icon: 'loading'
    });
    let that = this;
    let r_url = app.globalData.r_url;
    wx.login({
      success: function (data) {
        console.log(data);
        let js_code = data.code;
        wx.getUserInfo({
          success: function (res) {
            app.globalData.userInfo = res.userInfo;
            wx.setStorageSync('userInfo', res.userInfo);
          }
        });
        //请求 MSTR
        wx.request({
          url: `${app.globalData.r_url}sign_in`,
          data: {
            js_code: js_code,
            app_id: app.globalData.app_id
          },
          method: 'POST',
          success: function (data) {
            if (data.data.status) {
              let mstr = data.data.data.mstr;
              app.globalData.mstr = mstr;
              wx.setStorageSync('mstr', mstr);
              that.setData({
                mstr: mstr,
                r_url: r_url,
                skip_num: 0
              });

              // 判断是否从扫码进来的
              if (rqcode_goods_id) {
                wx.navigateTo({
                  url: `../dateil/dateil?id=${rqcode_goods_id}`,
                });
              }
              // 请求首页
              wx.request({
                url: `${app.globalData.r_url}yihushop_index`,
                data: {
                  mstr: mstr,
                },
                method: 'POST',
                success: function (data) {
                  console.log(data);
                  if (data.data.status) {
                    let t = data.data.data;
                    let i = parseInt(that.data.slide_index); // 当前轮播图 索引
                    let heads = [];
                    let slides = [];
                    for (let j = 0; j < 5; j++) {
                      heads.push(t[j]);  //头像's的所有信息
                    }
                    let left = '';
                    let right = '';
                    if (t[i - 1].works[0]) {
                      left = t[i - 1].works[0].thumb;
                    }
                    if (t[i + 1].works[0]) {
                      right = t[i + 1].works[0].thumb;
                    }
                    wx.hideLoading();

                    that.setData({
                      heads: heads,         //头像s
                      words: t,              // 作品's
                      img_left: left,      //当前左边图片
                      img_right: right     //当前右边图片
                    });

                  }
                }
              });
            } else {
              //确认弹窗
              wx.hideLoading();
              wx.showModal({
                title: '错误',
                content: '加载失败，请退出重试',
                showCancel: false,
                mask: true,
              });
            }
          }
        });
      }
    })

  },
  onShow: function () {
  },
  // 滑动轮播图
  swiper_edit: function (i) {
    let that = this;
    let len = that.data.words.length;        // 长度
    let t = that.data.words;                  //数据data
    console.log(t[i]);
    let heads = [];
    /*
      1. 得到当前索引
      2. 取索引前后两条数据
      3. 判断是否有数据，如果没有，接调到末尾或者开头
     */
    // 如果不是最前面，或者最后面
    if (i >= 2 && i <= len - 3) {
      console.log('index:i >= 2 && i <= len - 2');
      for (let j = i - 2; j <= i + 2; j++) {
        heads.push(t[j]);  //头像's
      }
      that.setData({
        heads: heads,         //头像s
        img_left: t[i - 1].works[0].thumb,      //  当前左边图片
        img_right: t[i + 1].works[0].thumb,
        slide_i: i,
      });
    } else if (i == 1) {
      console.log('index' + i);
      // 前面第二个
      heads[0] = t[len - 1];   //第一个头像是最后一个
      heads[1] = t[i - 1];   //第二个头像是前面一个
      heads[2] = t[i];
      heads[3] = t[i + 1];   //第三个头像右边一个
      heads[4] = t[i + 2];   //第四个头像是右边两个
      // --------------------头像
      that.setData({
        heads: heads,         //头像s
        img_left: t[i - 1].works[0].thumb,      // 左边一个，也就是第0个，
        img_right: t[i + 1].works[0].thumb,
        slide_i: i,    // 右边还是那个右边
      });
    }
    else if (i == 0) {
      console.log('index:0');
      // 前面第一个

      heads[0] = t[len - 2];   //第一个头像是最后二个
      heads[1] = t[len - 1];   //第二个头像是最后一个
      heads[2] = t[i];
      heads[3] = t[i + 1];   //第三个头像右边一个
      heads[4] = t[i + 2];   //第四个头像是右边两个
      // --------------------头像
      console.log(t[len - 1]);
      that.setData({
        heads: heads,                 //头像s
        img_left: t[len - 1].works[0].thumb,  // 左边就是右边最后一张
        img_right: t[i + 1].works[0].thumb,
        slide_i: i,    // 右边还是那个右边
      });
    } else if (i == len - 1) {
      console.log('index:len-1');
      // 最右边
      heads[0] = t[i - 2];     //第一个头像是前面二个
      heads[1] = t[i - 1];     //第二个头像是前面一个
      heads[2] = t[i];         //最后一个
      heads[3] = t[0];         //第三个头像最前面第一个
      heads[4] = t[1];         //第四个头像最前面第二个
      that.setData({
        heads: heads,               //头像s
        img_left: t[i - 1].works[0].thumb,   // 左边一个，前面一个
        img_right: t[0].works[0].thumb,
        slide_i: i,      // 右边是数组第一个
      });
    } else if (i == len - 2) {
      console.log('index:len-2');
      // 右边前面一个
      heads[0] = t[1];     //第一个头像是前面二个
      heads[1] = t[2];     //第二个头像是前面一个
      heads[2] = t[i];
      heads[3] = t[i + 1];     //第三个头像右边一个
      heads[4] = t[0];   //第四个头像最前面第一个
      that.setData({
        heads: heads,                //头像s
        img_left: t[i - 1].works[0].thumb,    // 左边一个，前面一个
        img_right: t[i + 1].works[0].thumb,
        slide_i: i,   // 右边是数组第一个
      });
    }


    // 如果到第二个或者倒数第二个
    if (i == 2 || i == len - 3) {
      console.log('index:' + i);
      // 请求首页
      wx.request({
        url: `${app.globalData.r_url}yihushop_index`,
        data: {
          mstr: that.data.mstr,
          page: parseInt((that.data.page + 1) * 30)
        },
        method: 'POST',
        success: function (data) {
          console.log(data);
          if (data.data.status) {
            let d = data.data.data;
            d = that.data.words.concat(d);
            console.log(d.length);
            that.setData({
              words: d,              // 作品's
              page: (that.data.page + 1)
            });
          }
        }
      });
    }
  }
});

