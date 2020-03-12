



//iframe设定宽度和高度（resize后）
window.addEventListener('resize', function () {
    h5_screen_orientation();
	console.log(11)
	
}, false);
window.addEventListener('orientationchange', function () {
    var orientation = window.orientation;
	console.log(22)
    if (orientation == 90 || orientation == -90) {

        // $(".h5-loading-cover").hide();
        // sdk_turn_width();
        if (browser.versions.ios && browser.versions.ios9) {
            h5_screen_orientation();
        }
    } else {
        // sdk_turn_height();
        if (browser.versions.ios && browser.versions.ios9) {
            h5_screen_orientation_for_iOS9Bug();
        }
    }
}, false);

  










//根据屏幕宽和高 决定是否显示”旋转示意图“ 并 改变分享栏style
function h5_screen_orientation() {
    var m_h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var m_w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    $("#h5-game-iframe").css("height", m_h);
	console.log(m_h)
    $("#h5-game-iframe").css("width", m_w);
}
//
function h5_screen_orientation_for_iOS9Bug() {
    if (qww_gameIframe_h && qww_gameIframe_w) {
        if (qww_gameIframe_orientation == "portrait") {
            $("#h5-game-iframe").css("height", qww_gameIframe_h);
            $("#h5-game-iframe").css("width", qww_gameIframe_w);
        } else if (qww_gameIframe_orientation == "landscape") {
            $("#h5-game-iframe").css("height", qww_gameIframe_w);
            $("#h5-game-iframe").css("width", qww_gameIframe_h);
        }
    }
}


