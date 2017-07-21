var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mstr: 0,
    spid: 0,
    discuss_data: {}         //评论
  },
  // 添加评论条目
  add_discuess: function (e) {
    let that = this;
    let i = e.currentTarget.dataset.index;
    let discuss_id = that.data.discuss_data[i].id;  //评论id 
    let goods_id = that.data.discuss_data[i].goods_id;
    let userInfo = app.globalData.userInfo;
    let head = userInfo.avatarUrl;
    let username = userInfo.nickName;
    console.log(head);
    wx.request({
      url: `${app.globalData.r_url}yihushop_addComment`,
      data: {
        mstr: that.data.mstr,
        comment_category_id: discuss_id,
        avatarurl: head,
        goods_id: goods_id,
        title: '',
        content: '',
        username: username
      },
      method: 'POST',
      success: function (data) {
        console.log(data);
        if (data.data.status) {
          //得到上个页面的数据
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面
          console.log(prevPage.data);

          let perv_data = prevPage.data; //上个页面的date数据

          let discuss_data = perv_data.discuss_data;
          if (discuss_data) {
            discuss_data[i].numbs = parseInt(perv_data.discuss_data[i].numbs) + 1;

            prevPage.setData({
              discuss_data: discuss_data
            })
          }
          wx.showToast({
            title: '评论成功',
            mask: true,
            duration: 800,
            success: () => {
              // return false;
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
                });
              }, 1000);
            }
          });
        } else {
          wx.showToast({
            title: data.data.info,
            mask: true,
            icon: 'loading',
            duration: 800,
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (o) {
    // 读取mstr
    let that = this;
    let id = o.id;//得到传过来的参数
    let mstr = wx.getStorageSync('mstr');   //mstr
    that.setData({
      mstr: mstr,
      spid: id
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
        } else {
          wx.showToast({
            title: '暂无商品评论',
            mask: true,
            duration: 800,
            muccess: function () {
              wx.navigateBack({
                delta: 1,
              });
            }
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