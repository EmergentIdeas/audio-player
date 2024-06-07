
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
			this.externalDragData = evt.data
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
	
	async getFilesEntries(evt) {
		let mode
		if (evt.dataTransfer) {
			mode = evt.dataTransfer.getData('data:text/mode')
		}
		if(mode == 'external-drag' && this.externalDragData) {
			let files = await dataItemWorker.expandEntries(this.externalDragData, {
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
}