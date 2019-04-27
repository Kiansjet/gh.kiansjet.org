// Base JS script to be ran on every page on the site
// This script loads every other default asset like stylesheets and other scripts. You should generally have nothing but this script in the <head>

// Globals
let isRunningLocally = false
let urlSearchParams = new URLSearchParams(document.location.search)

if (!document.location.host) {
	isRunningLocally = true
	console.warn('Main.js is running in local mode. Some features disabled.')
}

{ // Import jQuery (HIGH PRIORITY)
	let element = document.createElement('script')
		element.setAttribute('src','https://code.jquery.com/jquery-3.4.0.min.js')
		element.setAttribute('integrity','sha256-BJeo0qm959uMBGb65z40ejJYGSgR7REI4+CW1fNKwOg=')
		element.setAttribute('crossorigin','anonymous')
	document.getElementsByTagName('html')[0].appendChild(element)
}

let util = {}
{ // Utility functions
	util.linkStylesheetToPage = function(linkToStylesheet) {
		let element = document.createElement('link')
			element.setAttribute('rel','stylesheet')
			element.setAttribute('href',linkToStylesheet)
		document.head.appendChild(element)
	}
	util.linkScriptToPage = function(linkToScript) {
		let element = document.createElement('script')
			element.setAttribute('async',true)
			element.setAttribute('src',linkToScript)
		document.head.appendChild(element)
	}
}

{ // Import Main.css
	util.linkStylesheetToPage('Assets/CSS/Main.css')
}

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
}

//
// Above is all setup and prep
// Below is all services
//

if (!isRunningLocally) { // Custom QuickLinks handler
	let customQuickLinkString = urlSearchParams.get('cql')
	let customQuickLinkDataString = urlSearchParams.get('cqldata')
	if (customQuickLinkString) {
		import('./CustomQuickLinks.mjs').then(function(customQuickLinksModule) {
			customQuickLinksModule = customQuickLinksModule.default
			console.log('cql module is')
			console.log(customQuickLinksModule)
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
}

console.log('Main.js completed.')
