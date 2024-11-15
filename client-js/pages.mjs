import { default as go } from './index.js'
// go()


// import ListView from '@webhandle/drag-sortable-list'
import PlayControlsView from '../client-lib/player-controls.mjs'
import Player from '../client-lib/player.mjs'
import Emitter from '@webhandle/minimal-browser-event-emitter'
import PlaylistView from '../client-lib/playlist-view.mjs'
import LibraryView from '../client-lib/library-view.mjs'
import makeTree from 'kalpa-tree-on-page'


let emitter = new Emitter()

let controls = document.querySelector('.controls')
let controlsView = new PlayControlsView({
	el: controls
	, emitter: emitter
})
controlsView.render()

let playlist = document.querySelector('.playlist')
let playlistView = new PlaylistView({
	el: playlist
	, emitter: emitter
})
playlistView.render()


let player = new Player({
	controlEvents: emitter
	, playlist: playlistView
})


let library = document.querySelector('.library')
let libraryView = new LibraryView({
	el: library
	, emitter: emitter
})
libraryView.render()

