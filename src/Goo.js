var Goo = function () {
  var sendaiId = 590;
  this.gooUrl = "https://weather.goo.ne.jp/past/" + sendaiId + "/";
}

Goo.prototype = {
  getFitDate : function(highTmp, lowTmp, amW, pmW, array){
    var newArray = [];
    for (var i = 0; i < array.length; i++){
      if(Math.abs(array[i].hT - highTmp) < 2 && Math.abs(array[i].lT - lowTmp) < 2)
      {
        var item = {
          "y" : parseInt(array[i].y),
          "m" : parseInt(array[i].m),
          "d" : parseInt(array[i].d)
        }
        newArray.push(item);
      }
    }
    return newArray;
  },
  castWeatherString : function(weather){
    if(weather.match(/雨/)){
      return "雨";
    } else if(weather.match(/晴/)){
      return "晴れ";
    } else if(weather.match(/曇/) || weather.match(/雲/)){
      return "曇";
    } else {
      return "";
    }
  },
  getWeatherInfo : function(){
    var today = new Date();
//    return this.getWeatherInfoFromDate(new Date(today.getYear(), today.getMonth()-1, today.getDate())).concat(this.getWeatherInfoFromDate(today)).concat(this.getWeatherInfoFromDate(new Date(today.getYear()-1, today.getMonth()+1, today.getDate())));
    return this.getWeatherInfoFromDate(new Date(today.getYear(), today.getMonth()-1, today.getDate())).concat(this.getWeatherInfoFromDate(today));
    },
  getWeatherInfoFromDate : function(date){
    var m = date.getMonth()+1;
    if(m < 10) m = '0' + m;
    var url = this.gooUrl + date.getYear() + m + '00/';

    var response = UrlFetchApp.fetch(url).getContentText();
    var doc = Xml.parse(response, true);
    var bodyHtml = doc.html.body.toXmlString();
    doc = XmlService.parse(bodyHtml);
    var root = doc.getRootElement();
    var table = parser.getElementById(root, 'NR-main-in').getChild("div").getChild("section").getChild("div").getChild("div").getChild("table");

    var array = [];

    var trs = table.getChildren("tr");

    for(var i = 1; i < trs.length; i += 6){
      var ths1 = trs[i].getChildren("td");
      var ths2 = trs[i+1].getChildren("td");
      var ths3 = trs[i+2].getChildren("td");
      var ths5 = trs[i+4].getChildren("td");

      for (var j = 0; j < 7; j++){
        if (ths1[j] != undefined && ths1[j].getValue() != "-" && ths1[j].getValue() > 15){
          var item = {
            "y" : date.getYear(),
            "m" : date.getMonth()+1,
            "d" : ths1[j].getValue(),
            "hT" : ths2[j].getChildren("span")[0].getValue(),
            "lT" : ths2[j].getChildren("span")[1].getValue(),
            "amW" : ths3[j].getChild("img").getAttribute('alt').getValue(),
            "pmW" : ths5[j].getChild("img").getAttribute('alt').getValue()
          };
          array.push(item);
        }
      }
    }
    return array;
  }
}
