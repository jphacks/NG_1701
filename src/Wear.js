/************************************************************/
/****** Wearから情報を取得する ******/
/************************************************************/
var Wear = function () {

}

Wear.prototype.getImageUrl = function(gender, date, region){
  var url = "http://wear.jp/" + gender + "-coordinate/?country_id=1" + "&region_id=" + region + "&type_id=2";
  var response = UrlFetchApp.fetch(url).getContentText();
  var doc = Xml.parse(response, true);
  var bodyHtml = doc.html.body.toXmlString();
  doc = XmlService.parse(bodyHtml);
  var root = doc.getRootElement()
  var list = parser.getElementById(root, 'main_list');
  Logger.log(list.getChildren('ul')[0].getChildren('li')[0].getChildren('div')[0].getChild('a'));
}

function Uchida_Test(){
  var wear = new Wear();
  wear.getImageUrl("men", new Date(), 44);
}
