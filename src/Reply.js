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
        }
    }
};
