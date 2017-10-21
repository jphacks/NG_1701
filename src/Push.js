//this.<クラス内メンバ・メソッド>=(いろいろ)

var Push = function () {
  this.shoiUserId = 'Ub2afb72bc67d5d5d1b264bac6f7bb90b';
  this.url = "https://api.line.me/v2/bot/message/push";
};

Push.prototype.pushtext = function(text){
  var headers = {
  "Content-Type" : "application/json; charset=UTF-8",
  'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
};

var postData = {
  "to" : this.shoiUserId,
  "messages" : [
    {
      'type':'text',
      'text':text,
    }
  ]
};

var options = {
  "method" : "post",
  "headers" : headers,
  "payload" : JSON.stringify(postData)
};

return UrlFetchApp.fetch(this.url, options);
}

function testshoi(){
  var push = new Push();
  push.pushtext("おやすみ");
}

//<クラス名>.prototype.<メソッド名>  = function(引数){中身};
