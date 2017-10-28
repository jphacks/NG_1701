function SlackLog(text) {
    var token = "xoxp-255097650355-255228759108-261242846418-7b53675f21b4c7e330236455f6514290";
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
