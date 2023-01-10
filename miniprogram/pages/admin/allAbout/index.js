// pages/admin/modify/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        appointment: [],
        nbFrontColor: '#000000',
        nbBackgroundColor: '#ffffff',
    },
    onLoad() {
        this.setData({
            nbTitle: '所有预约',
            nbLoading: true,
            nbFrontColor: '#ffffff',
            nbBackgroundColor: '#000000',
        })
    },
    onShow: function () {
        this.appointment()
    },
    // judgeDate(tomodifyDate){ // 判断日期是否小于等于今天
    //     return (new Date(new Date().setHours(0, 0, 0, 0)))-new Date(tomodifyDate).getTime();
    // },
    appointment() { // 请求所有预约数据
        wx.cloud.callFunction({
            name: 'appointment',
            data: {
                request: 'allAbout'
            }
        })
        .then(res => {
            // for(let i=0; i<res.result.data.length;i++) {
            //     if(this.judgeDate(res.result.data[i].time)>=0){
            //         res.result.data[i].Isexpire = true
            //     }else {
            //         res.result.data[i].Isexpire = false
            //     }
            // }
            console.log(res.result.data)
            this.setData({
                nbLoading: false,
                appointment: res.result.data
            })
        })
        .catch(console.error, '错误')
    },
    cancelClick(e) {
        let this_ = this
        wx.showModal({
            title: '提示',
            content: '您是否要取消这条预约',
            success: function (res) {
                wx.cloud.callFunction({
                    name: 'appointment',
                    data: {
                        request: 'cancelRest',
                        id: e.target.dataset.id,
                    }
                })
                .then(res => {
                    this_.appointment()
                    wx.showToast({
                        title: '已取消预约',
                        icon: 'success',
                        duration: 2000
                    })
                })
                .catch(console.error, '错误')
            }
        })
    }
})