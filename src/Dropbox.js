var Dropbox = function (imgPath) {
    this.url = "https://api.dropboxapi.com/2/files/save_url";
    this.SharedUrl = "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings";
    this.token = 'jMtLFKY2xVAAAAAAAAAAG2VMPYdBoYJBh-B5MGwQtiuJTu1xP08DK1-5n14waUS1';
    this.imgPath = imgPath;
    //this.imgTitle = this.imgPath.substring(this.imgPath.lastIndexOf("/"));
    this.filename = "test.jpg";
    this.file;

    //  this.url2 = "https://content.dropboxapi.com/2/files/upload_session/finish";
};

function test_chon() {
    var dropbox = [new Dropbox("http://cdn.wimg.jp/coordinate/yxxlxo/20170930132439595/20170930132439595_500.jpg"), new Dropbox("http://cdn.wimg.jp/coordinate/yxxlxo/20170930132439595/20170930132439595_500.jpg"), new Dropbox("http://cdn.wimg.jp/coordinate/yxxlxo/20170930132439595/20170930132439595_500.jpg")];
    for (var i = 0; i < dropbox.length; i++) {
        dropbox[i].UploadToDropbox(i);
    }
    var res = [];
    var CorrectUrl = [];
    for (var i = 0; i < dropbox.length; i++) {
        res.push(JSON.parse(dropbox[i].MakeShareLink(i).getContentText()));
    }
    for (var i = 0; i < dropbox.length; i++) {
        CorrectUrl.push((res[i].url).substr(23).slice(0, -5));
        CorrectUrl[i] = "https://dl.dropboxusercontent.com" + CorrectUrl[i];
    }
    Logger.log(CorrectUrl);
}

Dropbox.prototype = {
    UploadToDropbox: function (num) {
        var fileBlob = UrlFetchApp.fetch(this.imgPath).getBlob().setName(this.filename);
        this.file = DriveApp.createFile(fileBlob);
        this.file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

        var parameters = {
            "path": "/imgSrc/" + num + this.filename,
            "url": "https://drive.google.com/uc?export=download&id=" + this.file.getId()
        };

        var headers = {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + this.token
        };

        var options = {
            "method": "post",
            "headers": headers,
            "payload": JSON.stringify(parameters)
        };

        UrlFetchApp.fetch(this.url, options);
    },

    MakeShareLink: function (num) {
        DriveApp.removeFile(this.file);

        var shareParameters = {
            "path": "/imgSrc/" + num + this.filename,
            "settings": {
                "requested_visibility": "public"
            }
        };

        var shareHeaders = {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + this.token
        };

        var shareOptions = {
            "method": "post",
            "headers": shareHeaders,
            "payload": JSON.stringify(shareParameters)
        };
        return UrlFetchApp.fetch(this.SharedUrl, shareOptions);
    },
    // ファイルのダウンロード（Google Drive）
    download: function () {
        var fileBlob = UrlFetchApp.fetch(this.imgPath).getBlob().setName(this.filename);
        this.file = DriveApp.createFile(fileBlob);
        this.file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        return this.filename;
    },

    upload: function () {
        var parameters = {
            "path": "/imgSrc/" + this.filename,
            "url": "https://drive.google.com/uc?export=download&id=" + this.file.getId()
                // オプション
                //      "mode": "add",
                //      "autorename": true,
                //      "mute": false
        };

        var headers = {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + this.token
                //'Dropbox-API-Arg': JSON.stringify(parameters)
        };

        var options = {
            "method": "post",
            "headers": headers,
            "payload": JSON.stringify(parameters)
        };

        //return UrlFetchApp.fetch(this.imgPath).getBlob().setName(this.filename);
        return UrlFetchApp.fetch(this.url, options);
        //return this.file.getDownloadUrl();
    }
}