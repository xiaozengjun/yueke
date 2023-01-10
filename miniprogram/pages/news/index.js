Page({
    data: {
        newsData: ''
    },
    onLoad: function (options) {
        this.newsDetails(options._id)
    },
    newsDetails(id) {
        wx.cloud.callFunction({
            name: 'rest',
            data: {
                request: 'newsDetails',
                id: id
            }
        })
        .then(res => {
            this.setData({
                newsData: res.result.data
            })
        })
        .catch(console.error, '错误')
    },
})