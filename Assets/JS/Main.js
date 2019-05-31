// Base JS script to be ran on every page on the site

// Globals
let isRunningLocally = false
let util = {}

if (!document.location.host) {
	isRunningLocally = true
	console.warn('Main.js is running in local mode. Some features disabled.')
}

console.time('Main.js utility object population')
{ // Utility functions
	util.linkStylesheetToPage = function(linkToStylesheet,integrity,crossorigin) {
		let element = document.createElement('link')
			element.setAttribute('rel','stylesheet')
			element.setAttribute('href',linkToStylesheet)
			if (integrity) {
				element.setAttribute('integrity',integrity)
			}
			if (crossorigin) {
				element.setAttribute('crossorigin',crossorigin)
			}
		document.head.appendChild(element)
		return element
	}
	util.linkScriptToPage = function(linkToScript) {
		return new Promise(function(resolve,reject) {
			let element = document.createElement('script')
				element.setAttribute('src',linkToScript)
			document.head.appendChild(element)
			element.addEventListener('load',function() {
				resolve()
			})
			element.addEventListener('error',function() {
				reject()
			})
		})
		
	}
	util.linkScriptsToPage = function(scripts) {
		return new Promise(function(resolve,reject) {
			function loadScript() {
				if (scripts.length == 0) {
					resolve()
				} else {
					let script = scripts[0]
					let element = document.createElement('script')
					Object.entries(script).forEach(function(attribute) {
						element.setAttribute(attribute[0],attribute[1])
					})
					document.head.appendChild(element)
					element.addEventListener('load',function() {
						console.log(`Script at ${script.src} loaded.`)
						scripts.shift()
						loadScript()
					})
					element.addEventListener('error',function() {
						console.warn(`Script at ${script.src} failed to load.`)
						scripts.shift()
						loadScript()
					})
				}
			}
			loadScript()
		})
	}
	util.dynamicallyLoadImage = function(imageElement) {
		let completionDeferred = $.Deferred()
		let highQualityImageSrc = $(imageElement).attr('x-kian-highqualitysrc')
		if (highQualityImageSrc) {
			let highQualityImage = new Image()
			highQualityImage.src = highQualityImageSrc
			highQualityImage.addEventListener('load',function onload() {
				highQualityImage.removeEventListener('load',onload)
				console.log('loaded')
				$(imageElement).attr('src',highQualityImageSrc)
				$(imageElement).removeClass('low-quality')
				$(imageElement).addClass('high-quality')
				highQualityImage.remove()
				completionDeferred.resolve()
			})
		} else {
			completionDeferred.resolve()
		}
		return completionDeferred
	}
	util.createDynamicallyLoadingImage = function(parentElement,lowQualitySrc,highQualitySrc) {
		let element = document.createElement('img')
		$(element).addClass('low-quality')
		$(element).attr('src',lowQualitySrc)
		$(element).attr('x-kian-highqualitysrc',highQualitySrc)
		$(parentElement).append(element)
		let completionDeferred = util.dynamicallyLoadImage(element)
		return {element,completionDeferred}
	}
}
console.timeEnd('Main.js utility object population')

if (!isRunningLocally) { // Import Google Analytics gtag.js
	let trackingId = 'UA-139162099-1'
	util.linkScriptToPage(`https://www.googletagmanager.com/gtag/js?id=${trackingId}`)

	// Google wrote this idk what it does
	window.dataLayer = window.dataLayer || [];
	function gtag() {
		dataLayer.push(arguments)
	}
	gtag('js', new Date())
	gtag('config', trackingId);
} else {
	console.warn('Main.js is running in local mode. Google Analytics disabled.')
}

//
// Above is all setup and prep
// Below is all services
//

if (!isRunningLocally) { // Custom QuickLinks handler
	let urlSearchParams = new URLSearchParams(document.location.search)
	let customQuickLinkString = urlSearchParams.get('cql')
	let customQuickLinkDataString = urlSearchParams.get('cqldata')
	if (customQuickLinkString) {
		import('./Modules/CustomQuickLinks.mjs').then(function(customQuickLinksModule) {
			customQuickLinksModule = customQuickLinksModule.default
			let customQuickLink = customQuickLinksModule[customQuickLinkString]
			if (customQuickLink) {
				switch (typeof(customQuickLink)) {
					default: {
						console.error(`CustomQuickLink ${customQuickLinkString} was not a valid type. Will not be executed.`)
						break
					}
					case 'function': {
						try {
							customQuickLink(customQuickLinkDataString)
						} catch (error) {
							console.error(`CustomQuickLink ${customQuickLinkString} failed to execute: ${error}`)
						}
						break
					}
					case 'string': {
						document.location = customQuickLink
						break
					}
				}
			}
		}).catch(function(error) {
			console.warn(`CustomQuickLinks.mjs failed to load: ${error}`)
		})
	}
} else {
	console.warn('Main.js is running in local mode. Custom Quick Links disabled.')
}

{ // Image loading with initial low quality images
	// Heavy credit to https://css-tricks.com/the-blur-up-technique-for-loading-background-images/
	
	$(document).ready(function() {
		$('img').each(function() {
			util.dynamicallyLoadImage(this)
		})
	})
}

console.log('Main.js completed.')
