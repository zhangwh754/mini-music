// pages/video/video.js

import { request } from "../../api/request";

Page({
  data: {
    navItem: [],
    currentIndex: 0,
    videoList: [],
    curVideo: '',
    videoUpdateTime: [],
    refresher: false,  //保存是否下拉刷新,
    videoListOffset: [] //保存各列表分页信息
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
    this.getVideoList(this.data.navItem[e.currentTarget.dataset.id].id)
  },
  // 请求视频数据的方法
  getVideoList(id, offset=0) {
    const cookie = wx.getStorageSync('cookie')
    const { videoList } = this.data
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    request("video/group", {id, cookie, offset}).then(res => {
      res.datas.forEach(item => {
        request("video/url", {id: item.data.vid}).then(res => {
          // 请求到视频数据后关闭加载
          wx.hideLoading()
          videoList.push({
            url: res.urls[0].url,  //视频播放链接
            title: item.data.title, //视频标题
            avatarUrl: item.data.creator.avatarUrl,  //创建者头像
            nickname: item.data.creator.nickname,  //创建者昵称
            commentCount: item.data.commentCount,  //评论数量
            praisedCount: item.data.praisedCount,  //点赞数量
            praised: item.data.praised,  //该用户是否点赞了
            id: item.data.vid, //该视频id,
            coverUrl: item.data.coverUrl  //封面
          })
          this.setData({
            videoList,
            refresher: false
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
  // 控制视频不要同时播放的方法，同时也控制把video和image的显示切换
  handlePlay(e) {

    const id = e.currentTarget.id
    this.id !== id && this.videoContext && this.videoContext.stop()
    this.id = id
    this.setData({
      curVideo: id
    })
    this.videoContext = wx.createVideoContext(id)
    let { videoUpdateTime } = this.data
    const videoItem = videoUpdateTime.find(item => item.id === id)
    if(videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }
  },
  // 监听视频播放进度，存放到videoUpdateTime，播放完成后再清空
  bindTimeUpdate(e) {
    const playInfo = {id: e.currentTarget.id, currentTime: e.detail.currentTime}
    const { videoUpdateTime } = this.data
    // 如果videoUpdateTime中已经有一项存储了播放时间，就返回这一项更新
    const videoItem = videoUpdateTime.find(item => item.id === playInfo.id)
    if(videoItem) {
      videoItem.currentTime = e.detail.currentTime
    // 没有就推入新一项
    } else {
      videoUpdateTime.push(playInfo)
    }
    this.setData({
      videoUpdateTime
    })
  },
  // 视频播放完成
  bindEnded(e) {
    const { videoUpdateTime } = this.data
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.id === e.currentTarget.id), 1)
    this.setData({
      videoUpdateTime
    })
  },
  // 触发下拉刷新
  async startRefresher() {
    const { currentIndex, navItem } = this.data
    await this.getVideoList(navItem[currentIndex].id)
    this.setData({
      refresher: false
    })
  },
  // 滚动到底部
  async scrollToLower() {
    console.log('滚动到底部');
    const { currentIndex, navItem, videoListOffset } = this.data
    await this.getVideoList(navItem[currentIndex].id, videoListOffset[currentIndex].offset)
    videoListOffset[currentIndex].offset++
    this.setData({
      refresher: false
    })
  },

  onLoad: function() {
    // 立即显示加载中
    wx.showLoading({
      title: '加载中',
    })
    // 1、页面加载完后就请求导航数据（标签名字和对应id）
    request("video/group/list", {}).then(res => {
      let { videoListOffset } = this.data
      // 给每个存储分页信息的对象设置默认分页为1
      videoListOffset = res.data.slice(0, 8).map(item => (
        {
          id: item.id,
          offset: 1
        }
      ))
      this.setData({
        navItem: res.data.slice(0, 8),
        videoListOffset
      });

      // 请求视频数据
      this.getVideoList(res.data[0].id) //默认offset=0，即第一页
    });
  },
  onShareAppMessage({from}) {
    return {
      title: '转发的标题',
      path: '/pages/video/video',
      imageUrl: '/static/images/avatar.jpg'
    }
  }
})