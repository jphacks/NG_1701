//this.<クラス内メンバ・メソッド>=(いろいろ)

var Init = function (e) {
    this.userId = e.source.userId;
    this.database = new Database();
    if (e.type == "follow") {
        if (this.database.AddUser(this.userId)) {
            this.database.SetValue(this.userId, "flag", "Init");
            this.StartSetting(e);
        }
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
                "text": "性別を選択してください"
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
                this.database.SetValue(this.userId, "gender", "men");
                break;
            case "おんな":
                this.database.SetValue(this.userId, "gender", "women");
                break;
            default:
                this.database.SetValue(this.userId, "gender", "");
                this.StartSetting(e);
                return;
                break;
        }

        this.LocationSetting(e);

    } else if (String(this.database.GetValue(this.userId, "location")).length != 4) {
        this.LocationSetting(e);
    } else if (this.database.GetValue(this.userId, "time") == "") {
        this.TimeSetting(e);
    }
};

Init.prototype.LocationSetting = function (e) {
    var locationId = String(this.database.GetValue(this.userId, "location"));
    switch (locationId.length) {
        case 0:
            switch (e.message.text) {
                case "本州":
                    this.database.SetValue(this.userId, "location", 1);
                    this.LocationSetting(e);
                    return;
                    break;
                case "四国":
                    this.database.SetValue(this.userId, "location", 2);
                    this.LocationSetting(e);
                    return;
                    break;
                default:
                    var postData = {
                        "replyToken": e.replyToken,
                        "messages": [
                            {
                                "type": "text",
                                "text": "地域を選択してください"
                            },
                            {
                                "type": "imagemap",
                                "baseUrl": "https://dl.dropboxusercontent.com/s/y9fn50dbbqhe3mw/japan.jpg",
                                "altText": "地域を選択してください",
                                "baseSize": {
                                    "width": 1040,
                                    "height": 1040
                                },
                                "actions": [
                                    {
                                        "type": "message",
                                        "text": "北海道",
                                        "area": {
                                            "x": 662,
                                            "y": 34,
                                            "width": 327,
                                            "height": 295
                                        }
                            },
                                    {
                                        "type": "message",
                                        "text": "本州",
                                        "area": {
                                            "x": 696,
                                            "y": 357,
                                            "width": 261,
                                            "height": 423
                                        }
                            },
                                    {
                                        "type": "message",
                                        "text": "本州",
                                        "area": {
                                            "x": 333,
                                            "y": 553,
                                            "width": 625,
                                            "height": 227
                                        }
                            },
                                    {
                                        "type": "message",
                                        "text": "四国",
                                        "area": {
                                            "x": 333,
                                            "y": 808,
                                            "width": 305,
                                            "height": 197
                                        }
                            },
                                    {
                                        "type": "message",
                                        "text": "九州・沖縄",
                                        "area": {
                                            "x": 50,
                                            "y": 686,
                                            "width": 254,
                                            "height": 320
                                        }
                            }
                        ]
                    }
                ]
                    }


                    var options = {
                        "method": "post",
                        "headers": {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
                        },
                        "payload": JSON.stringify(postData)
                    };

                    UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
                    return;
                    break;
            }
            return;
            break;
        case 1:
            switch (e.message.text) {
                case "東海":
                    this.database.SetValue(this.userId, "location", 13);
                    this.LocationSetting(e);
                    return;
                    break;
                case "香川":
                    this.database.SetValue(this.userId, "location", 2000);
                    this.LocationSetting(e);
                    return;
                    break;
                case "徳島":
                    this.database.SetValue(this.userId, "location", 2100);
                    this.LocationSetting(e);
                    return;
                    break;
                case "愛媛":
                    this.database.SetValue(this.userId, "location", 2200);
                    this.LocationSetting(e);
                    return;
                    break;
                case "高知":
                    this.database.SetValue(this.userId, "location", 2300);
                    this.LocationSetting(e);
                    return;
                    break;
                default:
                    switch (locationId.charAt(0)) {
                        case "1":
                            var postData = {
                                "replyToken": e.replyToken,
                                "messages": [
                                    {
                                        "type": "imagemap",
                                        "baseUrl": "https://dl.dropboxusercontent.com/s/uazmk9iigcxpwbm/honshu.jpg",
                                        "altText": "地域を選択してください",
                                        "baseSize": {
                                            "width": 1040,
                                            "height": 1040
                                        },
                                        "actions": [
                                            {
                                                "type": "message",
                                                "text": "東北",
                                                "area": {
                                                    "x": 767,
                                                    "y": 218,
                                                    "width": 250,
                                                    "height": 374
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "関東",
                                                "area": {
                                                    "x": 767,
                                                    "y": 608,
                                                    "width": 250,
                                                    "height": 215
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "北陸",
                                                "area": {
                                                    "x": 495,
                                                    "y": 431,
                                                    "width": 250,
                                                    "height": 161
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "東海",
                                                "area": {
                                                    "x": 495,
                                                    "y": 608,
                                                    "width": 250,
                                                    "height": 215
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "近畿",
                                                "area": {
                                                    "x": 295,
                                                    "y": 461,
                                                    "width": 179,
                                                    "height": 362
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "中国",
                                                "area": {
                                                    "x": 24,
                                                    "y": 461,
                                                    "width": 250,
                                                    "height": 181
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                            break;
                        case "2":
                            var postData = {
                                "replyToken": e.replyToken,
                                "messages": [
                                    {
                                        "type": "imagemap",
                                        "baseUrl": "https://dl.dropboxusercontent.com/s/bb7zjpwyi05i1t9/shikoku.jpg",
                                        "altText": "地域を選択してください",
                                        "baseSize": {
                                            "width": 1040,
                                            "height": 1040
                                        },
                                        "actions": [
                                            {
                                                "type": "message",
                                                "text": "香川",
                                                "area": {
                                                    "x": 595,
                                                    "y": 263,
                                                    "width": 424,
                                                    "height": 258
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "徳島",
                                                "area": {
                                                    "x": 595,
                                                    "y": 540,
                                                    "width": 424,
                                                    "height": 258
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "愛媛",
                                                "area": {
                                                    "x": 20,
                                                    "y": 388,
                                                    "width": 555,
                                                    "height": 258
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "高知",
                                                "area": {
                                                    "x": 20,
                                                    "y": 668,
                                                    "width": 555,
                                                    "height": 258
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                            break;
                    }

                    var options = {
                        "method": "post",
                        "headers": {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
                        },
                        "payload": JSON.stringify(postData)
                    };

                    UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
                    return;
                    break;
            }
            return;
            break;
        case 2:
            switch (e.message.text) {
                case "愛知":
                    this.database.SetValue(this.userId, "location", 130);
                    this.LocationSetting(e);
                    return;
                    break;
                default:
                    var postData = {
                        "replyToken": e.replyToken,
                        "messages": [
                            {
                                "type": "imagemap",
                                "baseUrl": "https://dl.dropboxusercontent.com/s/9lopof5cur1b17d/tokai.jpg",
                                "altText": "地域を選択してください",
                                "baseSize": {
                                    "width": 1040,
                                    "height": 1040
                                },
                                "actions": [
                                    {
                                        "type": "message",
                                        "text": "愛知",
                                        "area": {
                                            "x": 336,
                                            "y": 544,
                                            "width": 333,
                                            "height": 251
                                        }
                            },
                                    {
                                        "type": "message",
                                        "text": "岐阜",
                                        "area": {
                                            "x": 198,
                                            "y": 137,
                                            "width": 298,
                                            "height": 387
                                        }
                            },
                                    {
                                        "type": "message",
                                        "text": "三重",
                                        "area": {
                                            "x": 14,
                                            "y": 544,
                                            "width": 298,
                                            "height": 387
                                        }
                            },
                                    {
                                        "type": "message",
                                        "text": "静岡",
                                        "area": {
                                            "x": 691,
                                            "y": 544,
                                            "width": 333,
                                            "height": 251
                                        }
                            }
                        ]
                    }
                ]
                    }

                    var options = {
                        "method": "post",
                        "headers": {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
                        },
                        "payload": JSON.stringify(postData)
                    };

                    UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
                    return;
                    break;
            }
            return;
            break;
        case 3:
            switch (e.message.text) {
                case "名古屋市":
                    this.database.SetValue(this.userId, "location", 1301);
                    this.LocationSetting(e);
                    return;
                    break;
                case "尾張地方":
                    this.database.SetValue(this.userId, "location", 1300);
                    this.LocationSetting(e);
                    return;
                    break;
                case "知多":
                    this.database.SetValue(this.userId, "location", 1302);
                    this.LocationSetting(e);
                    return;
                    break;
                case "西三河":
                    this.database.SetValue(this.userId, "location", 1303);
                    this.LocationSetting(e);
                    return;
                    break;
                case "東三河":
                    this.database.SetValue(this.userId, "location", 1304);
                    this.LocationSetting(e);
                    return;
                    break;
                default:
                    var postData = {
                        "replyToken": e.replyToken,
                        "messages": [
                            {
                                "type": "imagemap",
                                "baseUrl": "https://dl.dropboxusercontent.com/s/aj9pm9jgnbcraa7/aichi.jpg",
                                "altText": "地域を選択してください",
                                "baseSize": {
                                    "width": 1040,
                                    "height": 1040
                                },
                                "actions": [
                                    {
                                        "type": "message",
                                        "text": "尾張地方",
                                        "area": {
                                            "x": 24,
                                            "y": 198,
                                            "width": 426,
                                            "height": 266
                                        }
                            },
                                    {
                                        "type": "message",
                                        "text": "名古屋市",
                                        "area": {
                                            "x": 186,
                                            "y": 477,
                                            "width": 266,
                                            "height": 266
                                        }
                            },
                                    {
                                        "type": "message",
                                        "text": "知多",
                                        "area": {
                                            "x": 186,
                                            "y": 755,
                                            "width": 266,
                                            "height": 266
                                        }
                            },
                                    {
                                        "type": "message",
                                        "text": "西三河",
                                        "area": {
                                            "x": 468,
                                            "y": 198,
                                            "width": 265,
                                            "height": 540
                                        }
                            },
                                    {
                                        "type": "message",
                                        "text": "東三河",
                                        "area": {
                                            "x": 751,
                                            "y": 198,
                                            "width": 266,
                                            "height": 817
                                        }
                            }
                        ]
                    }
                ]
                    }

                    var options = {
                        "method": "post",
                        "headers": {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
                        },
                        "payload": JSON.stringify(postData)
                    };

                    UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
                    return;
                    break;
            }
            return;
            break;
        case 4:
            this.TimeSetting(e);
            break;
        default:
            this.database.SetValue(this.userId, "gender", "");
            this.StartSetting(e);
            return;
            break;
    }

    //this.FinishSetting(e);

};

Init.prototype.TimeSetting = function (e) {
    if (e.message.text.match(/^\d{1,2}:00$/) && Number(e.message.text.slice(0, -3)) <= 23) {
        this.database.SetValue(this.userId, "time", Number(e.message.text.slice(0, -3)));
        this.FinishSetting(e);
    } else {
        var postData = {
            "replyToken": e.replyToken,
            "messages": [
                {
                    "type": "text",
                    "text": "通知してほしい時間を選択してください"
            },
                {
                    "type": "imagemap",
                    "baseUrl": "https://dl.dropboxusercontent.com/s/rhsm7w5tler9i3o/time.jpg",
                    "altText": "時間を選択してください",
                    "baseSize": {
                        "width": 1040,
                        "height": 1040
                    },
                    "actions": [
                        {
                            "type": "message",
                            "text": "6:00",
                            "area": {
                                "x": 34,
                                "y": 28,
                                "width": 975,
                                "height": 218
                            }
                    },
                        {
                            "type": "message",
                            "text": "7:00",
                            "area": {
                                "x": 34,
                                "y": 284,
                                "width": 975,
                                "height": 218
                            }
                    },
                        {
                            "type": "message",
                            "text": "8:00",
                            "area": {
                                "x": 34,
                                "y": 538,
                                "width": 975,
                                "height": 218
                            }
                    },
                        {
                            "type": "message",
                            "text": "9:00",
                            "area": {
                                "x": 34,
                                "y": 793,
                                "width": 975,
                                "height": 218
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
    }
}

Init.prototype.FinishSetting = function (e) {
    this.database.SetValue(this.userId, "flag", "");

    var postData = {
        "replyToken": e.replyToken,
        "messages": [
            {
                "type": "text",
                "text": "設定完了！"
            },
            {
                "type": "text",
                "text": e.message.text.slice(0, -3) + "時に通知が届きます"
            },
            {
                "type": "text",
                "text": "お楽しみに！"
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
