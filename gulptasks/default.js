'use strict'

const GULP = require( 'gulp' )
, SEQUENCE = require( 'gulp-sequence' )
, DEL = require( 'del' )
, UNZIP = require( 'gulp-unzip' )
, PATHS = {
  sources: `sources/**/*.sketch`
  , dist: `unpacked/`
}

let unpack = () => SEQUENCE( 'cleanup', 'unpack-file' )()
, cleanup = () => DEL( `${PATHS.dist}**/*` )
, unpackFile = function(){
  return GULP.src( PATHS.sources )
    .pipe( UNZIP() )
    .pipe( GULP.dest( PATHS.dist ) )
}
, watchFiles = function(){
  GULP.watch(
  	[ PATHS.sources ]
  	, [ 'unpack' ]
  	, [ 'add', 'change', 'unlink' ]
  )
}
, defaultGulpTask = () => SEQUENCE( 'unpack', 'watch-files' )()

GULP.task(
  'unpack'
  , unpack
)

GULP.task(
  'unpack-file'
  , unpackFile
)

GULP.task(
  'defaultGulpTask'
  , defaultGulpTask
)

module.exports = defaultGulpTask
