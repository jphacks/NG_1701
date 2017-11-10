var Reply = function (e) {
    var database = new Database();
    if (database.GetValue(e.source.userId, "flag") == "Init") {
        var init = new Init(e);
        init.Setting(e);
    } else if (database.GetValue(e.source.userId, "flag") == "Setting") {
        var init = new Init(e);
        init.Setting(e);
    } else {
        switch (e.message.text) {
            case "性別の設定":
                database.SetValue(e.source.userId, "flag", "Setting");
                database.SetValue(e.source.userId, "gender", "");
                var init = new Init(e);
                init.GenderSetting(e);
                break;
            case "地域の設定":
                database.SetValue(e.source.userId, "flag", "Setting");
                database.SetValue(e.source.userId, "location", "");
                var init = new Init(e);
                init.LocationSetting(e);
                break;
            case "時間の設定":
                database.SetValue(e.source.userId, "flag", "Setting");
                database.SetValue(e.source.userId, "time", "");
                var init = new Init(e);
                init.TimeSetting(e);
                break;
            case "設定を確認":
                var init = new Init(e);
                init.ShowSetting(e);
                break;
            default:
                this.AutoMessage(e);
                break;
        }
    }
};

Reply.prototype.AutoMessage = function (e) {
    var postData = {
        "replyToken": e.replyToken,
        "messages": [
            {
                "type": "text",
                "text": "メッセージありがとうございます！\n" +
                    "申し訳ありませんが、個別の返信は不可能となっております。\n" +
                    "次の配信をお楽しみに♪"
            }
        ]
    };


    var options = {
        "method": "post",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
        },
        "payload": JSON.stringify(postData)
    };

    UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
}
