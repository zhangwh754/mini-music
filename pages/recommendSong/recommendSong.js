// pages/recommendSong/recommendSong.js

import { request } from "../../api/request";

Page({
  data: {
    date: {},
    songList: []
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