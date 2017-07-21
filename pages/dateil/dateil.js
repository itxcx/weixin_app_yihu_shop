// pages/dateil/dateil.js
var WxParse = require('../wxParse/wxParse.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mstr: 0,       //mstr
    spid: 0,       //商品id
    content: '',   //富文本详情
    shop_data: 0,  //商品数据
    r_url: 0,      //url 请求
    author: 0,      // 作者信息
    discuss_data: null,      // 评论信息
    proto_sel: -1,       //选择属性
    money: 0,           //价格
    price: 0            //加价幅度
  },
  goto_shop_car: function () {
    let phone = app.globalData.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    });
  },
  // 加入购物车
  add_shop_car: function () {
    let that = this;
    let spid = that.data.shop_data.id; //id
    // let p_i = that.data.protos.proto_main;  //属性
    let j = [];
    let p = null;
    let z = null;
    let proto_id = 0;
    let param = that.data.param;
    if (param.length) {   //如果有属性
      if (that.data.proto_sel >= 0) {     //如果有属性，就必须要选择，如果没选择
        proto_id = param[that.data.proto_sel].id;
      } else {
        wx.showToast({
          title: '请选择属性',
          icon: 'loading',
          mask: true,
          duration: 800
        });
        return false;
      }
    }
    // 请求
    wx.request({
      url: `${app.globalData.r_url}cart_add`,
      data: {
        mstr: that.data.mstr,
        goods_id: spid,
        param: proto_id,
        numbs: 1,
        is_add: true
      },
      method: 'POST',
      success: function (data) {
        if (data.data.status) {
          // 模态框
          wx.showToast({
            title: data.data.data || '加入成功',
            icon: 'success',
            duration: 2000,
            mask: true
          });
        } else {
          // 模态框
          wx.showToast({
            title: data.data.data || '加入失败',
            icon: 'success',
            duration: 2000,
            mask: true
          });
        }
      }
    });
  },

  // 查看作者
  goro_author: function () {
    let that = this;
    let id = that.data.author.pid;
    let data = that.data.author;
    data = JSON.stringify(data);
    wx.navigateTo({
      url: `../intro/intro?data=${data}`,
    });
  },
  // 收藏和取消收藏
  add_collect: function (e) {
    // 添加到收藏 
    let that = this;
    let collect = that.data.is_colllect;  //是否收藏
    let spid = that.data.shop_data.id;          //id
    let collect_id = that.data.collect_id;  //  收藏id
    if (!collect) {
      // 如果为假，添加到收藏
      wx.request({
        url: `${app.globalData.r_url}goods_add_collect`,
        data: {
          mstr: that.data.mstr,
          goods_id: spid
        },
        method: 'POST',
        success: function (data) {
          if (data.data.status) {
            // 模态框
            wx.showToast({
              title: '已收藏',
              icon: 'success',
              duration: 2000,
              mask: true
            });
            that.setData({
              is_colllect: 1,
              collect_id: data.data.data.collect_id
            });
          } else {
            // 模态框
            wx.showToast({
              title: '收藏失败',
              icon: 'loading',
              duration: 2000,
              mask: true
            });
          }
        }
      });
    } else {
      // 取消收藏
      wx.request({
        url: `${app.globalData.r_url}goods_del_collect`,
        data: {
          mstr: that.data.mstr,
          comment_id: collect_id
        },
        method: 'POST',
        success: function (data) {
          if (data.data.status) {
            // 模态框
            wx.showToast({
              title: '已经取消收藏',
              icon: 'success',
              duration: 2000,
              mask: true
            });
            that.setData({
              is_colllect: 0
            });
          } else {
            // 模态框
            wx.showToast({
              title: '取消失败',
              icon: 'loading',
              duration: 2000,
              mask: true
            });
          }
        }
      });
    }
  },

  // 大图预览
  lock_banner: function () {
    let banner = this.data.shop_data.imgs;
    let banner_2 = [];

    for (let x of banner) {
      banner_2.push(this.data.r_url + x);
    }
    wx.previewImage({
      urls: banner_2 // 需要预览的图片http链接列表
    });
  },
  // 评论
  goto_discuess: function () {
    let id = this.data.shop_data.id;
    wx.navigateTo({
      url: `../discuss/discuss?id=${id}`,
    });
  },

  // now_buy
  now_buy: function () {
    let that = this;
    let spid = that.data.shop_data.id; //id
    let j = [];
    let p = null;
    let z = null;
    let proto_id = 0;
    let param = that.data.param;
    if (param.length) {   //如果有属性
      if (that.data.proto_sel >= 0) {     //如果有属性，就必须要选择，如果没选择
        proto_id = param[that.data.proto_sel].id;
      } else {
        wx.showToast({
          title: '请选择属性',
          icon: 'loading',
          mask: true,
          duration: 800
        });
        return false;
      }
    }
    // 请求
    wx.request({
      url: `${app.globalData.r_url}cart_add`,
      data: {
        mstr: that.data.mstr,
        goods_id: spid,
        param: proto_id,
        numbs: 1,
        is_add: true
      },
      method: 'POST',
      success: function (data) {
        if (data.data.status) {
          // 模态框
          wx.redirectTo({
            url: '../shop_car/shop_car'
          });
        } else {
          // 模态框
          wx.showToast({
            title: '发起购买失败',
            icon: 'success',
            duration: 2000,
            mask: true
          });
        }
      }
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (o) {
    let id = o.id;
    let that = this;
    let mstr = wx.getStorageSync('mstr');   //mstr
    that.setData({
      mstr: mstr,
      r_url: app.globalData.r_url,
    });
    /*
      1.请求商品
      2.请求作者
      3.请求评论
    */
    wx.request({
      // url: `${app.globalData.r_url}goods_get_this`, goods/getGoods
      url: `${app.globalData.r_url}api/goods/getGoods`,
      data: {
        mstr: that.data.mstr,
        goods_id: id,
        show_attr: 1,
        show_collect: 1
      },
      method: 'POST',
      success: function (data) {
        if (data.data.status) {
          let is_colllect = data.data.data.is_collect; //是否收藏
          let collect_id = data.data.data.collect_id;
          let t = data.data.data.goods;  //商品详情
          let param = data.data.data.goods_attr;  //商品属性

          let proto = [];  //属性空数组
          for (let x of param) {
            for (let i of x.children) {
              let proto_temp = {
                name: i.name,
                price: i.price,
                id: i.id
              };
              proto.push(proto_temp);
            }
          }

          t.imgs = JSON.parse(t.imgs); //json话 banner图 
          that.setData({
            shop_data: t,
            money: t.price,  //价格
            param: proto,    //属性
            collect_id: collect_id,
            is_colllect: is_colllect  // 收藏
          });
          // 详情
          let content = t.content;
          if (content) {
            let url = app.globalData.r_url;
            // let str1 = 'ueditor/php/upload/image';
            // content = content.replace(/ueditor/php / upload / image / g, url + "ueditor/php/upload/image");
            content = content.replace(new RegExp(/(\/ueditor\/php\/upload\/image)/g), url + "ueditor/php/upload/image");
            WxParse.wxParse('article', 'html', content, that, 5);
          }
        } else {
          //等待弹窗
          wx.showLoading({
            title: '错误',
            icon: 'loading',
            mask: true,
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 800);
        }
        // 作者
        wx.request({
          url: `${app.globalData.r_url}singer`,
          data: {
            mstr: that.data.mstr,
            pid: that.data.shop_data.other_id
          },
          method: 'POST',
          success: (res) => {
            if (res.data.status) {
              that.setData({
                author: res.data.data[0]
              });
            }
          }
        });
      }
    });

    // 评论
    wx.request({
      url: `${app.globalData.r_url}yihushop_comment_category`,
      data: {
        mstr: that.data.mstr,
        goods_id: id
      },
      method: 'POST',
      success: (res) => {
        if (res.data.status) {
          that.setData({
            discuss_data: res.data.data
          });
        }
      }
    });

  },

  // 选择属性
  sel_proto: function (e) {
    let that = this;
    let t = that.data.param;         //属性
    let i = e.currentTarget.dataset.index;     //选择属性索引

    let now_i = that.data.proto_sel;            // 原来的属性
    let money = 0;                             //价格
    money = that.data.money - that.data.price; //总价-加价 = 原价
    let price = 0;
    if (i == now_i) {                           //如果这个属性已经被激活
      price = 0;                                //加价== 0;
      i = -1;                                   //索引 = -1
    } else {
      price = parseFloat(t[i].price);            //加价
    }
    money = money + price;     //总价

    that.setData({
      money: money,
      price: price,
      proto_sel: i
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }
})