var joinAllSocket = function(user, eventName, sendData) {
	// если есть активные сокеты
	if (user.soketData !== undefined && user.soketData.length) {
		user.soketData.map(function socketsHandler(socketObj) {
			// отправляем данному пользователю на все соединения, что контакт находится в данном статусе
			socketObj.join(user.channel);
			socketObj.emit(eventName, sendData);
		});
	}
}

module.exports = joinAllSocket;
