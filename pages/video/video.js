// pages/video/video.js

import { request } from "../../api/request";

Page({
  data: {
    navItem: [],
    currentIndex: 0,
    videoList: []
  },
  handleSwitch(e) {
    // 点击后显示加载中
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.setData({
      // 获取的自定义属性id是字符串，先转换为Number类型
      currentIndex: Number(e.currentTarget.dataset.id)
    })
    console.log(this.data.navItem[e.currentTarget.dataset.id]);
    this.getVideoList(this.data.navItem[e.currentTarget.dataset.id].id)
  },
  // 请求视频数据的方法
  getVideoList(id) {
    const cookie = wx.getStorageSync('cookie')
    const videoArr = []
    request("video/group", {id, cookie}).then(res => {
      res.datas.forEach(item => {
        request("video/url", {id: item.data.vid}).then(res => {
          // 请求到视频数据后关闭加载
          wx.hideLoading()
          videoArr.push({
            url: res.urls[0].url,  //视频播放链接
            title: item.data.title, //视频标题
            avatarUrl: item.data.creator.avatarUrl,  //创建者头像
            nickname: item.data.creator.nickname,  //创建者昵称
            commentCount: item.data.commentCount,  //评论数量
            praisedCount: item.data.praisedCount,  //点赞数量
            praised: item.data.praised,  //该用户是否点赞了
            id: item.data.vid //该视频id
          })
          this.setData({
            videoList: videoArr
          });
        })
      })
    });
  },
  showNot() {
    wx.showToast({
      title: '未完成',
      icon: 'error',
      duration: 2000
    })
  },
  // 控制视频不要同时播放的方法
  handlePlay(e) {
    const id = e.currentTarget.id
    console.log(this.videoContext);
    this.id !== id && this.videoContext && this.videoContext.stop()
    this.id = id
    this.videoContext = wx.createVideoContext(id)
  },

  onLoad: function() {
    // 立即显示加载中
    wx.showLoading({
      title: '加载中',
    })
    // 1、页面加载完后就请求导航数据（标签名字和对应id）
    request("video/group/list", {}).then(res => {
      this.setData({
        navItem: res.data.slice(0, 8)
      });
      this.getVideoList(res.data[0].id)
    });
  }
})