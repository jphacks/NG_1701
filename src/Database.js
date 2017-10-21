var Database = function () {
    this.sheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getActiveSheet();
    //var c = this.GetValueByCell(1, 1);
};

//userの追加
Database.prototype.AddUser = function (userId) {
    var row = 2;
    while (this.GetValueByCell(row, 1) != "") {
        if (this.GetValueByCell(row, 1) == userId) {
            return false;
        }
        row++;
    }
    this.SetValueByCell(row, 1, userId);
    return true;
}

//キーを追加
Database.prototype.AddKey = function (keyname) {
    var col = 1;
    while (this.GetValueByCell(1, col) != "") {
        col++;
    }
    this.SetValueByCell(1, col, keyname);
}

//userIdとキーを指定して値を入れる
Database.prototype.SetValue = function (userId, key, value) {
    var col = 1;
    while (this.GetValueByCell(1, col) != "") {
        if (this.GetValueByCell(1, col) == key) {
            break;
        }
        col++;
    }

    var row = 1;
    while (this.GetValueByCell(row, 1) != "") {
        if (this.GetValueByCell(row, 1) == userId) {
            break;
        }
        row++;
    }

    this.SetValueByCell(row, col, value);
};

//userIdとキーを指定して値を得る
Database.prototype.GetValue = function (userId, key) {
    var col = 1;
    while (this.GetValueByCell(1, col) != "") {
        if (this.GetValueByCell(1, col) == key) {
            break;
        }
        col++;
    }

    var row = 2;
    while (this.GetValueByCell(row, 1) != "") {
        if (this.GetValueByCell(row, 1) == userId) {
            break;
        }
        row++;
    }

    return this.GetValueByCell(row, col);
};

//行と列を指定してデータを得る
Database.prototype.SetValueByCell = function (row, col, value) {
    this.sheet.getRange(row, col).setValue(value);
}

//行と列を指定してデータを得る
Database.prototype.GetValueByCell = function (row, col) {
    return this.sheet.getRange(row, col).getValue();
}