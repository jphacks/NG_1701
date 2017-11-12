function doGet(e) { //アクセスが来たら実行します

  if(!e.parameter.action) { //actionが指定されてない場合
    return createContent(e.parameter.callback , {error :'action is required '});
  }

  var pushPage = new PushPage();
  switch(e.parameter.action) { //actionによって振り分け
    case 'login':
      return pushPage.login(e.parameter);
    case 'push':
      return pushPage.push(e.parameter);
    default :
      return pushPage.createContent(e.parameter.callback , {error : "unsupported operation"});
   }
}

var PushPage = function(){

}

//login
PushPage.prototype.login = function(p){
  var returnData;
  if(this.loginCheck(p.user, p.password)){
    returnData = {
      "users":this.getUserList(),
      "contents":this.getContentList()
    };
  } else {
    returnData = {"error": "指定されたユーザー名とパスワードでログインできませんでした"};
  }
  return this.createContent(p.callback , returnData);
}

//push
PushPage.prototype.push = function(p){
  var samplePush = new SamplePush(p.contentId);
  samplePush.setUserId(p.userId);
  samplePush.push();
  var returnData;
  returnData = {"text":"push finish!"};
  return this.createContent(p.callback , returnData);
}

// ユーザー名とパスワードが一致しているか確認する
PushPage.prototype.loginCheck = function(user, pass){
  var sheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheets()[5];
  var data = sheet.getRange(1, 2, 1, 3).getValues()[0];
  if(user == data[0] && pass == data[2]) return true;
  else return false;
}

// 送信できるサンプル一覧を取得
PushPage.prototype.getContentList = function(){
  var sheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheets()[4];
  var data = sheet.getRange(2, 1, 4, 1).getValues();
  var contentList = [];
  for(var i = 0; i < data.length; i++){
    var content = {
      "text":data[i][0],
      "value":2+i
    }
    contentList.push(content);
  }
  return contentList;
}

// 送信できるユーザー一覧を取得
PushPage.prototype.getUserList = function(){
  var sheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheets()[5];
  var data = sheet.getRange(4, 1, 6, 2).getValues();
  var userList = [];
  for(var i = 0; i < data.length; i++){
    var user = {
      "text":data[i][0],
      "value":data[i][1]
    }
    userList.push(user);
  }
  return userList;
}

//JSONまたはJSONPの文字列を返します
PushPage.prototype.createContent = function(callback , returnObject ) {
  if(callback) {
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(returnObject) + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    return ContentService.createTextOutput(JSON.stringify(returnObject)).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}
