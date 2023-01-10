// 云函数入口文件
const cloud = require("wx-server-sdk");
const rp = require("request-promise");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
	const page = event.page;
	const scene = event.scene;

	//appid和秘钥
	const appid = "wx87c6d0b6bc149aac";
	const secret = "069d0b2bfb6c4c05bd62ea323a5e0768";

	const AccessToken_options = {
		method: "GET",
		url: "https://api.weixin.qq.com/cgi-bin/token",
		qs: {
			appid,
			secret,
			grant_type: "client_credential",
		},
		json: true,
	};

	//获取AccessToken
	const resultValue = await rp(AccessToken_options);
	const token = resultValue.access_token;

    

	//获取小程序码配置
	const code_options = {
		method: "POST",
		url:
			"https://api.weixin.qq.com/product/qrcode/gen?access_token=" + token,
		body: {
			"type":1
		},
		json: true,
		encoding: null,
	};

	//获取二进制图片
	const buffer = await rp(code_options);
    console.log(buffer, '123456456')
    return{
        buffer
    }
	// const upload = await cloud.uploadFile({
	// 	cloudPath: "wxacode.png",
	// 	fileContent: buffer,
	// });
	// return {
	// 	wxacodefileID: upload.fileID,
	// };
};
