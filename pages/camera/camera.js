const { generateBase64AlphaPhoto } = require("../../api/photo.js");
const { compress } = require("../../utils");
var app = getApp();

Page({
    data: {
        enableCamera: true,
        devicePosition: "back"
    },
    onLoad: function(e) {
      this.setData({
          data: app.globalData.spec
      })
    },
    unauth: function() {
      this.setData({
        enableCamera: false
      })
      wx.showModal({
        content: "请前打开摄像头权限",
        showCancel: false,
        confirmText: "去设置",
        success: (tipRes) => {
          if (tipRes.confirm) {
            wx.openSetting({
              success: (settingRes) => {
                if (settingRes.authSetting["scope.camera"]) {
                  this.setData({
                    enableCamera: true
                  })
                } else {
                  this.unauth()
                }
              },
            })
          }
        }
      })
    },
    changeDevicePhoto: function() {
        "back" == this.data.devicePosition ? this.setData({
            devicePosition: "front"
        }) : this.setData({
            devicePosition: "back"
        });
    },
    takePhoto: function() {
        wx.showLoading({
            title: "制作中.."
        })
        const {
          pix_height,
          pix_width
        } = this.data.data
        wx.createCameraContext().takePhoto({
            quality: "high",
            success: res => {
                var file = res.tempImagePath;
                compress(file, 2*1024*1024, 80, r=> {
                  generateBase64AlphaPhoto({
                    image_base64: wx.getFileSystemManager().readFileSync(file, "base64"),
                    width: pix_width,
                    height: pix_height
                  }).then(res => {
                    app.globalData.alphaImage = res.image_base64
                    wx.hideLoading()
                    wx.redirectTo({
                        url: "../preview/preview"
                    });
                  }).catch(err => {
                    wx.hideLoading()
                    console.log(err)
                    wx.showToast({
                      title: '[5000] 拍摄制作失败，请重试或联系客服处理！',
                      icon: 'none'
                    })
                  })
                })
            },
            fail: err => {
              wx.hideLoading()
              console.log(err)
              wx.showToast({
                title: '[4001] 拍摄异常，请联系客服处理！',
                icon: 'none'
              })
            }
        });
    },
    cancel: function() {
        wx.navigateBack({
            delta: 1
        });
    }
});