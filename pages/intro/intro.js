// pages/intro/intro.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    r_url: '',
    author: {},        //作者信息
    mstr: 0,           //mstr
    author_data: {},   //作者作品
    years: [],          // 年份
    is_show: false,  //展开全部
    sel_year: 0          //被选择的年份
  },

  // 选择年份
  sel_year: function (e) {
    let that = this;
    let i = parseInt(e.currentTarget.dataset.index);
    /*
      0  可售
      !0 年份
    */
    if (i == 0) {
      wx.request({
        url: `${app.globalData.r_url}yihushop_author_works`,
        data: {
          mstr: that.data.mstr,
          pid: that.data.author.pid,
        },
        method: 'POST',
        success: function (data) {
          console.log(data);
          if (data.data.status) {
            that.setData({
              author_data: data.data.data,
              sel_year: i
            });
          }
        }
      });
    } else {
      let yaer = that.data.years[i];
      //按照年份获得年份商品
      wx.request({
        url: `${app.globalData.r_url}yihushop_year_work`,
        data: {
          mstr: that.data.mstr,
          pid: that.data.author.pid,
          custom_time: yaer
        },
        method: 'POST',
        success: function (data) {
          console.log(data);
          if (data.data.status) {
            that.data.author_data.works = data.data.data;
            that.data.sel_year = i;
            that.setData(that.data);
          }
        }
      });
    }
  },

  // 商品详情
  datail: function (e) {
    let that = this;
    let i = parseInt(e.currentTarget.dataset.index);
    console.log(that.data.author_data);

    let numbers = that.data.author_data.works[i].numbers;
    if (numbers > 0) {
      let id = that.data.author_data.works[i].id;
      wx.navigateTo({
        url: `../dateil/dateil?id=${id}`
      });
    }
  },
  onLoad: function (o) {
    let that = this;
    let index = o.index;   //作者索引
    let r_url = app.globalData.r_url;
    //得到上个页面的数据
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];   //当前页面
    let prevPage = pages[pages.length - 2];  //上一个页面

    let data = prevPage.data.words[index];
    if (!data) {
      wx.showLoading({
        title: '错误',
      });
      setTimeout(function () {
        wx.navigateBack({
          delta: 1,
        });
      }, 800);
    }


    console.log(data);
    let mstr = wx.getStorageSync('mstr');   //mstr    
    that.setData({
      author: data,
      mstr: mstr,
      r_url: r_url
    });
    /*
      1.请求作者作品
      2.请求作者年份
    */
    wx.request({
      url: `${app.globalData.r_url}yihushop_author_works`,
      data: {
        mstr: mstr,
        pid: data.pid
      },
      method: 'POST',
      success: function (data) {
        console.log(data);
        if (data.data.status) {
          that.setData({
            author_data: data.data.data
          });
        }
      }
    });
    // 年份
    wx.request({
      url: `${app.globalData.r_url}yihushop_work_year`,
      data: {
        mstr: mstr,
        pid: data.pid
      },
      method: 'POST',
      success: function (data) {
        console.log(data);
        if (data.data.status) {
          let years = [];
          years.push("可售");
          for (let x of data.data.data) {
            if (x.custom_time) {
              years.push(x.custom_time);
            }
          }
          that.setData({
            years: years
          });
        }
      }
    });

  },
  // 全部展开
  is_show_all: function () {
    this.setData({
      is_show: !this.data.is_show
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})