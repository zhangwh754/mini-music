// index.js
// 引用封装的request发送请求
import { request } from "../../api/request";

Page({
  data: {
    banners: [],
    recommendList: [],
    // 需要去请求的排行榜的id
    idList: [19723756, 3779629, 2884035, 3778678, 1978921795],
    topList: []
  },
  // 页面渲染后执行
  onLoad: function (options) {
    const that = this
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
    // 3、请求排行榜数据，根据每个id去分别请求一次
    const resultArr = []
    that.data.idList.forEach(id => {
      request("playlist/detail", {id}).then(res => {
        const topListItem = {
          id: res.playlist.id,
          title: res.playlist.name,
          songsList: res.playlist.tracks.slice(0, 3)
        }
        resultArr.push(topListItem)
        this.setData({
          topList: resultArr
        });
      });
    })
  },
});
