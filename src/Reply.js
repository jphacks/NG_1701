var Reply = function (e) {
    var database = new Database();
    if (database.GetValue(e.source.userId, "flag") == "Init") {
        var init = new Init(e);
        init.Setting(e);
    }
};