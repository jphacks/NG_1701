/************************************************************/
/****** Wearから情報を取得する ******/
/************************************************************/
var Wear = function () {

}

// しょーいが呼ぶやつ(画像とリンクのセットの配列)
Wear.prototype.getUrlJsons = function(highTmp, lowTmp, amWe, pmWe, gener){
  var response = [
    {
      "imgUrl" : "https://dl.dropboxusercontent.com/s/fllry948cpol7vd/20171009144615278_500.jpg",
      "link" : "http://wear.jp/journal401x2/10977377/"
    },
    {
      "imgUrl" : "https://dl.dropboxusercontent.com/s/fllry948cpol7vd/20171009144615278_500.jpg",
      "link" : "http://wear.jp/journal401x2/10977377/"
    },
    {
      "imgUrl" : "https://dl.dropboxusercontent.com/s/fllry948cpol7vd/20171009144615278_500.jpg",
      "link" : "http://wear.jp/journal401x2/10977377/"
    }
  ]
  return response;
}

Wear.prototype.getImageUrl = function(gender, date, region, page){
  var imgUrl = "https://www.google.co.jp/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png";
  var link = "http://jackhp.webcrow.jp/";

  // Wearからデータリスト（xmlで）を取得
  var url = "http://wear.jp/" + gender + "-coordinate/?country_id=1" + "&region_id=" + region + "&type_id=2" + "&pageno=" + page;
  var response = UrlFetchApp.fetch(url).getContentText();
  var doc = Xml.parse(response, true);
  var bodyHtml = doc.html.body.toXmlString();
  doc = XmlService.parse(bodyHtml);
  var root = doc.getRootElement()
  var list = parser.getElementById(root, 'main_list');
  var li = list.getChildren('ul')[0].getChildren('li');

  // 日付に一致したデータを取得
  var oldestDate = this.castDate(li[li.length-1].getChildren('div')[0].getChildren('p')[1].getValue());
  if(date >= new Date(oldestDate[0], oldestDate[1]-1, oldestDate[2])){
  for(var i=0,l=li.length;i<l;i++){
    var div = li[i].getChildren('div')[0];
    var displayDate = div.getChildren('p')[1].getValue();
    var castDate = this.castDate(displayDate);

    if (castDate[0] == date.getYear() && castDate[1] == date.getMonth()+1 && castDate[2] == date.getDate()){
      Logger.log(displayDate);
      Logger.log(castDate[0] + " " + castDate[1] + " " + castDate[2]);
      link = "http://wear.jp" + div.getChild('a').getAttribute('href').getValue();
      var img = div.getChildren('p')[0].getChild('img');
      imgUrl = img.getAttribute('data-original').getValue();
      break;
    }
  }
  Logger.log(link);
  Logger.log(imgUrl);
  return [imgUrl, link];
} else {
  return this.getImageUrl(gender, date, region, page+1);
}
}

// Wearに表示されている日程（X時間前、X日前）
Wear.prototype.castDate = function(displayDate){
  var y = 1995;
  var m = 6;
  var d = 9;

  var date = new Date();
  if(displayDate == "昨日") {
    date.setDate(date.getDate() - 1);
  } else if(displayDate == "一昨日") {
    date.setDate(date.getDate() - 2);
  } else if(displayDate.match(/分/) || displayDate.match(/時/)){
  } else if(displayDate.match(/日/)){
    var array = displayDate.split("日");
    var intD = parseInt(array[0]);
    date.setDate(date.getDate() - intD);
  } else {
    var array = displayDate.split(".");
    var array2 = array[1].split("/");
    date = new Date(parseInt(array[0]), parseInt(array2[0]) - 1, parseInt(array2[1]));
  }

  y = date.getYear();
  m = date.getMonth() + 1;
  d = date.getDate();

  return [y, m, d];
}

function Uchida_Test(){
//  var wear = new Wear();
//  wear.getImageUrl("men", new Date(2017, 8, 10), 44, 1);
  var dropbox = new Dropbox("http://cdn.wimg.jp/coordinate/yxxlxo/20170930132439595/20170930132439595_500.jpg");
  var d = dropbox.download();
  Logger.log(dropbox.upload());
//  Logger.log(dropbox.finish());
}
