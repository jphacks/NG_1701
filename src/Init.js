//this.<クラス内メンバ・メソッド>=(いろいろ)

var Init = function (e) {
    this.userId = e.source.userId;
    this.database = new Database();
    if (e.type == "follow") {
        //if (this.database.AddUser(this.userId)) {
        this.database.SetValue(this.userId, "flag", "Init");
        this.StartSetting(e);
        //}
    }
};

//<クラス名>.prototype.<メソッド名>  = function(引数){中身};

//設定の始まり
Init.prototype.StartSetting = function (e) {
    //var e = this.event;
    var postData = {
        "replyToken": e.replyToken,
        "messages": [
            /*(this.database.GetValue(e.source.userId, "gender") == "不明") ? {
                "type": "text",
                "text": "画像をクリックしてください"
            } :*/
            {
                "type": "text",
                "text": "服装を提案するために初期設定をします"
            },
            {
                "type": "text",
                "text": "性別を教えてください"
            },
            {
                "type": "imagemap",
                "baseUrl": "https://dl.dropboxusercontent.com/s/44q04ftlnbg5q09/gender.jpg",
                "altText": "性別を選択してください",
                "baseSize": {
                    "width": 1040,
                    "height": 520
                },
                "actions": [
                    {
                        "type": "message",
                        "text": "おとこ",
                        "area": {
                            "x": 0,
                            "y": 0,
                            "width": 520,
                            "height": 520
                        }
                    },
                    {
                        "type": "message",
                        "text": "おんな",
                        "area": {
                            "x": 520,
                            "y": 0,
                            "width": 520,
                            "height": 520
                        }
                    }
                ]
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
};

Init.prototype.Setting = function (e) {
    if (this.database.GetValue(this.userId, "gender") == "") {
        switch (e.message.text) {
        case "おとこ":
            this.database.SetValue(this.userId, "gender", "男");
            break;
        case "おんな":
            this.database.SetValue(this.userId, "gender", "女");
            break;
        default:
            this.database.SetValue(this.userId, "gender", "");
            this.StartSetting(e);
            return;
            break;
        }

        //this.LocationSetting(e);

        this.FinishSetting(e);

        /*} else if (this.database.GetValue(this.userId, "location").length != 5) {
            this.LocationSetting(e);*/
    }
};

Init.prototype.LocationSetting = function (e) {
    if (this.database.GetValue(this.userId, "location") == "") {
        switch (e.message.text) {
        case "おとこ":
            this.database.SetValue(this.userId, "gender", "男");
            break;
        case "おんな":
            this.database.SetValue(this.userId, "gender", "女");
            break;
        default:
            this.database.SetValue(this.userId, "gender", "");
            this.StartSetting(e);
            return;
            break;
        }

        this.FinishSetting(e);

    }
};

Init.prototype.FinishSetting = function (e) {
    this.database.SetValue(this.userId, "flag", "");

    var postData = {
        "replyToken": e.replyToken,
        "messages": [
            {
                "type": "text",
                "text": "設定完了!"
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