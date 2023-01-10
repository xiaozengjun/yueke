//获取应用实例
const app = getApp();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {},
		hasUserInfo: false,
		canIUse: "",
		buttons: [
            {
                type: 'default',
                className: '',
                text: '辅助操作',
                value: 0
            },
            {
                type: 'primary',
                className: '',
                text: '主操作',
                value: 1
            }
        ],
		menuitems: [
			{
				text: "我的所有预约",
				url: "/pages/admin/allAbout/index",
				icon: "../../images/sy.png",
				tips: "",
			},
			{
				text: "联系我们",
				url: "",
				icon: "../../images/lx.png",
				tips: "",
			},
			{
				text: "设置",
				show: true,
				url: "/pages/login/index",
				icon: "../../images/sz.png",
				tips: "",
			},
		],
	},
	setTap() {
		let itemList = ["清除缓存", "后台管理"];
		wx.showActionSheet({
			itemList,
			success: async (res) => {
				let idx = res.tapIndex;
				if (idx == 0) {
					wx.clearStorageSync();
					wx.showToast({
						title: "已清除缓存",
						icon: "none",
						duration: 1000,
						mask: false,
					});
				}

				if (idx == 1) {
					wx.reLaunch({
						url: "/pages/login/index",
					});
				}
			},
			fail: function (res) {},
		});
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
	},
	onShow: function () {
		if(wx.getStorageSync('hadAuthed')) {
			this.setData({
				userInfo: wx.getStorageSync("userInfo"),
				hasUserInfo: wx.getStorageSync("hadAuthed"),
			});
		}else {
			this.getUserInfo()
		}
    },
	getUserInfo() {
		wx.showModal({
			title: '提示',
			content: wx.getStorageSync('hadAuthed')? '是否要修改头像和用户名':'设置头像和用户名, 更好的体验该小程序',
			success: function (res) {
			  if (res.confirm) {
				wx.navigateTo({
					url: "/pages/authorization/index",
				});
			  }
			}
		})
	},
});
