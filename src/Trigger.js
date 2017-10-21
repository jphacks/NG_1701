function setTrigger() {
    deleteTrigger();
    var userDatabase = new Database();
    var pushSheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheets()[1];
    var timelist = [];
    var low = 2;
    while (userDatabase.GetValueByCell(low, 1) != "") {
        var userId = userDatabase.GetValueByCell(low, 1);
        var timeLow = timelist.indexOf(userDatabase.GetValue(userId, "time"));
        if (timeLow >= 0) {
            var timeCol = 2;
            while (pushSheet.getRange(timeLow + 1, timeCol).getValue() != "") {
                timeCol++;
            }
            pushSheet.getRange(timeLow + 1, timeCol).setValue(userId);
        } else if (timeLow == -1) {
            timelist.push(userDatabase.GetValue(userId, "time"));
            pushSheet.getRange(timelist.length, 1).setValue(timelist[timelist.length - 1]);
            pushSheet.getRange(timelist.length, 2).setValue(userId);
        }
        low++;
    }

    timelist.forEach(function (timenum) {
        ScriptApp.newTrigger("PushByTime").timeBased().atHour(timenum).everyDays(1).create();
    });
}

function PushByTime() {
    var pushSheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheets()[1];
    var col = 2;
    var headers = {
        "Content-Type": "application/json; charset=UTF-8",
        'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    };
    while (pushSheet.getRange(1, col).getValue() != "") {
        var userId = pushSheet.getRange(1, col).getValue();
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
        col++;
    }
    pushSheet.deleteRow(1);
}

function deleteTrigger() {
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
        Logger.log(triggers[i].getUniqueId());
        ScriptApp.deleteTrigger(triggers[i]);
    }
}