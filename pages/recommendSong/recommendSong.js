// pages/recommendSong/recommendSong.js

import { request } from "../../api/request";

Page({
  data: {
    date: {},
    songList: []
  },
  // 跳转到songplay页面，并传参
  toSongPlay(e) {
    const song = {
      title: e.currentTarget.dataset.song.name,
      id: e.currentTarget.dataset.song.al.id,
      author: e.currentTarget.dataset.song.ar[0].name,
      imgUrl: e.currentTarget.dataset.song.al.picUrl
    }
    wx.navigateTo({
      url: '/pages/songPlay/songPlay',
      // id=${song.id}&title=${song.title}&author=${song.author}&imgUrl=${song.imgUrl}
      success(res) {
        res.eventChannel.emit('sendSongInfo', { song })
      }
    })
  },

  onLoad: function() {
    // 获取更新时间
    this.setData({
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1
      }
    })
    // 获取cookie
    const cookie = wx.getStorageSync('cookie')
    // cookie不存在，跳转到login页面
    if(!cookie) {
      wx.showToast({
        title: '请先登陆',
        icon: 'error',
        duration: 2000,
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    }
    // 请求每日推荐歌曲
    request('recommend/songs', {cookie}).then(res => {
      this.setData({
        songList: res.data.dailySongs
      })
    })
  }
})