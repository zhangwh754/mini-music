// pages/songPlay/songPlay.js

import { request } from "../../api/request";

// 获取全局实例
const app = getApp()

Page({
  data: {
    active: false,
    songInfo: {}
  },
  handlePlayState() {
    if(!this.data.active) {
      this.backgroundAudioManager.src = this.data.songInfo.url
      this.backgroundAudioManager.title = this.data.songInfo.title
    } else {
      this.backgroundAudioManager.pause()
    }
  },
  changePlayState(state) {
    this.setData({
      active: state
    })
    // 修改全局状态
    app.globalData.isPlay = state
  },

  // 解构传参
  onLoad() {
    //创建音频
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('sendSongInfo', data => {
      const {song: {id, title, author, imgUrl}} = data
      // 请求播放地址数据
      const cookie = wx.getStorageSync('cookie')
      request('song/url', {id, cookie}).then(res => {
        console.log(res);
        this.setData({
          songInfo: {id, title, author, imgUrl, url: res.data[0].url}
        })
        
        // 如果全局认为在播放，且播放的id和当前id相同
        if(app.globalData.isPlay && id === app.globalData.musicId) {
          // 修改当前页面状态为true
          this.setData({
            active: true
          })
        }

        // 分别监听音频的四个事件
        this.backgroundAudioManager.onPause(() => {
          console.log('暂停');
          this.changePlayState(false)
        })
        this.backgroundAudioManager.onPlay(() => {
          console.log('继续/开始');
          this.changePlayState(true)
          // 修改全局id
          app.globalData.musicId = id
        })
        this.backgroundAudioManager.onStop(() => {
          console.log('终止');
          this.changePlayState(false)
        })
        this.backgroundAudioManager.onEnded(() => {
          console.log('放完了');
          this.changePlayState(false)
        })
      })
    })
  }
})