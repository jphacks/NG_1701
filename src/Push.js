//this.<クラス内メンバ・メソッド>=(いろいろ)
var channel_access_token = "3t3EIwftT+lWk8koU4wt4h3qa58c6Gmlkli8qG3fVgsDbzKFcAkqfuMOsEd6vn2sVjkCProWGFt28hY9CEaUmTbXMPxKR/ai+GsZtTMkFS2w9erpQlI/5kFTN4Cd9hCKqdj/TIe35s9arzuE/a8i4wdB04t89/1O/w1cDnyilFU=";

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

//気温湿度などのデータ取得クラス
var GetWeatherData = function(){
//OpenWeatherMapAPIから情報を取得
GetWeatherData.prototype.GetWeather(lat,lon) {
  var API_KEY="9d287aeaef7ecc9dae9837a2d2f96934";
  var url="http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&APPID="+API_KEY+"&lang=ja&cnt=12&units=metric";
  var responce=UrlFetchApp.fetch(url);
  //return responce.getContentText();
  var json=JSON.parse(responce.getContentText());
  return json;
  //return Layout(json);
}

//送信用にデータを変更
GetWeatherData.prototype.Layout(json){
  var location="場所:"+json.city.name;
  var cnt=Number(json.cnt);
  var list=new Array(cnt);
  for(var i=0;i<cnt;i++){
    list[i]=new Array(6);
    var date=new Date(Number(json.list[i].dt)*1000);
    list[i][0]="時刻:"+date.getMonth()+"月"+date.getDate()+"日 "+('00'+date.getHours()).slice(-2)+":"+('00'+date.getMinutes()).slice(-2);
    list[i][1]="天気:"+json.list[i].weather[0]["description"];
    list[i][2]="最高気温:"+json.list[i].main.temp_max+"℃";
    list[i][3]="最低気温:"+json.list[i].main.temp_min+"℃";
    list[i][4]="平均気温"+json.list[i].main.temp;
    list[i][5]="湿度"+json.list[i].main.humidity;
  }


  var result=location+"\n";
  for(var i=0;i<cnt;i++){
    result=result+"\n";
    for(var j=0;j<6;j++){
      result=result+list[i][j]+"\n";
    }
  }
  return result;
}
}

function testshoi(){
  var push = new Push();
  var weather = GetWeatherData.GetWeather(36,136);
  weather = GetWeatherData.Layout(weather);
  push.pushtext(weather);
}

//<クラス名>.prototype.<メソッド名>  = function(引数){中身};
