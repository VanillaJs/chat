module.exports = {
	port: 3000,
	defaultChannel: '1bd3b5a8a7a560e168b3890a',
	app: {
		serverUrl: 'http://localhost:3000',
		socketOrigin: 'http://localhost:*'
	},
	mongoose: {
		'uri': 'mongodb://127.0.0.1:27017',
		'options': {
			'server': {
				'socketOptions': {
					'keepAlive': 1
				}
			}
		}
	},
	session: {
		'secret': 'chatseesion',
		'key': 'sid',
		'cookie': {
			'path': '/',
			'httpOnly': true,
			'maxAge': null
		}
	},
	defaultChannelId: '1bd3b5a8a7a560e168b3890a',
	YANDEX_TRANSLATE_API_KEY: '',
	PEERJS_KEY: '',
	STREAM_REQUEST_TIMEOUT: 5000
};
