'use strict'

const GULP = require( 'gulp' )
, FS = require( 'fs' )
, SEQUENCE = require( 'gulp-sequence' )
, DEL = require( 'del' )
, UNZIP = require( 'gulp-unzip' )
, ZIP = require( 'gulp-zip' )
, RENAME = require( 'gulp-rename' )
, EVENT_STREAM = require('event-stream')
, PATHS = {
  sources: `sources/`
  , sketchExt: `.sketch`
  , dist: `unpacked/`
}

let getSourcePath = () => `${PATHS.sources}**/*${PATHS.sketchExt}`
, unpack = () => SEQUENCE( 'cleanup', 'unpack-file' )()
, cleanup = () => DEL( `${PATHS.dist}**/*` )
, unpackFile = function(){
  return GULP
    .src( getSourcePath() )
    .pipe( UNZIP({ useFolder: true }) )
    .pipe( GULP.dest( PATHS.dist ) )
}
, watchFiles = function(){
  GULP.watch(
  	[ getSourcePath() ]
  	, [ 'unpack' ]
  	, [ 'add', 'change', 'unlink' ]
  )
}
, buildAll = () => buildFile()
// literature:
// https://github.com/BohemianCoding/libwebp/pull/5
// https://github.com/BohemianCoding/libwebp
, buildFile = function( pattern = '**/*' ){
  return GULP
    .src( `${PATHS.dist}${pattern}` )
    .pipe( ZIP( 'toto', { inferFilename: true } ) )
    .pipe( RENAME({ extname: PATHS.sketchExt }) )
    .pipe( GULP.dest( PATHS.sources ) )
}
, defaultGulptask = () => SEQUENCE( 'unpack', 'watch-files' )()
, buildSequence = () => SEQUENCE( 'build-all', 'cleanup' )()

// unpack

GULP.task( 'unpack', unpack )

GULP.task( 'cleanup', cleanup )

GULP.task( 'unpack-file', unpackFile )

// builder

GULP.task( 'build-all-no-clean', buildAll )

GULP.task( 'build-all', buildSequence )

GULP.task( 'build-all-files-then-cleanup', buildSequence )

// watchers and default

GULP.task( 'watch-files', watchFiles )

GULP.task( 'default', defaultGulptask )

module.exports = defaultGulptask
