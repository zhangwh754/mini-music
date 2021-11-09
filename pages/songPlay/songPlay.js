// pages/songPlay/songPlay.js
Page({
  data: {
    active: false
  },
  handlePlayState() {
    this.setData({
      active: !this.data.active
    })
  }
})