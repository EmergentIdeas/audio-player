
import ListView from '@webhandle/drag-sortable-list'
import DataItemWorker from '@webhandle/drag-sortable-list/client-lib/data-item-worker.mjs'

let dataItemWorker = new DataItemWorker()

export default class PlaylistView extends ListView {

	preinitialize(options = {}) {
		if(options.emitter) {
			this.emitter = options.emitter
		}
		super.preinitialize(options)
		this.events['dblclick .cell'] = 'doubleClick'
		this.events['click .remove'] = 'removeCell'
		
		this.emitter.on('external-file-item-drag', (evt) => {
			this.externalDragData = {
				data: evt.data
				, track: evt.track
				, mediaMeta: evt.mediaMeta
			}
		})

		this.emitter.on('enqueue-command', (evt) => {
			if(evt.tracks && evt.tracks.length > 0) {
				this.addTracksToQueue(evt.tracks)
			}
			else if(evt.files && evt.files.length > 0) {
				this.addFilesToQueue(evt.files)
			}
		})
	}
	doubleClick(evt, selected) {
		this.emitter.emit('play-item', {
			item: selected
		})
	}

	removeCell(evt, selected) {
		let cell = selected.closest('.cell')

		this.emitter.emit('list-change', {
			type: 'remove'
			, cells: [cell]
			, event: evt
		})
		cell.remove()
	}

	isExternalDrop(evt) {
		let uriList
		let mode
		if (evt.dataTransfer) {
			uriList = evt.dataTransfer.getData('text/uri-list')
			mode = evt.dataTransfer.getData('data:text/mode')
		}

		if (this.externalDrag || uriList) {
			return true
		}
		if(mode == 'external-drag' && this.externalDragData) {
			return true
		}
		return false
	}
	
	getTrackEntries(evt) {
		let mode
		if (evt.dataTransfer) {
			mode = evt.dataTransfer.getData('data:text/mode')
		}
		if(mode == 'external-drag' && this.externalDragData && this.externalDragData.track) {
			return [this.externalDragData.track]
		}
	}
	async getFilesEntries(evt) {
		let mode
		if (evt.dataTransfer) {
			mode = evt.dataTransfer.getData('data:text/mode')
		}
		if(mode == 'external-drag' && this.externalDragData) {
			let files = await dataItemWorker.expandEntries(this.externalDragData.data, {
				keepDirectories: false
				, recursive: true
			})
			delete this.externalDragData
			return files
		}
		else {
			let files = await dataItemWorker.getFileEntriesFromEvent(evt, {
				keepDirectories: false
				, recursive: true
			})
			return files

		}
	}
	
	addTracksToQueue(tracks) {
		let cells = []
		let changes = []
		cells.push(...this.createCellsForTracks(tracks))
		for (let cell of cells) {
			this.addCell(cell, { })
			changes.push({
				cell: cell
				, file: cell.file
			})
		}
		this.emitter.emit('list-change', {
			type: 'enqueue'
			, cells: cells
			, tracks: tracks
			, files: tracks.map(track => track.file)
			, changes: changes
		})
	}
	
	addFilesToQueue(files) {
		let cells = []
		let changes = []
		cells.push(...this.createCellsForFiles(files))
		for (let cell of cells) {
			this.addCell(cell, { })
			changes.push({
				cell: cell
				, file: cell.file
			})
		}
		this.emitter.emit('list-change', {
			type: 'enqueue'
			, cells: cells
			, files: files
			, changes: changes
		})
	}
	
	/**
	 * Creates permanent cells for files dropped into the list
	 * @param {array} files 
	 * @returns an array of Elements
	 */
	createCellsForTracks(tracks) {
		let cells = tracks.map(track => {
			let html = `<div class="cell">
				<span class="handle">↕</span>
				<span class="info">
				<span class="title">${track.name}</span>
				`
			if(track.artist) {
				html += `<span class="artist">${track.artist.name}</span>`
			}
				
			html += `</span><span class="remove">&times</span>
			</div>`
			let el = this._makeElementFromHTML(html)
			el.data = track.file
			el.file = track.file
			el.track = track
			el.setAttribute('draggable', true)
			return el
		})
		return cells
	}
	
	/**
	 * Creates permanent cells for files dropped into the list
	 * @param {array} files 
	 * @returns an array of Elements
	 */
	createCellsForFiles(files) {
		let cells = files.map(file => {
			let html = `<div class="cell">
				<span class="handle">↕</span>
				<span class="title">${file.name}</span>
				<span class="remove">&times</span>
			</div>`
			let el = this._makeElementFromHTML(html)
			el.data = file
			el.file = file
			el.setAttribute('draggable', true)
			return el
		})
		return cells
	}
	
	/**
	 * Creates permanent cells for resource objects dropped into the list
	 * @param {array[string]} uriList 
	 * @returns an array of Elements
	 */
	createCellsForUriList(uriList) {
		if(!Array.isArray(uriList)) {
			uriList = [uriList]
		}
		let cells = uriList.map(uri => {
			let html = `<div class="cell">
				<span class="handle">↕</span>
				<span class="title">${uri}</span>
				<span class="remove">&times</span>
			</div>`
			let el = this._makeElementFromHTML(html)
			el.data = uri
			return el
		})
		return cells
	}
	/**
	 * Creates permanent cells for external items dropped into the list,
	 * emits events, and does cleaup
	 * @param {Event} evt 
	 * @param {Element} selected 
	 */
	handleDrop(evt, selected) {
		evt.preventDefault()
		
		// Sometimes the placeholder gets cleaned up before the insertion of the new nodes
		// happens. Let's capture the following element just in case we need it.
		let afterDragElement
		if(this.dragging) {
			afterDragElement = this.dragging.nextElementSibling
		}

		let p = new Promise(async (resolve, reject) => {
			if (this.isExternalDrop(evt)) {
				// if a link is dropped, there's no exteralDrag object, just a drop object
				let uriList
				if (evt.dataTransfer) {
					uriList = evt.dataTransfer.getData('text/uri-list')
				}

				let changes = []
				let tracks = this.getTrackEntries(evt)
				let files = await this.getFilesEntries(evt)
				let cells = []
				if(tracks && tracks.length > 0) {
					cells = this.createCellsForTracks(tracks)
				}
				else if (files && files.length > 0) {
					cells = this.createCellsForFiles(files)
					for (let count = 0; count < cells.length; count++) {
						let cell = cells[count]
						if (!cell.file) {
							cell.file = files[count]
						}
					}
				}
				else if (uriList) {
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
					cells = this.createCellsForUnknownType(evt)
				}

				for (let cell of cells) {
					cell.setAttribute('draggable', true)
					this.addCell(cell, {
						before: this.dragging || afterDragElement
					})
					changes.push({
						cell: cell
						, file: cell.file
					})
				}
				if (this.dragging) {
					this.dragging.remove()
				}
				this.emitter.emit('list-change', {
					type: 'drop'
					, cells: cells
					, files: files
					, changes: changes
					, event: evt
				})
			}
			else {
				this.emitter.emit('list-change', {
					type: 'reorder'
					, cells: [this.dragging]
				})
			}

		})
		this.cleanupDrag()
		return p
	}

}