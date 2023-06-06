const { compress, downloadImageToPhotosAlbum } = require("../../utils");
const { generateBase64AlphaPhoto } = require("../../api/photo");
const { addUserPhotoWithBase64Alpha } = require("../../api/user_photo");
import settings from "../../settings"
import Dialog from '@vant/weapp/dialog/dialog'
var app = getApp();
var videoAd = null
var adEnable = false
var colors = {
    white: [ "#FFFFFF", "#FFFFFF" ],
    lightblue: [ "#8EC5E9", "#AFD7F0" ],
    blue: [ "#1A8AE4", "#4EA4ED" ],
    red: [ "#C40C20", "#D5284A" ],
    gray: [ "#818892", "#A7AFB7" ]
};

Page({
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        imageBase64: "",
        src: "",
        color: "",
        colors: [ "white", "lightblue", "blue", "red", "gray" ],
        skipAd: settings.skipAd,
    },
    onLoad: function(t) {
      if (wx.createRewardedVideoAd) {
        videoAd = wx.createRewardedVideoAd({
          adUnitId: 'adunit-2491d0b848d77cc5'
        })
        videoAd.onLoad(() => {console.log('onLoad event emit')})
        videoAd.onError((err) => {this.internalSavePhoto()})
        videoAd.onClose((res) => {
          if (res && res.isEnded) {
            this.internalSavePhoto()
          } else {
            console.log('user stop unfinsh')
          }
        })
        adEnable = true
      }
    },
    pickPhoto: function(t) {
      wx.chooseMedia({
        count: 1,
        mediaType: 'image',
        sourceType: [ "album" ],
        success: result => {
          compress(result.tempFiles[0].tempFilePath, 1024*1024, 80, file => {
            wx.showLoading({
                title: "图片处理中.."
            })
            wx.getImageInfo({
                src: file,
                success: result => {
                  this.setData({
                    pix_width: result.width,
                    pix_height: result.height 
                  })
                  generateBase64AlphaPhoto({
                    image_base64: wx.getFileSystemManager().readFileSync(file, "base64"),
                    enable_cut: false,
                  }).then(res => {
                    this.setData({
                      imageBase64: res.image_base64,
                      src: "data:image/png;base64," + res.image_base64,
                      color: this.data.color ? this.data.color : "white"
                    })
                    wx.hideLoading()
                  })
              },
              fail: err => {
                  console.log(err);
              }
            })
          })
        }
      })
    },
    changeColor: function(t) {
        this.data.src ? this.setData({
            color: t.currentTarget.dataset.color
        }) : wx.showToast({
            title: "请先选择照片",
            icon: "none"
        })
    },
    hexToRgb(color) {
      var hex = colors[color][0]
      return {
        r: parseInt('0x' + hex.slice(1, 3)),
        g: parseInt('0x' + hex.slice(3, 5)),
        b: parseInt('0x' + hex.slice(5, 7)),
      }
    },
    internalSavePhoto: function() {
      wx.showLoading({
        title: "图片处理中...",
        mask: true
      });
      const {
        r,
        g,
        b
      } = this.hexToRgb(this.data.color)
      addUserPhotoWithBase64Alpha({
        image_base64: this.data.imageBase64, 
        r: r, 
        g: g, 
        b: b,
        openid: app.globalData.openid,
        name: "换底色",
        width: 0,
        height: 0,
        pix_width: this.data.pix_width,
        pix_height: this.data.pix_height,
      }).then(result => {
        wx.hideLoading()
        const {url} = result
        downloadImageToPhotosAlbum(url)
      }).catch(e => {
        wx.hideLoading()
        console.log(e)
        wx.showToast({
          title: "[5003] 换底色异常，请重试或联系客服处理！",
          icon: "none",
          duration: 2000
        });
      })
    },
    savePhoto: function() {
      if (!this.data.src) {
        wx.showToast({
          title: "请先选择照片",
          icon: "none"
        })
        return
      }
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
        this.internalSavePhoto()
      }
      
    },
    closeReupload: function() {
        this.setData({
            showReupload: false
        });
    }
});