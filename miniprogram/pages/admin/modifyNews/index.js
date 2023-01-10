// pages/admin/modifyNews/index.js
Page({
    data: {
        information: '',
        nbLoading: true
    },
    onLoad: function () {
        this.getInformation()
    },
    getInformation() {
        wx.cloud.callFunction({
            name: 'rest',
            data: {
                request: 'getInformation'
            }
        })
        .then(res => {
            this.setData({
                information: res.result.data,
                nbLoading: false
            })
        })
        .catch(console.error, '错误')
    },
    editClick(e) {
        wx.navigateTo({
            url: '/pages/admin/ReleaseNews/index?isEdit=1&id=' + e.target.dataset.id
        })
    },
    deleteClick(e) {
        wx.cloud.callFunction({
            name: 'rest',
            data: {
                request: 'deleteNews',
                id: e.target.dataset.id
            }
        })
        .then(res => {
            this.getInformation()
        })
        .catch(console.error, '错误')
    }
})