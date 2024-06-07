import { View } from '@webhandle/backbone-view'
import Emitter from '@webhandle/minimal-browser-event-emitter'
import {playerControls} from "../views/load-browser-views.js"
import DataItemWorker from '@webhandle/drag-sortable-list/client-lib/data-item-worker.mjs'

let dataItemWorker = new DataItemWorker()

let counter = 1

function isSet(val) {
	return ! (val === null || val === undefined)
}
export default class PlayControlsView extends View {

	/**
	 * Setup the event listners and default objects.
	 * @param {Object} options 
	 */
	preinitialize(options = {}) {
		this.events = Object.assign({}, {
			'click .play': 'handlePlay'
			, 'click .volumeBar': 'handleVolume'
			, 'click .next': 'handleNext'
			, 'click .previous': 'handlePrevious'
			, 'change input[name="volume"]': 'handleVolume'
			, 'change input[name="position"]': 'handlePosition'
			, 'mousedown input[name="volume"]': 'updatesOff'
			, 'mouseup input[name="volume"]': 'updatesOn'
			, 'mousedown input[name="position"]': 'updatesOff'
			, 'mouseup input[name="position"]': 'updatesOn'
			, 'dragover .library': 'handleDropzoneDragover'
			, 'drop .library': 'handleDropzoneDrop'
			, 'dragstart .kalpa-tree li.node': 'handleNodeDragStart'
			// , 'dragover .drop-zone': 'handleDropzoneDragover'
			// , 'drop .drop-zone': 'handleDropzoneDrop'
			// , 'dragover .kalpa-tree': 'handleDropzoneDragover'
			// , 'drop .kapla-tree': 'handleDropzoneDrop'

		}, options.events)
		options.events = this.events
		if (!this.emitter) {
			this.emitter = options.emitter || new Emitter()
		}
		this.emitter.on('status', this.handleStatusUpdate.bind(this))
		this.updates = true
		this.positionInputRange = 1000
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
					keepDirectories: true
					, recursive: true
				})
				for(let file of files) {
					this.nodesEmitter.emit('data', {
						parentId: 0
						, id: counter++
						, label: file.name
						, file: file
						, data: file
						, draggable: true
					})
				}
				setTimeout(() => {
					this.el.querySelectorAll('.kalpa-tree li.node').forEach(node => node.setAttribute('draggable', true))
				}, 20)
			}
		})
		return p
	}

	
	updatesOff() {
		this.updates = false
	}
	
	updatesOn() {
		this.updates = true
	}
	
	_makeSecondsClock(seconds) {
		if(Number.isNaN(seconds)) {
			return '--'
		}
		let result = []
		seconds = parseInt(seconds)
		let s = seconds % 60
		seconds = parseInt((seconds - s) / 60)
		let m = seconds % 60
		if(m) {
			let h = parseInt((seconds - m) / 60)
			if(h) {
				result.push(h)
			}
			if(h && m < 10) {
				m = `${m}`.padStart(2, '0')
			}
			result.push(m)
		}
		else {
			result.push('0')
		}
		// if(m && s < 10) {
			s = `${s}`.padStart(2, '0')
		// }
		result.push(s)

		return result.join(':')

	}
	
	handleStatusUpdate(args) {

		if(!this.updates) {
			// In this case, somebody is doing something to components we'd want to update, like position,
			// so we're not going to do anything until that action is finished.
			return
		}
		if(isSet(args.volume)) {
			this.el.querySelector('input[name="volume"]').value = parseInt(args.volume * 100)
		}
		if(isSet(args.currentTime) && isSet(args.duration)) {
			if(Number.isNaN(args.currentTime) || Number.isNaN(args.duration)) {
				// When loading a track, sometimes the audio object doesn't have all the numbers
				this.el.querySelector('input[name="position"]').value = 0
			}
			else {
				this.el.querySelector('input[name="position"]').value = parseInt(args.currentTime / args.duration * this.positionInputRange)
			}
			this.el.querySelector('.position-text').innerHTML = `${this._makeSecondsClock(args.currentTime)} / ${this._makeSecondsClock(args.duration)}`
		}
		else {
			// we're not really playing anything at this point, so don't give values
			this.el.querySelector('input[name="position"]').value = 0
			this.el.querySelector('.position-text').innerHTML = ' -- / --'
		}

		if(isSet(args.title)) {
			this.el.querySelector('.track-title').innerHTML = args.title
		}
		else {
			this.el.querySelector('.track-title').innerHTML = ''

		}
	}
	

	handlePosition(evt, selected) {
		let value = selected.value / this.positionInputRange
		this.emitter.emit('position', {
			action: 'position'
			, value: value
		})
	}
	handleVolume(evt, selected) {
		let value = selected.value / 100
		this.emitter.emit('volume', {
			action: 'volume'
			, value: value
		})
	}
	handlePlay(evt, selected) {
		this.emitter.emit('play-pause', {
			action: 'play-pause'
		})
	}
	handleNext(evt, selected) {
		this.emitter.emit('next', {
			action: 'next'
		})
	}
	handlePrevious(evt, selected) {
		this.emitter.emit('previous', {
			action: 'previous'
		})
	}

	render() {
		this.el.innerHTML = playerControls()
	}
}