// index.js
// 引用封装的request发送请求
import { request } from "../../api/request";

Page({
  data: {
    banners: []
  },
  // 页面渲染后执行
  onLoad: function (options) {
    // 1、请求首页轮播图数据
    request("banner", {}).then(res => {
      console.log(res);
      this.setData({
        banners: res.banners,
      });
    });
  },
});
