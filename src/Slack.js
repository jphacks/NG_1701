function testSlack(text) {
    var token = "xoxp-255097650355-255228759108-261242846418-7b53675f21b4c7e330236455f6514290";
    var channel = "#qroon-test";
    var username = "TriggerTest";

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
    testSlack("hello slack");
}
