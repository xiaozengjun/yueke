// pages/info/index.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		courseName: "",
		userInfo: "",
        userPhone: "",
        id: '',
		date: '',
		info: [],
		index: '', // 需要修改数组下标
		infoindex: '' // 
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			courseName: options.courseName,
			date: options.time,
            id: options.id,
			index: options.index,
			infoindex: options.infoindex,
			userInfo: wx.getStorageSync("userInfo"),
            userPhone: wx.getStorageSync("phoneNumber")
		});
	},
    formSubmit(e) {
		if(!e.detail.value.nickName || !e.detail.value.userPhone) {
			wx.showToast({
                title: '请完善信息',
				mask:true,
				icon:'error',
                duration: 2000
            })
			return
		}
        wx.cloud.callFunction({
            name: 'appointment',
            data: {
                request: 'addRest',
                id: this.data.id,
                data: e.detail.value,
				infoindex: this.data.infoindex,
				index: this.data.index,
				HeadPicture: this.data.userInfo.avatarUrl
            }
        })
        .then(res => {
			console.log(res,'res')
            wx.showToast({
                title: '已预约成功',
                icon: 'success',
                duration: 2000
            })
			wx.reLaunch({
				url: '/pages/BookingDetails/index?nickName=' + res.result.data.data.nickName + '&userPhone=' + res.result.data.data.userPhone + '&tateTime=' + res.result.data.tateTime + '&uuid=' + res.result.data.uuid + '&status=' + res.result.data.status,
			});
            // wx.navigateBack({
            //     delta: 1
            // });
        })
        .catch(console.error, '错误')
    },
	async getPhoneNumber(res) {
		const errMsg = res.detail.errMsg;
		if (errMsg != "getPhoneNumber:ok") {
			wx.showToast({
				title: "授权失败",
				icon: "error",
			});
			return;
		}
		const cloudId = res.detail.cloudID;
		const cloudIdList = [cloudId];
		wx.showLoading({
			title: "获取中",
			mask: true,
		});

		const cloudFunRes = await wx.cloud.callFunction({
			name: "user",
			data: {
				cloudIdList,
			},
		});
		const jsonStr = cloudFunRes.result.dataList[0].json;
		const jsonData = JSON.parse(jsonStr);
		const phoneNumber = jsonData.data.phoneNumber;
		wx.setStorageSync("phoneNumber", phoneNumber);
		this.setData({
			userPhone: phoneNumber,
		});
		wx.hideLoading({
			success: (res) => {},
		});
	},
});
