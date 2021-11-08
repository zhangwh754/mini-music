// pages/video/video.js

import { request } from "../../api/request";

Page({
  data: {
    navTitle: [],
    currentIndex: 0
  },
  handleSwitch(e) {
    this.setData({
      // 获取的自定义属性id是字符串，先转换为Number类型
      currentIndex: Number(e.currentTarget.dataset.id)
    })
  },
  onLoad: function() {
    request("video/group/list", {}).then(res => {
      this.setData({
        navTitle: res.data.slice(0, 8)
      });
    });
  }
})