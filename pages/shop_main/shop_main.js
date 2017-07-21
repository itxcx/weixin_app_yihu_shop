//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    temp_data: {      //模板 数据
      mstr: 0,
      r_url: 0,
      logo: '../icon/ico_home.png',
      // shop_main: '../icon/ico_shop_main_0.png',
      shop_main: '../icon/ico_shop_main_1.png',
      img_car: '../icon/ico_car_0.png',
      // img_car: '../icon/ico_car_1.png',
      img_my: '../icon/ico_my_0.png',
      // img_my: '../icon/ico_my_1.png'
      class_name: 0,
    },
    sel_time: '0', //选择时间 字符0 默认 ，false 下 ，true 上升
    sel_size: '0',
    sel_money: '0',
    shop_data: {},  //商品数据
  },
  // 详情
  datail: function (e) {
    let that = this;
    let i = e.currentTarget.dataset.index;
    let id = that.data.shop_data[i].id;
    if (id) {
      wx.navigateTo({
        url: `../dateil/dateil?id=${id}`,
      });
    }
  },
  // 加入购物车
  add_shop_car: function (e) {
    let that = this;
    let i = e.currentTarget.dataset.index;
    let id = that.data.shop_data[i].id;
    if (id) {
      //等待弹窗
      let time = 1000;
      wx.showLoading({
        title: '请选择属性',
        mask: true,
        icon: 'loading',
        duration: time,
        success: function () {
          setTimeout(function () {
            wx.navigateTo({
              url: `../dateil/dateil?id=${id}`,
            });
          }, time);

        }
      });


    }
  },

  // 排序
  sort: function (e) {
    let that = this;
    let i = e.currentTarget.dataset.index;
    let time = that.data.sel_time;   //时间
    let size = that.data.sel_size;  //尺幅
    let money = that.data.sel_money; //价格
    let page = 0;
    if (i == 1) {
      // 1. 时间 
      // 2.尺幅
      // 3.价格
      if (time === "0") {
        time = 1;
      } else if (time) {
        time = 0;
      } else {
        time = 1;
      }
      wx.request({
        url: `${app.globalData.r_url}goods_get_custom`,
        data: {
          mstr: that.data.mstr,
          newest: 1,
          sort_newest: time
        },
        method: 'POST',
        success: function (data) {
          console.log(data);
          if (data.data.status) {
            let t = data.data.data.newest;
            console.log(t);
            that.setData({
              shop_data: t,
              sel_time: time,
              sel_size: '0',
              sel_money: '0'
            });
          }
        }
      });

    } else if (i == 2) {
      // 2.尺幅
      if (size === "0") {
        size = 1;
      } else if (size) {
        size = 0;
      } else {
        size = 1;
      }
      wx.request({
        url: `${app.globalData.r_url}goods_get_custom`,
        data: {
          mstr: that.data.mstr,
          size: 1,
          sort_size: size,
          page_size: page
        },
        method: 'POST',
        success: function (data) {
          console.log(data);
          if (data.data.status) {
            let t = data.data.data.size;
            that.setData({
              shop_data: t,
              sel_size: size,
              sel_time: '0',
              sel_money: '0'
            });
          }
        }
      });
    } else {
      // 3.价格
      if (money === "0") {
        money = 1;
      } else if (money) {
        money = 0;
      } else {
        money = 1;
      }
      wx.request({
        url: `${app.globalData.r_url}goods_get_custom`,
        data: {
          mstr: that.data.mstr,
          price: 1,
          sort_price: money
        },
        method: 'POST',
        success: function (data) {
          console.log(data);
          if (data.data.status) {
            let t = data.data.data.price;
            that.setData({
              shop_data: t,
              sel_size: '0',
              sel_time: '0',
              sel_money: money
            });
          }
        }
      });
    }
  }
  ,
  onLoad: function () {
    //同步读取缓存
    let that = this;
    let mstr = wx.getStorageSync('mstr');   //mstr
    that.setData({
      mstr: mstr,
      r_url: app.globalData.r_url
    });

    // 请求分类
    wx.request({
      url: `${app.globalData.r_url}goods_get_category`,
      data: {
        mstr: mstr
      },
      method: 'POST',
      success: function (data) {
        console.log(data);
        if (data.data.status) {
          let id = data.data.data.category[0].id;
          //请求分类下的商品
          wx.request({
            url: `${app.globalData.r_url}goods_get_list`,
            data: {
              mstr: that.data.mstr,
              category_id: id
            },
            method: 'POST',
            success: function (data) {
              console.log(data);
              if (data.data.status) {
                let t = data.data.data;
                console.log(t);
                that.setData({
                  shop_data: t
                });
              }
            }
          });
        }
      }
    });
  }

})
