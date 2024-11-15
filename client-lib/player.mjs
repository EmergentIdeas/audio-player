import DataItemWorker from "@webhandle/drag-sortable-list/client-lib/data-item-worker.mjs"
let dataItemWorker = new DataItemWorker()

export default class Player {
	/**
	 * 
	 * @param {Object} options 
	 * @param {EventEmitter} options.controlEvents
	 * @param {ListView} options.playlist
	 * @param {Audio} [options.audio]
	 */
	constructor(options = {}) {
		Object.assign(this, {
			audio: new Audio()

		}, options)
		
		this.controlEvents.on('play-pause', this.playPause.bind(this))
		this.controlEvents.on('next', this.next.bind(this))
		this.controlEvents.on('previous', this.previous.bind(this))
		this.controlEvents.on('play-item', this.playItem.bind(this))
		this.controlEvents.on('volume', this.volumeEvent.bind(this))
		this.controlEvents.on('position', this.positionEvent.bind(this))
		this.controlEvents.on('list-change', this.listChangeEvent.bind(this))


		this.audio.addEventListener('ended', this.itemEndedEvent.bind(this))
		this.audio.addEventListener('timeupdate', this.emitStatus.bind(this))
	}
	
	_createStatus() {
		
		let status
		if(this.currentItem) {
			status = {
				action: 'status'
				, volume: this.audio.volume
				, duration: this.audio.duration
				, currentTime: this.audio.currentTime
				, playState: this._getAudioState()
				, currentItem: this.currentItem
				, title: this.currentItem.querySelector('.title').innerText
				, track: this.currentItem.track
			}
		}
		else {
			status = {
				action: 'status'
				, volume: this.audio.volume
				, playState: 'off'
			}
		}
		return status
	}

	emitStatus() {
		this.controlEvents.emit('status', this._createStatus())
	}
	
	_getAudioState() {
		if(this.audio.paused) {
			return 'paused'
		}
		if(this.audio.ended) {
			return 'ended'
		}
		return 'playing'
	}

	listChangeEvent(args) {
		if(args.type === 'remove') {
			if(args.cells[0] === this.currentItem) {
				this.next()
			}
		}
	}
	volumeEvent(args) {
		this.audio.volume = args.value
	}
	positionEvent(args) {
		let status = this._createStatus()
		this.audio.currentTime = args.value * status.duration
	}
	itemEndedEvent() {
		this.next()
	}
	playItem(args) {
		this._playCell(args.item)
	}
	_clearCurrent() {
		this.playlist.getCells().forEach(cell => cell.classList.remove('current'))
	}
	_cleanupCurrent() {
		if(this.currentItem) {
			this.currentItem.classList.remove('current')
			if(this.currentItem.objectUrl) {
				URL.revokeObjectURL(this.currentItem.objectUrl)
			}
		}
		if(this.audio) {
			this.audio.pause()
			this.audio.src = null
		}
		this.emitStatus()
	}
	
	playFile(file) {
		let url = URL.createObjectURL(file)
		this.audio.src = url
		this.audio.load()
		this.audio.play()
		return url
	}
	
	_playCell(cell) {
		this._cleanupCurrent()
		if(cell) {
			if(cell.classList) {
				cell.classList.add('current')
			}
			this.currentItem = cell
			if(cell.data) {
				if(cell.data instanceof Blob) {
					cell.objectUrl = this.playFile(cell.data)
				}
				else if(cell.data.__proto__.toString() == '[object FileEntry]') {
					dataItemWorker.getFileFromEntry(cell.data).then(file => {
						cell.objectUrl = this.playFile(file)
					})
				}
				else if(typeof cell.data === 'string') {
					// I guess let's assume this is a url
					this.audio.src = cell.data
					this.audio.load()
					this.audio.play()
				}
			}
			this.emitStatus()
		}
		else {
			delete this.currentItem
		}

	}
	
	playPause(args) {
		if(!this.currentItem) {
			let cells = this.playlist.getCells()
			if(cells && cells.length > 0) {
				this._playCell(cells[0])
			}
		}
		else {
			if(this.audio.paused) {
				this.audio.play()
			}
			else {
				this.audio.pause()
			}
		}
	}
	previous(args) {
		if(this.currentItem && this.currentItem.previousElementSibling) {
			this._playCell(this.currentItem.previousElementSibling)
		}
	}
	next(args) {
		if(this.currentItem) {
			this._playCell(this.currentItem.nextElementSibling)
		}
	}

}