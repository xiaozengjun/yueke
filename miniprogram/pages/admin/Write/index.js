Page({
    data: {
        _id: '',
        RestData: '',
        nbLoading: true,
        name: '扫码核销'
    },
    onLoad: function (e) {
        this.data._id = e.id
        this.appointment()
    },
    appointment(e) { // 请求预约数据
        wx.cloud.callFunction({
            name: 'appointment',
            data: {
                id: this.data._id,
                request: 'QuerySheet'
            }
        })
        .then(res => {
            console.log(res)
            this.setData({
                RestData: res.result.data.contentData,
                nbLoading: false,
            })
        })
        .catch(console.error, '错误')
    },
    WriteClick(e) {
        console.log(e.currentTarget.dataset)
        let index = e.currentTarget.dataset
        let this_ = this
		wx.scanCode({
			async success(res) {
                wx.showToast({
                    title: '正在核销',
                    icon: 'loading',
                    duration: 2000
                })
				if (!res ||
					!res.result ||
					!res.result.includes('meet=') ||
					res.result.length != 20) {
                        wx.showToast({
                            title: '错误的预约码，请重新扫码',
                            icon: 'none',
                            duration: 2000,
                            mask: false
                        })
					return;
				}
				let code = res.result.replace('meet=', '');
                wx.cloud.callFunction({
                    name: 'appointment',
                    data: {
                        id: this_.data._id,
                        code: code,
                        index: index.index,
                        infoIndex: index.infoindex,
                        request: 'WriteOff'
                    }
                })
                .then(res => {
                    console.log(res.result.data)
                    if(res.result.data.code == 200) {
                        wx.showToast({
                            title: res.result.data.text,
                            icon: 'success',
                            duration: 2000
                        })
                        this_.appointment()
                    }else {
                        wx.showToast({
                            title: res.result.data.text,
                            icon: 'none',
                            duration: 2000,
                            mask: false
                        })
                    }
                })
                .catch(console.error, '错误')
			},
			fail(err) {
				if (err && err.errMsg == 'scanCode:fail') {
                    wx.showToast({
                        title: '预约码核销错误，请重新扫码',
                        icon: 'none',
                        duration: 2000,
                        mask: false
                    })
                }
			}
		});
    }
})