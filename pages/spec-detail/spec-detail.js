const { generateBase64AlphaPhoto } = require("../../api/photo.js");
const { compress } = require("../../utils")
var app = getApp()

Page({
    data: {},
    onLoad: function(e) {
        this.setData({
            data: app.globalData.spec
        });
    },
    takeAPhoto: function() {
        wx.navigateTo({
            url: "../camera/camera"
        });
    },
    pickAPhoto: function() {
      console.log("1")
        wx.chooseMedia({
            count: 1,
            mediaType: 'image',
            sourceType: [ "album" ],
            success: result => {
                wx.showLoading({
                    title: "图片检测中"
                });
                const {
                  pix_height,
                  pix_width
                } = this.data.data
                var file = result.tempFiles[0];
                compress(file.tempFilePath, 1024*1024, 80, path=> {
                  generateBase64AlphaPhoto({
                    image_base64: wx.getFileSystemManager().readFileSync(path, "base64"),
                    width: pix_width,
                    height: pix_height
                  }).then(res => {
                    app.globalData.alphaImage = res.image_base64
                    wx.hideLoading()
                    wx.redirectTo({
                        url: "../preview/preview"
                    });
                  })
                })      
            }
        })
    }
});