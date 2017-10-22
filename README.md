
# ModerateClothes

[![Product Name](thumbnail.png)](https://youtu.be/l51pYL7iX4g)

## 製品概要
### Cloth(服) × Tech

### 背景（製品開発のきっかけ、課題等）
１日の始まり、会社や学校へ行く前に、こんなことで悩んだことはありませんか？
- 今日の温度を知りたいけど、調べている時間がない…
- でも、ニュースを見たりアプリを開いたりするのは面倒くさい…
- どの服が今日に最適であるかがわからない…

あなたのそんなお悩みは、ModerateClothesにお任せください。

### 製品説明（具体的な製品の説明）
##### ModerateClothesはあなたにいつでも最適なコーディネートをお届けします！  

　通知の欲しいタイミング、性別、住んでいる地域を登録するだけで、今日の温度と気温差のデータから、それにあった最適な服装を通知でお知らせします。

1.まずはラインで友達登録。  
![QRコード](linebot.png)  
2.住んでいる地域と性別を登録。  
3.さあ、ModerateClothesでスマートな朝を体験しましょう！！

### 特長

#### 1. 特長1
今日の気温と湿度から不快度指数を算出！  今日の服装を選ぶ参考となる情報を自動生成

#### 2. 特長2
今日の最高気温、最低気温、天気をもとに今日と似た天候の日を算出。その日にファッションサイトに投稿された画像を選別し参考として表示します。

#### 3. 特長3
シンプルかつ可愛らしいUI！イラストで直観的にわかりやく、あなたを長い文字でイライラさせません。

### 解決出来ること
「今日に適した服が分からない…」  
「昨日は厚かったから薄手の服を着ていったが今日は寒かった…」  
「昼は暑かったけど、夕方一気に冷え込んだ。でも上着を忘れちゃった…」  
といった煩わしさ、もやもやを一気に解消します！  

##### あなたはもう二度と、着る服の選択を間違えることはありません！

### 今後の展望
- ユーザーの好みの算出をして、着る服の厚さだけでなく、ユーザーのセンスに合うファッションもサポート。
- リッチメニューによってユーザーとインタラクティブにやり取り。地域を移動した場合や、設定をより手軽に変更できるようにします。
- 服装に変化が少なくなる真夏や真冬には通知頻度を下げる。
- ファッションオンライン販売サイトとの提携による収益化。最適なファッションに必要なアイテムをユーザーに示し、より効率的にその製品を宣伝することができます。


## 開発内容・開発技術
### 活用した技術

#### フレームワーク・ライブラリ・モジュール・API
* Google Apps Script
* LINE Messaging API
* OpenWeatherMap API
* XML Service Service
* GoogleDrive API
* Dropbox API

#### デバイス
* LINEアプリをインストールしたスマートフォン


### 独自開発技術（Hack Dayで開発したもの）
#### 2日間に開発した独自の機能・技術
* 今日の気温、湿度から不快度指数を算出し、度数に合ったコメントを自動生成
* 最高気温、最低気温、天気から今日と似た天候の日を複数算出、それらをもとにファッションサイトの画像を取得（50299113d885658a2a5752cf6da0682acc6181c2, 7ee6a018cff9461c6b680216bacc363676b491e8）
