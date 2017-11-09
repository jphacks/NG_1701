var SamplePush = function(row){
  this.getData(row);
};

// データベースを参照して送信用データを取得する関数
SamplePush.prototype.getData = function(row){
  var sheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheets()[4];
  var data = sheet.getRange(row, 2, 1, 18).getValues()[0];
  this.userId = data[0];
  this.weather = [data[1], data[2], data[3], data[4], data[5], data[6],0,0, data[7], data[8], data[9], data[10], data[11]] // 添え字 8:9~12, 9:12~15, 10:15~18, 11:18~21, 12:21~24
  this.imageUrl = [data[12], data[13], data[14]];
  this.webUrl = [data[15], data[16], data[17]];
};

// 送信先のuserIdを変更する関数
SamplePush.prototype.setUserId = function(userId){
  this.userId = userId;
};

// データを送る関数
SamplePush.prototype.push = function(){
  var makematerial = new makeMaterial();
  var indexinfo = new Indexinfo();
  var discomindex = indexinfo.discomfort(this.weather);
  var atugido = indexinfo.atugido(discomindex);
  var text = makematerial.makeText(athugido);
  var raintext = makematerial.makeRainText(this.weather);
  var push = new Push();
  push.pushtext2(text,this.userId);
  push.pushtext2(raintext,this.userId);
  if(this.webUrl.length > 0){
    push.pushtext2("★☆参考コーディネート☆★",this.userId);
    push.pushCarousel(this.webUrl,this.imageUrl,"参考画像一覧",this.userId);
  }
};

function samplePushTest(){
  var sp = new SamplePush(2);
  sp.push();
};
