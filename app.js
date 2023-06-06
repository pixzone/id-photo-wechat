const { login } = require("./api/login");

App({
    onLaunch: function() {
        this.userLogin()
        var e = wx.getSystemInfoSync()
        this.globalData.statusBarHeight = e.statusBarHeight
        this.globalData.windowWidth = e.windowWidth
        this.globalData.windowHeight = e.windowHeight
    },
    globalData: {
      openid: ""
    },
    userLogin: function() {
      wx.login({
        success: res => {
          login({code: res.code}).then(res => {
            this.globalData.openid = res.openid
            // wx.setStorage({
            //   key: constants.TOKEN,
            //   data: JSON.stringify(s.data.data)
            // })
          }).catch(err => {
            wx.showToast({
              title: '[002]登录失败，请重试',
              icon: 'none'
            })
          })
        },
        fail: err => {
          wx.showToast({
            title: '[001]登录失败，请重试',
            icon: 'none'
          })
        }
      })
    }
});