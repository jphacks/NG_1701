var log = document.getElementById("log");

// login時に実行する関数
function login(){
  var user = document.getElementsByName("loginUser")[0].value;
  var password = document.getElementsByName("password")[0].value;
  log.textContent = "ユーザー名："+ user + ", パスワード：" + password + " でログインを試みています...";
  gas("action=login&user="+user+"&password="+password, (j)=>{
    log.textContent = "ログインに成功しました!";
    makeSelectContent("content",j.contents);
    makeSelectContent("userId",j.users);
  });
};

// select要素の選択肢を更新する関数
function makeSelectContent(name, content){
  var contentHtml = "";
  for (var i = 0; i < content.length; i++){
    contentHtml += "<option value='" + content[i].value + "'>" + content[i].text + "</option>";
  }
  var select = document.getElementsByName(name)[0];
  select.innerHTML = contentHtml;
};

// 通知を送る時に実行する関数
function push(){
  var contentSelect = document.getElementsByName("content")[0];
  var userSelect = document.getElementsByName("userId")[0];
  log.textContent = (userSelect.value != "") + "に" + (contentSelect.value != "") + "を通知をしたいんですね。わかります。";
  if(userSelect.value != "" && contentSelect.value != ""){
    log.textContent = "通知を試みています…";
    gas("action=push&userId=" + userSelect.value + "&contentId=" + contentSelect.value, (j)=>{
      log.textContent = "通知が完了しました！";
    });
  } else {
    log.textContent = "内容とユーザーを選択してください";
  }
//  gas("action=push", (j)=>{log.textContent = "finish!";makeSelectContent("userId",j);});
};

// google apps script と通信する関数
function gas(parameter, callback){
  const baseUrl = "https://script.google.com/macros/s/AKfycbx9fg8eJB2E1pDRMEM3Z_r_Y1qzi39h6D_tQ7WIL8sGfNdQjGY/exec";
  const request = new XMLHttpRequest();
  request.open("GET", baseUrl+"?"+parameter);
  request.addEventListener("load", (event) => {
      if (event.target.status !== 200) {
          console.log(event.target.status + ":" + event.target.statusText);
          log.textContent = event.target.status + ":" + event.target.statusText;
          return;
      }
      console.log(event.target.status);
      console.log(event.target.responseText);
      var json = JSON.parse(event.target.responseText);
      if(json.error) log.textContent = json.error;
      else callback(json);
  });
  request.addEventListener("error", () => {
      console.error("Network Error");
      log.textContent = "Network Error";
  });
  request.send();
};
