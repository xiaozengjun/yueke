const app = getApp()

Page({
    data: {
        spotMap: {
            y2022m5d9: 'deep-spot',
            y2022m5d10: 'spot',
        },
        appointment: [],
        detail_A: '',
        selected: '2022-12-28',
        spotMap: {},
        isExecute: false,
        show: false,
        buttons: [
            {
                type: 'default',
                className: '',
                text: '取消',
                value: 0
            },
            {
                type: 'primary',
                className: '',
                text: '确认',
                value: 1
            }
        ]
    },
    onLoad() {
        this.timeData()
    },
    open: function () {
        this.setData({
            show: true
        })
    },
    onShow: function () {
        if(this.data.isExecute) this.appointment()
    },
    // getDateList({detail}) {
    //     console.log(detail,'getDateList detail');
    // },
    timeData() {
        wx.cloud.callFunction({
            name: 'appointment',
            data: {
                request: 'timeData'
            }
        })
        .then(res => {
            console.log(res.result.data, '456789')
            let data = {}
            let itemKey = ['y','m','d']
            for(let i=0; i<res.result.data.length; i++) {
                let item = res.result.data[i]
                let name = ''
                for(let k=0; k<item.length; k++) {
                    name += itemKey[k] + item[k]
                }
                data[name] = 'spot'
            }
            this.setData({
                spotMap: data
            })
        })
        .catch(console.error, '错误')
    },
    selectDay({detail}){ // 点击日历
        this.detail_A = detail.year + '-' + (detail.month<10? '0'+detail.month : detail.month) + '-' + (detail.day<10? '0'+detail.day : detail.day)
        this.setData({
            detail_A: detail.year + '-' + (detail.month<10? '0'+detail.month : detail.month) + '-' + (detail.day<10? '0'+detail.day : detail.day)
        })
        this.appointment()
    },
    judgeDate(tomodifyDate){ // 判断日期是否小于等于今天
        return new Date().getTime()-new Date(tomodifyDate).getTime();
    },
    appointment() { // 请求预约数据
        this.setData({
            appointment: []
        })
        if(this.judgeDate(this.detail_A)>0){
            return ;
        }
        wx.cloud.callFunction({
            name: 'appointment',
            data: {
                time: this.detail_A,
                request: 'appointment'
            }
        })
        .then(res => {
            this.setData({
                appointment: res.result.data,
                isExecute: true,
            })
        })
        .catch(console.error, '错误')
    },
    aboutClick(e) { // 预约
        wx.navigateTo({
            url: '/pages/info/index?id=' + e.currentTarget.dataset.id + '&courseName=' + e.currentTarget.dataset.coursename + '&index=' + e.currentTarget.dataset.index+ '&infoindex=' + e.currentTarget.dataset.infoindex+ '&time=' + e.currentTarget.dataset.time,
        });
    },
    detailsClick(e) { // 详情
        wx.cloud.callFunction({
            name: 'appointment',
            data: {
                id: e.currentTarget.dataset.id,
                index: e.currentTarget.dataset.index,
                infoindex: e.currentTarget.dataset.infoindex,
                request: 'details'
            }
        })
        .then(res => {
            let data = res.result.data
            wx.navigateTo({
				url: '/pages/BookingDetails/index?nickName=' + data.data.nickName + '&userPhone=' + data.data.userPhone + '&tateTime=' + data.tateTime + '&uuid=' + data.uuid + '&status=' + data.status,
			});
        })
        .catch(console.error, '错误')

    },
    cancel(e) { // 取消预约
        wx.cloud.callFunction({
            name: 'appointment',
            data: {
                request: 'cancelRest',
                id: e.target.dataset.id,
                index: e.target.dataset.index,
                infoIndex: e.target.dataset.infoindex
            }
        })
        .then(res => {
            this.appointment()
            wx.showToast({
                title: '已取消预约',
                icon: 'success',
                duration: 2000
            })
        })
        .catch(console.error, '错误')
    }
})