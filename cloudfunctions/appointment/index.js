const cloud = require('wx-server-sdk')
cloud.init({
    env: "test-2gelfgbub7f9c51b",
    traceUser: true
})
const db = cloud.database()
const appointment = db.collection('appointment')
const _ = db.command
const genRandomIntString = len => {
    const text = '0123456789';
    const rdmIndex = text => Math.random() * text.length | 0;
    let rdmString = '';
    for (; rdmString.length < len; rdmString += text.charAt(rdmIndex(text)));
    return rdmString;
}
function getNowTimeFull(){
    var myDate=new Date;
    var year=myDate.getFullYear(); //获取当前年
    var mon=myDate.getMonth()+1<10?"0"+(myDate.getMonth()+1):myDate.getMonth()+1; //获取当前月
    var date=myDate.getDate()<10?"0"+myDate.getDate():myDate.getDate(); //获取当前日
    var hour=myDate.getHours()<10?"0"+myDate.getHours():myDate.getHours();//获取当前时
    var minute=myDate.getMinutes()<10?"0"+myDate.getMinutes():myDate.getMinutes();//获取当前分
    return year+"-"+mon+"-"+date+" "+hour+":"+minute+":00";
}
let API = {
    appointment: async (event , openid) => {// 查询预约数据
        let res = ''
        let params = []
        if(event.time) {
            res = await appointment.where({
                "contentData.date": event.time
            }).get();
            for(let i=0; i<res.data.length;i++) {
                for(let k=0; k<res.data[i].contentData.length; k++) {
                    let item = res.data[i].contentData[k]
                    if(item.date == event.time) {
                        for(let o=0; o<item.info.length;o++) {
                            let isAbout = item.info[o].openId.indexOf(openid) != -1
                            let quantity = item.info[o].openId.length
                            let index = item.info[o].openId.indexOf(openid)
                            let status = ''
                            console.log(index, isAbout , item.info[o].RestData.length , item.info[o].RestData)
                            if(isAbout && item.info[o].RestData.length>0) {
                                status = item.info[o].RestData[index].status || 0
                            }else {
                                status = 0
                            }
                            params.push({
                                "_id": res.data[i]._id,
                                "courseName": res.data[i].courseName,
                                "name": res.data[i].name,
                                "type": res.data[i].type,
                                "tips": res.data[i].tips,
                                "date": item.date,
                                "startTime": item.info[o].startTime,
                                "endTime": item.info[o].endTime,
                                "allowNumber": item.info[o].allowNumber,
                                "isAbout": isAbout,
                                "quantity": quantity,
                                "index": k,
                                "infoIndex": o,
                                "status": status
                            })
                        }
                        break;
                    }
                }
            }
        }else {
            res = await appointment.get();
            for(let i=0; i<res.data.length;i++) {
                let params2 = {
                    "_id": res.data[i]._id,
                    "courseName": res.data[i].courseName,
                    "name": res.data[i].name,
                    "type": res.data[i].type,
                    "tips": res.data[i].tips,
                    "info": []
                }
                for(let k=0; k<res.data[i].contentData.length; k++) {
                    let item = res.data[i].contentData[k]
                    let dateData = {
                        isexpire: (new Date(new Date().setHours(0, 0, 0, 0)))-new Date(item.date).getTime()>=0,
                        date: []
                    }
                    for(let o=0; o<item.info.length;o++) {
                        dateData.date.push({
                            item: item.date+ ' ' + item.info[o].startTime + "至" + item.info[o].endTime,
                            surplus: item.info[o].allowNumber? item.info[o].openId.length +'/'+ item.info[o].allowNumber : item.info[o].openId.length+'/不限'
                        })
                    }
                    params2.info.push(dateData)
                }
                params.push(params2)
            }  
        }
        return params
    },
    appointmentt: async (event) => { // 增加可预约数据
        res = await appointment.add({
            data: event.data
        })
        return true
    },
    addRest: async (event , openid) => { // 预约
        let data = {
            data: event.data,
            openid: openid,
            HeadPicture: event.HeadPicture,
            uuid: genRandomIntString(15),
            tateTime: getNowTimeFull(),
            status: 0
        }
        await appointment.where({
            _id: event.id
          }).update({
            data: {
                ["contentData." + event.index + ".info." + event.infoindex + '.RestData']: _.push(data),
                ["contentData." + event.index + ".info." + event.infoindex + '.openId']: _.push(openid),
                ["contentData." + event.index + ".info." + event.infoindex + '.has']: 0,
            }
        })
        return {
            uuid: data.uuid,
            data: data.data,
            tateTime: data.tateTime,
            status: data.status
        }
    },

    cancelRest: async (event , openid) => { // 取消预约
        await appointment.where({
            _id: event.id
          }).update({
            data: {
                ["contentData." + event.index + ".info." + event.infoIndex + ".RestData"]: _.pull({
                    openid: _.eq(openid)
                }),
                ["contentData." + event.index + ".info." + event.infoIndex + ".openId"]: _.pull(openid),
            }
        })
        return true
    }, 
    deleteRest: async (event) => { // 删除预约
        await appointment.doc(event.id).remove()
        return true
    }, 
    QuerySheet: async (event) => { // 查询单条预约
        let res = await appointment.doc(event.id).field({contentData : true}).get()
        return res.data
    }, 
    details: async (event , openId) => { // 查询单条预约
        let res = await appointment.doc(event.id).field({contentData : true}).get()
        let index = res.data.contentData[event.index].info[event.infoindex].openId.indexOf(openId)
        return res.data.contentData[event.index].info[event.infoindex].RestData[index]
    }, 
    QuerySheet2: async (event) => { // 查询单条预约信息用于修改复现
        let res = await appointment.doc(event.id).get()
        return res.data
    }, 
    editAbout: async (event) => { // 编辑预约
        res = await appointment.doc(event.id).update({
            data: event.data
        })
        return true
    },
    allAbout: async (event , openid) => { // 查询当前用户的预约课程
        let res = await appointment.where({
                'contentData.info.openId': openid
            }).get()
        let data = []
        for(let i=0; i<res.data.length;i++) {
            let params = {
                "_id": res.data[i]._id,
                "courseName": res.data[i].courseName,
                "name": res.data[i].name,
                "type": res.data[i].type,
                "tips": res.data[i].tips,
                "info": []
            }
            for(let k=0; k<res.data[i].contentData.length; k++) {
                let item = res.data[i].contentData[k]
                let dateData = {
                    isexpire: (new Date(new Date().setHours(0, 0, 0, 0)))-new Date(item.date).getTime()>=0,
                    date: []
                }
                for(let o=0; o<item.info.length;o++) {
                    if(item.info[o].openId.indexOf(openid) != -1) {
                        dateData.date.push(item.date+ ' ' + item.info[o].startTime + "至" + item.info[o].endTime)
                    }
                }
                params.info.push(dateData)
            }
            data.push(params)
        }  
        return data
    }, 
    timeData: async (event , openid) => { // 查询可预约时间
        let res = await appointment.get()
        let data = []
        var myDate = new Date();
        for(let i=0; i<res.data.length; i++) {
            for(let k=0; k<res.data[i].contentData.length;k++) {
                let itemData  = res.data[i].contentData[k].date
                if(data.indexOf(itemData) == -1 && myDate.valueOf() < new Date(itemData).valueOf()) {
                    data.push(itemData.split('-').map(function(aa){return +aa}))
                }
            }
        }
        return data
    }, 
    WriteOff: async (event , openid) => { // 核销
        let res = await appointment.doc(event.id).field({contentData : true}).get()
        let RestData = res.data.contentData[event.index].info[event.infoIndex].RestData
        let uuidData = []
        for(let i=0; i<RestData.length; i++) {
            if(RestData[i].uuid) {
                uuidData.push(RestData[i].uuid)
            }else {
                uuidData.push(false)
            }
        }
        let uuidDataIndex = uuidData.indexOf(event.code)
        if(uuidDataIndex != -1 && res.data.contentData[event.index].info[event.infoIndex].RestData[uuidDataIndex].status) {
            return {
                code: 301,
                text: '核销失败! 该二维码已核销'
            }
        }else if(uuidDataIndex != -1) {
            await appointment.doc(event.id).update({
                data: {
                    ["contentData." + event.index + ".info." + event.infoIndex + ".RestData."+ uuidDataIndex +".status"]: 1,
                    ["contentData." + event.index + ".info." + event.infoIndex +".has"]: _.inc(1),
                }
            })
            return {
                code: 200,
                text: '核销成功'
            }
        }else {
            return {
                code: 301,
                text: '核销失败! 提醒学员检查课程'
            }
        }
    }, 
}
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    let data = await API[event.request](event , wxContext.OPENID)
    return {
        event,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
        data: data
    }
}