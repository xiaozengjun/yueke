// pages/login/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        pwd: '' 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    bindLoginTap() {
        if(!this.data.name || !this.data.pwd) {
            wx.showToast({
                title: '请输入账号密码',
                icon: 'none',
                duration: 2000,
                mask: false
            })
            return
        } 
        wx.showToast({
            title: '正在登录...',
            icon: 'loading',
            mask: true
        })
        wx.cloud.callFunction({
            name: 'login',
            data: {
                name: this.data.name,
                password: this.data.pwd,
                request: 'login'
            }
        })
        .then(res => {
            if(res.result.data) {
                wx.showToast({
                    title: '登录成功',
                    icon: 'success',
                    duration: 2000,
                    mask: false,
                    success: function() {
                        wx.reLaunch({
                            url: '/pages/admin/adminMain/index',
                        });
                    }
                })
            }else {
                wx.showToast({
                    title: '登录失败',
                    icon: 'none',
                    duration: 2000,
                    mask: false
                })
            }
            console.log(res , 12345789)
        })
        .catch(console.error)
    }
})