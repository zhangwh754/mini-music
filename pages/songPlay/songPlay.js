// pages/songPlay/songPlay.js
Page({
  data: {
    active: false,
    songInfo: {}
  },
  handlePlayState() {
    this.setData({
      active: !this.data.active
    })
  },

  // 解构传参
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('sendSongInfo', data => {
      const {song: {id, title, author, imgUrl}} = data
      this.setData({
        songInfo: {id, title, author, imgUrl}
      })
    })

  }
})