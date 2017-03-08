'use strict'

const GULP = require( 'gulp' )
, FS = require( 'fs' )
, SEQUENCE = require( 'gulp-sequence' )
, DEL = require( 'del' )
, UNZIP = require( 'gulp-unzip' )
, EVENT_STREAM = require('event-stream')
, PATHS = {
  sources: `sources/**/*.sketch`
  , dist: `unpacked/`
}

let unpack = () => SEQUENCE( 'cleanup', 'unpack-file' )()
, cleanup = () => DEL( `${PATHS.dist}**/*` )
, unpackFile = function(){
  return GULP
    .src( PATHS.sources )
    .pipe( UNZIP({ useFolder: true }) )
    .pipe( GULP.dest( PATHS.dist ) )
}
, watchFiles = function(){
  GULP.watch(
  	[ PATHS.sources ]
  	, [ 'unpack' ]
  	, [ 'add', 'change', 'unlink' ]
  )
}
, defaultGulptask = () => SEQUENCE( 'unpack', 'watch-files' )()

GULP.task(
  'unpack'
  , unpack
)

GULP.task(
  'cleanup'
  , cleanup
)

GULP.task(
  'unpack-file'
  , unpackFile
)

GULP.task(
  'watch-files'
  , watchFiles
)

GULP.task(
  'default'
  , defaultGulptask
)

module.exports = defaultGulptask
