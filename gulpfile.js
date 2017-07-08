(function(){

	var gulp = require("gulp");
	var uglify = require("gulp-uglify");
	var filter = require("gulp-filter");
	var sass = require('gulp-sass');
	var sourcemaps = require('gulp-sourcemaps');
	var cleanCSS = require('gulp-clean-css');
	var browserSync = require('browser-sync').create();
	var reload = browserSync.reload;
	
	//postcss
	var postcss = require('gulp-postcss');
	var autoprefixer = require('autoprefixer');
	var px2rem = require('postcss-px2rem');

	var processors = [
		autoprefixer({
			browsers: ['ie >= 9', 'Chrome >= 20', 'Android >= 3.0', 'Firefox >= 10']
		})
	];


	/**
	 * 定义sass任务
	 * @return 生成sourcemap、css、压缩成单行的css
	 */
	gulp.task('sass', function() {
		return gulp.src('sass/*.scss')
			.pipe(sourcemaps.init())
			.pipe(sass({
				outputStyle: 'compact'
			}).on('error', sass.logError))
			.pipe(cleanCSS({
				keepBreaks: true,
				compatibility: 'ie7',
				advanced: false
			}))
			.pipe(postcss(processors))
			// .pipe(cleanCSS())
			// .pipe(replace(/}/g, '} \r\n'))
			.pipe(sourcemaps.write('.map/'))
			.pipe(gulp.dest('css'))
			.pipe(filter('**/*.css')) // Filtering stream to only css files
			.pipe(reload({stream:true}));  //need browserSync
	});


	/**
	 * 定义多重任务
	 */
	gulp.task('default', function() {

		//指定文件，用browserSync监听文件变化
		browserSync.init({
			server: {
	            baseDir: "./"
	        }
		});

		//监听文件变化并执行sass任务
		gulp.watch('sass/*.scss', ['sass']);

		//监听html发生变化时手动重载浏览器
		gulp.watch("*.html").on("change", browserSync.reload);

	});



})();