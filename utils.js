export const compress = (path, targetSize, quality, successCallback) => {
  if (quality< 50) {
    wx.showToast({
      title: "[4005] 图片大大，请选择其他图片",
      icon: "none"
    })
    return
  }
  wx.getFileSystemManager().getFileInfo({
    filePath: path,
    success: file => {
      if (file.size < targetSize) {
        successCallback(path)
        return
      } else {
        wx.compressImage({
          src: path,
          quality: quality,
          success: result => {
            wx.getFileSystemManager().getFileInfo({
              filePath: result.tempFilePath,
              success: f => {
                console.log("compressed: ", f.size)
                if (f.size < targetSize) {
                  successCallback(result.tempFilePath)
                  return
                } else {
                  this.compress(path, quality-10, successCallback)
                }
              }
            })
          }
        })
      }
    }
  })
}

export const saveImageToPhotosAlbum = (file) => {
  wx.saveImageToPhotosAlbum({
    filePath: file,
    success: function(e) {
      wx.showToast({
        title: "保存成功，可前往【手机相册】中查看",
        icon: "none",
        duration: 2000
      });
    },
    fail: function(e) {
        "saveImageToPhotosAlbum:fail cancel" != e.errMsg ? wx.showModal({
          content: "请打开相册权限",
          confirmText: "去设置",
          success: function(e) {
              e.confirm && wx.openSetting()
          }
        }) : wx.showToast({
            title: "[4003] 保存失败",
            icon: "none"
        });
    }
  });
}

export const downloadImageToPhotosAlbum = (url) => {
  wx.downloadFile({
    url: url,
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
      saveImageToPhotosAlbum(tempFilePath)
    }
  })
}