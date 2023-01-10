const cloud = require('wx-server-sdk')
cloud.init({
    env: "test-2gelfgbub7f9c51b",
    traceUser: true
})
const db = cloud.database()
const adminUser = db.collection('adminUser')
let API = {
    login: async (event) => {
        data = false
        let res = await adminUser.get();
        for(let i=0; i<res.data.length;i++) {
            if(event.name == res.data[i].name && event.password == res.data[i].password) {
                return true
            } 
        }
        return false
    }
}
// 云函数入口函数
exports.main = async (event, context) => {
    console.log(event, 123456456)
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