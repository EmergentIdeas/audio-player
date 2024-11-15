let appName = 'audio-player-local'

module.exports = {
	/**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps: [{
		name: appName + '-local-live',
		script: './web-server.js',
		"env": {
			PORT: 4000,
			NODE_ENV: 'development',
		}
	}	
]
};
