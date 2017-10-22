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

Push.prototype.pushtext2 = function(text,userid){
var postData = {
  "to" : userid,
  "messages" : [
    {
      'type':'text',
      'text':text,
    }
  ]
};
this.pushData(postData);
}

Push.prototype.pushImage = function(userid){
  var postData = {
    "to" : userid,
    "messages" : [
      {
        "type": "image",
        "originalContentUrl": "https://drive.google.com/open?id=0B2tPxOvRhEO9TFlFRUFtQmUxS0E",
        "previewImageUrl": "https://drive.google.com/open?id=0B2tPxOvRhEO9TFlFRUFtQmUxS0E"
      }
    ]
  };
  this.pushData(postData);
}

//carouselを送る
Push.prototype.pushCarousel = function(weburl,imageurl,altText,userid){
  var columns = new Array(weburl.length);
  for (var i=0;i<weburl.length;i++){
    var actions = this.makeActions(weburl[i]);
    var column = this.makeColumnforCarousel(imageurl[i],actions);
    columns[i] = column;
  }
    var template = this.makeCarouselTemplate(columns);
    var postdata = this.makeTemplatePostData(altText,template,userid);
    this.pushData(postdata);
}

//templateのPostData作る
Push.prototype.makeTemplatePostData = function(altText,template,userid){
  var PostData = {
    "to" : userid,
    "messages":[
      {
        'type':'template',
        'altText':altText,
        'template':template
      }
    ]
  };
  return PostData;
}

//templateを作る
Push.prototype.makeCarouselTemplate = function(columns){
  var template = {
    'type':'image_carousel',
    'columns':columns
  };
  return template;
}

Push.prototype.makeColumnforCarousel = function(imageurl,actions){
  var column = {
    'imageUrl':imageurl,
    //'title':title,
    //'text':body,
    'action':actions
  };
  return column;
}

Push.prototype.makeActions = function(Url){
  var actions =
    {
      "type":"uri",
      "label":"Open Browser",
      "uri":Url
    };
  return actions;
}

//気温湿度などのデータ取得クラス
var GetWeatherData = function(){

};

//OpenWeatherMapAPIから情報を取得
GetWeatherData.prototype.GetWeather = function(place) {
  var API_KEY="9d287aeaef7ecc9dae9837a2d2f96934";
  var url="http://api.openweathermap.org/data/2.5/forecast?q="+place+",jp&APPID="+API_KEY+"&lang=ja&type=hour&cnt=12&units=metric";
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

//気候データから、今日の朝昼夜の気温と湿度と天候を配列で返す
GetWeatherData.prototype.Todaytemp = function(json){
    //[その時間からいくつ目の３時間ごとのデータか][データ番号]
    //データ番号 0~2 朝昼夜気温 3~5 朝昼夜湿度
    var weatherlist = new Array(8);
    var cnt=Number(json.cnt);
    var list=new Array(cnt);
    var firstdate=new Date(Number(json.list[0].dt)*1000);
    //初期化
    for(var i=0;i<cnt;i++){
      weatherlist[i]=100;
    }
    for(var i=0;i<cnt;i++){
      var date=new Date(Number(json.list[i].dt)*1000);
      if(date.getDate()==firstdate.getDate() && date.getHours() == 9){
        weatherlist[0]=json.list[i].main.temp_min;
        weatherlist[3]=json.list[i].main.humidity;
        weatherlist[6]=json.list[i].weather[0].description;
      }
      if(date.getDate()==firstdate.getDate() && date.getHours() == 12){
        weatherlist[1]=json.list[i].main.temp;
        weatherlist[4]=json.list[i].main.humidity;
        weatherlist[7]=json.list[i].weather[0].description;
      }
      if(date.getDate()==firstdate.getDate() && date.getHours() == 21){
        weatherlist[2]=json.list[i].main.temp;
        weatherlist[5]=json.list[i].main.humidity;
      }
    }
    return weatherlist;
  }

  //最高最低気温をだす
  GetWeatherData.prototype.MaxMinTemp = function(templist){
    var daytemplist = new Array(2);
    var maxtemp;
    var mintemp;
    maxtemp = Math.max(templist[0],templist[1],templist[2]);
    mintemp = Math.min(templist[0],templist[1],templist[2]);
    daytemplist[0] = maxtemp;
    daytemplist[1] = mintemp;
    return daytemplist;
  }

  //[0]と[1]の天気をだす
  GetWeatherData.prototype.Weathers = function(todaytemp){
    var weathers = new Array(2);
    weathers[0] = todaytemp[6];
    weathers[1] = todaytemp[7];
    return weathers;
  }

  GetWeatherData.prototype.TempAndWeather = function(MaxMinTemp,Weathers){
    var tempandweather = new Array(4);
    tempandweather[0] = MaxMinTemp[0];
    tempandweather[1] = MaxMinTemp[1];
    tempandweather[2] = Weathers[0];
    tempandweather[3] = Weathers[1];
    return tempandweather;
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

//不快指数リストから厚着度を算出します
Indexinfo.prototype.atugido = function(discomlist){
  var Atugido = new Array(3);
  for(var i=0;i<3;i++){
    if(discomlist[i]<55){
      Atugido[i]=0;
    }else if(55 <= discomlist[i] && discomlist[i] <60){
      Atugido[i]=1;
    }else if(60 <= discomlist[i] && discomlist[i] <65){
      Atugido[i]=2;
    }else if(65 <= discomlist[i] && discomlist[i] <70){
      Atugido[i]=3;
    }else if(70 <= discomlist[i] && discomlist[i] <75){
      Atugido[i]=4;
    }else if(75 <= discomlist[i] && discomlist[i] <80){
      Atugido[i]=5;
    }else if(80 <= discomlist[i] && discomlist[i] <110){
      Atugido[i]=6;
    }else{
      Atugido[i]=7;
    }
  }
  return Atugido;
}

var makeMaterial = function(){

};

makeMaterial.prototype.makeText = function(atugido){
  var text = "";
  var plusword0;
  var plusword1;
  var equalword;
  var minusword0;
  var minusword1;
  if(atugido[2]<4){
    plusword0 = "気温が上がり";
    plusword1 = "気温が上がる";
    equalword = "気温は上がらず";
    minusword0 = "気温が下がり";
    minusword1 = "気温が下がる";
  }else{
    plusword0 = "暑さが増し";
    plusword1 = "暑さが増す";
    equalword = "気温は変わらず";
    minusword0 = "涼しくなり";
    minusword1 = "涼しくなる";
  }

  //朝の厚着度が存在する場合
  if(atugido[0]<7){
    if(atugido[0]<atugido[1]){
      text = "日中になると"+plusword0;
      if(atugido[1]<atugido[2]){
        text += "夜になるとさらに"+plusword1+"でしょう。";
      }else if(atugido[1]==atugido[2]){
        text += "夜はその気温が続くでしょう。";
      }else if(atugido[1]>atugido[2]){
        text += "夜は"+minusword1+"でしょう。";
      }
    }else if(atugido[0]==atugido[1]){
      text = "日中になっても"+equalword;
      if(atugido[1]<atugido[2]){
        text += "夜になると"+plusword1+"でしょう。";
      }else if(atugido[1]==atugido[2]){
        text += "夜はその気温が続くでしょう。";
      }else if(atugido[1]>atugido[2]){
        text += "夜は"+minusword1+"でしょう。";
      }
    }else if(atugido[0]>atugido[1]){
      text = "日中になると"+minusword0;
      if(atugido[1]<atugido[2]){
        text += "夜になると"+plusword1+"でしょう。";
      }else if(atugido[1]==atugido[2]){
        text += "夜はその気温が続くでしょう。";
      }else if(atugido[1]>atugido[2]){
        text += "夜はさらに"+minusword1+"でしょう。";
      }
    }
  }

  var text2 = "";
  //気温が下がる日
  if((atugido[0]>atugido[1] && atugido[1]<atugido[2])
  || (atugido[0]==atugido[1] && atugido[1]>atugido[2])
  || (atugido[0]>atugido[1] && atugido[1]>atugido[2])
  || (atugido[0]>atugido[1] && atugido[1]==atugido[2])){
    if(atugido[0]>1){
        text2 = "ですので何か羽織れるものを持っていくといいでしょう。";
    }else{
        text2 = "";
    }
  //気温が上がる日
  }else if((atugido[0]>atugido[1] && atugido[1]<atugido[2])
  ||(atugido[0]==atugido[1] && atugido[1]<atugido[2])
  ||(atugido[0]<atugido[1] && atugido[1]>atugido[2])
  ||(atugido[0]<atugido[1] && atugido[1]==atugido[2])){
    if(atugido[0]<5){
      text2 = "ですので脱ぎ着のできる服装で行くことをお勧めします。";
    }else{
      text2 = "";
    }
  }

  var text3 = "";
  if(atugido[0]==0){
    text3 = "今日は厚手のコートなどが活躍する日です。";
  }else if(atugido[0]==1){
    text3 = "今日はセーターや厚手のパーカーが活躍する日です。";
  }else if(atugido[0]==2){
    text3 = "厚手のシャツを着るとちょうどいい気候です。";
  }else if(atugido[0]==3){
    text3 = "今日はパーカーやシャツがちょうどいい気候です。";
  }else if(atugido[0]==4){
    text3 = "今日は七分袖のTシャツなどがちょうどいい気候です。";
  }else if(atugido[0]==5){
    text3 = "今日は涼しげなシャツがちょうどいい気候です";
  }else if(atugido[0]==6){
    text3 = "今日はとても暑いのでTシャツ一枚で過ごせる気候です。";
  }
  var lasttext = text3 + text + text2;
  return lasttext;
}

function pushTriggerData(userid){
  var push = new Push();
  var database = new Database();
  var getweatherdata = new GetWeatherData();
  var indexinfo = new Indexinfo();
  var makematerial = new makeMaterial();
  var weather = getweatherdata.GetWeather(GetLocationName(database.GetValue(userid,"location")));
  var todayweather = getweatherdata.Todaytemp(weather);
  var discomindex = indexinfo.discomfort(todayweather);
  var atugido = indexinfo.atugido(discomindex);
  var text = makematerial.makeText(atugido);
  push.pushtext2(text,userid);

  var maxmintemp = getweatherdata.MaxMinTemp(todayweather);
  var weathers = getweatherdata.Weathers(todayweather);
  var weburl = new Array(3);
  var imageurl = new Array(3);
  var wear = new Wear();
  var link = wear.getUrlJsons(maxmintemp[0],maxmintemp[1],weathers[0],weathers[1],"men");
  weburl[0] = link[0].link;
  imageurl[0]= link[0].imgUrl;
  weburl[1] = link[1].link;
  imageurl[1]= link[1].imgUrl;
  weburl[2] = link[2].link;
  imageurl[2]= link[2].imgUrl;
  push.pushCarousel(weburl,imageurl,"今日の服装をお知らせします",userid);

}

//テスト関数
function testshoi(){
  var push = new Push();
  var getweatherdata = new GetWeatherData();
  var indexinfo = new Indexinfo();
  var makematerial = new makeMaterial();
  //apiから手に入る天気の情報
  var weather = getweatherdata.GetWeather("Nagoya-shi");
  //気温、湿度、天候のデータ
  var todayweather = getweatherdata.Todaytemp(weather);
  //最低、最高気温
  var maxmintemp = getweatherdata.MaxMinTemp(todayweather);
  //push.pushtext2(maxmintemp[0]);
  //push.pushtext2(maxmintemp[1]);
  //天候のデータ
  var weathers = getweatherdata.Weathers(todayweather);
  //push.pushtext2(weathers[0]);
  //最高、最低、天候のデータ [0]最高気温　[1]最低気温 [2,3]天候
  var tempandweather = getweatherdata.TempAndWeather(maxmintemp,weathers);
  push.pushtext2(tempandweather[0]);
  push.pushtext2(tempandweather[1]);
  push.pushtext2(tempandweather[2]);
  push.pushtext2(tempandweather[3]);
  var discomindex = indexinfo.discomfort(todayweather);
  var atugido = indexinfo.atugido(discomindex);
  push.pushtext2(atugido[0]);
  push.pushtext2(atugido[1]);
  push.pushtext2(atugido[2]);
  var text = makematerial.makeText(atugido);
  push.pushtext2(text);
  var weburl = new Array(3);
  var imageurl = new Array(3);
  weburl[0] = "https://drive.google.com/open?id=0B2tPxOvRhEO9TFlFRUFtQmUxS0E";
  imageurl[0]= "https://dl.dropboxusercontent.com/s/fllry948cpol7vd/20171009144615278_500.jpg";
  weburl[1] = "https://drive.google.com/open?id=0B2tPxOvRhEO9TFlFRUFtQmUxS0E";
  imageurl[1]= "https://dl.dropboxusercontent.com/s/fllry948cpol7vd/20171009144615278_500.jpg";
  weburl[2] = "https://drive.google.com/open?id=0B2tPxOvRhEO9TFlFRUFtQmUxS0E";
  imageurl[2]= "https://dl.dropboxusercontent.com/s/fllry948cpol7vd/20171009144615278_500.jpg";
  push.pushCarousel(weburl,imageurl,"今日の服装をお知らせします");
}

function testshoi2(){
  var push = new Push();
  push.pushImage(this.shoiUserId);
}


//<クラス名>.prototype.<メソッド名>  = function(引数){中身};
