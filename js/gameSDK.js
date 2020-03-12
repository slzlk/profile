var is_Login_Listener_exist = true;
var is_pay_Listener_exist = true;
var is_share_Listener_exist = true;
var is_title_Listener_exist = true;

var liulian_browser = {
    versions: function () {
        var u = navigator.userAgent;
        return {//移动终端浏览器版本信息
            ios               : !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android           : u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            meitu_main_gamebox: u.indexOf('meitu-main-gamebox') > -1, //是否是美图游戏盒应用内
        };
    }()
};
var getLoginInfo_obj = {};
function qww_meitu_ios_login_callback(res) {
    var liulian_info = {};
    liulian_info.user_name = res.user_name;
    liulian_info.uid = res.uid;
    liulian_info.img = res.headimgurl;
    liulian_info.sid = res.sid;
    liulian_info.access_token = res.access_token;
    liulian_info.nick_name = res.nick_name;

    getLoginInfo_obj.callFunc && getLoginInfo_obj.callFunc(liulian_info);
}

//流连互娱控件
var Liulian = {
    create: function () {
        var liulian = {};

        liulian.from_os = this.chkFrom();

        liulian.getLoginInfo = function (obj) {
            liuliansdk_game_id = obj.game_id;
            liuliansdk_server_id = obj.server_id;

            if (liulian_browser.versions.meitu_main_gamebox) {
                if (liulian_browser.versions.ios) {
                    getLoginInfo_obj = obj;
                    var iFrame;
                    iFrame = document.createElement("iframe");
                    iFrame.setAttribute("src", "meitu-main-gamebox//game-activateLoginProcess:game_id=" + obj.game_id + ",server_id=" + obj.server_id);
                    iFrame.setAttribute("style", "display:none;");
                    iFrame.setAttribute("height", "0px");
                    iFrame.setAttribute("width", "0px");
                    iFrame.setAttribute("frameborder", "0");
                    document.body.appendChild(iFrame);
                    // 发起请求后这个iFrame就没用了，所以把它从dom上移除掉
                    iFrame.parentNode.removeChild(iFrame);
                    iFrame = null;

                    // window.location.href = "meitu-gamebox://game-activateLoginProcess:game_id="+obj.game_id+",server_id="+obj.server_id;
                    return liulian;
                }
            }

            //  游戏盒ios版时
            //通知外面iframe

            window.parent.postMessage({
                "type"     : "cp_login",
                "game_id"  : obj.game_id,
                "server_id": obj.server_id
            }, "*");

            //防止外层iframe尚未加载完监听功能，重复请求
            var login_timer = setInterval(function () {
                window.parent.postMessage({
                    "type"     : "cp_login",
                    "game_id"  : obj.game_id,
                    "server_id": obj.server_id
                }, "*");
            }, 2500);
            //接收外层iframe返回的用户信息
            if (is_Login_Listener_exist) {
                window.addEventListener('message', function (e) {
                    if (e.origin == "https://www.4ry.cn" && e.data.msg == "login_success") {
                        var liulian_info = {};
                        liulian_info.user_name = e.data.user_name;
                        liulian_info.uid = e.data.uid;
                        liulian_info.img = e.data.headimgurl;
                        liulian_info.sid = e.data.sid;
                        liulian_info.access_token = e.data.access_token;
                        liulian_info.nick_name = e.data.nick_name;
                        liulian_info.isapp = e.data.isapp;
                        liulian_info.os = e.data.os;
                        liulian_info.app_url = e.data.app_url;
                        liulian_info.wechat = e.data.wechat;
                        liulian_info.wechat_qrcode = e.data.wechat_qrcode;
                        liulian_info.sign = e.data.sign;
                        obj.callFunc && obj.callFunc(liulian_info);
                        obj.callFunc = null;
                    }
                    else if (e.origin == "https://www.4ry.cn" && e.data.msg == "receive_success") {
                        //确认外层收到登陆请求，关闭定时器
                        clearInterval(login_timer);
                    }
                }, false);
                is_Login_Listener_exist = false;
            }

            return liulian;
        };

        liulian.reportUserInfo = function (obj) {
            if (!obj) {
                console.error('请传递用户信息参数');
                return false;
            }
            else if (obj.constructor !== Object) {
                console.error('输入参数必须为对象');
                return false;
            }
            if (this.from_os === 'android') {
                this.reportUserInfoAndroid(obj);
            }
            else if (this.from_os === 'ios') {
                this.reportUserInfoIos(obj);
            }
            else {
                this.reportUserInfoWeb(obj);
            }
        };

        liulian.reportUserInfoAndroid = function (obj) {
            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    if (obj[p] === undefined || obj[p] === null) {
                        obj[p] = '';
                    }
                }
            }
            TTWAndroidCallBack.submitExtendData(
                obj.dataType, obj.serverID, obj.serverName, obj.roleName, obj.roleLevel, obj.roleID, obj.moneyNum, obj.roleCreateTime, obj.guildId, obj.guildName, obj.guildLevel, obj.guildLeader, obj.power, obj.professionid, obj.profession, obj.gender, obj.professionroleid, obj.professionrolename, obj.vip, obj.guildroleid, obj.guildrolename
            );
        };

        liulian.reportUserInfoIos = function (obj) {
            this.reportUserInfoWeb(obj);
        };

        liulian.reportUserInfoWeb = function (obj) {
            var queryArr = [];
            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    queryArr.push(p + '=' + obj[p]);
                }
            }

            var protocal = window.location.protocol;
            var query = queryArr.join('&');
            var baseUrl = protocal + '//www.4ry.cn/member/getUserInfo';
            var url = baseUrl + '?' + query;
            var img = new Image();
            img.src = url;
        };

        liulian.pay_web = function (obj) {

            console.log(obj);
			console.log(9999999999999)
            window.parent.postMessage({
                type        : 'cp_pay',
                game_id     : obj.game_id,                           // 游戏ID
                server_id   : obj.server_id,                           // 游戏服ID
                server_name : obj.server_name,                           // 游戏服ID
                uid         : obj.uid,                           //  平台ID
                user_name   : obj.user_name,                           //  平台ID
                role_name   : obj.role_name,                          // 游戏角色名
                money       : obj.money,                           // 充值金额
                game_gold   : obj.game_gold,                        // 充值游戏币
                role_id     : obj.role_id,
                product_name: obj.product_name,
                vip         : obj.vip,
                role_level  : obj.role_level,
                ext         : obj.ext                           // 游戏方订单ID
            }, "*");

            var pay_msg = "";
            if (is_pay_Listener_exist) {
                window.addEventListener('message', function (e) {
                    if ((e.origin == "https://www.4ry.cn") && e.data.msg == "pay_callback") {
                        console.log("内嵌回调成功" + e.data.msg + " " + e.data.status);
                        switch (e.data.status) {
                            case 'success':
                                pay_msg = "支付成功";
                                break;
                            case 'fail':
                                pay_msg = "支付失败";
                                break;
                            case 'cancel':
                                pay_msg = "支付取消";
                                break;
                        }
                        obj.callFunc && obj.callFunc(e.data.status, pay_msg);
                    }
                }, false);
                is_pay_Listener_exist = false;
            }
            return liulian;
        };

        liulian.pay_android = function (obj) {

            for (var i in obj) {
                if (typeof obj[i] == undefined) obj[i] = '';
                obj[i] = obj[i] + '';
            }
            TTWAndroidCallBack.pay(obj.buyNum, obj.coin, obj.ext, obj.money, obj.product_id, obj.product_name, obj.product_desc, obj.role_id, obj.role_level, obj.role_name, obj.server_id, obj.server_name, obj.vip);
        };

        liulian.pay_ios = function (obj) {
            window.webkit.messageHandlers.iOSCallBack.postMessage({
                IMoney      : parseInt(obj.money),
                iServerId   : obj.server_id,
                strExtraInfo: obj.ext,
                strRoleName : obj.role_name,
                productId   : obj.product_id
            });
        };

        liulian.get_os = function () {
            if (this.from_os == 'android') {
                return 'android';
            }else if (this.from_os == 'ios') {
                return 'ios';
            } else {
                return 'web';
            }
        };

        liulian.pay = function (obj) {
            console.log(obj);
            console.log(this.from_os);
            if (this.from_os == 'android') {
                this.pay_android(obj);
            } else if (this.from_os == 'ios') {
                this.pay_ios(obj);
                // this.pay_web(obj);
            } else {
                this.pay_web(obj);
            }

        };

        liulian.change_share_info = function (obj) {
            //通知外面iframe
            window.parent.postMessage({
                "type"      : "change_share_info",
                "title"     : obj.title,
                "summary"   : obj.summary,
                "img_url"   : obj.img_url,
                "channel"   : obj.channel,
                "show_share": obj.show_share
            }, "*");
            //接收外层iframe返回的用户信息
            if (is_share_Listener_exist) {
                window.addEventListener('message', function (e) {
                    if (e.origin == "https://www.4ry.cn" && e.data.msg == "change_share_info_success") {
                        obj.callFunc && obj.callFunc("success");
                    }
                    ;
                    if (e.origin == "https://www.4ry.cn" && e.data.msg == "change_share_info_cancel") {
                        obj.callFunc && obj.callFunc("cancel");
                    }
                    ;
                }, false);
                is_share_Listener_exist = false;
            }

            return liulian;
        };

        liulian.change_title = function (obj) {
            //通知外面iframe
            window.parent.postMessage({
                "type" : "change_title",
                "title": obj.title,
            }, "*");
            //接收外层iframe返回的用户信息
            if (is_title_Listener_exist) {
                window.addEventListener('message', function (e) {
                    if (e.origin == "https://www.4ry.cn" && e.data.msg == "change_title_success") {
                        obj.callFunc && obj.callFunc("success");
                    }
                    ;
                }, false);
                is_title_Listener_exist = false;
            }

            return liulian;
        };

        liulian.login = function (obj) {
            if (this.from_os == 'android') {
                TTWAndroidCallBack.login();
            }else if (this.from_os == 'ios') {
                window.webkit.messageHandlers.iOSLogin.postMessage({});
            } else {
                return 'web';
            }_
        };

        liulian.logout = function (obj) {
            if (this.from_os == 'android') {
                TTWAndroidCallBack.logout();
            }else if (this.from_os == 'ios') {
                window.webkit.messageHandlers.iOSLogout.postMessage({});
            } else {
                return 'web';
            }
        };

        liulian.download_update = function (obj) {
            TTWAndroidCallBack.dl_update(obj.update_url);
        }

        return liulian;
    },

    chkFrom: function () {
        if (typeof TTWAndroidCallBack == 'object') {
            return 'android';
        } else if (typeof window.webkit != 'undefined' && typeof window.webkit.messageHandlers.iOSCallBack == 'object') {
            return 'ios';
        } else {
            return 'web';
        }

    }


};
var liuliansdk_game_id = '';
var liuliansdk_server_id = '';
var liuliansdk_from = '';

var liuSDK = Liulian.create();


function is_weixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

function getRootPath() {
    var curWwwPath = window.document.location.href;
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.lastIndexOf('/');
    var localhostPaht = curWwwPath.substring(0, pos) + '/';
    return (localhostPaht);
}

