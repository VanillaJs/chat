module.exports = {
	path: {
		build: {
			img: 'static/img/',
			fonts: 'static/fonts/',
			vendorsCss: 'static/css/'
		},
		src: {
			img: 'src/img/**/*.*',
			fonts: 'src/fonts/**/*.*',
			vendorsCss: 'src/style/vendor/**/*.css'
		},
		watch: {
			css: 'src/style/**/*.{scss,sass,css}',
			img: 'src/img/**/*.*',
			fonts: 'src/fonts/**/*.*'
		},
		clean: 'static'
	}
};
