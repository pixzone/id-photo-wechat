const { addUserPhotoWithBase64Alpha } = require("../../api/user_photo.js");
import settings from "../../settings"
import Dialog from '@vant/weapp/dialog/dialog'
var app = getApp();
let videoAd = null
let adEnable = false

Page({
    data: {
        edit: "",
        statusBarHeight: app.globalData.statusBarHeight,
        whitening: 0,
        buffing: 0,
        skipAd: settings.skipAd,
    },
    onLoad: function(t) {
        this.setData({
            img: "data:image/png;base64," + app.globalData.alphaImage,
            openid: app.globalData.openid,
            name: app.globalData.spec.name,
            pix_width: app.globalData.spec.pix_width,
            pix_height: app.globalData.spec.pix_height,
            width: app.globalData.spec.width,
            height: app.globalData.spec.height,
            colors: app.globalData.spec.bg_colors,
            color: app.globalData.spec.bg_colors[0]
        })
        if (wx.createRewardedVideoAd) {
          videoAd = wx.createRewardedVideoAd({
            adUnitId: 'adunit-e4c915532522e3cd'
          })
          videoAd.onLoad(() => {console.log('onLoad event emit')})
          videoAd.onError((err) => {this.gen()})
          videoAd.onClose((res) => {
            if (res && res.isEnded) {
              this.gen()
            } else {
              console.log('user stop unfinsh')
            }
          })
          adEnable = true
        }
    },
    changeColor: function(t) {
        this.setData({
            color: t.currentTarget.dataset.color
        });
    },
    hexToRgb(color) {
      var hex = "#ffffff"
      if (color === "white") {
        hex = "#ffffff"
      } else if (color === "lightblue") {
        hex = "#8ec5e9"
      } else if (color === "blue") {
        hex = "#1a8ae4"
      } else if (color === "red") {
        hex = "#c40c20"
      } else if (color === "gray") {
        hex = "#818892"
      } else {
        wx.showToast({
          title: "[4002] 程序异常，请联系客服处理！",
          icon: "none",
          duration: 2000
        });
      }
      return {
        r: parseInt('0x' + hex.slice(1, 3)),
        g: parseInt('0x' + hex.slice(3, 5)),
        b: parseInt('0x' + hex.slice(5, 7)),
      }
    },
    save: function() {
      if (adEnable && !this.data.skipAd) {
        Dialog.confirm({
          message: '完整观看视频可免费下载',
        }).then(() => {
          videoAd.show().catch(() => {
            videoAd.load()
              .then(() => videoAd.show())
              .catch(err => {
                console.log('激励视频 广告显示失败')
              })
          })
        })
      } else {
        this.gen()
      }
    },
    gen() {
      wx.showLoading({
        title: "制作中...",
        mask: true
      });
      const {
        r,
        g,
        b
      } = this.hexToRgb(this.data.color)
      addUserPhotoWithBase64Alpha({
        image_base64: app.globalData.alphaImage, 
        r: r, 
        g: g, 
        b: b,
        openid: this.data.openid,
        name: this.data.name,
        width: this.data.width,
        height: this.data.height,
        pix_width: this.data.pix_width,
        pix_height: this.data.pix_height,
      }).then(result => {
        wx.hideLoading()
        wx.navigateTo({
          url: "../save-image/save-image?image=" + result.url + "&size=" + result.size
        });
      }).catch(e => {
        wx.hideLoading()
        console.log(e)
        wx.showToast({
          title: "[5002] 选择图片制作失败，请尝试或客服处理！",
          icon: "none",
          duration: 2000
        });
      })
    }
});