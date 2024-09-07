import { Album } from "./album.mjs"
import { Artist } from "./artist.mjs"

export class MediaLibrary {
	constructor(options) {
		Object.assign(this, options)
		this.mediaItems = []
		this.artists = {}
	}
	
	getArtist(name) {
		let artist = this.artists[name]
		if(!artist) {
			artist = new Artist()
			this.artists[name] = artist
		}
		return artist
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
		
		if(!pathInfo.artist) {
			pathInfo.artist = 'unknown'
		}

		return pathInfo
	}

	add(path, item) {

		let treePath = this.getTreePathParts(path)
		let parentPath = treePath.album ? treePath.artist + '/' + treePath.album : treePath.artist

		let artistNode = this.getArtist(treePath.artist)
		let albumNode
		
		
		
		
		
		
		if (!parent && treePath.artist) {
			artistNode = this.nodesByPath[treePath.artist]
			if (!artistNode) {
				artistNode = {
					parentId: parentId
					, id: counter++
					, label: treePath.artist
				}

				this.nodesByPath[treePath.artist] = artistNode
				newNodesPaths.add(treePath.artist)
			}
			if (treePath.album) {
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

		if (parent) {
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

		if (path in this.nodesByPath) {
			// We already have a node with this path, maybe because a file has the same name as
			// a folder.
			path += this.uniquify++
		}
		this.nodesByPath[path] = add
		newNodesPaths.add(path)
	}


}