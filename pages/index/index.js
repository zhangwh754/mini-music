// index.js
// 引用封装的request发送请求
import { request } from "../../api/request";

Page({
  data: {
    banners: [],
    recommendList: []
  },
  // 页面渲染后执行
  onLoad: function (options) {
    // 1、请求首页轮播图数据
    request("banner", {}).then(res => {
      this.setData({
        banners: res.banners,
      });
    });
    // 2、请求首页推荐数据
    request("personalized", {limit: 15}).then(res => {
      this.setData({
        recommendList: res.result,
      });
    });
  },
});
