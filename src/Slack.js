function SlackLog(text) {
    var slackSheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheets()[3];
    var token = slackSheet.getRange(1, 2).getValue();
    var channel = "#jphacks_slacklog";
    var username = "SLACK_LOG_BOT";

    var postData = {
        "channel": channel,
        "text": text,
        "username": username
    };
    var options = {
        "method": "post",
        "payload": postData
    };
    UrlFetchApp.fetch("https://slack.com/api/chat.postMessage?token=" + token, options);
}

function SlackChon() {
    SlackLog("hello slack");
}
