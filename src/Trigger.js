//トリガーのセット。いろいろ完成したらこれだけ毎日夜中に実行。自身をトリガー設定すること！
function setTrigger() {
    deleteTrigger();
    var userDatabase = new Database();
    var pushSheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheets()[1];
    pushSheet.clear();
    var timelist = [];
    var low = 2;
    while (userDatabase.GetValueByCell(low, 1) != "") {
        if (userDatabase.GetValueByCell(low, 2) != "") {
            low++;
            continue;
        }
        var userId = userDatabase.GetValueByCell(low, 1);
        var hour = userDatabase.GetValue(userId, "time");
        var timeLow = timelist.indexOf(hour);
        if (timeLow >= 0) {
            var timeCol = 2;
            while (pushSheet.getRange(timeLow + 1, timeCol).getValue() != "") {
                timeCol++;
            }
            pushSheet.getRange(timeLow + 1, timeCol).setValue(userId);
        } else if (timeLow == -1) {
            var index = 0;
            for (var i = 0; i < timelist.length; i++) {
                if (timelist[index] > hour) {
                    timelist.splice(index, 0, hour);
                    pushSheet.insertRowBefore(index + 1);
                    break;
                }
                index++;
            }
            if (timelist.indexOf(hour) == -1) {
                timelist.push(hour);
            }
            pushSheet.getRange(index + 1, 1).setValue(timelist[index]);
            pushSheet.getRange(index + 1, 2).setValue(userId);
        }
        low++;
    }

    var setTime = new Date();

    timelist.forEach(function (timenum) {
        var nowTime = new Date();
        if (nowTime.getHours() > timenum) {
            Logger.log("true");
            setTime.setDate(nowTime.getDate() + 1);
        }
        setTime.setHours(timenum);
        setTime.setMinutes(0);
        ScriptApp.newTrigger("PushByTime").timeBased().at(setTime).create();
    });
    ScriptApp.newTrigger("setTrigger").timeBased().atHour(0).everyDays(1).create();
}

//トリガーで実行される関数。
function PushByTime() {
    var pushSheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheets()[1];
    var col = 2;
    while (pushSheet.getRange(1, col).getValue() != "") {
        try {
            var userId = pushSheet.getRange(1, col).getValue();
            pushTriggerData(userId); //userIdを引数とする関数をここにセット
            col++;
            testSlack("Pushed! " + userId);
        } catch (e) {
            testSlack(e.message);
        }
    }
    pushSheet.deleteRow(1);
}

//テスト用関数。本番は削除予定。
function TestOfTriggerPush(userId) {
    var headers = {
        "Content-Type": "application/json; charset=UTF-8",
        'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    };
    var postData = {
        "to": userId,
        "messages": [
            {
                'type': 'text',
                'text': "時間やで",
                }
            ]
    };
    var options = {
        "method": "post",
        "headers": headers,
        "payload": JSON.stringify(postData)
    };
    UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", options);
}

//トリガーを全削除する関数
function deleteTrigger() {
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
        Logger.log(triggers[i].getUniqueId());
        ScriptApp.deleteTrigger(triggers[i]);
    }
}
