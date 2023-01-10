const app = getApp()
Page({
  data: {
    avatarUrl: '',
    theme: wx.getSystemInfoSync().theme,
    name: '',
    openId: ''
  },
  onLoad() {
    this.setData({
        avatarUrl: wx.getStorageSync("userInfo").avatarUrl || 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
        name: wx.getStorageSync("userInfo").name || ''
    })
    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme
      })
    })
    this.jsonData()
  },
  async jsonData() {
    const cloudFunRes = await wx.cloud.callFunction({
			name: "user",
		});
    this.data.openId = cloudFunRes.result
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },
  uuid() {
    var s = [];
    var uuidData = "0123456789abcdefghijklmnopqrstuvwxyz";
    var uuidDataLength = uuidData.length;
    for (var i = 0; i < 36; i++) {
      s[i] = uuidData.substr(Math.floor(Math.random() * uuidDataLength), 1);
    }
    var uuid = s.join("");
    return uuid;
  },
  submitForm() {
    console.log(this.data.openId)
    wx.cloud.uploadFile({  
      cloudPath: this.data.openId, // 存放在云存储的图片名字用openid
      filePath: this.data.avatarUrl, // 文件路径
    }).then(res => {
      let userInfo = {
          name: this.data.name,
          avatarUrl: res.fileID
      }
      wx.setStorageSync('userInfo', userInfo)
      wx.setStorageSync('hadAuthed', true)
      wx.showToast({
          title: '已保存！',
          icon: 'success',
          duration: 2000,
          complete:function(){
              setTimeout(function(){
                  wx.navigateBack({
                      delta: 1
                  });
              }, 2000)
          }
      })
    })
  },
  bindTimeChangeEnd(e) {
    this.setData({
        name:e.detail.value,
    })
  }
})
