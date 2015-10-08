function emmitEvent(user, channelId, additionalData, eventName) {
	// если есть активные сокеты
	if (user.soketData !== undefined && user.soketData.length) {
		user.soketData.map(function socketsHandler(socketObj) {
			// отправляем данному пользователю на все соединения, что контакт находится в данном статусе
			var sendData = {channel: channelId};

			if (additionalData) {
				sendData.custom = additionalData;
			}
			socketObj.emit(eventName, sendData);
		});
	}
}

function sendStatus(id, Users, eventName, toChannel, additionalData) {
	var userId;
	var userData = Users[id];
	var keysChannels;
	if (userData !== undefined) {
		keysChannels = Object.keys(userData.contacts);
		if (toChannel === undefined) {
			// будем отправлять другим пользователям , что пользователь появился
			if (keysChannels.length) {
				keysChannels.map(function channelsHandler(key) {
					// отправляем уведомление только в каналы типа user
					if (userData.contacts[key].type === 'user') {
						userId = userData.contacts[key].user;
						// проверяем если пользоваетель онлайн
						if (Users.hasOwnProperty(userId)) {
							emmitEvent(Users[userId], key, additionalData, eventName);
						}
					}
				});
			}
		} else {
			if (Users.hasOwnProperty(toChannel.user)) {
				// проверяем если пользоваетель онлайн
				emmitEvent(Users[toChannel.user], toChannel._id, additionalData, eventName);
			}
		}
	}
}

module.exports = sendStatus;
