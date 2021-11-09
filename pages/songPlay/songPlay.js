// pages/songPlay/songPlay.js
Page({
  data: {
    active: false
  },
  toggle() {
    this.setData({
      active: !this.data.active
    })
  }
})