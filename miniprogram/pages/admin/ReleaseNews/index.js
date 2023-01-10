Page({
    data: {
      SingleStrip: {
        text: '',
        img: ''
      },
      content: [],
      title: '',
      author: '',
      coverImg: '',
      editIndex: -1,
      nbTitle: '上传资讯',
      _id: '',
      nbLoading: false
    },
    onLoad(e) {
      if(e.isEdit==1) {
        this.setData({
            nbTitle: '编辑资讯',
            nbLoading: true,
        })
        this.QueryInformation(e.id)
        this.data._id = e.id
      }else {
        this.setData({
            nbTitle: '上传资讯',
            nbLoading: false,
        })
      }
    },
    QueryInformation(id) {
      wx.cloud.callFunction({
          name: 'rest',
          data: {
            id: id,
            request: "newsDetails"
          }
      })
      .then(res => {
          if(res.result.data) {
            this.setData({
              title: res.result.data.title,
              author: res.result.data.author,
              content: res.result.data.content,
              coverImg: res.result.data.coverImg,
              nbLoading: false,
            })
          }
      })
      .catch(console.error, '错误')
    },
    bindinput(event) { // 文章内容
      let value = event.detail.value
      var SingleStrip = this.data.SingleStrip
      SingleStrip.text = value
      this.setData({
        SingleStrip:SingleStrip
      })
    },
    titleBoxinput(event) { // 标题输入框
      this.setData({
        title:event.detail.value
      })
    },
    authorBoxinput(event) { // 作者输入框
      this.setData({
        author:event.detail.value
      })
    },
    edit(e) { // 点击内容修改内容
      this.setData({
        SingleStrip: {
          text: this.data.content[e.currentTarget.dataset.id].text,
          img:  this.data.content[e.currentTarget.dataset.id].img
        },
        editIndex: e.currentTarget.dataset.id
      })
    },
    cancel() { // 取消
      this.setData({
        SingleStrip: {
          text: '',
          img:  ''
        },
        editIndex: -1
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
    inputFlex() {
      wx.chooseMedia({
        success: (chooseResult) => {
          const tempFiles = chooseResult.tempFiles[0].tempFilePath;
          wx.cloud.uploadFile({  
            cloudPath: this.uuid(), // 存放在云存储的图片名字
            filePath: tempFiles, // 文件路径
          }).then(res => {
            var SingleStrip = this.data.SingleStrip
            SingleStrip.img = res.fileID
            this.setData({
              SingleStrip: SingleStrip
            })
          })
        },
      });
    },
    inputFlex2() {
      wx.chooseMedia({
        success: (chooseResult) => {
          const tempFiles = chooseResult.tempFiles[0].tempFilePath;
          wx.cloud.uploadFile({  
            cloudPath: this.uuid(), // 存放在云存储的图片名字
            filePath: tempFiles, // 文件路径
          }).then(res => {
            this.setData({
              coverImg: res.fileID
            })
          })
        },
      });
    },
    FillIn() {
      if(this.data.SingleStrip.text || this.data.SingleStrip.img) {
        if(this.data.editIndex >= 0) {
          this.data.content[this.data.editIndex] = this.data.SingleStrip
        }else {
          this.data.content.push(this.data.SingleStrip)
        }
        this.setData({
          content: this.data.content,
          SingleStrip: {
            text: '',
            img: ''
          }
        })
      }
      this.cancel()
    },
    deleteImg() { // 删除图片
      var SingleStrip = this.data.SingleStrip
      SingleStrip.img = ''
      this.setData({
        SingleStrip: SingleStrip
      })
    },
    deleteImg2() { // 删除封面
      this.setData({
        coverImg: ''
      })
    },
    release() { // 发布
      var myDate=new Date()
      let params = {
        title: this.data.title,
        author: this.data.author,
        content: this.data.content,
        coverImg: this.data.coverImg,
        time: myDate.toLocaleString()
      }
      for(var key in params){
        if(!params[key]) {
          wx.showToast({
            title: '请完善信息',
            mask:true,
            icon:'error',
            duration: 2000
          })
          return
        }
      }
      if(this.data.nbTitle == '编辑资讯') {
        wx.cloud.callFunction({
            name: 'rest',
            data: {
              data: params,
              id: this.data._id,
              request: "editNews"
            }
        })
        .then(res => {
            if(res.result.data) {
              wx.showToast({
                title: '编辑成功',
                icon: 'success',
                duration: 2000,
                mask: true,
                success:function(){
                  setTimeout(function () { 
                    wx.navigateBack({
                      delta: 1
                    });
                  }, 2000) 

                }
              })
            }
        })
        .catch(console.error, '错误')
      }else {
        wx.cloud.callFunction({
            name: 'rest',
            data: {
              data: params,
              request: "addarticle"
            }
        })
        .then(res => {
            if(res.result.data) {
              wx.showToast({
                title: '发布成功',
                icon: 'success',
                duration: 2000,
                mask: true,
                success:function(){
                  setTimeout(function () { 
                    wx.navigateBack({
                      delta: 1
                    });
                  }, 2000) 

                }
              })
            }
        })
        .catch(console.error, '错误')
      }
    }
  })