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

//  for (var i = 0; i < 1; i++){
  for (var i = 0; i < targetDate.length; i++){
    var d = new Date(targetDate[i].y, targetDate[i].m-1, targetDate[i].d);
    this.getImageUrl(gender, d, this.region, 0);
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

  /*
  // 1d
  var response = [
    {
      "imgUrl" : "https://dl.dropboxusercontent.com/s/jgvblth7jqiemjd/1-1.jpg",
      "link" : "http://wear.jp/kadotk4/11009163/"
    },
    {
      "imgUrl" : "https://dl.dropboxusercontent.com/s/uj5jbn7jh348859/1-2.jpg",
      "link" : "http://wear.jp/onealex/11007195/"
    },
    {
      "imgUrl" : "https://dl.dropboxusercontent.com/s/ofkcroh5yh4ho76/1-3.jpg",
      "link" : "http://wear.jp/ar0287/11005166/"
    }
  ]
  // 2d
  var response = [
    {
      "imgUrl" : "https://dl.dropboxusercontent.com/s/461vihb2g2p4j7w/2-1.jpg",
      "link" : "http://wear.jp/bc137/10973668/"
    },
    {
      "imgUrl" : "https://dl.dropboxusercontent.com/s/snlb0g2h34jp3ju/2-2.jpg",
      "link" : "http://wear.jp/dead2zero/10799337/"
    },
    {
      "imgUrl" : "https://dl.dropboxusercontent.com/s/3xvns0yooqg5l4k/2-3.jpg",
      "link" : "http://wear.jp/astrum/10976362/"
    }
  ]
  // 3d
  var response = [
    {
      "imgUrl" : "https://dl.dropboxusercontent.com/s/ro0xa29avrefoig/3-1.jpg?dl=0",
      "link" : "http://wear.jp/zawakana0225/11089246/"
    },
    {
      "imgUrl" : "https://dl.dropboxusercontent.com/s/nu1scfd7mp3glnu/3-2.jpg?dl=0",
      "link" : "http://wear.jp/kazuma05/11001377/"
    },
    {
      "imgUrl" : "https://dl.dropboxusercontent.com/s/ldpn64n87blnzp5/3-3.jpg?dl=0",
      "link" : "http://wear.jp/Disney5189/10995558/"
    }
  ]
  */
  return this.urls;
}

Wear.prototype.getImageUrl = function(gender, date, region, page){
  if (this.urls.length >= 3) return;

  // Wearからデータリスト（xmlで）を取得
  var url = "http://wear.jp/" + gender + "-coordinate/?country_id=1" + "&region_id=" + region + "&type_id=2" + "&pageno=" + page + "&from_month=" + (date.getMonth()+1) + "&to_month=" + (date.getMonth()+1);

  Logger.log(url);

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
        if (this.urls.length >= 3) return;
      }
    }
    if(finishFlag)
      return;
    else
      return this.getImageUrl(gender, date, region, page+1);
  } else {
    if(finishFlag)
      return;
    else
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
  var wear = new Wear();
  wear.getUrlJsons(18.3,17,"晴", "雲", "men");
}
