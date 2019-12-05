# 藍牙

## 基本知識

1. 藍牙 4.0 分為經典藍牙與 ble(低功耗) 藍牙，本說明為 ble。
2. 藍牙通訊將連結設備(通常是手機)稱為 client 端，被連結設備(如穿戴式手環)稱為 server 端。
3. server 端可啟動廣播功能，告訴大家目前它處於待連結狀態。
4. client 端可接收廣播，並對 server 端發出連線請求，確認完成連線後即可讀取 server 端的 service 項目。
5. server 端會提供數個 service，各 service 下含有數個 characteristic，每個 characteristic 即為實際可操作的接口。
6. 每個 service 與 characteristic 皆有獨立的 UUID。藍牙技術聯盟(bluetooth SIG)有對各項進行標準定義，但仍有自定義空間。
7. 對 characteristic 的操作行為共有 read、write、notify 及 indicate 四種，但並非所有 characteristic 都可進行這四種操作。
8. read 為對 characteristic 讀取資料，如設備剩餘電量等等。
9. write 為對 characteristic 寫入資料，也可用作對 server 發出請求。
10. notify 及 indicate 的功能皆為訂閱，差別在於 indicate 在收到通知後會再回覆 server 一個 ACK，告知有收到。此類型可搭配 write 進行使用，例如對一個 characteristic 發出訂閱後，再對 characteristic write 所想取得的資料類型(此時的 characteristic 可已是同一個)，這時 server 即可透過訂閱的 characteristic 回覆結果。
11. 每個可 notify 或 indicate 的 characteristic 之下都一定會有一個 descriptors(0x2902)，用途為描述目前 notify 及 indicate 目前是否已訂閱。

## 測試方式

1. 於手機上下載 app `nRF Connect`，搜尋設備並連結後，可以看到設備所有的 service 與 characteristic。
2. 可於每個 characteristic 上可以看到能進行的操作。一個向下箭頭是 read，一個向上箭頭是 write，三個向下箭頭是 notify，一上一下箭頭是 indicate 。點擊該圖示即可進行操作。
3. 可於 characteristic 進行 read、write、notify 及 indicate 的操作。
4. 寫入資料分為多總類型，BYTE ARRAY 為 16 進制兩個一碼。

## 察看藍牙技術聯盟(bluetooth SIG) 的 characteristic 規範

註：並不是所有藍牙設備製造商都一定會依標準走，所以也有可能以下方式取不到值的狀況...

此部份關係到如何解析從 characteristic 處所讀取到的數據，因為每個 characteristic 所規範的資料結構都不同，詳細的內容可在[此處]((https://www.bluetooth.com/specifications/gatt/characteristics/))查閱。

* 例：[電池電量 0x2A19](https://www.bluetooth.com/wp-content/uploads/Sitecore-Media-Library/Gatt/Xml/Characteristics/org.bluetooth.characteristic.battery_level.xml)，此 Value 中含有一個 Field，格式為 uint8，最小值 0，最大值100。所以程式在 characteristic 上取到 value 時，讀取前 8 個 bit 轉為 10 進制，就是目前設備電量百分比。

* 例：[日期時間 0x2A08](https://www.bluetooth.com/wp-content/uploads/Sitecore-Media-Library/Gatt/Xml/Characteristics/org.bluetooth.characteristic.date_time.xml)，此 Value 第一個 Field 為 Year，格式為 uint16，最小值 1582，最大值 9999。所以程式讀取前 16 個 bit 轉為 10 進制，就是年份。Month 格式為 uint8，就是的 17 到 24 個 bit。以此類推...

## bowser 端的藍牙(以 chrome 為例)

1. Mac (Chrome 56) and Windows 10 (Chrome 70) 以上可使用，Linux 上需開始 flag [連結](chrome://flags/#enable-experimental-web-platform-features)。
2. 藍牙 API 為於 navigator.bluetooth，相關使用方式可於[程式碼](./webBluetooth.js)中察看。

## 參考網站

* [Interact with Bluetooth devices on the Web](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web)