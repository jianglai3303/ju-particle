var gulp = require( 'gulp' ),
    seajsCombo = require( 'gulp-seajs-combo' ),
    rename = require('gulp-rename'),
    concat = require('gulp-concat');

    
gulp.task( '2d', function(){
    gulp.src( 'src/2d_sdk.js' )
    	.pipe( seajsCombo() )
    	.pipe( rename(function (path) {
		    path.basename += "_temp";
		 }))
    	.pipe( gulp.dest('src/build') )
    gulp.src(['src/jquery.min.js','src/Math/glMatrix-0.9.5.js','src/Math/perlin-noise.js','src/sea.js','src/build/2d_sdk_temp.js'])
    	.pipe(concat('2d_all_sdk.js'))
    	.pipe( gulp.dest('src/build'));
});
gulp.task( '3d', function(){
    gulp.src( 'src/3d_sdk.js' )
        .pipe( seajsCombo() )
        .pipe( rename(function (path) {
            path.basename += "_temp";
         }))
        .pipe( gulp.dest('src/build') )
    gulp.src(['src/jquery.min.js','src/Math/glMatrix-0.9.5.js','src/Math/perlin-noise.js','src/sea.js','src/three.min.js','src/OBJLoader.js','src/build/3d_sdk_temp.js'])
        .pipe(concat('3d_all_sdk.js'))
        .pipe( gulp.dest('src/build'));
});  