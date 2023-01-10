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
            nbTitle: '预约信息',
            nbLoading: true,
            nbFrontColor: '#ffffff',
            nbBackgroundColor: '#000000',
        })
    },
    onShow: function () {
        this.appointment()
    },
    judgeDate(tomodifyDate){ // 判断日期是否小于等于今天
        return (new Date(new Date().setHours(0, 0, 0, 0)))-new Date(tomodifyDate).getTime();
    },
    appointment() { // 请求预约数据
        wx.cloud.callFunction({
            name: 'appointment',
            data: {
                request: 'appointment'
            }
        })
        .then(res => {
            for(let i=0; i<res.result.data.length;i++) {
                if(this.judgeDate(res.result.data[i].time)>=0){
                    res.result.data[i].Isexpire = true
                }else {
                    res.result.data[i].Isexpire = false
                }
            }
            this.setData({
                nbLoading: false,
                appointment: res.result.data
            })
        })
        .catch(console.error, '错误')
    },
    deleteClick(e) {
        let this_ = this
        wx.showModal({
            title: '提示',
            content: '您是否确定删除该条预约信息?',
            success: function (res) {
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name: 'appointment',
                        data: {
                            id: e.target.dataset.id,
                            request: 'deleteRest'
                        }
                    })
                    .then(res => {
                        this_.appointment()
                    })
                    .catch(console.error, '错误')
                }
            }
        })
    },
    WriteClick(e) { // 核销
        wx.navigateTo({
            url: '/pages/admin/Write/index?id=' + e.target.dataset.id,
        });
    }, 
    editClick(e) {
        wx.navigateTo({
            url: '/pages/admin/release/index?isUpload=1&id=' + e.target.dataset.id,
        });
    },
    personnelClick(e) {
        wx.navigateTo({
            url: '/pages/admin/personnel/index?id=' + e.target.dataset.id,
        });
    }
})