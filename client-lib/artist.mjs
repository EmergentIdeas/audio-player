import { Album } from "./album.mjs"

export class Artist {
	constructor(options) {
		Object.assign(this, options)
		this.albums = { }
		unalbumed = new Album()
	}
	
	getAlbum(name) {
		if(!name) {
			return this.unalbumed
		}
		else {
			if(name in this.albums) {
				return this.albums[name]
			}
			let album = new Album({name: name})
			this.albums[name] = album
			return album
		}
	}
}