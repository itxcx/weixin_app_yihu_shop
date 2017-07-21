var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mstr: false,
    data_list: [],
    r_url: app.globalData.r_url
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this;
    let mstr = wx.getStorageSync('mstr');   //mstr
    wx.request({
      url: `${app.globalData.r_url}yihushop_goods_browse`,
      data: {
        mstr: mstr
      },
      method: 'POST',
      success: function (data) {
        console.log(data);
        if (data.data.status) {
          that.setData({
            data_list: data.data.data,
            mstr: mstr
          });
        }
      }
    });
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