
import { View } from '@webhandle/backbone-view'
import makeTree from 'kalpa-tree-on-page'
import Emitter from '@webhandle/minimal-browser-event-emitter'
import DataItemWorker from '@webhandle/drag-sortable-list/client-lib/data-item-worker.mjs'

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
		this.nodesByPath = {}
		
		this.uniquify = 1
	}
	
	getFullPath(path) {
		let parts = path.split('/').filter(item => !!item)
		return parts.join('/')
	}
	getParentPath(path) {
		let parts = path.split('/').filter(item => !!item)
		if(parts.length < 2) {
			return ''
		}
		parts.pop()
		return parts.join('/')
	}
	

	getTreePathParts(path) {
		let extExp = /(.*)(\..{3,4})$/i
		let segments = path.match(extExp)
		if(segments) {
			path = segments[1]
		}
		let pathParts = path.split('/').filter(item => !!item)
		let name = pathParts.pop()
		let nameParts = name.split(' - ').filter(item => !!item).map(item => item.trim())
		
		let pathInfo = {

		}
		if(nameParts.length == 4) {
			pathInfo.artist = nameParts[0]
			pathInfo.album = nameParts[1]
			pathInfo.trackNum = nameParts[2]
			pathInfo.name = nameParts[3]
		}
		else if(nameParts.length == 3) {
			pathInfo.artist = nameParts[0]
			pathInfo.album = nameParts[1]
			pathInfo.name = nameParts[2]
		}
		else if(nameParts.length == 2) {
			pathInfo.artist = nameParts[0]
			pathInfo.name = nameParts[1]
		}
		else if(nameParts.length > 4) {
			pathInfo.artist = nameParts[0]
			pathInfo.album = nameParts[1]
			pathInfo.trackNum = nameParts[2]
			pathInfo.name = nameParts[nameParts.length - 1]
		}
		else if(nameParts.length == 1) {
			pathInfo.name = nameParts[0]
			
			if(pathParts.length > 0) {
				pathInfo.artist = pathParts[pathParts.length - 1]
			}
		}

		return pathInfo
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
				let newNodesPaths = new Set()
				for (let file of files) {
					let parentId = 0
					let treePath = this.getTreePathParts(file.fullPath)
					let parentPath = treePath.album ? treePath.artist + '/' + treePath.album : treePath.artist
					let parent = this.nodesByPath[parentPath]
					
					let artistNode
					let albumNode
					if(!parent && treePath.artist) {
						artistNode = this.nodesByPath[treePath.artist]
						if(!artistNode) {
							artistNode = {
								parentId: parentId
								, id: counter++
								, label: treePath.artist
							}
							
							this.nodesByPath[treePath.artist] = artistNode
							newNodesPaths.add(treePath.artist)
						}
						if(treePath.album) {
							// This can't exist yet otherwise we would have found it as the parent
							albumNode = {
								parentId: artistNode.id
								, id: counter++
								, label: treePath.album
							}
							this.nodesByPath[parentPath] = albumNode
							newNodesPaths.add(parentPath)
							parent = albumNode
						}
						else {
							parent = artistNode
						}
					}
					
					if(parent) {
						parentId = parent.id
					}
					
					let add = {
						parentId: parentId
						, id: counter++
						, label: treePath.name
						, file: file
						, data: file
						, mediaMeta: treePath
					}
					
					let path = (parentPath ? parentPath + '/' : '') + treePath.name
					
					if(path in this.nodesByPath) {
						// We already have a node with this path, maybe because a file has the same name as
						// a folder.
						path += this.uniquify++
					}
					this.nodesByPath[path] = add
					newNodesPaths.add(path)
				}
				newNodesPaths = [...newNodesPaths]
				newNodesPaths.sort()
				for(let path of newNodesPaths) {
					this.nodesEmitter.emit('data', this.nodesByPath[path])
				}
			}
		})
		return p
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
			let rootNode = {
				id: 0
				, label: 'music'
			}
			view.nodesByPath[''] = rootNode
			view.nodesEmitter.emit('data', rootNode)
			
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