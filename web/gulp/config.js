module.exports = {
	path: {
		build: {
			html: 'build/',
			js: 'build/js/',
			css: 'build/css/',
			img: 'build/img/',
			fonts: 'build/fonts/',
			vendorsCss: 'build/css/'
		},
		src: {
			js: 'src/index.js',
			css: 'src/**/*.{scss,sass,css}',
			img: 'src/img/**/*.*',
			fonts: 'src/fonts/**/*.*',
			vendorsCss: 'src/style/vendor/**/*.css'
		},
		watch: {
			html: 'src/**/*.jade',
			js: 'src/**/*.{js,sass,jsx}',
			css: 'src/style/**/*.{scss,sass,css}',
			img: 'src/img/**/*.*',
			fonts: 'src/fonts/**/*.*'
		},
		clean: 'build'
	},
	server: {
		host: 'localhost',
		port: '8080'
	}
};
