// 后台api的域名本地
// var apiDomain = 'https://www.4ry.cn/'
var apiDomain = 'https://www.z3n.cn/'
// var apiDomain = 'http://192.168.3.148:8885/'
// 测试
// var apiDomain = 'http://192.168.3.39:8180/api/'
// var apiDomain = 'https://www.hnllhy.cn/api/'
// var apiDomain = 'https://www.4ry.cn/api/'
// var apiDomain = 'http://127.0.0.1:8180/api/'



// 获取指定的URL参数值
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}

