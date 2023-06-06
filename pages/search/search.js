const { listPhotoSize } = require("../../api/size_list")

var app = getApp()

// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input: "",
    hotSearchArr: ["一寸", "二寸", "公务员国考"],
    showSearchResults: false,
    searchResults: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  onSearch: function(e) {
    this.loadData(e.detail)
  },
  loadData: function(input) {
    var c = input.trim();
    if (c) {
      listPhotoSize({
        name__icontains: c
      }).then(data => {
        this.setData({
          searchResults: data,
          showSearchResults: true
        })
      })
    } else {
      this.setData({
        searchResults: [],
        showSearchResults: false
      })
    }
  },
  gotoSpecDetail: function(a) {
    app.globalData.spec = a.currentTarget.dataset.spec
    wx.navigateTo({
        url: "../spec-detail/spec-detail"
    })
  },
  clickHotSearchItem: function(e) {
    var i  = e.currentTarget.dataset.text
    this.setData({
      input: i,
    })
    this.loadData(i)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})