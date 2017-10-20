function GetWeathr() {
  var API_KEY="9d287aeaef7ecc9dae9837a2d2f96934";
  var url="http://api.openweathermap.org/data/2.5/forecast?lat="+36+"&lon="+135+"&APPID="+API_KEY+"&lang=ja&cnt=1";
  var responce=UrlFetchApp.fetch(url);
  var json=JSON.parse(responce.getContentText());
  Logger.log(json.list[0].weather[0]["description"]);
}

function testing(){
  var id="14TZKXlUNkUdfCtM48b2ymu8ILEvlwi8bVU6IQArybOw";
  var spreadsheet=SpreadsheetApp.openById(id);
  var sheet=spreadsheet.getActiveSheet();
  var to=[];
  for(var i=1;sheet.getRange(i,1).getValue()!="";i++){
    to.push(sheet.getRange(i,1).getValue());
  }
  var time=new Date();
  if(Number(time.getMinutes())%4==0){
    Logger.log(to);
  }
}

function StartText(e){
  /*var postData = {
        "replyToken" : event.replyToken,
        "messages" : [
          {
            "type" : "templete",
            "title" : "性別",
            "altText" : "性別はどっちや",
            "templete" : "かえってくれ"
          }
        ]
      };
      
      var options = {
        "method" : "post",
        "headers" : {
          "Content-Type" : "application/json",
          "Authorization" : "Bearer " + channel_access_token
        },
        "payload" : JSON.stringify(postData)
      };*/
}