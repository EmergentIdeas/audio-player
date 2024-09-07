export class Album {
	constructor(options) {
		Object.assign(this, options)
		this.tracks = []
	}
	
	addTrack(track) {
		this.tracks.push(track)
	}
}