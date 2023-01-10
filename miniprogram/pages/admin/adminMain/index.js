// pages/admin/adminMain/index.js
Page({
    data: {
        menuitems: [
            { text: '发布预约', url: '/pages/admin/release/index?isUpload=0', icon: '../../../images/yy.png', tips: '' },
            { text: '约课信息', url: '/pages/admin/modify/index', icon: '../../../images/xx.png', tips: '' },
            { text: '发布资讯', url: '/pages/admin/ReleaseNews/index', icon: '../../../images/zx.png', tips: '' },
            { text: '编辑资讯', url: '/pages/admin/modifyNews/index?isEdit=0', icon: '../../../images/bj.png', tips: '' }
        ]
    }
})