const { listUserPhoto, deleteUserPhoto } = require("../../api/user_photo");

var app = getApp();

Page({
    data: {
      next_id: 0,
      photos: [],
      moreIndex: -1
    },
    onLoad: function(t) {
    },
    onShow: function() {
      listUserPhoto({
        openid: app.globalData.openid
      }).then(res => {
        this.setData({
          photos: res,
        })
      })
    },
    onHide: function() {
    },
    onReachBottom: function() {
        this.loadMore();
    },
    loadMore: function() {
        listUserPhoto({
          openid: app.globalData.openid,
          next_id: this.data.photos[this.data.photos.length - 1].id
        }).then(res => {
          if (res.length > 0) {
            this.setData({
              photos: this.data.photos.concat(res)
            })
          }
        })
    },
    tapPage: function() {
    },
    more: function(t) {
        var index = t.currentTarget.dataset.index;
        this.setData({
            moreIndex: index,
            deletePosition: "bottom"
        });
    },
    gotoDetail: function(t) {
        var index = t.currentTarget.dataset.index;
        app.globalData.photo = this.data.photos[index]
        console.log(this.data.photos[index], index)
         wx.navigateTo({
            url: "../album-detail/album-detail"
        });
    },
    deletePhoto: function(event) {
      const { position, instance } = event.detail;
      if (position==="right") {
        var index = event.currentTarget.dataset.index
        deleteUserPhoto(this.data.photos[index].id).then(res => {
          this.data.photos.splice(index, 1)
          this.setData(
            {
              photos: this.data.photos
            }  
          )
          instance.close();
          wx.showToast({
            title: "照片已删除"
          })
        })
      }
    },
    gotoSpec: function(t) {
        wx.switchTab({
          url: '../index/index',
        })
    }
});