import { Album } from "./album.mjs"

export class Artist {
	constructor(options) {
		Object.assign(this, options)
		this.albums = {}
	}
	
	getAlbum(name) {
		if(!name) {
			name = ''
		}
		if(name in this.albums) {
			return this.albums[name]
		}
		let album = new Album({name: name})
		this.albums[name] = album
		return album
	}
	
	getNamedAlbums() {
		let albums = []
		for(let key of Object.keys(this.albums)) {
			if(key) {
				albums.push(this.albums[key])
			}
		}
		return albums
	}
	
	getUnnamedAlbum() {
		if('' in this.albums) {
			return this.albums['']
		}
		return null
	}
}