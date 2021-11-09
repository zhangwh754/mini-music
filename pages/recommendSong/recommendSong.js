// pages/recommendSong/recommendSong.js
Page({
  data: {
    date: {}
  },

  onLoad: function() {
    // 获取更新时间
    this.setData({
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1
      }
    })
  }
})