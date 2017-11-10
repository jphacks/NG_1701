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
    this.Setting(e);
};

Init.prototype.Setting = function (e) {
    if (this.database.GetValue(this.userId, "gender") == "") {
        this.GenderSetting(e);
    } else if (String(this.database.GetValue(this.userId, "location")).length != 4) {
        this.LocationSetting(e);
    } else if (this.database.GetValue(this.userId, "time") == "") {
        this.TimeSetting(e);
    } else {
        this.FinishSetting(e);
    }
};

Init.prototype.ShowSetting = function (e) {
    var gender = this.database.GetValue(this.userId, "gender");
    var location = this.database.GetValue(this.userId, "location");
    var time = this.database.GetValue(this.userId, "time");
    var postData = {
        "replyToken": e.replyToken,
        "messages": [
            {
                "type": "text",
                "text": "【現在の設定】\n" +
                    "性別 : " + (gender == "men" ? "男性 " : "女性 ") + "\n" +
                    "地域 : " + GetLocationJapaneseName(location) + "\n" +
                    "設定時間 : " + time + "時"
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
    return;
}

Init.prototype.GenderSetting = function (e) {
    if (e.type == "follow") {
        var gpostData = {
            "replyToken": e.replyToken,
            "messages": [
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


        var goptions = {
            "method": "post",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
            },
            "payload": JSON.stringify(gpostData)
        };

        UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", goptions);
        return;
    }
    switch (e.message.text) {
        case "おとこ":
            this.database.SetValue(this.userId, "gender", "men");
            this.Setting(e);
            break;
        case "おんな":
            this.database.SetValue(this.userId, "gender", "women");
            this.Setting(e);
            break;
        default:
            var postData = {
                "replyToken": e.replyToken,
                "messages": [
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
            return;
            break;
    }
}

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
                case "北海道":
                    this.database.SetValue(this.userId, "location", "0000");
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
                case "関東":
                    this.database.SetValue(this.userId, "location", 11);
                    this.LocationSetting(e);
                    return;
                    break;
                case "近畿":
                    this.database.SetValue(this.userId, "location", 14);
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
                case "岐阜":
                    this.database.SetValue(this.userId, "location", 1310);
                    this.LocationSetting(e);
                    return;
                    break;
                case "三重":
                    this.database.SetValue(this.userId, "location", 1320);
                    this.LocationSetting(e);
                    return;
                    break;
                case "静岡":
                    this.database.SetValue(this.userId, "location", 1330);
                    this.LocationSetting(e);
                    return;
                    break;
                case "群馬":
                    this.database.SetValue(this.userId, "location", 1100);
                    this.LocationSetting(e);
                    return;
                    break;
                case "栃木":
                    this.database.SetValue(this.userId, "location", 1110);
                    this.LocationSetting(e);
                    return;
                    break;
                case "埼玉":
                    this.database.SetValue(this.userId, "location", 1120);
                    this.LocationSetting(e);
                    return;
                    break;
                case "東京":
                    this.database.SetValue(this.userId, "location", 1130);
                    this.LocationSetting(e);
                    return;
                    break;
                case "神奈川":
                    this.database.SetValue(this.userId, "location", 1140);
                    this.LocationSetting(e);
                    return;
                    break;
                case "千葉":
                    this.database.SetValue(this.userId, "location", 1150);
                    this.LocationSetting(e);
                    return;
                    break;
                case "茨城":
                    this.database.SetValue(this.userId, "location", 1160);
                    this.LocationSetting(e);
                    return;
                    break;
                case "兵庫":
                    this.database.SetValue(this.userId, "location", 1400);
                    this.LocationSetting(e);
                    return;
                    break;
                case "京都":
                    this.database.SetValue(this.userId, "location", 1410);
                    this.LocationSetting(e);
                    return;
                    break;
                case "滋賀":
                    this.database.SetValue(this.userId, "location", 1420);
                    this.LocationSetting(e);
                    return;
                    break;
                case "大阪":
                    this.database.SetValue(this.userId, "location", 1430);
                    this.LocationSetting(e);
                    return;
                    break;
                case "和歌山":
                    this.database.SetValue(this.userId, "location", 1440);
                    this.LocationSetting(e);
                    return;
                    break;
                case "奈良":
                    this.database.SetValue(this.userId, "location", 1450);
                    this.LocationSetting(e);
                    return;
                    break;
                case "三重":
                    this.database.SetValue(this.userId, "location", 1460);
                    this.LocationSetting(e);
                    return;
                    break;
                default:
                    switch (locationId.charAt(1)) {
                        case "1":
                            var postData = {
                                "replyToken": e.replyToken,
                                "messages": [
                                    {
                                        "type": "imagemap",
                                        "baseUrl": "https://dl.dropboxusercontent.com/s/ev1chgp819o3q27/kanto.jpg",
                                        "altText": "地域を選択してください",
                                        "baseSize": {
                                            "width": 1040,
                                            "height": 1040
                                        },
                                        "actions": [
                                            {
                                                "type": "message",
                                                "text": "群馬",
                                                "area": {
                                                    "x": 138,
                                                    "y": 319,
                                                    "width": 344,
                                                    "height": 169
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "栃木",
                                                "area": {
                                                    "x": 488,
                                                    "y": 240,
                                                    "width": 288,
                                                    "height": 248
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "埼玉",
                                                "area": {
                                                    "x": 265,
                                                    "y": 494,
                                                    "width": 344,
                                                    "height": 169
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "東京",
                                                "area": {
                                                    "x": 324,
                                                    "y": 669,
                                                    "width": 285,
                                                    "height": 111
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "神奈川",
                                                "area": {
                                                    "x": 324,
                                                    "y": 786,
                                                    "width": 285,
                                                    "height": 155
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "千葉",
                                                "area": {
                                                    "x": 615,
                                                    "y": 748,
                                                    "width": 181,
                                                    "height": 248
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "茨城",
                                                "area": {
                                                    "x": 615,
                                                    "y": 494,
                                                    "width": 288,
                                                    "height": 248
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                            break;
                        case "3":
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
                            break;
                        case "4":
                            var postData = {
                                "replyToken": e.replyToken,
                                "messages": [
                                    {
                                        "type": "imagemap",
                                        "baseUrl": "https://dl.dropboxusercontent.com/s/bthztl83glo39a8/kinki.jpg",
                                        "altText": "地域を選択してください",
                                        "baseSize": {
                                            "width": 1040,
                                            "height": 1040
                                        },
                                        "actions": [
                                            {
                                                "type": "message",
                                                "text": "兵庫",
                                                "area": {
                                                    "x": 179,
                                                    "y": 257,
                                                    "width": 241,
                                                    "height": 305
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "京都",
                                                "area": {
                                                    "x": 427,
                                                    "y": 258,
                                                    "width": 223,
                                                    "height": 305
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "滋賀",
                                                "area": {
                                                    "x": 657,
                                                    "y": 259,
                                                    "width": 189,
                                                    "height": 230
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "大阪",
                                                "area": {
                                                    "x": 357,
                                                    "y": 568,
                                                    "width": 178,
                                                    "height": 224
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "和歌山",
                                                "area": {
                                                    "x": 357,
                                                    "y": 799,
                                                    "width": 179,
                                                    "height": 217
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "奈良",
                                                "area": {
                                                    "x": 542,
                                                    "y": 568,
                                                    "width": 109,
                                                    "height": 295
                                                }
                                            },
                                            {
                                                "type": "message",
                                                "text": "三重",
                                                "area": {
                                                    "x": 657,
                                                    "y": 496,
                                                    "width": 189,
                                                    "height": 465
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
            this.Setting(e);
            break;
        default:
            this.database.SetValue(this.userId, "gender", "");
            this.StartSetting(e);
            return;
            break;
    }
};

Init.prototype.TimeSetting = function (e) {
    if (e.message.text.match(/^\d{1,2}:00$/) && Number(e.message.text.slice(0, -3)) <= 23) {
        this.database.SetValue(this.userId, "time", Number(e.message.text.slice(0, -3)));
        this.Setting(e);
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
    var postData;
    if (this.database.GetValue(this.userId, "flag") == "Setting") {
        postData = {
            "replyToken": e.replyToken,
            "messages": [
                {
                    "type": "text",
                    "text": "設定完了！"
                }
            ]
        };
    } else {
        postData = {
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
    this.database.SetValue(this.userId, "flag", "");
}
