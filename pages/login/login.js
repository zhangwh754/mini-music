// pages/login/login.js
import { request } from "../../api/request";
Page({
  data: {
    phone: '13501838597',
    password: 'f91f91'
  },
  login() {
    let { phone, password } = this.data
    // 1、前端验证
    if(!phone) {
      wx.showToast({
        title: '手机号不能为空！',
        icon: 'error',
        duration: 2000
      })
      return
    }
    const phoneReg = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/
    if(!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误！',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if(!password) {
      wx.showToast({
        title: '密码不能为空！',
        icon: 'error',
        duration: 2000
      })
      return
    }
    // 发送到后端登录
    request("login/cellphone", {phone, password}, 'POST').then(res => {
      console.log(res);
      if(res.code !== 200) {
        wx.showToast({
          title: res.message,
          icon: 'error',
          duration: 2000
        })
        return
      } else {
        // 保存cookie
        wx.setStorageSync('cookie', res.cookie)
        wx.showToast({
          title: '登陆成功',
          icon: 'success',
          duration: 2000
        })
        wx.switchTab('/pages/personal/personal')
      }
    });
  }
})