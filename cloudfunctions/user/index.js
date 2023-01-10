const cloud = require('wx-server-sdk')

cloud.init({
    env: "test-2gelfgbub7f9c51b",
    traceUser: true
})

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  if(event.cloudIdList) {
    const cloudIdList = event.cloudIdList
    try {
      const result = await cloud.openapi.cloudbase.getOpenData({
        openid: openid,
        cloudidList: cloudIdList
      })
      return result
    } catch (err) {
      return err
    }
  }else {
    return openid
  }
}
