import config from './config'
// 数据请求封装，需要传入url和data，默认为GET方法，传出一个Promise
export function request(url, data, method="GET") {
  return new Promise((resolve, reject) => {
      wx.request({
        url: config.baseUrl + url,
        data,
        method,
        success: (res) => {
          resolve(res.data)
        },
        fail: (err) => {
          reject(err)
        }
      })
  })
}