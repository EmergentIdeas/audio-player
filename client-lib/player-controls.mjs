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
			// , 'dragover .library': 'handleDropzoneDragover'
			// , 'drop .library': 'handleDropzoneDrop'
			// , 'dragstart .kalpa-tree li.node': 'handleNodeDragStart'
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

		if(isSet(args.track)) {
			let track = args.track

			let html = ` 
				<div class="title">${track.name}</div>
				`
			if(track.artist) {
				html += `<div class="artist">${track.artist.name}</div>`
			}
				
			this.el.querySelector('.track-info').innerHTML = html
		}
		else if(isSet(args.title)) {
			this.el.querySelector('.track-info').innerHTML = `<span class="track-title">${args.title}</span>`
		}
		else {
			this.el.querySelector('.track-info').innerHTML = ''
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