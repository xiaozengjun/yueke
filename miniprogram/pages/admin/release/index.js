Page({
    data: {
      courseName: '',
      name: '',
      tips: '',
      type: '0',
      nbFrontColor: '#000000',
      nbBackgroundColor: '#ffffff',
      nbLoading: false,
      _id: '',
      contentData: [], // 日期选择传过来的信息
    },
    onLoad(e) {
      if(e.isUpload==1) {
        this.setData({
            nbTitle: '编辑预约',
            nbLoading: true,
            nbFrontColor: '#ffffff',
            nbBackgroundColor: '#000000',
        })
        this.QuerySheet(e.id)
        this.data._id = e.id
      }else {
        this.setData({
            nbTitle: '上传预约',
            nbLoading: false,
            nbFrontColor: '#ffffff',
            nbBackgroundColor: '#000000',
        })
      }
    },
    dateClick(e) {
      let contentData = JSON.stringify(e.currentTarget.dataset.contentdata)
      wx.navigateTo({
          url: '/pages/admin/chooseDate/index?contentData=' + contentData
      })
    },
    formSubmit(e) { // 确认按钮
        let params = e.detail.value
        let paramsData = {
          courseName: params.courseName,
          name: params.name,
          tips: params.tips,
          type: params.type,
          contentData: this.data.contentData
        }

        for(var key in paramsData){
          if(!paramsData[key]) {
            wx.showToast({
              title: '请完善信息',
              mask:true,
              icon:'error',
              duration: 2000
            })
            return
          }
        }
        if(this.data.nbTitle == "上传预约") {
          wx.cloud.callFunction({
              name: 'appointment',
              data: {
                data: paramsData,
                request: "appointmentt"
              }
          })
          .then(res => {
              if(res.result.data) {
                this.setData({
                  courseName: '',
                  name: '',
                  tips: '',
                  contentData: []
                })
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 2000
                })
              }
          })
          .catch(console.error, '错误')
        }else {
          wx.cloud.callFunction({
              name: 'appointment',
              data: {
                data: paramsData,
                id: this.data._id,
                request: "editAbout"
              }
          })
          .then(res => {
              if(res.result.data) {
                this.setData({
                  courseName: '',
                  name: '',
                  tips: '',
                })
                wx.showToast({
                  title: '编辑成功',
                  icon: 'success',
                  duration: 2000
                })
                wx.navigateBack({
                  delta: 1
                });
              }
          })
          .catch(console.error, '错误')
        }
    },
    formReset() {
      wx.reLaunch({
          url: '/pages/admin/adminMain/index'
      })
    },
    QuerySheet(id) {
      wx.cloud.callFunction({
          name: 'appointment',
          data: {
            id: id,
            request: "QuerySheet2"
          }
      })
      .then(res => {
          if(res.result.data) {
            this.setData({
              courseName: res.result.data.courseName,
              name: res.result.data.name,
              tips: res.result.data.tips,
              type: res.result.data.type,
              contentData: res.result.data.contentData,
              nbLoading: false,
            })
          }
      })
      .catch(console.error, '错误')
    }
  })