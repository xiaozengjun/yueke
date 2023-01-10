// pages/admin/chooseDate/index.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		selectedDays: [],
		contentData: [],
		showIndex: null, //打开弹窗的对应下标
		date: [],
        allowNumber: 0,
        switch1Checked: true,
		popoverIndex: '',
		popoverIndexs: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.data.contentData = JSON.parse(options.contentData)
		for(let i=0; i<this.data.contentData.length; i++) {
			this.data.selectedDays.push(this.data.contentData[i].date)
		}
		this.setData({
			contentData: this.data.contentData,
			selectedDays:this.data.selectedDays
		});
	},
    addTate(e) {
        this.data.contentData[e.target.dataset.index].info.push({
            startTime: "09:00",
            endTime: "09:45",
            allowNumber: "50",
			openId: [],
			RestData : []
        })
        this.setData({
			contentData: this.data.contentData,
		});
    },
    PersonEdit(e) { // 人数选择
		let index = e.currentTarget.dataset.index
		let indexs = e.currentTarget.dataset.indexs
		var dataset = e.currentTarget.dataset;
		this.setData({
			showIndex: dataset.index2,
            date: dataset.date + ' ' + dataset.time,
            allowNumber: dataset.allownumber,
			popoverIndex: index,
			popoverIndexs: indexs
		});
    },
	popoverConfirm() { // 弹窗确认
		this.data.contentData[this.data.popoverIndexs].info[this.data.popoverIndex].allowNumber = (this.data.switch1Checked? this.data.allowNumber : false)
		this.setData({
			contentData: this.data.contentData
		});
		this.closePopup()
	},
	switch1Change(e) { // 弹窗里面开关
		this.setData({
			switch1Checked: e.detail.value
		});
	},
	inputChange(e) { // 弹窗输入框
		this.setData({
            allowNumber: e.detail.value,
		});
	},
	cmfclick({detail}) {
		let params = []
		let myDate = []
		for(let i=0; i<this.data.contentData.length; i++) {
			myDate.push(this.data.contentData[i].date)
		}
        for(let i=0;i<detail.selectDays.length;i++) {
			let index = myDate.indexOf(detail.selectDays[i])
			if (index != -1) {
				params.push(this.data.contentData[index])
			}else {
				params.push({
					date: detail.selectDays[i],
					info: [
						{
							startTime: "09:00",
							endTime: "09:45",
							allowNumber: "50",
							openId: [],
							RestData : []
						}
					]
				})
			}
		}
		this.setData({
			contentData: params
		});
	},
	determineInfo() { // 信息确认按钮
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		prevPage.data.contentData = this.data.contentData
		prevPage.setData({
			contentData: this.data.contentData,
		});
		wx.navigateBack({
			delta: 1,
		});
	},
	delete(e) { // 删除时间段
		let index = e.currentTarget.dataset.index
		let indexs = e.currentTarget.dataset.indexs
		this.data.contentData[indexs].info.splice(index , 1)
		this.setData({
			contentData: this.data.contentData
		});
	},
	bindTimeChange: function(e) {
		let index = e.currentTarget.dataset.index
		let indexs = e.currentTarget.dataset.indexs
		this.data.contentData[indexs].info[index].startTime = e.detail.value
        this.setData({
		    contentData: this.data.contentData
        })
    },
    bindTimeChangeEnd: function(e) {
		let index = e.currentTarget.dataset.index
		let indexs = e.currentTarget.dataset.indexs
		this.data.contentData[indexs].info[index].endTime = e.detail.value
        this.setData({
			contentData: this.data.contentData
        })
    },
	//关闭弹窗
	closePopup() {
		this.setData({
			showIndex: null,
		});
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {
        console.log(123)
		var that = this;
		// 动态获取屏幕高度
		wx.getSystemInfo({
			success: (result) => {
				that.setData({
					height: result.windowHeight,
				});
			},
		});
	},
});
