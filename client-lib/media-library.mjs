import { Album } from "./album.mjs"
import { Artist } from "./artist.mjs"
import { Track } from "./track.mjs"

export class MediaLibrary {
	constructor(options) {
		Object.assign(this, options)
		this.mediaItems = []
		this.artists = {}
	}

	getArtist(name) {
		let artist = this.artists[name]
		if (!artist) {
			artist = new Artist({
				name: name
			})
			this.artists[name] = artist
		}
		return artist
	}

	getTreePathParts(path) {
		let extExp = /(.*)(\..{3,4})$/i
		let segments = path.match(extExp)
		if (segments) {
			path = segments[1]
		}
		let pathParts = path.split('/').filter(item => !!item)
		let name = pathParts.pop()
		let nameParts = name.split(' - ').filter(item => !!item).map(item => item.trim())

		let pathInfo = {

		}
		if (nameParts.length == 4) {
			pathInfo.artist = nameParts[0]
			pathInfo.album = nameParts[1]
			pathInfo.trackNum = nameParts[2]
			pathInfo.name = nameParts[3]
		}
		else if (nameParts.length == 3) {
			pathInfo.artist = nameParts[0]
			pathInfo.album = nameParts[1]
			pathInfo.name = nameParts[2]
		}
		else if (nameParts.length == 2) {
			pathInfo.artist = nameParts[0]
			pathInfo.name = nameParts[1]
		}
		else if (nameParts.length > 4) {
			pathInfo.artist = nameParts[0]
			pathInfo.album = nameParts[1]
			pathInfo.trackNum = nameParts[2]
			pathInfo.name = nameParts[nameParts.length - 1]
		}
		else if (nameParts.length == 1) {
			pathInfo.name = nameParts[0]

			if (pathParts.length > 0) {
				pathInfo.artist = pathParts[pathParts.length - 1]
			}
		}

		if (!pathInfo.artist) {
			pathInfo.artist = 'unknown'
		}

		if (!pathInfo.trackNum) {
			pathInfo.trackNum = 0
		}

		if (!pathInfo.album) {
			pathInfo.album = ''
		}

		return pathInfo
	}

	add(path, item) {
		let treePath = this.getTreePathParts(path)
		let artist = this.getArtist(treePath.artist)
		let album = artist.getAlbum(treePath.album)

		let track = new Track({
			name: treePath.name
			, album: album
			, artist: artist
			, file: item
			, data: item
			, mediaMeta: treePath
			, trackNum: treePath.trackNum
		})

		album.addTrack(track)
	}
	
	getArtistSortedByName() {
		let names = Object.keys(this.artists)
		names.sort((one, two) => {
			one = one.toLocaleLowerCase().trim()
			two = two.toLocaleLowerCase().trim()
			return one.localeCompare(two)
		})
		
		let artists = []
		for(let name of names) {
			artists.push(this.artists[name])
		}
		return artists
	}


}