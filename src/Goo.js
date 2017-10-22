var Goo = function () {
  var sendaiId = 590;
  this.gooUrl = "https://weather.goo.ne.jp/past/" + sendaiId + "/";
}

Goo.prototype = {
  getDate : function(date){
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
        if (ths1[j] != undefined && ths1[j].getValue() != "-"){
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

    Logger.log(array);

    return array;
  }
}
