//this.<クラス内メンバ・メソッド>=(いろいろ)
var channel_access_token = "3t3EIwftT+lWk8koU4wt4h3qa58c6Gmlkli8qG3fVgsDbzKFcAkqfuMOsEd6vn2sVjkCProWGFt28hY9CEaUmTbXMPxKR/ai+GsZtTMkFS2w9erpQlI/5kFTN4Cd9hCKqdj/TIe35s9arzuE/a8i4wdB04t89/1O/w1cDnyilFU=";

var Push = function () {
  this.shoiUserId = 'Ub2afb72bc67d5d5d1b264bac6f7bb90b';
  this.url = "https://api.line.me/v2/bot/message/push";
};

//postdataをもらって送る
Push.prototype.pushData = function(PostData){
  var headers = {
  "Content-Type" : "application/json; charset=UTF-8",
  'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
  };

var postData = PostData;

var options = {
  "method" : "post",
  "headers" : headers,
  "payload" : JSON.stringify(postData)
};

return UrlFetchApp.fetch(this.url, options);
}

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

//templateの作成
Push.prototype.maketemplate = function(imageurl){
  var template = {
      "type": "buttons",
      "thumbnailImageUrl": imageurl,
      "title": "Menu",
      "text": "Please select",
      "actions": [
          {
            "type": "postback",
            "label": "Buy",
            "data": "action=buy&itemid=123"
          },
          {
            "type": "postback",
            "label": "Add to cart",
            "data": "action=add&itemid=123"
          },
          {
            "type": "uri",
            "label": "View detail",
            "uri": imgaeurl
          }
      ]
    }
    return template;
}

//template message を送る
Push.prototype.pushtemplate = function(altText ,url){
  var template = this.maketemplate(url);
  var postData = {
  "type": "template",
  "altText": altText,
  "template": template
    }
  this.pushData(postData);
}


//気温湿度などのデータ取得クラス
var GetWeatherData = function(){

};

//OpenWeatherMapAPIから情報を取得
GetWeatherData.prototype.GetWeather = function(lat,lon) {
  var API_KEY="9d287aeaef7ecc9dae9837a2d2f96934";
  var url="http://api.openweathermap.org/data/2.5/forecast?lat="+35+"&lon="+139+"&APPID="+API_KEY+"&type=hour&cnt=12&units=metric";
  var responce=UrlFetchApp.fetch(url);
  //return responce.getContentText();
  var json=JSON.parse(responce.getContentText());
  return json;
  //return Layout(json);
}

//送信用にデータを変更
GetWeatherData.prototype.Layout = function(json){
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
    list[i][4]="平均気温"+json.list[i].temp;
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

//気候データから、今日の朝昼夜の気温と湿度を配列で返す
GetWeatherData.prototype.Todaytemp = function(json){
    //[その時間からいくつ目の３時間ごとのデータか][データ番号]
    //データ番号 0~2 朝昼夜気温 3~5 朝昼夜湿度
    var weatherlist = new Array(6);
    var cnt=Number(json.cnt);
    var list=new Array(cnt);
    var firstdate=new Date(Number(json.list[0].dt)*1000);
    //初期化
    for(var i=0;i<cnt;i++){
      weatherlist[i]=100;
    }
    for(var i=0;i<cnt;i++){
      var date=new Date(Number(json.list[i].dt)*1000);
      if(date.getDate()==firstdate.getDate() && date.getHours() == 6){
        weatherlist[0]=json.list[i].main.temp;
        weatherlist[3]=json.list[i].main.humidity;
      }
      if(date.getDate()==firstdate.getDate() && date.getHours() == 12){
        weatherlist[1]=json.list[i].main.temp;
        weatherlist[4]=json.list[i].main.humidity;
      }
      if(date.getDate()==firstdate.getDate() && date.getHours() == 21){
        weatherlist[2]=json.list[i].main.temp;
        weatherlist[5]=json.list[i].main.humidity;
      }
    }
    return weatherlist;
  }

//不快指数や過去のデータ
var Indexinfo = function(){
};
//不快指数の計算
Indexinfo.prototype.discomfort = function(list){
  //[0]朝[1]昼[2]夜
  var discomlist = new Array(3);
  for (var i=0;i<3;i++){
    var T = list[i];
    var H = list[i+3];
    discomlist[i] = 0.81*T+0.01*H*(0.99*T-14.3)+46.3;
  }
  return discomlist;
}



//テスト関数
function testshoi(){
  var push = new Push();
  var getweatherdata = new GetWeatherData();
  var indexinfo = new Indexinfo();
  var weather = getweatherdata.GetWeather(36,136);
  var todayweather = getweatherdata.Todaytemp(weather);
  var discomindex = indexinfo.discomfort(todayweather);
  push.pushtext(discomindex[0]);
  //push.pushtemplate("https://drive.google.com/open?id=0B2tPxOvRhEO9TFlFRUFtQmUxS0E","A");
}

function testshoi2(){
  var push = new Push();
  push.pushtext("A");
}

//<クラス名>.prototype.<メソッド名>  = function(引数){中身};
