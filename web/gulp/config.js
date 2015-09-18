module.exports = {
	path: {
		build: {
			html: 'build/',
			js: 'build/js/',
			css: 'build/css/',
			img: 'build/img/',
			fonts: 'build/fonts/'
		},
		src: {
			html: 'src/index.jade',
			js: 'src/main.js',
			css: 'src/main.scss',
			img: 'src/blocks/**/*.{jpeg,jpg,png,svg}',
			fonts: 'src/blocks/helpers/fonts.*'
		},
		watch: {
			html: 'src/blocks/**/*.jade',
			js: 'src/js/*.js',
			css: 'src/blocks/**/*.{scss,sass,css}',
			img: 'src/blocks/**/*.{jpeg,jpg,png,svg}',
			fonts: 'src/blocks/helpers/fonts.*'
		},
		clean: 'build'
	},
	server: {
		host: 'localhost',
		port: '8888'
	}
};
