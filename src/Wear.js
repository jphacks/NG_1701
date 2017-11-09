/************************************************************/
/****** Wearから情報を取得する ******/
/************************************************************/
var Wear = function () {
  this.region = 4; // 宮城
  this.urls = [];
}

// しょーいが呼ぶやつ(画像とリンクのセットの配列)
Wear.prototype.getUrlJsons = function(highTmp, lowTmp, amWe, pmWe, gender){

  var goo = new Goo();
  var weatherInfo = goo.getWeatherInfo();
  var targetDate = goo.getFitDate(highTmp, lowTmp, amWe, pmWe, weatherInfo);
  Logger.log(targetDate);

  targetDate.sort(function(a, b){return b.d - a.d;});
  Logger.log(targetDate);
  var dateText = "";
  for (var i = 0; i < targetDate.length; i++)
    dateText += targetDate[i].m + "/" + targetDate[i].d + " ";
  SlackLog(dateText);

  for (var i = 0; i < targetDate.length; i++){
    var d = new Date(targetDate[i].y, targetDate[i].m-1, targetDate[i].d);
    var page = 1;
    while (page != -1){
      page = this.getImageUrl(gender, d, this.region, page);
    }
    if(this.urls.length >= 3) break;
  }

  Logger.log(this.urls);

  var imgUrls = [];
  for (var i = 0; i < this.urls.length; i++){
    imgUrls.push(this.urls[i].imgUrl);
  }

  imgUrls = GetImageURLs(imgUrls);

  for (var i = 0; i < this.urls.length; i++){
    this.urls[i].imgUrl = imgUrls[i];
  }

  Logger.log(this.urls);

  return this.urls;
}

Wear.prototype.getImageUrl = function(gender, date, region, page){
  if (this.urls.length >= 3) return -1;

  // Wearからデータリスト（xmlで）を取得
  var url = "http://wear.jp/" + gender + "-coordinate/?country_id=1" + "&region_id=" + region + "&type_id=2" + "&pageno=" + page + "&from_month=" + (date.getMonth()+1) + "&to_month=" + (date.getMonth()+1);

  Logger.log(url);
  SlackLog("解析を試みるURL : " + url);

  var response = UrlFetchApp.fetch(url).getContentText();
  var doc = Xml.parse(response, true);
  var bodyHtml = doc.html.body.toXmlString();
  doc = XmlService.parse(bodyHtml);
  var root = doc.getRootElement()

  // 最大ページ数を取得
  var finishFlag = false;
  var pager = parser.getElementById(root, 'pager');
  var maxPage = pager.getChild("ul").getChildren('li');
  if(parseInt(maxPage[maxPage.length-1].getChild("a").getValue()) <= page) finishFlag = true;

  var list = parser.getElementById(root, 'main_list');
  var li = list.getChildren('ul')[0].getChildren('li');

  // 日付に一致したデータを取得
  var oldestDate = this.castDate(li[li.length-1].getChildren('div')[0].getChildren('p')[1].getValue());
  var nearlyDate = this.castDate(li[0].getChildren('div')[0].getChildren('p')[1].getValue());
  if(date < new Date(nearlyDate[0], nearlyDate[1]-1, nearlyDate[2])){
    if(date >= new Date(oldestDate[0], oldestDate[1]-1, oldestDate[2])){
    for(var i=0,l=li.length;i<l;i++){
      var div = li[i].getChildren('div')[0];
      var displayDate = div.getChildren('p')[1].getValue();
      var castDate = this.castDate(displayDate);

      if (castDate[0] == date.getYear() && castDate[1] == date.getMonth()+1 && castDate[2] == date.getDate()){
        var link = "http://wear.jp" + div.getChild('a').getAttribute('href').getValue();
        var img = div.getChildren('p')[0].getChild('img');
        var imgUrl = img.getAttribute('data-original').getValue();
        var item = {
          "imgUrl" : imgUrl,
          "link" : link
        }
        this.urls.push(item);
        if (this.urls.length >= 3) return -1;
      }
    }
    if(finishFlag)
      return -1;
    else
      return page+1;
    } else {
      if(finishFlag)
        return -1;
        else
        return page+1;
    }
  } else {
      return -1;
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
//  wear.getUrlJsons(18.3,17,"晴", "雲", "women");
//  pushTriggerData(USER_ID);
}
