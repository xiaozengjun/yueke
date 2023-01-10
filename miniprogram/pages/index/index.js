
// pages/index/index.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		information: "",
		background: [
			"../../images/1.png",
			"../../images/2.png",
			"../../images/3.png",
		],
		//是否已经获取用户信息
		hasUserInfo: false,
		//是否可以调用获取信息得函数
		canIUseGetUserProfile: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		this.getInformation();
		this.setData({
			canIUseGetUserProfile: true,
		});
		if (!wx.getStorageSync("hadAuthed")) {
			wx.showModal({
				title: "提示",
				content: "设置头像和用户名, 更好的体验该小程序",
				success: function (res) {
					if (res.confirm) {
						wx.navigateTo({
							url: "/pages/authorization/index",
						});
					}
				},
			});
		};
	},
	getInformation() {
		wx.cloud
			.callFunction({
				name: "rest",
				data: {
					request: "getInformation",
				},
			})
			.then((res) => {
				this.setData({
					information: res.result.data,
				});
			})
			.catch(console.error, "错误");
	},
	toNews(e) {
		console.log(e.currentTarget.dataset.id);
		wx.navigateTo({
			url: "/pages/news/index?_id=" + e.currentTarget.dataset.id,
		});
	},
});

// const request = require("request");
// const appid = "YOUR_APPID";
// const appsecret = "YOUR_APPSECRET";
// const getAccessToken = () => {
// 	return new Promise((resolve, reject) => {
// 		const options = {
// 			method: "POST",
// 			url: "https://api.weixin.qq.com/cgi-bin/token",
// 			qs: { grant_type: "client_credential", appid, secret: appsecret },
// 		};
// 		request(options, (error, response, body) => {
// 			if (error) {
// 				reject(error);
// 			} else {
// 				const data = JSON.parse(body);
// 				resolve(data.access_token);
// 			}
// 		});
// 	});
// };
