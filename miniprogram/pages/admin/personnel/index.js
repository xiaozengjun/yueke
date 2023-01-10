// pages/admin/personnel/index.js
Page({
    data: {
        _id: '',
        RestData: '',
        nbLoading: true,
        name: '人员信息'
    },
    onLoad: function (e) {
        this.data._id = e.id
        this.appointment()
    },
    appointment(id) { // 请求预约数据
        wx.cloud.callFunction({
            name: 'appointment',
            data: {
                id: this.data._id,
                request: 'QuerySheet'
            }
        })
        .then(res => {
            this.setData({
                RestData: res.result.data.contentData,
                nbLoading: false,
            })
        })
        .catch(console.error, '错误')
    },
})