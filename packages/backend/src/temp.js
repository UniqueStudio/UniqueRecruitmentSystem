// !function () {
//     setTimeout(function (c) {
//         $.ajax({
//             type: "GET",
//             url: "/wwopen/sso/l/qrConnect?key=" + window.settings.key + (c ? "&lastStatus=" + c : ""),
//             dataType: "jsonp",
//             jsonpCallback: "jsonpCallback",
//             cache: false,
//             timeout: 60000,
//             success: function (c) {
//                 var e = c.status;
//                 c.auth_code;
//                 switch (e) {
//                     case"QRCODE_SCAN_SUCC":
//                         var f = window.settings.redirect_uri;
//                         if (f = f.replace(/&amp;/g, "&"), f += (f.indexOf("?") > -1 ? "&" : "?") + ("1" === window.settings.code_type ? "auth_code=" : "code=") + c.auth_code + "&state=" + window.settings.state + "&appid=" + window.settings.appid,
//                             b) try {
//                             document.domain = "qq.com";
//                             var g = window.top.location.host.toLowerCase();
//                             g && (window.location = f)
//                         } catch (h) {
//                             window.settings.crossorgin && window.parent && window.parent.postMessage ? window.parent.postMessage(f, "*") : window.top.location = f
//                         } else window.location = f;
//                         break;
//                     case"QRCODE_SCAN_ING":
//                         $(".js_status").hide(), $("#wx_after_scan").show(), setTimeout(function () {
//                             a(e, "QRCODE_SCAN_ING")
//                         }, 2e3);
//                         break;
//                     case"QRCODE_SCAN_FAIL":
//                         $(".js_status").hide(), $("#wx_after_cancel").show(), setTimeout(function () {
//                             a(e, "QRCODE_SCAN_FAIL");
//                         }, 2e3);
//                         break;
//                     case"QRCODE_SCAN_ERR":
//                         $("#wx_timeout_tips").show();
//                         break;
//                     case"QRCODE_SCAN_NEVER":
//                         setTimeout(a, 2e3)
//                 }
//             }
//         })
//     }, 2000)
// }();