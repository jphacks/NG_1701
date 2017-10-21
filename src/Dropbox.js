var Dropbox = function(imgPath) {
  this.url = "https://content.dropboxapi.com/2/files/upload";
  this.token      = 'jMtLFKY2xVAAAAAAAAAAG2VMPYdBoYJBh-B5MGwQtiuJTu1xP08DK1-5n14waUS1';
  this.imgPath  = imgPath;
  this.filename = "test.jpg";
  this.file;

//  this.url2 = "https://content.dropboxapi.com/2/files/upload_session/finish";
}

Dropbox.prototype = {
  // ファイルのダウンロード（Google Drive）
  download: function(){
    var fileBlob = UrlFetchApp.fetch(this.imgPath).getBlob().setName(this.filename);
    this.file = DriveApp.createFile(fileBlob);
    return this.filename;
  },

  upload: function(){
    var parameters = {
      "path": "/imgSrc/test.jpg",
      // オプション
//      "mode": "add",
//      "autorename": true,
//      "mute": false
    };

    var headers = {
      "Content-Type" : "application/octet-stream",
      'Authorization': 'Bearer ' + this.token,
      'Dropbox-API-Arg': JSON.stringify(parameters)
    };

    var options = {
      "method" : "post",
      "headers" : headers,
      "data-binary" : this.file.getBlob()
    };

    return UrlFetchApp.fetch(this.url, options);
  }
}
