function sendStatus(id, Users, status) {
	var userData = Users[id],
	keysChannels = Object.keys(userData.contacts);
	//будем отправлять другим пользователям , что пользователь появился
	if(keysChannels.length) {
		keysChannels.map(function channelsHandler (key) {
			//отправляем уведомление только в каналы типа user
			if(userData.contacts[key].type === "user") {
				var userId = userData.contacts[key].user;
				//проверяем если пользоваетель онлайн
				if(Users.hasOwnProperty(userId)) {
					//если есть активные сокеты
					if(Users[userId].soketData !== undefined && Users[userId].soketData.length) {
						Users[userId].soketData.map(function socketsHandler (socketObj) {
							//отправляем данному пользователю на все соединения, что контакт находится в данном статусе
							console.log('s.channel.'+status);
							socketObj.emit('s.channel.'+status, {channel: key});
						});
					}

				}
			}

		});
	}
}

module.exports = sendStatus;
