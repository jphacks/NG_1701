//トリガーのセット。いろいろ完成したらこれだけ毎日夜中に実行。自身をトリガー設定すること！
function setTrigger() {
    deleteTrigger();
    var userDatabase = new Database();
    var pushSheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheets()[1];
    pushSheet.clear();
    var timelist = [];
    var userCount = [];
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
            userCount[timeLow]++;
        } else if (timeLow == -1) {
            var index = 0;
            for (var i = 0; i < timelist.length; i++) {
                if (timelist[index] > hour) {
                    timelist.splice(index, 0, hour);
                    userCount.splice(index, 0, 1);
                    pushSheet.insertRowBefore(index + 1);
                    break;
                }
                index++;
            }
            if (timelist.indexOf(hour) == -1) {
                timelist.push(hour);
                userCount.push(1);
            }
            pushSheet.getRange(index + 1, 1).setValue(timelist[index]);
            pushSheet.getRange(index + 1, 2).setValue(userId);
        }
        low++;
    }

    var setTime = new Date();

    var timenum = timelist[0];
    var nowTime = new Date();
    if (nowTime.getHours() > timenum) {
        Logger.log("true");
        setTime.setDate(nowTime.getDate() + 1);
    }
    setTime.setHours(timenum);
    setTime.setMinutes(0);
    var users = userCount[0];
    for (var i = 0; i < users; i++) {
        ScriptApp.newTrigger("PushByTime").timeBased().at(setTime).create();
    }
    ScriptApp.newTrigger("setTrigger").timeBased().atHour(0).everyDays(1).create();
    CacheService.getScriptCache().put("userId-num", "1");
    SlackLog("Finish Setting Trigger");
}

//トリガーで実行される関数。
function PushByTime() {
    var userNum = Number(CacheService.getScriptCache().get("userId-num"));
    if (userNum <= 0) {
        userNum = 1;
    }
    CacheService.getScriptCache().put("userId-num", String(userNum + 1));
    SlackLog("Trigger Start : " + userNum);
    var pushSheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheets()[1];
    var userId = pushSheet.getRange(1, userNum + 1).getValue();
    while (true) {
        try {
            pushTriggerData(userId); //userIdを引数とする関数をここにセット
            SlackLog("Pushed : " + userId);
            break;
        } catch (e) {
            SlackLog(e.message);
        }
    }
    if (pushSheet.getRange(1, userNum + 2).getValue() == "") {
        pushSheet.deleteRow(1);
        deleteTrigger();
        var vals = pushSheet.getRange("1:1").getValues();
        if (vals[0][1] != "") {
            var userCount = 0;
            var timenum = Number(vals[0][0]);
            for (var i = 1; i < vals[0].length; i++) {
                if (vals[0][i] == "") {
                    break;
                }
                userCount++;
            }
            var setTime = new Date();

            var nowTime = new Date();
            if (nowTime.getHours() > timenum) {
                setTime.setDate(nowTime.getDate() + 1);
            }
            setTime.setHours(timenum);
            setTime.setMinutes(0);
            for (var i = 0; i < userCount; i++) {
                ScriptApp.newTrigger("PushByTime").timeBased().at(setTime).create();
            }
        }
        CacheService.getScriptCache().put("userId-num", "1");
        ScriptApp.newTrigger("setTrigger").timeBased().atHour(0).everyDays(1).create();
        SlackLog("Finished!!");
    }
}

function testPushOfTrigger() {
    SlackLog("Trigger Start");
    var pushSheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheets()[1];
    var userId = pushSheet.getRange(1, 1).getValue();
    while (true) {
        try {
            pushTriggerData(userId); //userIdを引数とする関数をここにセット
            SlackLog("Pushed : " + userId);
            break;
        } catch (e) {
            SlackLog(e.message);
        }
    }
    SlackLog("Finished!!");
}

function testStartTrigger() {
    CacheService.getScriptCache().put("userId-num", "1");
    var date = new Date();
    for (var i = 0; i < 16; i++) {
        ScriptApp.newTrigger("PushByTime").timeBased().at(date).create();
    }
}

//トリガーを全削除する関数
function deleteTrigger() {
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
        Logger.log(triggers[i].getUniqueId());
        ScriptApp.deleteTrigger(triggers[i]);
    }
}
