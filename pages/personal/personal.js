// pages/personal/personal.js
let startY = 0  //手指起始坐标
let moveY = 0 //手指当前坐标
let moveDistance = 0  //手指移动距离

import { request } from "../../api/request";

Page({
  data: {
    coverTransform: 'translateY(0)',
    coverTranstion: '',
    // 保存用户信息
    userInfo: {},
    recentPlayList: []
  },
  handleTouchStart(e) {
    startY = e.touches[0].clientY
  },
  handleTouchMove(e) {
    moveY = e.touches[0].clientY
    moveDistance = moveY - startY
    if(moveDistance >= 80) {
      moveDistance = 80
    }
    if(moveDistance < 0) {
      return
    }
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`,
      coverTranstion: ''
    })
  },
  handleTouchEnd() {
    this.setData({
      coverTransform: 'translateY(0)',
      coverTranstion: 'transform .5s linear'
    })
  },
  switchLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  // 获取最近历史记录
  getRecentPlayList(uid) {
    // type=1获取最近一周的播放
    request("user/record", {uid, type: 1}).then(res => {
      this.setData({
        // 只截取最近10条播放记录
        recentPlayList: res.weekData.slice(0, 10)
      });
    });
  },

  // 生命周期
  onShow: function(options) {
    // 如果本地没有存储userInfo
    if(!wx.getStorageSync('userInfo')) { return }
    const userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    this.setData({
      userInfo: userInfo
    })
    // 发送获取到的用户id
    this.getRecentPlayList(userInfo.userId)
  }
})