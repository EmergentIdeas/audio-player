import { default as go } from './index.js'
go()


import ListView from '@webhandle/drag-sortable-list'
import PlayControlsView from '../client-lib/player-controls.mjs'
import Player from '../client-lib/player.mjs'
import Emitter from '@webhandle/minimal-browser-event-emitter'
import PlaylistView from '../client-lib/playlist-view.mjs'
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
// let playlistView = new ListView({
// 	el: playlist
// 	, emitter: emitter
// 	, mobileHandleSelector: '.handle'
// 	, events: {
// 		'dblclick .cell': 'doubleClick'
// 		, 'click .remove': 'removeCell'
// 	}
// 	, doubleClick(evt, selected) {
// 		controlsView.emitter.emit('play-item', {
// 			item: selected
// 		})
// 	}
// 	, removeCell(evt, selected) {
// 		let cell = selected.closest('.cell')

// 		this.emitter.emit('list-change', {
// 			type: 'remove'
// 			, cells: [cell]
// 			, event: evt
// 		})
// 		cell.remove()
// 	}
// 	/**
// 	 * Creates permanent cells for files dropped into the list
// 	 * @param {array} files 
// 	 * @returns an array of Elements
// 	 */
// 	, createCellsForFiles(files) {
// 		let cells = files.map(file => {
// 			let html = `<div class="cell">
// 				<span class="handle">↕</span>
// 				<span class="title">${file.name}</span>
// 				<span class="remove">&times</span>
// 			</div>`
// 			let el = this._makeElementFromHTML(html)
// 			el.data = file
// 			return el
// 		})
// 		return cells
// 	}

// 	/**
// 	 * Creates permanent cells for resource objects dropped into the list
// 	 * @param {array[string]} uriList 
// 	 * @returns an array of Elements
// 	 */
// 	, createCellsForUriList(uriList) {
// 		if(!Array.isArray(uriList)) {
// 			uriList = [uriList]
// 		}
// 		let cells = uriList.map(uri => {
// 			let html = `<div class="cell">
// 				<span class="handle">↕</span>
// 				<span class="title">${uri}</span>
// 				<span class="remove">&times</span>
// 			</div>`
// 			let el = this._makeElementFromHTML(html)
// 			el.data = uri
// 			return el
// 		})
// 		return cells
// 	}
// })
playlistView.render()


let player = new Player({
	controlEvents: emitter
	, playlist: playlistView
})


let nodesEmitter = new Emitter()

makeTree({
	stream: nodesEmitter
	, treeContainerSelector: '.player-controls .library .kalpa-tree'
}).then(tree => {
	nodesEmitter.emit('data', {
		id: 0
		, label: 'music'
	})
	controlsView.tree = tree
	controlsView.nodesEmitter = nodesEmitter


	tree.on('dndstart', function (eventData) {
		console.log('drag start')
		// eventData.el -> The DOM node the user is moving
		// eventData.traveler -> The DOM traveling node created by the tree which can actually be moved
		// eventData.layout -> Layout data describing the moving node
		// eventData.data -> Data bound to this tree node
	})


	// Do something with the tree
})