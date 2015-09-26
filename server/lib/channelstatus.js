function sendStatus(id, Users, event_name, to, additionalData) {
	var userData = Users[id],
	keysChannels = Object.keys(userData.contacts);
	if(to === "all" || to === undefined) {
		//будем отправлять другим пользователям , что пользователь появился
		if(keysChannels.length) {
			keysChannels.map(function channelsHandler (key) {
				//отправляем уведомление только в каналы типа user
				if(userData.contacts[key].type === "user") {
					var userId = userData.contacts[key].user;
					//проверяем если пользоваетель онлайн
					if(Users.hasOwnProperty(userId)) {
						emmitEvent(Users[userId], additionalData,event_name);
					}
				}

			});
		}
	} else {
		if(Users.hasOwnProperty(to)) {
			//проверяем если пользоваетель онлайн
			emmitEvent(Users[to], additionalData,event_name);
		}
	}

}

function emmitEvent(user, additionalData,event_name) {
	//если есть активные сокеты
	if(user.soketData !== undefined && user.soketData.length) {
		user.soketData.map(function socketsHandler (socketObj) {
			//отправляем данному пользователю на все соединения, что контакт находится в данном статусе
			var sendData = {channel: key};

			if(additionalData) {
				sendData.custom = additionalData;
			}

			socketObj.emit(event_name, sendData);
		});
	}
}

module.exports = sendStatus;
