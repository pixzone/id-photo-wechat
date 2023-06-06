var app = getApp();

Page({
    data: {},
    onLoad: function(o) {
        this.setData({
            image: decodeURIComponent(o.image),
            size: o.size,
            width: app.globalData.spec.width,
            height: app.globalData.spec.height,
            pix_width: app.globalData.spec.pix_width,
            pix_height: app.globalData.spec.pix_height
        })
    },
    saveImage: function() {
      wx.downloadFile({
        url: this.data.image,
        fail: e => {
          wx.showToast({
            title: "[5004] 保存失败",
            icon: "none"
          })
        },
        success: result => {
          const {
            tempFilePath,
          } = result
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: function(e) {
              wx.showToast({
                title: "保存成功，可前往【手机相册】中查看",
                icon: "none",
                duration: 2000
              });
            },
            fail: function(e) {
              console.log(e)
                "saveImageToPhotosAlbum:fail cancel" != e.errMsg ? wx.showModal({
                  content: "请打开相册权限",
                  confirmText: "去设置",
                  success: function(e) {
                      e.confirm && wx.openSetting();
                  }
                }) : wx.showToast({
                    title: "[4003] 保存失败",
                    icon: "none"
                });
            }
          });
        }
      })
    },
    onShareAppMessage: function() {
        return {
            path: "/pages/index/index",
            title: "快图证件照"
        };
    }
});