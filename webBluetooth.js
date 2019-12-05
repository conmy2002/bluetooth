// serive 及 characteristic 定義，可用 16 進制 或 完整的 UUID 來表示，此處用最為常見的電量為例
// bluetooth SIG serive 規範 https://www.bluetooth.com/specifications/gatt/services/
const seriveUUID = 0x180f; // 或 "0000180f-0000-1000-8000-00805f9b34fb"
// bluetooth SIG characteristics 規範 https://www.bluetooth.com/specifications/gatt/characteristics/
const characteristicUUID = 0x2a19; // 或 "00002a19-0000-1000-8000-00805f9b34fb"

// 設備搜尋參數
const option = {
	//acceptAllDevices: true, // 采納所有設備，與 filters 擇一使用
	filters: [
		// 篩選設備，可多組，與 acceptAllDevices 擇一使用
		{
			services: [seriveUUID] // 篩選設備所包含的 service
			// name: 'Francois robot', // 設備名稱
			// namePrefix: 'Francois', // 設備前綴名稱，寫上 Francois 即可找到名稱為 Francois* 的設備
		}
	],
	optionalServices: [seriveUUID] // 設備上會使用到的 serviec，沒列入之後操作會有問題
};

// 進行設備搜尋
navigator.bluetooth
	.requestDevice(option)
	.then(device => {
		// 此處會取得在 UI(bowser 自帶的) 上所選擇的 device
		console.log("device", device);
		// 進行設備連接
		return device.gatt.connect();
	})
	.then(server => {
		// 取得 server
		console.log("server", server);
		return server.getPrimaryService(seriveUUID);
	})
	.then(service => {
		// 取得 service
		console.log("service", service);
		return service.getCharacteristic(characteristicUUID);
	})
	.then(characteristic => {
		// 取得 characteristic
		console.log("characteristic", characteristic);
		// 讀取數據
		return characteristic.readValue();
	})
	.then(event => {
		// 取得數據
		// 此處用 Uint8 將數據取出，是因為電量是用此為表示方式
		const len = event.target.value.byteLength;
		const res = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			res[i] = event.target.value.getUint8(i);
		}
		console.log(`目前設備電量 ${res[0]}%`);
	});

// 寫入值
const writeValue = characteristic => {
	const value = Uint8Array.of("a".charCodeAt(), "b".charCodeAt(), "c".charCodeAt());
	return characteristic.writeValue(value); // 回傳 Promise
};

// notification
const notification = characteristic => {
	return characteristic.startNotifications().then(characteristic => {
		characteristic.addEventListener("characteristicvaluechanged", event => {
			const len = event.target.value.byteLength;
			const res = new Uint8Array(len);
			for (let i = 0; i < len; i++) {
				res[i] = event.target.value.getUint8(i);
			}
			console.log("notification value", res);
		});
	});
};
