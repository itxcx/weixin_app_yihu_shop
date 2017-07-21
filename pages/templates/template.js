//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
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
    sel_photo: 5,
  },
  tap: function (e) {
    this.setData({
      x: 30,
      y: 30
    });
  },
  onLoad: function () {

  }
})
