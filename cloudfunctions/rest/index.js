const cloud = require('wx-server-sdk')
cloud.init({
    env: "test-2gelfgbub7f9c51b",
    traceUser: true
})
const db = cloud.database()
const rest = db.collection('rest')
let API = {
    getInformation: async () => {
        let res = await rest.get();
        return res.data
    },    
    addarticle: async (event) => { // 增加资讯
        res = await rest.add({
            data: event.data
        })
        return true
    }, 
    editNews: async (event) => { // 编辑资讯
        res = await rest.doc(event.id).update({
            data: event.data
        })
        return true
    },
    newsDetails: async (event) => { // 查询单条数据
        let res = await rest.doc(event.id).get()
        return res.data
    },
    deleteNews: async (event) => { // 删除预约
        await rest.doc(event.id).remove()
        return true
    }, 
}
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    let data = await API[event.request](event)
    return {
        event,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
        data: data
    }
}