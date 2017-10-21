var Database = function () {
    this.sheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getActiveSheet();
};

//userの追加
Database.prototype.AddUser = function (userId) {
    var row = 2;
    while ((var value = this.GetValueByCell(row, 1)) != "") {
        if (value == userId) {
            return false;
        }
        row++;
    }
    this.SetValueByCell(row, 1, userId);
    return true;
}

//キーを追加
Database.prototype.AddKey = function (keyname) {

}

//userIdとキーを指定して値を入れる
Database.prototype.SetValue = function (userId, key, value) {

};

//userIdとキーを指定して値を得る
Database.prototype.GetValue = function (userId, key) {

};

Database.prototype.SetValueByCell = function (row, col, value) {
    return this.sheet.GetRange(row, col).setValue(value);
}

//行と列を指定してデータを得る
Database.prototype.GetValueByCell = function (row, col) {
    return this.sheet.GetRange(row, col).getValue();
}