// pages/personal/personal.js
let startY = 0  //手指起始坐标
let moveY = 0 //手指当前坐标
let moveDistance = 0  //手指移动距离
Page({
  data: {
    coverTransform: 'translateY(0)',
    coverTranstion: ''
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
})