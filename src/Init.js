//this.<クラス内メンバ・メソッド>=(いろいろ)

var Init = function (e) {
    this.userId = e.source.userId;
    this.database = new Database();
    if (this.database.AddUser(this.userId)) {
        this.StartSetting(e);
    }
};

//<クラス名>.prototype.<メソッド名>  = function(引数){中身};
Init.prototype.StartSetting = function (e) {
    //var e = this.event;
    var postData = {
        "replyToken": e.replyToken,
        "messages": [
            {
                "type": "text",
                "text": "服装提案するで～"
            },
            {
                "type": "template",
                "altText": "性別をおしえるんやで",
                "template": {
                    "type": "buttons",
                    "title": "性別",
                    "text": "性別なんなん",
                    "actions": [
                        {
                            "type": "message",
                            "label": "男や",
                            //"data": "q=gender&item=male",
                            "text": "漢やで!"
                        },
                        {
                            "type": "message",
                            "label": "女や",
                            //"data": "q=gender&item=female",
                            "text": "乙女やで..."
                        },
                        {
                            "type": "message",
                            "label": "教えてたまるか",
                            //"data": "q=gender&item=secret",
                            "text": "ひ・み・つ"
                        }
                    ]
                }
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