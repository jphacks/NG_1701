/************************************************************/
/****** 全体で使用するキーやURLなど ******/
// Botのアクセストークン
var CHANNEL_ACCESS_TOKEN = 'R9CmCCDP8Bsmcvx3GIydfy1QGi43IrTbS8Y7SNvnWSTzDiiiJm+qmT+0GHk4hb4TQHuo1+2tDepoEDYtD2ExaAlTLSF024wA6iPABEFMDdmParZYsx9Wa7cXr/y81CL8cnprVdtgm6sdKEZXhbYQcwdB04t89/1O/w1cDnyilFU=';
// BotのuserId
//var USER_ID = 'Uc5376a7a0a6a3ed5c8a6d6baf73220c7'
// データを扱うスプレッドシートID
var SPREAD_SHEET_ID = '1eupv9M-SYSpra3_HNPE108fTdL1WcjmXGs2RhiA5dqA';
/************************************************************/


/************************************************************/
/* 実行関数群 */
function doPost(e) {
    var events = JSON.parse(e.postData.contents).events;
    events.forEach(function (event) {
        if (event.type == "message") {
            var init = new Init(event);
            //init.StartSetting(event);

        } else if (event.type == "follow") {
            var init = new Init(event);
            //init.StartSetting(event);
        }
    });
}

/************************************************************/