/******/ var __webpack_modules__ = ({

/***/ "./node_modules/kalpa-tree-on-page/client-js/icons.js":
/*!************************************************************!*\
  !*** ./node_modules/kalpa-tree-on-page/client-js/icons.js ***!
  \************************************************************/
/***/ ((module) => {

module.exports = `<div id="kalpa-tree-icons" style="position: absolute; left: -10000px; width: 0; height: 0;">
	<svg xmlns="http://www.w3.org/2000/svg">
		<symbol id="icon-generic" viewBox="0 0 12 12">
			<path
				d="M9.7 12H2.3C1 12 0 11 0 9.7V2.3C0 1 1 0 2.3 0h7.5C11 0 12 1 12 2.3v7.5C12 11 11 12 9.7 12zM8 5.3C8 4.6 7.4 4 6.6 4H5.3C4.6 4 4 4.6 4 5.3v1.3C4 7.4 4.6 8 5.3 8h1.3C7.4 8 8 7.4 8 6.6V5.3z" />
		</symbol>
		<symbol id="icon-root" viewBox="0 0 16 16">
			<path d="M9 16V9h7v7H9zM9 0h7v7H9V0zM0 9h7v7H0V9zm0-9h7v7H0V0z" />
		</symbol>
		<symbol id="icon-metric" viewBox="0 0 100 100">
			<path
				d="M50 100C22.4 100 0 77.6 0 50S22.4 0 50 0s50 22.4 50 50-22.4 50-50 50zm0-76.9c-14.8 0-26.9 12.1-26.9 26.9S35.2 76.9 50 76.9 76.9 64.8 76.9 50 64.8 23.1 50 23.1zm0 38.4c-6.4 0-11.5-5.2-11.5-11.5S43.6 38.4 50 38.4s11.5 5.2 11.5 11.5S56.4 61.5 50 61.5z" />
		</symbol>
		<symbol id="icon-perspective" viewBox="0 0 12 11">
			<path d="M12 11H0L5.9 0 12 11z" />
		</symbol>
		<symbol id="icon-objective" viewBox="0 0 12 10">
			<ellipse cx="6" cy="5" rx="6" ry="5" />
		</symbol>
		<symbol id="icon-find">
			<path
				d="m 13.497323,12.433608 c 0.08422,0.978628 -1.417295,1.469942 -1.954282,0.657234 C 10.369384,11.968141 9.2411696,10.799391 8.087323,9.6566079 5.7875518,11.20515 2.2596241,10.270797 1.051352,7.7662065 -0.1027543,5.5922068 0.61269436,2.5743169 2.7539681,1.2885899 4.6322082,0.06461011 7.3623548,0.26924656 8.9286688,1.9183502 c 1.5121032,1.4872335 1.9726552,4.001359 0.8885116,5.8618536 -0.2008407,0.7179057 0.6439246,1.0286413 1.0395966,1.4627471 0.79551,0.9178591 1.752248,1.6943191 2.51171,2.6495761 0.08347,0.167322 0.129284,0.353872 0.128836,0.541081 z m -8.047,-9.7420001 C 3.5991559,2.6059751 2.107634,4.7815577 2.8684439,6.4772182 3.4629388,8.0470383 5.6500695,8.7859958 7.0177529,7.7488936 8.3664062,6.8424394 8.6521549,4.6587499 7.425963,3.52989 6.9118115,3.0069548 6.1883031,2.6803036 5.450323,2.6916079 z" />
		</symbol>
		<symbol id="icon-collapsed" viewBox="0 0 9 6">
			<path
				d="M4.4 6c-.2 0-.5-.1-.9-.5L.3 1.8C-.1 1.4-.1.7.3.3s1.1-.4 1.5 0l2.7 3.2L7.1.4C7.5 0 8.2 0 8.6.4c.4.4.4 1.1 0 1.5L5.4 5.5c-.3.4-.8.5-1 .5z" />
		</symbol>
	</svg>
</div>`


/***/ }),

/***/ "./node_modules/kalpa-tree-on-page/client-js/kalpa-tree-loader.js":
/*!************************************************************************!*\
  !*** ./node_modules/kalpa-tree-on-page/client-js/kalpa-tree-loader.js ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const Streamish = __webpack_require__(/*! ./streamish */ "./node_modules/kalpa-tree-on-page/client-js/streamish.js")
const serializeTreeNodes = __webpack_require__(/*! ./serialize-tree-nodes */ "./node_modules/kalpa-tree-on-page/client-js/serialize-tree-nodes.js")
const serializeANode = __webpack_require__(/*! ./serialize-a-node */ "./node_modules/kalpa-tree-on-page/client-js/serialize-a-node.js")

const icons = __webpack_require__(/*! ./icons */ "./node_modules/kalpa-tree-on-page/client-js/icons.js")

let loadedStyles = []


async function loadKalpaTree(scriptLocation) {
	return new Promise((resolve, reject) => {
		if (window.KalpaTree) {
			resolve(window.KalpaTree)
		}
		else {
			let ckscript = document.createElement('script');
			ckscript.setAttribute('src', scriptLocation);
			ckscript.onload = async function () {
				resolve(window.KalpaTree)
			}
			document.head.appendChild(ckscript)
		}
	})
}

async function createTree(options = {}) {
	let plan = Object.assign({
		treeContainerSelector: '#kalpa-tree'
		, stream: new Streamish()
		, loadStyles: true
		, styleLocation: '/kalpa-tree-on-page/css/white-page-tree.css'
		, scriptLocation: '/kalpa-tree-on-page/js/kalpa-tree.js'
		, data: null

	}, options)
	return new Promise((resolve, reject) => {
		// Add the icon svgs if they haven't been added yet
		if(!document.querySelector('#kalpa-tree-icons')) {
			document.body.insertAdjacentHTML('beforeend', icons)
		}

		// Load the kalpa-tree script dependency then configure it
		loadKalpaTree(plan.scriptLocation).then(KalpaTree => {

			const Tree = KalpaTree.default
			let tree = new Tree({
				stream: plan.stream,
				accessors: {
					icon: 'nodeType'
				},
				initialSelection: 0
			})

			tree.on('error', function (e) {
				console.log('tree error', e)
			})

			tree.on('move', function (node, newParent, previousParent, newIndex, prevIndex) {
				node.parentId = newParent.id
			})
			tree.serializeTree = function() {
				let result = []
				result.push(tree.get(tree.root.id))
				serializeTreeNodes(this, tree.root.id, result)
				return result
			}
			tree.serialize = function () {
				let result = tree.serializeTree()
				return JSON.stringify(result)
			}
			
			if(plan.treeContainerSelector) {
				document.querySelector(plan.treeContainerSelector).appendChild(tree.render().el.node())
			}
			
			if(plan.data && Array.isArray(plan.data)) {
				for(let node of plan.data) {
					tree.options.stream.emit('data', node)
				}
			}

			resolve(tree)
		})
		
		// Load the stylesheet for minimal formatting
		if(plan.loadStyles && plan.styleLocation) {
			if(!loadedStyles.includes(plan.styleLocation)) {
				loadedStyles.push(plan.styleLocation)
				document.head.insertAdjacentHTML('beforeend', `<link href="${plan.styleLocation}" rel="stylesheet">`)
			}
		}
	})

}

module.exports = createTree

/***/ }),

/***/ "./node_modules/kalpa-tree-on-page/client-js/serialize-a-node.js":
/*!***********************************************************************!*\
  !*** ./node_modules/kalpa-tree-on-page/client-js/serialize-a-node.js ***!
  \***********************************************************************/
/***/ ((module) => {

function serializeANode (tree, rootId, result) {
	tree.children(rootId).forEach(function (child) {
		child.parentId = rootId
		result.push(child)
		serializeANode(tree, child.id, result)
	})
}

module.exports = serializeANode

/***/ }),

/***/ "./node_modules/kalpa-tree-on-page/client-js/serialize-tree-nodes.js":
/*!***************************************************************************!*\
  !*** ./node_modules/kalpa-tree-on-page/client-js/serialize-tree-nodes.js ***!
  \***************************************************************************/
/***/ ((module) => {


function serializeTreeNodes(tree, rootId, result) {
	tree.children(rootId).forEach(function (child) {
		child.parentId = rootId
		result.push(child)
		serializeTreeNodes(tree, child.id, result)
	})
}

module.exports = serializeTreeNodes

/***/ }),

/***/ "./node_modules/kalpa-tree-on-page/client-js/streamish.js":
/*!****************************************************************!*\
  !*** ./node_modules/kalpa-tree-on-page/client-js/streamish.js ***!
  \****************************************************************/
/***/ ((module) => {


class Streamish {
	constructor() {
		this.handles = {}
	}
	on(evt, handle) {
		let handles = this.handles[evt]
		if (!handles) {
			handles = this.handles[evt] = []
		}
		handles.push(handle)
		return this
	}
	emit(evt, ...args) {
		if (evt in this.handles) {
			for (let handle of this.handles[evt]) {
				handle.apply(this, args)
			}
		}
	}
}
module.exports = Streamish

/***/ }),

/***/ "./node_modules/tripartite/active-element.js":
/*!***************************************************!*\
  !*** ./node_modules/tripartite/active-element.js ***!
  \***************************************************/
/***/ ((module) => {


const defaultTemplateName = 'defaultTemplate'

class ActiveElement {
	constructor(conditionalExpression, dataExpression, handlingExpression, tripartite) {
		this.conditionalExpression = conditionalExpression
		this.dataExpression = dataExpression
		this.handlingExpression = handlingExpression || defaultTemplateName
		this.tripartite = tripartite
	}
}

module.exports = ActiveElement

/***/ }),

/***/ "./node_modules/tripartite/calculate-relative-path.js":
/*!************************************************************!*\
  !*** ./node_modules/tripartite/calculate-relative-path.js ***!
  \************************************************************/
/***/ ((module) => {

var calculateRelativePath = function(parentPath, currentPath) {
	if(!parentPath) {
		return currentPath
	}
	if(!currentPath) {
		return currentPath
	}
	
	if(currentPath.indexOf('../') != 0 && currentPath.indexOf('./') != 0) {
		return currentPath
	}
	
	var pparts = parentPath.split('/')
	var cparts = currentPath.split('/')
	
	// trim any starting blank sections
	while(pparts.length && !pparts[0]) {
		pparts.shift()
	}
	while(cparts.length && !cparts[0]) {
		cparts.shift()
	}
	
	if(currentPath.indexOf('../') == 0 ) {
		while(cparts.length && cparts[0] == '..') {
			pparts.pop()
			cparts.shift()
		}
		pparts.pop()
		
		while(cparts.length) {
			pparts.push(cparts.shift())
		}
		return pparts.join('/')
	}
	if(currentPath.indexOf('./') == 0 ) {
		cparts.shift()
		pparts.pop()
		while(cparts.length) {
			pparts.push(cparts.shift())
		}
		return pparts.join('/')
	}
	
	return currentPath
}

module.exports = calculateRelativePath

/***/ }),

/***/ "./node_modules/tripartite/evaluate-in-context.js":
/*!********************************************************!*\
  !*** ./node_modules/tripartite/evaluate-in-context.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const resolveDataPath = __webpack_require__(/*! ./resolve-data-path */ "./node_modules/tripartite/resolve-data-path.js")
function evaluateInContext(context, expression, dataFunctions, globalData) {
	if (!expression) {
		return null
	}
	if (typeof expression === 'string') {
		expression = expression.trim()
	}

	if (expression === '$this' || expression === 'this') {
		return context
	}
	if (typeof context === 'object' && expression in context) {
		return context[expression]
	}
	if (expression === '""' || expression === "''") {
		return ''
	}
	let resolved = resolveDataPath(context, expression)
	if (resolved === null || resolved === undefined) {
		resolved = resolveDataPath({
			'$globals': globalData
		}, expression)
	}
	if (resolved === null || resolved === undefined) {
		resolved = _evaluateInContext.call(context, context, expression, dataFunctions, globalData)
	}
	return resolved
}

let evalFunction = new Function('additionalContexts',
	`with ({
		'$globals': additionalContexts.globalData
	}) {
		with (additionalContexts.dataFunctions) {
			with (additionalContexts.context) {
				try {
					return eval(additionalContexts.expression);
				} catch (e) {
					return null;
				}
			}
		}
	}`
)

function _evaluateInContext(context, expression, dataFunctions, globalData) {
	dataFunctions = dataFunctions || {}
	globalData = globalData || {}


	let result = evalFunction.call(this, {
		globalData: globalData
		, dataFunctions: dataFunctions
		, context: context
		, expression: expression
	})
	return result
}

module.exports = evaluateInContext

/***/ }),

/***/ "./node_modules/tripartite/execution-context.js":
/*!******************************************************!*\
  !*** ./node_modules/tripartite/execution-context.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


let ActiveElement = __webpack_require__(/*! ./active-element */ "./node_modules/tripartite/active-element.js")
var calculateRelativePath = __webpack_require__(/*! ./calculate-relative-path */ "./node_modules/tripartite/calculate-relative-path.js")
let evaluateInContext = __webpack_require__(/*! ./evaluate-in-context */ "./node_modules/tripartite/evaluate-in-context.js")

class ExecutionContext {
	/**
	 * 
	 * @param {Tripartite} tripartite 
	 * @param {function} template 
	 * @param {stream} [destination]
	 */
	constructor(tripartite, template, data = {}, destination = '', dataFunctions = {}) {
		this.tripartite = tripartite
		this.template = template
		this.destination = destination
		this.initialData = data
		this.currentData = []
		this.dataFunctions = dataFunctions
		this.continueOnTripartiteError = true
		
		// Sometimes large pages have so many elements that we exceed
		// the maximum call depth. This happens when we have a lot of elements all being
		// rendered by the same templates. That is, there's no async callback when a template
		// is loaded, only instant callbacks.
		// The downside to doing very frequent async calls is that it takes a lot longer to
		// to get called from a setTimeout than it does to call directly. We want ot keep
		// the time between needing to do that reasonably long. Unfortunately, there's no
		// easy/fast way to detect the call stack depth, so we rely on this proxy.
		this.callCount = 0
		this.callDepthLimit = 1000
	}

	/**
	 * 
	 * @param {function} [callback] called when done
	 * @returns Returns the string of stream as the result of the operation
	 */
	run(callback) {
		let ourCallback
		if (callback) {
			ourCallback = () => {
				callback(null, this.destination)
			}
		}

		this._run(this.template, this.initialData, ourCallback)

		return this.destination
	}

	_resolveHandlingExpression(template, handlingExpression, data) {
		if (!handlingExpression) {
			handlingExpression = defaultTemplateName
		}
		if (handlingExpression.charAt(0) == '$') {
			// Indicates the handling espression is not a literal template name but is a string which should
			// be evaluated to determine the template name
			handlingExpression = evaluateInContext(data, handlingExpression.substring(1), this.dataFunctions, this.initialData)
		}
		// resolve relative template paths
		if (handlingExpression.indexOf('./') == 0 || handlingExpression.indexOf('../') == 0) {
			handlingExpression = calculateRelativePath(template.templateMeta.name, handlingExpression)
		}

		return handlingExpression
	}

	_run(template, data, callback) {
		let parts = [...template.parts].reverse()
		const processParts = () => {
			
			// check to see how far down in the call stack we are. If too far down,
			// come back in the next tick.
			this.callCount++
			if(this.callCount++ > this.callDepthLimit) {
				setTimeout(()=> {
					this.callCount = 0
					processParts()
				})
				return
			}

			if (parts.length > 0) {
				let part = parts.pop()
				if (typeof part === 'string') {
					this.output(part)
					processParts()
				}
				else if (part instanceof ActiveElement) {
					let conditional = part.conditionalExpression || part.dataExpression
					let conditionalResult = false
					let resultData
					if (conditional == null || conditional == undefined || conditional === '') {
						// Because if they didn't specify a condition or data, they probably 
						// just want the template to be run as is
						conditionalResult = true
					}
					else {
						if(part.conditionalExpression) {
							let result = evaluateInContext(data, part.conditionalExpression, this.dataFunctions, this.initialData)
							if (result) {
								conditionalResult = true
							}
						}
						else {
							// This means we're evaluating the data expression to see if we should run the template
							resultData = evaluateInContext(data, part.dataExpression, this.dataFunctions, this.initialData)
							if(resultData === null || resultData === undefined) {
								conditionalResult = false
							}
							else if (typeof resultData === 'number') {
								// if the result is a number, any number, we want to output it
								// unless the number is from the conditional expression, in which
								// case we want to evaluate it as truthy
								conditionalResult = true
							}
							else if(Array.isArray(resultData) && resultData.length > 0) {
								conditionalResult = true
							}
							else if(resultData) {
								conditionalResult = true
							}
						}
					}


					if (conditionalResult) {
						if (part.dataExpression && resultData === undefined) {
							resultData = evaluateInContext(data, part.dataExpression, this.dataFunctions, this.initialData)
						}
						if(resultData === null || resultData === undefined) {
							resultData = data
						}

						let handlingExpression = this._resolveHandlingExpression(template, part.handlingExpression, data)
						let handlingTemplate
						let children = (Array.isArray(resultData) ? [...resultData] : [resultData]).reverse()
						const applyTemplate = () => {
							if (children.length > 0) {
								let child = children.pop()
								this._run(handlingTemplate, child, () => {
									applyTemplate()
								})
							}
							else {
								processParts()
							}
						}

						if(handlingExpression in this.tripartite.templates) {
							handlingTemplate = this.tripartite.getTemplate(handlingExpression)
							if (handlingTemplate) {
								applyTemplate()
							}
							else {
								// the template has been loaded before but is empty
								if (this.continueOnTripartiteError) {
									processParts()
								}
							}
							
						}
						else {
							this.tripartite.loadTemplate(handlingExpression, (template) => {
								if (!template) {
									let msg = 'Could not load template: ' + handlingExpression
									console.error(msg)
									if (this.continueOnTripartiteError) {
										processParts()
									}
									else {
										let err = new Error(msg)
										if (callback) {
											callback(err)
										}
										else {
											throw err
										}
									}
								}
								else {
									handlingTemplate = template
									applyTemplate()
								}
							})
						}
					}
					else {
						processParts()
					}
				}
				else if (typeof part === 'function') {
					if(part.write) {
						part.write(data, this.destination, () => {
							processParts()
						})

					}
					else {
						this.output(part(data))
						processParts()
					}
				}

			}
			else {
				if (callback) {
					callback()
				}
			}
		}

		processParts()
	}

	/**
	 * 
	 * @param {string} value 
	 */
	output(value) {
		if(value === null || value === undefined) {
			return
		}
		if (typeof this.destination === 'string') {
			this.destination += value
		}
		else if (this.destination.write) {
			this.destination.write(value)
		}
	}
}


module.exports = ExecutionContext

/***/ }),

/***/ "./node_modules/tripartite/resolve-data-path.js":
/*!******************************************************!*\
  !*** ./node_modules/tripartite/resolve-data-path.js ***!
  \******************************************************/
/***/ ((module) => {

/*
function resolveDataPath(data, path) {
	if(data === null || data === undefined) {
		return data
	}
	let parts
	if(typeof path === 'string') {
		parts = path.trim().split('.')
	}
	else if(Array.isArray(path)) {
		parts = path
	}
	
	let name = parts.shift()
	if(name.indexOf(' ') > -1) {
		// there's a space, which means it's really unlikely it's a property
		return null
	}
	let child
	if(name === 'this' || name === '$this') {
		child = data
	}
	else if(typeof data === 'object') {
		if(name in data) {
			child = data[name]
		}
	}
	if(parts.length > 0) {
		return resolveDataPath(child, parts)
	}
	else {
		return child
	}
} */
function resolveDataPath(data, path) {
	if (data === null || data === undefined) {
		return data
	}
	let parts
	if (typeof path === 'string') {
		parts = path.trim().split('.')
	}
	else if (Array.isArray(path)) {
		parts = path
	}

	while (parts.length > 0) {
		let name = parts.shift()
		if (name.indexOf(' ') > -1) {
			// there's a space, which means it's really unlikely it's a property
			return null
		}
		let child
		if (name === 'this' || name === '$this') {
			child = data
		}
		else if (typeof data === 'object') {
			if (name in data) {
				child = data[name]
			}
		}
		if (parts.length == 0) {
			return child
		}
		data = child
	}
}

module.exports = resolveDataPath

/***/ }),

/***/ "./node_modules/tripartite/tripartite.js":
/*!***********************************************!*\
  !*** ./node_modules/tripartite/tripartite.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {




if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	}
}


function isStream(stream) {
	return stream !== null
		&& typeof stream === 'object'
		&& typeof stream.pipe === 'function';
}


function isTemplate(obj) {
	if (!obj) {
		return false
	}
	if (typeof obj !== 'function') {
		return false
	}
	if (!obj.write) {
		return false
	}
	if (!obj.parts) {
		return false
	}
	if (!obj.templateMeta) {
		return false
	}

	return true
}

let ExecutionContext = __webpack_require__(/*! ./execution-context */ "./node_modules/tripartite/execution-context.js")
let ActiveElement = __webpack_require__(/*! ./active-element */ "./node_modules/tripartite/active-element.js")


class Tripartite {
	constructor(options = {}) {
		this.templates = {
			defaultTemplate: this._makeTemplate(function (thedata) {
				return '' + thedata;
			})
		}
		let { constants = {
			templateBoundary: '__',
			templateNameBoundary: '##'
		} } = options
		this.constants = constants

		// This object (if set) will receive the template functions parsed from a script
		// I want to be able to call my templates as global functions, so I've set it
		// to be the window object
		this.secondaryTemplateFunctionObject = options.secondaryTemplateFunctionObject

		this.loaders = options.loaders || []

		this.dataFunctions = options.dataFunction || {}
	}

	_makeTemplate(transformationFunction) {
		if (isTemplate(transformationFunction)) {
			return transformationFunction
		}
		let tri = this
		let f = function (thedata) {
			let stream = null
			let options = null
			let callback = null
			for (let i = 1; i < arguments.length; i++) {
				let arg = arguments[i]
				if (isStream(arg)) {
					stream = arg
				}
				else if(typeof arg === 'function') {
					callback = arg
				}
				else if(typeof arg === 'object') {
					options = arg
				}
			}

			return f.write(thedata, stream, callback, options)
		}
		f.write = function (thedata, stream, callback, options = {}) {
			if(transformationFunction && transformationFunction.write) {
				// if it's not a template, but has a write method, invoke the right method directly
				return transformationFunction.write.apply(transformationFunction, arguments)
			}
			else {
				let dest = stream || ''

				let context = new ExecutionContext(tri, f, thedata, dest, tri.dataFunctions)
				if (options && 'continueOnTripartiteError' in options) {
					context.continueOnTripartiteError = options.continueOnTripartiteError
				}

				return context.run(callback)
			}
		}
		f.parts = []
		if (transformationFunction && typeof transformationFunction === 'function') {
			f.parts.push(transformationFunction)
		}
		f.templateMeta = {}
		return f
	}

	addTemplate(name, template) {
		if (typeof template === 'string') {
			template = this.parseTemplate(template);
		}
		else if (typeof template === 'function') {
			template = this._makeTemplate(template)
		}

		this.templates[name] = template;
		template.templateMeta = template.templateMeta || {}
		template.templateMeta.name = name
		return template;
	}

	createBlank() {
		return new Tripartite()
	}

	getTemplate(name) {
		return this.templates[name]
	}

	loadTemplate(name, callback) {
		if (name in this.templates) {
			callback(this.templates[name])
		}
		else {
			let tri = this
			let count = this.loaders.length
			let done = false

			if (count == 0) {
				tri.templates[name] = null
				callback(tri.getTemplate(name))
			}
			else {
				this.loaders.forEach(loader => {
					if (done) {
						return
					}
					loader(name, template => {
						if (done) {
							return
						}
						count--
						if (template) {
							done = true
							tri.addTemplate(name, template)
						}
						else if (count == 0) {
							done = true
							tri.templates[name] = null
						}
						if (done) {
							callback(tri.getTemplate(name))
						}
					})
				})
			}
		}
	}
	parseTemplateScript(tx) {
		var tks = this.tokenizeTemplateScript(tx);
		/* current template name */
		var ctn = null;
		for (var i = 0; i < tks.length; i++) {
			var token = tks[i];
			if (token.active) {
				ctn = token.content;
			}
			else {
				if (ctn) {
					var template = this.addTemplate(ctn, this.stripTemplateWhitespace(token.content));
					if (this.secondaryTemplateFunctionObject) {
						this.secondaryTemplateFunctionObject[ctn] = template;
					}
					ctn = null;
				}
			}
		}
	}

	stripTemplateWhitespace(txt) {
		var i = txt.indexOf('\n');
		if (i > -1 && txt.substring(0, i).trim() == '') {
			txt = txt.substring(i + 1);
		}
		i = txt.lastIndexOf('\n');
		if (i > -1 && txt.substring(i).trim() == '') {
			txt = txt.substring(0, i);
		}
		return txt;
	}

	/* simple template */
	_createActiveElement(/* conditional expression */ cd, data, /* handling expression */ hd, tripartite, templateMeta) {
		let el = new ActiveElement(cd, data, hd, tripartite);
		el.templateMeta = templateMeta
		return el
	}
	pt(tx) {
		return this.parseTemplate(tx)
	}
	/* parse template */
	parseTemplate(tx) {
		var tks = this.tokenizeTemplate(tx);
		let t = this._makeTemplate()
		var templateMeta = t.templateMeta

		for (let tk of tks) {
			if (tk.active) {
				t.parts.push(this.tokenizeActivePart(tk.content, templateMeta));
			}
			else if (tk.content) {
				t.parts.push(tk.content);
			}
		}

		return t
	}

	tokenizeActivePart(tx, templateMeta) {
		var con = null;
		var dat = null;
		var han = null;

		/* condition index */
		var ci = tx.indexOf('??');
		if (ci > -1) {
			con = tx.substring(0, ci);
			ci += 2;
		}
		else {
			ci = 0;
		}

		/* handler index */
		var hi = tx.indexOf('::');
		if (hi > -1) {
			dat = tx.substring(ci, hi);
			han = tx.substring(hi + 2);
		}
		else {
			dat = tx.substring(ci);
		}
		return this._createActiveElement(con, dat, han, this, templateMeta);
	}

	tokenizeTemplate(tx) {
		return this.tokenizeActiveAndInactiveBlocks(tx, this.constants.templateBoundary);
	}


	/** tokenize template script */
	tokenizeTemplateScript(tx) {
		return this.tokenizeActiveAndInactiveBlocks(tx, this.constants.templateNameBoundary);
	}

	/* tokenize active and inactive blocks */
	tokenizeActiveAndInactiveBlocks(text, /*Active Region Boundary */ boundary) {
		/* whole length */
		let length = text.length

		/* current position */
		let position = 0

		/* are we in an active region */
		let act = false

		let tokens = []

		while (position < length) {
			let i = text.indexOf(boundary, position);
			if (i == -1) {
				i = length;
			}
			var tk = { active: act, content: text.substring(position, i) };
			tokens.push(tk);
			position = i + boundary.length;
			act = !act;
		}

		return tokens;
	}

}
var tripartiteInstance = new Tripartite()

if (typeof window != 'undefined') {
	tripartiteInstance.secondaryTemplateFunctionObject = window
}


if (true) {
	module.exports = tripartiteInstance
}
else {}

if (typeof __webpack_require__.g != 'undefined') {
	if (!__webpack_require__.g.Tripartite) {
		__webpack_require__.g.Tripartite = Tripartite
	}
	if (!__webpack_require__.g.tripartite) {
		__webpack_require__.g.tripartite = tripartiteInstance
	}
}



/***/ }),

/***/ "./views/dankolz/audio-player/controls.tri":
/*!*************************************************!*\
  !*** ./views/dankolz/audio-player/controls.tri ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var tri = __webpack_require__(/*! tripartite */ "./node_modules/tripartite/tripartite.js"); var t = "<div class=\"player-controls lib-player\">\n\n\t<div class=\"library\">\n\t\t<div class=\"kalpa-tree\">\n\t\t<\/div>\n\t\t<div class=\"lib-controls\">\n\t\t\t<div class=\"filter\">\n\t\t\t\t<input name=\"libFilter\" type=\"text\" placeholder=\"search\" \/>\n\t\t\t<\/div>\n\t\t\t\n\t\t<\/div>\n\n\t\t<!-- <div class=\"drop-zone\">\n\t\t\tdrop files here\t\n\t\t<\/div> -->\n\t<\/div>\n\t<div class=\"selected-details\">\n\t\t\n\t<\/div>\n\t<div class=\"playside\">\n\t\t<div class=\"playlist-wrapper\">\n\t\t\t<div class=\"playlist webhandle-drag-sortable-list\">\n\t\t\t<\/div>\n\t\t\t<div class=\"playlist-bottom-buttons actions\">\n\t\t\t\t<div class=\"left\">\n\t\t\t\t\t<button class=\"previous\" title=\"previous track\">\n\t\t\t\t\t\t__::.\/previous-button__\n\t\t\t\t\t<\/button>\n\t\t\t\t<\/div>\n\t\t\t\t<div class=\"right\">\n\t\t\t\t\t<button class=\"next\" title=\"next track\">\n\t\t\t\t\t\t__::.\/next-button__\n\t\t\t\t\t<\/button>\n\n\t\t\t\t<\/div>\n\t\t\t<\/div>\n\t\t<\/div>\n\t\t<div class=\"track-controls\">\n\t\t\t<div class=\"track-title\">\n\t\t\t<\/div>\n\t\t\t<div class=\"position\">\n\t\t\t\t<div class=\"play-pause actions\">\n\t\t\t\t\t<button class=\"play\" title=\"play \/ pause\">\n\t\t\t\t\t\t__::.\/play-pause-button__\n\t\t\t\t\t<\/button>\n\t\t\t\t<\/div>\n\t\t\t\t<label>\n\t\t\t\t\t<input type=\"range\" name=\"position\" min=\"0\" max=\"1000\" value=\"0\" \/>\n\t\t\t\t<\/label>\n\t\t\t\t<div class=\"position-text\">\n\n\t\t\t\t<\/div>\n\t\t\t<\/div>\n\t\t\t<div class=\"global-controls\">\n\t\t\t\t<div class=\"volume\">\n\t\t\t\t\t<label>\n\t\t\t\t\t\t<input type=\"range\" name=\"volume\" min=\"0\" max=\"100\" value=\"100\" \/>\n\t\t\t\t\t\tVolume\n\t\t\t\t\t<\/label>\n\t\t\t\t<\/div>\n\t\t\t<\/div>\n\t\t<\/div>\n\t<\/div>\n<\/div>\n\n<\/div>"; 
module.exports = tri.addTemplate("dankolz/audio-player/controls", t); 

/***/ }),

/***/ "./views/dankolz/audio-player/next-button.tri":
/*!****************************************************!*\
  !*** ./views/dankolz/audio-player/next-button.tri ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var tri = __webpack_require__(/*! tripartite */ "./node_modules/tripartite/tripartite.js"); var t = "<svg class=\"next-button-svg\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" height=\"24px\" viewBox=\"0 -960 960 960\" width=\"24px\" fill=\"#5f6368\"><path d=\"M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Zm80-240Zm0 90 136-90-136-90v180Z\"\/><\/svg>"; 
module.exports = tri.addTemplate("dankolz/audio-player/next-button", t); 

/***/ }),

/***/ "./views/dankolz/audio-player/play-pause-button.tri":
/*!**********************************************************!*\
  !*** ./views/dankolz/audio-player/play-pause-button.tri ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var tri = __webpack_require__(/*! tripartite */ "./node_modules/tripartite/tripartite.js"); var t = "\n<svg class=\"play-pause-button-svg\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" height=\"24px\" viewBox=\"0 -960 960 960\" width=\"24px\" fill=\"#5f6368\"><path d=\"M200-312v-336l240 168-240 168Zm320-8v-320h80v320h-80Zm160 0v-320h80v320h-80Z\"\/><\/svg>"; 
module.exports = tri.addTemplate("dankolz/audio-player/play-pause-button", t); 

/***/ }),

/***/ "./views/dankolz/audio-player/previous-button.tri":
/*!********************************************************!*\
  !*** ./views/dankolz/audio-player/previous-button.tri ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var tri = __webpack_require__(/*! tripartite */ "./node_modules/tripartite/tripartite.js"); var t = "<svg class=\"previous-button-svg\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" height=\"24px\" viewBox=\"0 -960 960 960\" width=\"24px\" fill=\"#5f6368\"><path d=\"M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Zm-80-240Zm0 90v-180l-136 90 136 90Z\"\/><\/svg>"; 
module.exports = tri.addTemplate("dankolz/audio-player/previous-button", t); 

/***/ }),

/***/ "./views/test1.tri":
/*!*************************!*\
  !*** ./views/test1.tri ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var tri = __webpack_require__(/*! tripartite */ "./node_modules/tripartite/tripartite.js"); var t = "This is test1.tri\n"; 
module.exports = tri.addTemplate("test1", t); 

/***/ }),

/***/ "./views/test2.tri":
/*!*************************!*\
  !*** ./views/test2.tri ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var tri = __webpack_require__(/*! tripartite */ "./node_modules/tripartite/tripartite.js"); var t = "This is test2.tri\n__::.\/test1__\n"; 
module.exports = tri.addTemplate("test2", t); 

/***/ }),

/***/ "./client-js/index.js":
/*!****************************!*\
  !*** ./client-js/index.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ go),
/* harmony export */   stop: () => (/* binding */ stop)
/* harmony export */ });
/* harmony import */ var tripartite__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tripartite */ "./node_modules/tripartite/tripartite.js");
/* harmony import */ var _views_load_browser_views_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../views/load-browser-views.js */ "./views/load-browser-views.js");



function go() {
	console.log((0,_views_load_browser_views_js__WEBPACK_IMPORTED_MODULE_1__.test2)())

	// and use like:
	let d = document.createElement('div')
	d.innerHTML = tripartite__WEBPACK_IMPORTED_MODULE_0__.getTemplate('test1')({
		key1: 'value'
		, key2: 'value'
	})
	document.body.append(d)
}

function stop() {
	console.log('stop')
}

/***/ }),

/***/ "./client-lib/library-view.mjs":
/*!*************************************!*\
  !*** ./client-lib/library-view.mjs ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LibraryView)
/* harmony export */ });
/* harmony import */ var _webhandle_backbone_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @webhandle/backbone-view */ "./node_modules/@webhandle/backbone-view/client-js/index.js");
/* harmony import */ var kalpa_tree_on_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! kalpa-tree-on-page */ "./node_modules/kalpa-tree-on-page/client-js/kalpa-tree-loader.js");
/* harmony import */ var _webhandle_minimal_browser_event_emitter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @webhandle/minimal-browser-event-emitter */ "./node_modules/@webhandle/minimal-browser-event-emitter/client-js/index.js");
/* harmony import */ var _webhandle_drag_sortable_list_client_lib_data_item_worker_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @webhandle/drag-sortable-list/client-lib/data-item-worker.mjs */ "./node_modules/@webhandle/drag-sortable-list/client-lib/data-item-worker.mjs");






let dataItemWorker = new _webhandle_drag_sortable_list_client_lib_data_item_worker_mjs__WEBPACK_IMPORTED_MODULE_3__["default"]()

let counter = 1

class LibraryView extends _webhandle_backbone_view__WEBPACK_IMPORTED_MODULE_0__.View {

	/**
	 * Setup the event listners and default objects.
	 * @param {Object} options 
	 */
	preinitialize(options = {}) {
		this.events = Object.assign({}, {
			'dragover .': 'handleDropzoneDragover'
			, 'drop .': 'handleDropzoneDrop'
			, 'dragstart .kalpa-tree li.node': 'handleNodeDragStart'
			, 'keydown input[name="libFilter"]': 'handleSearch'
			, 'change input[name="libFilter"]': 'handleSearch'
			// , 'dragover .drop-zone': 'handleDropzoneDragover'
			// , 'drop .drop-zone': 'handleDropzoneDrop'
			// , 'dragover .kalpa-tree': 'handleDropzoneDragover'
			// , 'drop .kapla-tree': 'handleDropzoneDrop'

		}, options.events)
		options.events = this.events
		if (!this.emitter) {
			this.emitter = options.emitter || new _webhandle_minimal_browser_event_emitter__WEBPACK_IMPORTED_MODULE_2__["default"]()
		}
		this.nodesEmitter = new _webhandle_minimal_browser_event_emitter__WEBPACK_IMPORTED_MODULE_2__["default"]()
		this.nodesByPath = {}
		
		this.uniquify = 1
	}
	
	getFullPath(path) {
		let parts = path.split('/').filter(item => !!item)
		return parts.join('/')
	}
	getParentPath(path) {
		let parts = path.split('/').filter(item => !!item)
		if(parts.length < 2) {
			return ''
		}
		parts.pop()
		return parts.join('/')
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

		return pathInfo
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

	handleSearch(evt, selected) {
		// evt.preventDefault()
		// evt.stopPropagation()
		setTimeout(() => {
			this.tree.search(selected.value)

		}, 1)
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
					keepDirectories: false
					, recursive: true
				})
				let newNodesPaths = new Set()
				for (let file of files) {
					let parentId = 0
					let treePath = this.getTreePathParts(file.fullPath)
					let parentPath = treePath.album ? treePath.artist + '/' + treePath.album : treePath.artist
					let parent = this.nodesByPath[parentPath]
					
					let artistNode
					let albumNode
					if(!parent && treePath.artist) {
						artistNode = this.nodesByPath[treePath.artist]
						if(!artistNode) {
							artistNode = {
								parentId: parentId
								, id: counter++
								, label: treePath.artist
							}
							
							this.nodesByPath[treePath.artist] = artistNode
							newNodesPaths.add(treePath.artist)
						}
						if(treePath.album) {
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
					
					if(parent) {
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
					
					if(path in this.nodesByPath) {
						// We already have a node with this path, maybe because a file has the same name as
						// a folder.
						path += this.uniquify++
					}
					this.nodesByPath[path] = add
					newNodesPaths.add(path)
				}
				newNodesPaths = [...newNodesPaths]
				newNodesPaths.sort()
				for(let path of newNodesPaths) {
					this.nodesEmitter.emit('data', this.nodesByPath[path])
				}
			}
		})
		return p
	}
	
	nodeSelectedFromTree(node) {
		this.el.querySelector('input[name="libFilter"]').value = null

	}

	render() {
		let view = this

		kalpa_tree_on_page__WEBPACK_IMPORTED_MODULE_1__({
			stream: view.nodesEmitter
			, treeContainerSelector: '.player-controls .library .kalpa-tree'
		}).then(tree => {
			view.tree = tree
			let rootNode = {
				id: 0
				, label: 'music'
			}
			view.nodesByPath[''] = rootNode
			view.nodesEmitter.emit('data', rootNode)
			
			this.tree.on('select', (node) => {
				view.nodeSelectedFromTree(node)
			})

			let updateDraggable = () => {
				view.el.querySelectorAll('.kalpa-tree li.node').forEach(node => node.setAttribute('draggable', true))
				setTimeout(() => {
					view.el.querySelectorAll('.kalpa-tree li.node').forEach(node => node.setAttribute('draggable', true))
				}, 200)
			}
			tree.on('rebind', updateDraggable)
			tree.on('rebind:exit', updateDraggable)
		})

	}

}

/***/ }),

/***/ "./client-lib/player-controls.mjs":
/*!****************************************!*\
  !*** ./client-lib/player-controls.mjs ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PlayControlsView)
/* harmony export */ });
/* harmony import */ var _webhandle_backbone_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @webhandle/backbone-view */ "./node_modules/@webhandle/backbone-view/client-js/index.js");
/* harmony import */ var _webhandle_minimal_browser_event_emitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @webhandle/minimal-browser-event-emitter */ "./node_modules/@webhandle/minimal-browser-event-emitter/client-js/index.js");
/* harmony import */ var _views_load_browser_views_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../views/load-browser-views.js */ "./views/load-browser-views.js");
/* harmony import */ var _webhandle_drag_sortable_list_client_lib_data_item_worker_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @webhandle/drag-sortable-list/client-lib/data-item-worker.mjs */ "./node_modules/@webhandle/drag-sortable-list/client-lib/data-item-worker.mjs");





let dataItemWorker = new _webhandle_drag_sortable_list_client_lib_data_item_worker_mjs__WEBPACK_IMPORTED_MODULE_3__["default"]()

let counter = 1

function isSet(val) {
	return ! (val === null || val === undefined)
}
class PlayControlsView extends _webhandle_backbone_view__WEBPACK_IMPORTED_MODULE_0__.View {

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
			this.emitter = options.emitter || new _webhandle_minimal_browser_event_emitter__WEBPACK_IMPORTED_MODULE_1__["default"]()
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
		this.el.innerHTML = (0,_views_load_browser_views_js__WEBPACK_IMPORTED_MODULE_2__.playerControls)()
	}
}

/***/ }),

/***/ "./client-lib/player.mjs":
/*!*******************************!*\
  !*** ./client-lib/player.mjs ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _webhandle_drag_sortable_list_client_lib_data_item_worker_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @webhandle/drag-sortable-list/client-lib/data-item-worker.mjs */ "./node_modules/@webhandle/drag-sortable-list/client-lib/data-item-worker.mjs");

let dataItemWorker = new _webhandle_drag_sortable_list_client_lib_data_item_worker_mjs__WEBPACK_IMPORTED_MODULE_0__["default"]()

class Player {
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
				if(cell.data instanceof File) {
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

/***/ }),

/***/ "./client-lib/playlist-view.mjs":
/*!**************************************!*\
  !*** ./client-lib/playlist-view.mjs ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PlaylistView)
/* harmony export */ });
/* harmony import */ var _webhandle_drag_sortable_list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @webhandle/drag-sortable-list */ "./node_modules/@webhandle/drag-sortable-list/client-lib/list-view.mjs");
/* harmony import */ var _webhandle_drag_sortable_list_client_lib_data_item_worker_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @webhandle/drag-sortable-list/client-lib/data-item-worker.mjs */ "./node_modules/@webhandle/drag-sortable-list/client-lib/data-item-worker.mjs");




let dataItemWorker = new _webhandle_drag_sortable_list_client_lib_data_item_worker_mjs__WEBPACK_IMPORTED_MODULE_1__["default"]()

class PlaylistView extends _webhandle_drag_sortable_list__WEBPACK_IMPORTED_MODULE_0__["default"] {

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

/***/ }),

/***/ "./node_modules/@webhandle/backbone-view/client-js/event-entry-mapper.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@webhandle/backbone-view/client-js/event-entry-mapper.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ eventEntryMapper)
/* harmony export */ });
function eventEntryMapper([key, value]) {
	key = key.trim()
	let parts = key.split(' ')
	let event = parts.shift().trim()
	let selector = parts.join(' ').trim()
	
	if(typeof value === 'string') {
		value = value.trim()
	}	
	
	return {
		event: event,
		selector: selector,
		handler: value
	}
}

/***/ }),

/***/ "./node_modules/@webhandle/backbone-view/client-js/extract-event-names.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@webhandle/backbone-view/client-js/extract-event-names.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ extractEventNames)
/* harmony export */ });
function extractEventNames(eventTriggers) {
	let eventNames = Array.from(eventTriggers.reduce((acc, trigger) => {
		acc.add(trigger.event)
		return acc
	}, new Set()))
	return eventNames
}

/***/ }),

/***/ "./node_modules/@webhandle/backbone-view/client-js/generate-id.js":
/*!************************************************************************!*\
  !*** ./node_modules/@webhandle/backbone-view/client-js/generate-id.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generateId)
/* harmony export */ });
/**
 * Generates a random string id in the browser. Will probably not work
 * on the server.
 * @returns A base64 web url safe string
 */
function generateId() {
	let array = new Uint8Array(32)
	window.crypto.getRandomValues(array)
	let value = btoa(array)
	value = value.replace(/\//g, "_").replace(/\+/g, "-").replace(/=+$/, "")
	return value
}

/***/ }),

/***/ "./node_modules/@webhandle/backbone-view/client-js/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/@webhandle/backbone-view/client-js/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   View: () => (/* reexport safe */ _view_js__WEBPACK_IMPORTED_MODULE_0__.View)
/* harmony export */ });
/* harmony import */ var _view_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view.js */ "./node_modules/@webhandle/backbone-view/client-js/view.js");




/***/ }),

/***/ "./node_modules/@webhandle/backbone-view/client-js/view.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@webhandle/backbone-view/client-js/view.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   View: () => (/* binding */ View)
/* harmony export */ });
/* harmony import */ var _generate_id_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./generate-id.js */ "./node_modules/@webhandle/backbone-view/client-js/generate-id.js");
/* harmony import */ var _event_entry_mapper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-entry-mapper.js */ "./node_modules/@webhandle/backbone-view/client-js/event-entry-mapper.js");
/* harmony import */ var _extract_event_names_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extract-event-names.js */ "./node_modules/@webhandle/backbone-view/client-js/extract-event-names.js");

// import pick from "./pick.js"



let defaultOptions = {
	// The default `tagName` of a View's element is `"div"`.
	tagName: 'div'
	
	, events: {}

}
let viewOptions = ['model', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

/**
 * A way to connect data to be displayed, a way to display it, and an organization
 * of functions to handle events.
 */
class View {
	constructor(options) {
		this.id = (0,_generate_id_js__WEBPACK_IMPORTED_MODULE_0__["default"])()
		Object.assign(this, defaultOptions)
		this.preinitialize.apply(this, arguments);
		Object.assign(this, options)
		this._ensureElement()
		this.initialize.apply(this, arguments);
	}


	/**
	 * preinitialize is an empty function by default. You can override it with a function
	 * or object.  preinitialize will run before any instantiation logic is run in the View
	 */
	preinitialize() { }

	/**
	 * Initialize is an empty function by default. Override it with your own
	 * initialization logic.
	 */
	initialize() { }

	/**
	 * **render** is the core function that your view should override, in order
	 * to populate its element (`this.el`), with the appropriate HTML. The
	 * convention is for **render** to always return `this`.
	 * @returns this
	 */
	render() {
		return this
	}
	
	/**
	 * Removes the element from the dom. Does not disable event listeners
	 */
	remove() {
		this.el.parentElement.removeChild(this.el)
	}
	
	/**
	 * Adds this view as a child to a containing element. Nothing special is going on here.
	 * This is just a shortcut for container.appendChild
	 * @param {Element} container 
	 */
	appendTo(container) {
		container.appendChild(this.el)
	}

	/**
	 * Clears the contents of the container and adds this view.
	 * @param {Element} container 
	 */
	replaceContentsOf(container) {
		container.innerHTML = ''
		this.appendTo(container)
	}

	/**
	 * Set the element for this view, and if new, adds listeners to it in accordance
	 * with the "events" member.
	 * @param {Element} el The dom element which will be the root of this view
	 * @returns this
	 */
	setElement(el) {
		if (this.el !== el) {
			this.el = el
			this._addListeners()
		}
		return this
	}

	/**
	 * Produces a DOM element to be assigned to your view. Exposed for
	 * subclasses using an alternative DOM manipulation API.
	 * @param {string} name The element tag name
	 * @returns The dom element
	 */
	_createElement(name) {
		let el = document.createElement(name)
		el.setAttribute('id', this.id)
		el.view = this
		return el
	}

	/**
	 * Ensures that the element exists. Applies attributes and className
	 * to it regardless
	 */
	_ensureElement() {
		if (!this.el) {
			this.setElement(this._createElement(this.tagName))
		}
		else {
			this._addListeners()
		}
		this._setAttributes()
		if (this.className) {
			this.el.classList.add(this.className)
		}
	}

	/**
	 * Set attributes from a hash on this view's element.  Exposed for
	 * subclasses using an alternative DOM manipulation API.
	 * @param {object} attributes 
	 */
	_setAttributes(attributes) {
		if (this.attributes) {
			for (let [key, value] of Object.entries(this.attributes)) {
				this.el.setAttribute(key, value)
			}
		}
	}

	/**
	 * 
	 * Set callbacks, where `this.events` is a hash of
	 * *{"event selector": "callback"}*
	 *
	 *    {
	 *       'mousedown .title':  'edit',
	 *       'click .button':     'save',
	 *       'click .open':       function(e) { ... },
	 *       'keydown .':     	  'handleKey'
	 *    }
	 * pairs. Callbacks will be bound to the view, with `this` set properly.
	 * 
	 * 
	 * Note that the selector `.` will match the root element and can be used
	 * as a final chance to handle events or for events like an escape key
	 * which are essentially global to the widget.
	 * 
	 */
	_addListeners() {
		this.eventTriggers = Object.entries(this.events).map(_event_entry_mapper_js__WEBPACK_IMPORTED_MODULE_1__["default"])
		let eventNames = (0,_extract_event_names_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.eventTriggers)		

		for(let eventName of eventNames) {
			this.el.addEventListener(eventName, this._eventHandler.bind(this))
		}
	}
	
	/**
	 * Get the elements from the view which match the selector
	 * @param {string} selector A css selector. `.` will select the root element
	 * @returns An array of elements
	 */
	_getCandidates(selector) {
		if(selector === '.') {
			return [this.el]
		}
		return Array.from(this.el.querySelectorAll(selector))
	}
	
	/**
	 * Handles all events for all elements within the view. It attempts to find a
	 * trigger matching the event and then process it. It will match and invoke
	 * only one trigger.
	 * @param {Event} evt 
	 */
	_eventHandler(evt) {
		for(let trigger of this.eventTriggers) {
			if(evt.type == trigger.event) {
				let candidates = this._getCandidates(trigger.selector)
				let found = null
				for(let candidate of candidates) {
					if(candidate === evt.target || candidate.contains(evt.target)) {
						found = candidate
						break
					}
				}
				if(found) {
					if(typeof trigger.handler === 'string') {
						this[trigger.handler].call(this, evt, found)
					}	
					else if(typeof trigger.handler === 'function') {
						trigger.handler.call(this, evt, found)
					}
					break
				}
			}
		}
	}
}


/***/ }),

/***/ "./node_modules/@webhandle/drag-sortable-list/client-lib/data-item-worker.mjs":
/*!************************************************************************************!*\
  !*** ./node_modules/@webhandle/drag-sortable-list/client-lib/data-item-worker.mjs ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DataItemWorker)
/* harmony export */ });

class DataItemWorker {

	async getFileFromEntry(entry) {
		let p = new Promise(async (resolve, reject) => {
			try {
				if (entry.file) {
					entry.file(file => {
						file.entry = entry
						resolve(file)
					}, (err) => {
						console.error(err)
						resolve(null)
					})
				}
				else {
					resolve(null)
				}
			}
			catch (e) {
				console.error(e)
				resolve(null)
			}
		})
		return p
	}

	async readDirectoryEntries(entry) {
		let p = new Promise((resolve, reject) => {
			let dirReader = entry.createReader()
			let result = []
			let readThem = () => {
				dirReader.readEntries(async (entries) => {
					try {
						if(entries && entries.length > 0) {
							for (let entry of entries) {
								result.push(entry)
							}
							readThem()
						}
						else {
							resolve(result)
						}
					}
					catch (e) {
						console.error(e)
						resolve(result)
					}
				})
			}
			readThem()
		})
		return p
	}

	/**
	 * 
	 * Takes a list of DataTransferItems and resolves them to FileEntry objects.
	 * 
	 * Note, you can get a real File object by calling `getFileFromEntry`
	 * @param {array[DataTransferItem|File|FileEntry|DirectoryEntry]} entries 
	 * @param {*} [options]
	 * @returns 
	 */
	async expandEntries(entries, options) {
		options = Object.assign({
			keepDirectories: false
			, recursive: true
		}, options)
		let expanded = []
		let target = [...entries]	
		
		while(target.length > 0) {
			
			// You MUST process all of the DataTransferItems first. If you do a directory read
			// it will blank out the information on those items.
			let item = target.shift()
			
			if(item instanceof File) {
				expanded.push(item)
			}
			else if(item.isFile === true && item.isDirectory === false) {
				expanded.push(item)
			}
			else if(item.isFile === false && item.isDirectory === true) {
				let dirEntries = await this.readDirectoryEntries(item)
				if(options.recursive) {
					target.push(...dirEntries)
				}
				else {
					if(!options.keepDirectories) {
						dirEntries = dirEntries.filter(item => item.isFile)
					}
					expanded.push(...dirEntries)
				}
				if(options.keepDirectories) {
					expanded.push(item)
				}
			}
			else if (item.kind === "file") {
				if (item.webkitGetAsEntry) {
					let entry = item.webkitGetAsEntry()
					if (entry) {
						target.push(entry)
					}
				}
				else if(item.getAsFile) {
					target.push(item.getAsFile())
				}
			}
		}
		
		expanded = expanded.filter(item => !!item)
		return expanded
	}

	/**
	 * A utility function to extract the file entries from a file drop event.
	 * @param {Event} evt 
	 * @returns 
	 */
	async getFileEntriesFromEvent(evt, options) {
		let entries = []
		// items is the new interface we should use if that's available
		if (evt.dataTransfer.items) {
			entries.push(...evt.dataTransfer.items)
		} 
		else if(evt.dataTransfer.files) {
			entries.push(...evt.dataTransfer.files)
		}
		let result = await this.expandEntries(entries, options)
		return result.filter(item => !!item)
	}


}

/***/ }),

/***/ "./node_modules/@webhandle/drag-sortable-list/client-lib/list-view.mjs":
/*!*****************************************************************************!*\
  !*** ./node_modules/@webhandle/drag-sortable-list/client-lib/list-view.mjs ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ListView)
/* harmony export */ });
/* harmony import */ var _webhandle_backbone_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @webhandle/backbone-view */ "./node_modules/@webhandle/backbone-view/client-js/index.js");
/* harmony import */ var _webhandle_minimal_browser_event_emitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @webhandle/minimal-browser-event-emitter */ "./node_modules/@webhandle/minimal-browser-event-emitter/client-js/index.js");
/* harmony import */ var _data_item_worker_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./data-item-worker.mjs */ "./node_modules/@webhandle/drag-sortable-list/client-lib/data-item-worker.mjs");




let dataItemWorker = new _data_item_worker_mjs__WEBPACK_IMPORTED_MODULE_2__["default"]()

class ListView extends _webhandle_backbone_view__WEBPACK_IMPORTED_MODULE_0__.View {

	/**
	 * Setup the event listners and default objects.
	 * @param {Object} options 
	 */
	preinitialize(options = {}) {
		this.desktopHandleSelector = options.desktopHandleSelector
		this.mobileHandleSelector = options.mobileHandleSelector || '.handle'
		this.events = Object.assign({}, {
			'drop .': 'handleDrop'
			, 'dragend .': 'handleDragEnd'
			, 'dragleave .': 'handleDragLeave'
			, 'dragover .': 'handleDragover'
			, 'dragenter .': 'dragEnter'
			, 'dragover *': 'dragEnterCell'
			, 'dragstart *': 'dragStart'
			, ['touchstart ' + this.mobileHandleSelector]: 'touchDrag'
			, ['touchmove ' + this.mobileHandleSelector]: 'touchMove'
			, ['touchend ' + this.mobileHandleSelector]: 'touchEnd'
			, ['touchcancel ' + this.mobileHandleSelector]: 'touchCancel'
		}, options.events)
		this.placeholderName = options.placeholderName || 'New Item'
		options.events = this.events
		if (!this.emitter) {
			this.emitter = new _webhandle_minimal_browser_event_emitter__WEBPACK_IMPORTED_MODULE_1__["default"]()
		}
		this.overscrollCaptures = {}
	}

	/**
	 * Returns true if a file is being dragged into the list.
	 * @param {Event} evt 
	 * @returns 
	 */
	isFileTypeDrag(evt) {
		if (evt.dataTransfer && evt.dataTransfer.item && evt.dataTransfer.item.length > 0) {
			if (evt.dataTransfer.items[0].kind === 'file') {
				return true
			}
		}
		if (evt.dataTransfer && evt.dataTransfer.types) {
			for (let type of evt.dataTransfer.types) {
				if (type.toLowerCase() == 'files') {
					return true
				}
			}
		}

		return false
	}

	/**
	 * Looks to see if there's a resource label and we should therefore consider this an
	 * external resource object that's being dragged into the list.
	 * @param {Event} evt 
	 * @returns 
	 */
	isResourceTypeDrag(evt) {
		return !!this.extractLabel(evt)
	}

	/**
	 * Watches for entry of dragging into a cell so we can tell of the user is still
	 * performing a drag operation.
	 * @param {Event} evt 
	 * @param {Element} selected 
	 */
	dragEnterCell(evt, selected) {
		this.canCancel = false
	}

	/**
	 * Watch for the end of dragging for one of the existing cells. This is the cleanup
	 * for the case where a user is dragging and then presses escape.
	 * @param {Event} evt 
	 * @param {Element} selected 
	 */
	handleDragEnd(evt, selected) {
		this.cleanupDrag()
	}

	/**
	 * Watches for the mouse leaving the list area. The spec has no good way to tell if the user
	 * has stopped dragging within our control area, so here we're doing a little dance to watch
	 * when the user leaves any of the top level elements and then perform a cancel if we don't
	 * see another drag event within a few milliseconds.
	 * 
	 * This does sometimes lead to false positives, but that's generally okay since the code just
	 * interprets the next drag event as if the user just started their drag, so it recovers 
	 * fairly well.
	 * @param {Event} evt 
	 * @param {Element} selected 
	 */
	handleDragLeave(evt, selected) {
		if (this.externalDrag) {
			if (evt.target == this.el || this.getCells().includes(evt.target)) {
				// so we're leaving the whole list. If we don't immediately enter someplace else
				// then we should interpret this as a cancel
				// In this case, "the whole list" is one of the cells or the container
				this.canCancel = true
				setTimeout(() => {
					if (this.canCancel) {
						this.cleanupDrag()
					}
				}, 20)
			}
		}
	}

	/**
	 * Returns true if this is a type of object from outside the list that can be added
	 * to the list. By default it allows files and uri-list types. To turn off the abilty
	 * to drag other items into the list, just override to return false.
	 * @param {Event} evt 
	 * @returns 
	 */
	shouldInsertCellForExternalDrag(evt) {
		return this.isFileTypeDrag(evt) || this.isResourceTypeDrag(evt)
	}


	/**
	 * This is the mobile/touch equivalent of dragStart
	 * @param {Event} evt 
	 * @param {Element} selected 
	 */
	touchDrag(evt, selected) {
		this.captureOverscroll('html')
		this.captureOverscroll('body')
		this.dragStart(evt, selected)
	}

	/**
	 * Handle the user touch dragging an item.
	 * @param {Event} evt 
	 * @param {Element} selected 
	 */
	touchMove(evt, selected) {
		let top = this.boxTop()
		let pos = Math.max(0, evt.touches[0].pageY) - top
		this.positionOnDrag(pos)
	}

	/**
	 * This is essentially a mobile/touch drop
	 * @param {Event} evt 
	 * @param {Element} selected 
	 */
	touchEnd(evt, selected) {
		this.handleDrop(evt, selected)
	}

	/**
	 * Cleanup after a mobile drag
	 * @param {Event} evt 
	 * @param {Element} selected 
	 */
	touchCancel(evt, selected) {
		this.cleanupDrag()
	}

	/**
	 * Listens for the element being dragged. The spec seems to indicate that this is
	 * fired on mobile as well, but in practice is seems to only get fired on 
	 * desktop.
	 * @param {Event} evt 
	 * @param {Element} selected 
	 */
	dragStart(evt, selected) {
		this.dragging = this.getCellFromChild(selected)
		this.dragging.classList.add('dragging')
		if (evt.dataTransfer) {
			evt.dataTransfer.setDragImage(document.createElement('div'), 0, 0)
		}
	}

	/**
	 * Extracts a placeholder label from the data transfer types. The label name is
	 * part of the type name. So, a type of `data:text/label,awesome` would indicate
	 * that the placeholder is supposed to be `awesome`.
	 * @param {Event} evt 
	 * @returns 
	 */
	extractLabel(evt) {
		let labelPrefix = 'data:text/label,'
		for (let type of evt.dataTransfer.types) {
			if (type.indexOf(labelPrefix) == 0) {
				return type.substring(labelPrefix.length)
			}
		}

		return null
	}

	/**
	 * Restores the elements previous overscroll behavior (see captureOverscroll for why we need
	 * this)
	 * @param {string} elName 
	 */
	restoreOverscroll(elName) {
		if (elName in this.overscrollCaptures) {
			document.querySelector(elName).style['overscroll-behavior'] = this.overscrollCaptures[elName]
			delete this.overscrollCaptures[elName]
		}
	}

	/**
	 * Used for mobile to get the present value of what happens when the user drags their finger
	 * farther than the screen can scroll. By default what happens is a page reload. That won't 
	 * be what we want if a user is dragging a list item, so we have to capture that behavior and
	 * change it so that nothing happens to the page.
	 * @param {string} elName 
	 */
	captureOverscroll(elName) {
		let el = document.querySelector(elName)
		this.overscrollCaptures[elName] = el.style['overscroll-behavior']
		el.style['overscroll-behavior'] = 'none'
	}

	/**
	 * Utility function to create a dom node based on html
	 * @param {string} html 
	 * @returns 
	 */
	_makeElementFromHTML(html) {
		let div = document.createElement('div')
		div.innerHTML = html
		let child = div.children[0]
		return child
	}


	/**
	 * Creates markup for the external drag event placeholder cell. Attempts
	 * to determine a reasonable label.
	 * @param {Event} evt 
	 * @returns 
	 */
	createExternalDragPlaceholderHTML(evt) {
		let placeholder = this.extractLabel(evt) || this.placeholderName
		let html = `<div class="cell">
			<span class="handle">↕</span>
			${placeholder}
		</div>`
		return html

	}

	/**
	 * Creates a placeholder cell for a drag event where the source is an
	 * external object like a file or something else on the page.
	 * @param {Event} evt 
	 */
	createExternalDragPlaceholderCell(evt) {
		let html = this.createExternalDragPlaceholderHTML(evt)
		let cell = this._makeElementFromHTML(html)
		cell.setAttribute('draggable', true)
		this.addCell(cell)
		this.dragStart(evt, cell)
	}

	dragEnter(evt, selected) {
		if (!this.dragging && this.shouldInsertCellForExternalDrag(evt)) {
			// If we're not already doing a drag operation, we need to start one
			// We create a placeholder for this event and then move it up and down
			// like a pre-existing cell. 
			// NOTE: We do not have much information about the contents of the
			// drag until the drop event occurs. This placeholder may have to be
			// somewhat generic.
			this.externalDrag = true
			this.createExternalDragPlaceholderCell(evt)
		}
	}

	/**
	 * Watch for movement of something being dragged
	 * @param {Event} evt 
	 * @param {Element} selected 
	 */
	handleDragover(evt, selected) {
		evt.preventDefault()
		this.canCancel = false
		let top = this.boxTop()
		let pos = evt.y - top

		if (this.dragging) {
			if (evt.dataTransfer) {
				evt.dataTransfer.dropEffect = 'move'
			}
			this.positionOnDrag(pos)
		}
		else {
			if (evt.dataTransfer) {
				evt.dataTransfer.dropEffect = 'copy'
			}
		}
	}

	/**
	 * Creates permanent cells for files dropped into the list
	 * @param {array[FileEntry|File]} files 
	 * @returns an array of Elements
	 */
	createCellsForFiles(files) {
		let cells = files.map(file => {
			let html = `<div class="cell">
				<span class="handle">↕</span>
				${file.name}
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
		if (!Array.isArray(uriList)) {
			uriList = [uriList]
		}
		let cells = uriList.map(uri => {
			let html = `<div class="cell">
				<span class="handle">↕</span>
				${uri}
			</div>`
			let el = this._makeElementFromHTML(html)
			el.data = uri
			return el
		})
		return cells
	}

	/**
	 * Creates permanent cells for drops of unknown types.
	 * @param {Event} evt 
	 * @returns An array of elements
	 */
	createCellsForUnknownType(evt) {
		return []
	}
	
	isExternalDrop(evt) {
		let uriList
		if (evt.dataTransfer) {
			uriList = evt.dataTransfer.getData('text/uri-list')
		}

		if (this.externalDrag || uriList) {
			return true
		}
		return false
	}
	
	async getFilesEntries(evt) {
		let files = await dataItemWorker.getFileEntriesFromEvent(evt, {
			keepDirectories: false
			, recursive: true
		})
		return files
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
				let files = await this.getFilesEntries(evt)
				let cells = []
				if (files && files.length > 0) {
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

	/**
	 * Adds a new item to the list, last item by default 
	 * @param {string|Element} cell The item to add 
	 * @param {*} [options]
	 * @param {boolean} options.first If true inserted at the start of the list
	 * @param {boolean} options.last If true inserted at the end of the list
	 * @param {Element} options.after Insert after this item 
	 * @param {Element} options.before Insert before this item
	 * @param {*} options.data Data to be set on the element
	 */
	addCell(cell, options = {}) {
		if (typeof cell === 'string') {
			cell = this._makeElementFromHTML(cell)
		}

		if (options.data) {
			cell.data = options.data
		}

		if (options.first) {
			this.el.insertAdjacentElement('afterbegin', cell)
		}
		else if (options.before) {
			this.el.insertBefore(cell, options.before)
		}
		else if (options.after) {
			options.after.after(cell)
		}
		else {
			this.el.insertAdjacentElement('beforeend', cell)
		}
		return cell
	}

	/**
	 * 
	 * @param {int} pos position of pointer relative to the top of the box
	 */
	positionOnDrag(pos) {
		let over = this.findOver(pos)
		this.addCell(this.dragging, {
			before: over
		})
	}

	/**
	 * Gets the top level objects of the list.
	 * @returns 
	 */
	getCells() {
		return [...this.el.children]
	}

	/**
	 * Cleanup after a drag event by deleting any placeholder objects
	 * and restoring the browser to its pre-drag settings
	 */
	cleanupDrag() {
		if (this.dragging && this.externalDrag) {
			this.dragging.remove()
		}

		delete this.dragging
		delete this.externalDrag
		this.getCells().forEach(cell => {
			cell.classList.remove('dragging')
		})
		this.restoreOverscroll('html')
		this.restoreOverscroll('body')
	}

	/**
	 * Determine which cell the pointer/finger is currently over.
	 * @param {Object} pos 
	 * @returns 
	 */
	findOver(pos) {
		let locations = this.findLocations()
		for (let loc of locations) {
			if (pos >= loc.top && pos <= loc.bottom) {
				return loc.cell
			}
		}
	}

	/**
	 * Gets the top of the list box
	 * @returns 
	 */
	boxTop() {
		let boxRect = this.el.getBoundingClientRect()
		let top = boxRect.top
		return top
	}


	/**
	 * Sets up the cells to be draggable and makes the mobile touch handles ready for drag.
	 */
	render() {
		if (this.desktopHandleSelector) {
			this.el.querySelectorAll(this.desktopHandleSelector).forEach(handle => {
				handle.setAttribute("draggable", true)
			})
		}
		else {
			this.getCells().forEach(cell => {
				cell.setAttribute("draggable", true)
			})
		}
		if (this.mobileHandleSelector) {
			this.el.querySelectorAll(this.mobileHandleSelector).forEach(handle => {
				handle.style['touch-action'] = 'none'
			})
		}
	}

	/**
	 * 
	 * @returns The relative locations of the cells in the list
	 */
	findLocations() {
		let top = this.boxTop()

		let locations = []
		this.getCells().forEach(cell => {
			let rect = cell.getBoundingClientRect()
			locations.push({
				top: rect.top - top
				, bottom: rect.bottom - top
				, cell: cell
			})
		})
		return locations
	}

	/**
	 * Give a node for the cell or a descendent of a cell, returns the node
	 * for the cell.
	 * @param {Node} child 
	 * @returns 
	 */
	getCellFromChild(child) {
		if (child.parentElement == this.el) {
			return child
		}
		if (!child) {
			return null
		}
		return this.getCellFromChild(child.parentElement)
	}
}




/***/ }),

/***/ "./node_modules/@webhandle/minimal-browser-event-emitter/client-js/event-emitter.mjs":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@webhandle/minimal-browser-event-emitter/client-js/event-emitter.mjs ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EventEmitter)
/* harmony export */ });
/* harmony import */ var _streamish_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./streamish.mjs */ "./node_modules/@webhandle/minimal-browser-event-emitter/client-js/streamish.mjs");


/**
 * Add this most basic of the EventEmitter functions (on, emit, removeListener) to the browser's
 * EventTarget functionality.
 * 
 * The eventEmitter.emit() method allows an arbitrary set of arguments to be passed to the listener 
 * functions. Keep in mind that when an ordinary listener function is called, the standard this 
 * keyword is intentionally set to reference the EventEmitter instance to which the listener is attached.
 */
let base = typeof EventTarget === 'undefined' ? _streamish_mjs__WEBPACK_IMPORTED_MODULE_0__["default"] : EventTarget
class EventEmitter extends base {
	constructor(target) {
		super(target)
		if(target) {
			this.innerEventTarget = target
		}
		else {
			this.innerEventTarget = this
		}
	}
	/**
	 * Adds the listener function to the end of the listeners array for the event named eventName. No checks 
	 * are made to see if the listener has already been added. Multiple calls passing the same combination 
	 * of eventName and listener will result in the listener being added, and called, multiple times.
	 * @param {string} eventName The event type name
	 * @param {*} listener The listener function where has arbitrary arguments
	 */
	on(eventName, listener) {
		if(this.innerEventTarget.addEventListener) {
			let nativeListener = (event) => {
				listener.apply(this, event.detail)
			}
			listener.nativeListener = nativeListener
			this.innerEventTarget.addEventListener(eventName, nativeListener)
		}
		else {
			super.on(eventName, listener)
		}
		return this
	}

	/**
	 * Synchronously calls each of the listeners registered for the event named eventName, in the order 
	 * they were registered, passing the supplied arguments to each.
	 * 
	 * @param {string} eventName The event type name
	 * @param  {...any} args 
	 */
	emit(eventName, ...args) {
		if(this.innerEventTarget.dispatchEvent) {
			this.innerEventTarget.dispatchEvent(this._makeEvent(eventName, args))
		}
		else {
			super.emit(eventName, ...args)
		}
		return this
	}

	/**
	 * Removes the specified listener from the listener array for the event named eventName.
	 * @param {string} eventName The event type name
	 * @param {function} listener The listener function
	 */
	removeListener(eventName, listener) {
		if(this.innerEventTarget.removeEventListener) {
			listener = listener.nativeListener || listener
			this.innerEventTarget.removeEventListener(eventName, listener)
		}
		else {
			super.removeListener(eventName, listener)
		}
		return this
	}
	
	_makeEvent(eventName, args) {
		if(typeof CustomEvent === 'function') {
			return new CustomEvent(eventName, {
				detail: args
			})
		}
		else {
			let evt = new Event(eventName)
			evt.detail = args
			return evt
		}
	}
}

/***/ }),

/***/ "./node_modules/@webhandle/minimal-browser-event-emitter/client-js/index.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@webhandle/minimal-browser-event-emitter/client-js/index.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _streamish_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./streamish.mjs */ "./node_modules/@webhandle/minimal-browser-event-emitter/client-js/streamish.mjs");
/* harmony import */ var _event_emitter_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-emitter.mjs */ "./node_modules/@webhandle/minimal-browser-event-emitter/client-js/event-emitter.mjs");
let Emitter
;


if (typeof EventTarget !== 'undefined') {
	Emitter = _event_emitter_mjs__WEBPACK_IMPORTED_MODULE_1__["default"]
}
else {
	Emitter = _streamish_mjs__WEBPACK_IMPORTED_MODULE_0__["default"]
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Emitter);

/***/ }),

/***/ "./node_modules/@webhandle/minimal-browser-event-emitter/client-js/streamish.mjs":
/*!***************************************************************************************!*\
  !*** ./node_modules/@webhandle/minimal-browser-event-emitter/client-js/streamish.mjs ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Streamish)
/* harmony export */ });

class Streamish {
	constructor() {
		this.handles = {}
	}

	on(evt, handle) {
		let handles = this.handles[evt]
		if (!handles) {
			handles = this.handles[evt] = []
		}
		handles.push(handle)
		return this
	}

	emit(evt, ...args) {
		if (evt in this.handles) {
			for (let handle of this.handles[evt]) {
				handle.apply(this, args)
			}
		}
	}

	/**
	 * Removes the specified listener from the listener array for the event named eventName.
	 * @param {string} eventName The event type name
	 * @param {function} listener The listener function
	 */
	removeListener(eventName, listener) {
		if (eventName in this.handles) {
			this.handles[eventName] = this.handles[eventName].filter(func => {
				return func !== listener
			})
		}
	}
}

/***/ }),

/***/ "./views/load-browser-views.js":
/*!*************************************!*\
  !*** ./views/load-browser-views.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   playerControls: () => (/* binding */ playerControls),
/* harmony export */   test1: () => (/* binding */ test1),
/* harmony export */   test2: () => (/* binding */ test2)
/* harmony export */ });
/* harmony import */ var _test1_tri__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./test1.tri */ "./views/test1.tri");
/* harmony import */ var _test2_tri__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./test2.tri */ "./views/test2.tri");
/* harmony import */ var _dankolz_audio_player_controls_tri__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dankolz/audio-player/controls.tri */ "./views/dankolz/audio-player/controls.tri");
/* harmony import */ var _dankolz_audio_player_play_pause_button_tri__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dankolz/audio-player/play-pause-button.tri */ "./views/dankolz/audio-player/play-pause-button.tri");
/* harmony import */ var _dankolz_audio_player_next_button_tri__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dankolz/audio-player/next-button.tri */ "./views/dankolz/audio-player/next-button.tri");
/* harmony import */ var _dankolz_audio_player_previous_button_tri__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dankolz/audio-player/previous-button.tri */ "./views/dankolz/audio-player/previous-button.tri");








let test1 = _test1_tri__WEBPACK_IMPORTED_MODULE_0__
let test2 = _test2_tri__WEBPACK_IMPORTED_MODULE_1__
let playerControls = _dankolz_audio_player_controls_tri__WEBPACK_IMPORTED_MODULE_2__

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/global */
/******/ (() => {
/******/ 	__webpack_require__.g = (function() {
/******/ 		if (typeof globalThis === 'object') return globalThis;
/******/ 		try {
/******/ 			return this || new Function('return this')();
/******/ 		} catch (e) {
/******/ 			if (typeof window === 'object') return window;
/******/ 		}
/******/ 	})();
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./client-js/pages.mjs ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./client-js/index.js");
/* harmony import */ var _client_lib_player_controls_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../client-lib/player-controls.mjs */ "./client-lib/player-controls.mjs");
/* harmony import */ var _client_lib_player_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../client-lib/player.mjs */ "./client-lib/player.mjs");
/* harmony import */ var _webhandle_minimal_browser_event_emitter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @webhandle/minimal-browser-event-emitter */ "./node_modules/@webhandle/minimal-browser-event-emitter/client-js/index.js");
/* harmony import */ var _client_lib_playlist_view_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../client-lib/playlist-view.mjs */ "./client-lib/playlist-view.mjs");
/* harmony import */ var _client_lib_library_view_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../client-lib/library-view.mjs */ "./client-lib/library-view.mjs");
/* harmony import */ var kalpa_tree_on_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! kalpa-tree-on-page */ "./node_modules/kalpa-tree-on-page/client-js/kalpa-tree-loader.js");

(0,_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])()


// import ListView from '@webhandle/drag-sortable-list'
;







let emitter = new _webhandle_minimal_browser_event_emitter__WEBPACK_IMPORTED_MODULE_3__["default"]()

let controls = document.querySelector('.controls')
let controlsView = new _client_lib_player_controls_mjs__WEBPACK_IMPORTED_MODULE_1__["default"]({
	el: controls
	, emitter: emitter
})
controlsView.render()

let playlist = document.querySelector('.playlist')
let playlistView = new _client_lib_playlist_view_mjs__WEBPACK_IMPORTED_MODULE_4__["default"]({
	el: playlist
	, emitter: emitter
})
playlistView.render()


let player = new _client_lib_player_mjs__WEBPACK_IMPORTED_MODULE_2__["default"]({
	controlEvents: emitter
	, playlist: playlistView
})


let library = document.querySelector('.library')
let libraryView = new _client_lib_library_view_mjs__WEBPACK_IMPORTED_MODULE_5__["default"]({
	el: library
	, emitter: emitter
})
libraryView.render()


})();


//# sourceMappingURL=pages.js.map