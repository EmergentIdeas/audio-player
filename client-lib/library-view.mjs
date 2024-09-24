
import { View } from '@webhandle/backbone-view'
import makeTree from 'kalpa-tree-on-page'
import Emitter from '@webhandle/minimal-browser-event-emitter'
import DataItemWorker from '@webhandle/drag-sortable-list/client-lib/data-item-worker.mjs'
import { MediaLibrary } from './media-library.mjs'

let dataItemWorker = new DataItemWorker()

let counter = 1

export default class LibraryView extends View {

	/**
	 * Setup the event listners and default objects.
	 * @param {Object} options 
	 */
	preinitialize(options = {}) {
		this.events = Object.assign({}, {
			'dragover .': 'handleDropzoneDragover'
			, 'drop .': 'handleDropzoneDrop'
			, 'dragstart .kalpa-tree li.node': 'handleNodeDragStart'
			, 'keydown input[name="libFilter"]': 'handleSearch'
			, 'change input[name="libFilter"]': 'handleSearch'
			// , 'dragover .drop-zone': 'handleDropzoneDragover'
			// , 'drop .drop-zone': 'handleDropzoneDrop'
			// , 'dragover .kalpa-tree': 'handleDropzoneDragover'
			// , 'drop .kapla-tree': 'handleDropzoneDrop'

		}, options.events)
		options.events = this.events
		if (!this.emitter) {
			this.emitter = options.emitter || new Emitter()
		}
		this.nodesEmitter = new Emitter()

		this.mediaLibrary = new MediaLibrary()
		this.uniquify = 1
	}

	getFullPath(path) {
		let parts = path.split('/').filter(item => !!item)
		return parts.join('/')
	}
	getParentPath(path) {
		let parts = path.split('/').filter(item => !!item)
		if (parts.length < 2) {
			return ''
		}
		parts.pop()
		return parts.join('/')
	}


	async handleNodeDragStart(evt, selected) {
		let id = selected.getAttribute('data-id')
		let dataNode = this.tree.get(id)

		evt.dataTransfer.setData('text', dataNode.data.name)

		let label = `data:text/label,${dataNode.label}`
		evt.dataTransfer.setData(label, label)

		evt.dataTransfer.setData('data:text/mode', 'external-drag')
		this.emitter.emit('external-file-item-drag', {
			action: 'external-file-item-drag'
			, data: [dataNode].map(node => node.data)
		})
	}

	handleSearch(evt, selected) {
		// evt.preventDefault()
		// evt.stopPropagation()
		setTimeout(() => {
			this.tree.search(selected.value)

		}, 1)
	}
	/**
	 * Watch for movement of something being dragged
	 * @param {Event} evt 
	 * @param {Element} selected 
	 */
	handleDropzoneDragover(evt, selected) {
		evt.preventDefault()
		evt.stopPropagation()
	}
	/**
	 * Creates permanent cells for external items dropped into the list,
	 * emits events, and does cleaup
	 * @param {Event} evt 
	 * @param {Element} selected 
	 */
	handleDropzoneDrop(evt, selected) {
		evt.preventDefault()


		let p = new Promise(async (resolve, reject) => {
			let uriList
			if (evt.dataTransfer) {
				uriList = evt.dataTransfer.getData('text/uri-list')
			}

			if (uriList) {
				// if a link is dropped, there's no exteralDrag object, just a drop object

				if (typeof uriList == 'string') {
					// Acording to the spec, this should be a list with one uri on every line
					// In practice, it seems like the browser is eating the return characters
					// In my tests, I'm passing multiple uris as comma separated. I'm handling
					// both cases here.
					let parts = [uriList]
					for (let sep of ['\r\n', '\n', ',']) {
						let newParts = []
						for (let part of parts) {
							newParts.push(...part.split(sep))
						}
						parts = newParts
					}
					uriList = parts
				}
				cells = this.createCellsForUriList(uriList)
			}
			else {
				let files = await dataItemWorker.getFileEntriesFromEvent(evt, {
					keepDirectories: false
					, recursive: true
				})
				for (let file of files) {
					this.mediaLibrary.add(file.fullPath, file)
				}
				this.redrawNodes()
			}
		})
		return p
	}
	
	rerootTree() {
		this.tree.removeNode(0)
		let rootNode = {
			id: 0
			, label: 'music'
		}
		this.nodesEmitter.emit('data', rootNode)
	}

	redrawNodes() {
		let parentId = 0
		let newNodes = []
		this.rerootTree()
		for (let artist of this.mediaLibrary.getArtistSortedByName()) {
			let artistNode = {
				parentId: parentId
				, id: counter++
				, label: artist.name
			}
			newNodes.push(artistNode)
			for (let album of artist.getNamedAlbums()) {
				let albumNode = {
					parentId: artistNode.id
					, id: counter++
					, label: album.name
				}
				newNodes.push(albumNode)
				for (let track of album.tracks) {
					let trackNode = {
						parentId: albumNode.id
						, id: counter++
						, label: track.name
						, data: track.data
						, file: track.file
						, mediaMeta: track.mediaMeta
						, track: track
					}
					newNodes.push(trackNode)
				}
			}
			let unnamedAlbum = artist.getUnnamedAlbum()
			if (unnamedAlbum) {
				for (let track of unnamedAlbum.tracks) {
					let trackNode = {
						parentId: artistNode.id
						, id: counter++
						, label: track.name
						, data: track.data
						, file: track.file
						, mediaMeta: track.mediaMeta
						, track: track
					}
					newNodes.push(trackNode)
				}
			}
		}
		for (let node of newNodes) {
			this.nodesEmitter.emit('data', node)
		}
	}

	nodeSelectedFromTree(node) {
		this.el.querySelector('input[name="libFilter"]').value = null

	}

	render() {
		let view = this

		makeTree({
			stream: view.nodesEmitter
			, treeContainerSelector: '.player-controls .library .kalpa-tree'
		}).then(tree => {
			view.tree = tree
			this.rerootTree()

			this.tree.on('select', (node) => {
				view.nodeSelectedFromTree(node)
			})

			let updateDraggable = () => {
				view.el.querySelectorAll('.kalpa-tree li.node').forEach(node => node.setAttribute('draggable', true))
				setTimeout(() => {
					view.el.querySelectorAll('.kalpa-tree li.node').forEach(node => node.setAttribute('draggable', true))
				}, 200)
			}
			tree.on('rebind', updateDraggable)
			tree.on('rebind:exit', updateDraggable)
		})

	}

}