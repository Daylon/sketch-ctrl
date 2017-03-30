'use strict'

const GULP = require( 'gulp' )
, GUTIL = require( 'gulp-util' )
, FS = require( 'fs' )
, SEQUENCE = require( 'gulp-sequence' )
, DEL = require( 'del' )
, UNZIP = require( 'gulp-unzip' )
, ZIP = require( 'gulp-zip' )
, RENAME = require( 'gulp-rename' )
, EVENT_STREAM = require('event-stream')
, ARGV = require( 'yargs' ).argv
, PATHS = {
  sources: `sources/`
  , sketchExt: `.sketch`
  , dist: `unpacked/`
  , defaultPattern: '**/*'
}

let getSourcePath = () => `${PATHS.sources}**/*${PATHS.sketchExt}`
, cleanupDist = () => DEL( `${PATHS.dist}**/*` )
, cleanupSources = () => DEL( `${PATHS.sources}**/*${PATHS.sketchExt}` )
, unpack = () => SEQUENCE( 'cleanup-dist', 'unpack-files' )()
, unpackFiles = function(){
  return GULP
    .src( getSourcePath() )
    .pipe( UNZIP({ useFolder: true }) )
    .pipe( GULP.dest( PATHS.dist ) )
}
, unpackSequence = () => SEQUENCE( 'cleanup-dist', 'unpack' )()
, buildAll = () => buildFile()
, build = function(){
  if( !ARGV.sketch || !ARGV.sketch.length ){
    throw new GUTIL.PluginError( 'ui-version-ctrl', '--sketch argument is missing' )
  }
  buildFile( `${ARGV.sketch}/${PATHS.defaultPattern}` )
}
// literature:
// https://github.com/BohemianCoding/libwebp/pull/5
// https://github.com/BohemianCoding/libwebp
, buildFile = function( pattern = PATHS.defaultPattern ){
  return GULP
    .src( `${PATHS.dist}${pattern}` )
    .pipe( ZIP( '', { inferFilename: true, rootAt: PATHS.dist } ) )
    .pipe( RENAME({ extname: PATHS.sketchExt }) )
    .pipe( GULP.dest( PATHS.sources ) )
}
, buildSequence = () => SEQUENCE( 'cleanup-sources', 'build-all' )()
, watchFiles = function(){
  GULP.watch(
    [ getSourcePath() ]
    , [ 'unpack' ]
    , [ 'add', 'change', 'unlink' ]
  )
}
, defaultGulptask = () => SEQUENCE( 'build-all', 'unpack-files', 'watch-files' )()

// unpack


GULP.task( 'cleanup-dist', cleanupDist )

GULP.task( 'cleanup-sources', cleanupSources )

GULP.task( 'unpack', unpack )

GULP.task( 'unpack-files', unpackFiles )

GULP.task( 'unpack-sequence', unpackSequence )
// builder

GULP.task( 'build', build )

GULP.task( 'build-all', buildAll )

GULP.task( 'build-all-then-clean', buildSequence )

// watchers and default

GULP.task( 'watch-files', watchFiles )

GULP.task( 'default', defaultGulptask )

module.exports = defaultGulptask
