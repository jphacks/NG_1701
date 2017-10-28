var Dropbox = function (imgPath) {
    this.url = "https://api.dropboxapi.com/2/files/save_url";
    this.SharedUrl = "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings";
    this.token = 'jMtLFKY2xVAAAAAAAAAAG2VMPYdBoYJBh-B5MGwQtiuJTu1xP08DK1-5n14waUS1';
    this.imgPath = imgPath;
    this.imgTitle = this.imgPath.substring(this.imgPath.lastIndexOf("/")).slice(1);
    this.filename = "test.jpg";
    this.file;
    this.fileid;

    //  this.url2 = "https://content.dropboxapi.com/2/files/upload_session/finish";
};

function Test_Chon() {
    var urls = ["http://cdn.wimg.jp/coordinate/yxxlxo/20170930132439595/20170930132439595_500.jpg", "http://cdn.wimg.jp/coordinate/yxxlxo/20170930132439595/20170930132439595_500.jpg", "http://cdn.wimg.jp/coordinate/yxxlxo/20170930132439595/20170930132439595_500.jpg"];
    Logger.log(GetImageURLs(urls));
}

function GetImageURLs(imgArr) {
    var dropbox = [];
    var downloadId = [];
    for (var i = 0; i < imgArr.length; i++) {
        dropbox.push(new Dropbox(imgArr[i]));
    }
    for (var i = 0; i < dropbox.length; i++) {
        downloadId.push(dropbox[i].UploadToDropbox(i));
    }
    var res = [];
    var CorrectUrl = [];
    for (var i = 0; i < dropbox.length; i++) {
        res.push(JSON.parse(dropbox[i].MakeShareLink(i, downloadId[i].async_job_id).getContentText()));
    }
    for (var i = 0; i < dropbox.length; i++) {
        CorrectUrl.push((res[i].url).substr(23).slice(0, -5));
        CorrectUrl[i] = "https://dl.dropboxusercontent.com" + CorrectUrl[i];
    }
    return CorrectUrl;
}

Dropbox.prototype = {
    UploadToDropbox: function (num) {
        var fileBlob = UrlFetchApp.fetch(this.imgPath).getBlob().setName(this.filename);
        this.file = DriveApp.createFile(fileBlob);
        this.file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        this.fileid = this.file.getId();

        var parameters = {
            "path": "/imgSrc/" + num + this.fileid + this.imgTitle,
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

        return JSON.parse(UrlFetchApp.fetch(this.url, options).getContentText());
    },

    MakeShareLink: function (num, sync_id) {
        DriveApp.removeFile(this.file);
        var checkUrl = "https://api.dropboxapi.com/2/files/save_url/check_job_status";
        var status = "";

        var checkParameters = {
            "async_job_id": sync_id
        };

        var checkHeaders = {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + this.token
        };

        var checkOptions = {
            "method": "post",
            "headers": checkHeaders,
            "payload": JSON.stringify(checkParameters)
        };

        do {

            var jso = JSON.parse(UrlFetchApp.fetch(checkUrl, checkOptions).getContentText());
            //Logger.log(jso);
            status = jso[".tag"];
        } while (status != "complete");

        var shareParameters = {
            "path": "/imgSrc/" + num + this.fileid + this.imgTitle,
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
    }
}
