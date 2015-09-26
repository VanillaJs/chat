function sendStatus(id, Users, event_name, toChannel, additionalData) {
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
						emmitEvent(Users[userId], key, additionalData,event_name);
					}
				}

			});
		}
	} else {
		if(Users.hasOwnProperty(toChannel.user)) {
			//проверяем если пользоваетель онлайн
			emmitEvent(Users[toChannel.user],toChannel._id, additionalData,event_name);
		}
	}

}

function emmitEvent(user, channelId, additionalData,event_name) {
	//если есть активные сокеты
	if(user.soketData !== undefined && user.soketData.length) {
		user.soketData.map(function socketsHandler (socketObj) {
			//отправляем данному пользователю на все соединения, что контакт находится в данном статусе
			var sendData = {channel: channelId};

			if(additionalData) {
				sendData.custom = additionalData;
			}

			socketObj.emit(event_name, sendData);
		});
	}
}

module.exports = sendStatus;
