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
		element.setAttribute('defer',true)
		element.setAttribute('src','https://code.jquery.com/jquery-3.4.0.min.js')
		element.setAttribute('integrity','sha256-BJeo0qm959uMBGb65z40ejJYGSgR7REI4+CW1fNKwOg=')
		element.setAttribute('crossorigin','anonymous')
	document.getElementsByTagName('html')[0].appendChild(element)
}

{ // Import Popper.js (HIGH PRIORITY)
	let element = document.createElement('script')
	element.setAttribute('defer',true)
		element.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js')
		element.setAttribute('integrity','sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1')
		element.setAttribute('crossorigin','anonymous')
	document.getElementsByTagName('html')[0].appendChild(element)
}

console.time('Main.js utility object population')
let util = {}
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
	}
	util.linkScriptToPage = function(linkToScript,defer,integrity,crossorigin) {
		defer = defer || false
		let element = document.createElement('script')
			element.setAttribute('async',!defer || true)
			element.setAttribute('defer',defer)
			element.setAttribute('src',linkToScript)
			if (integrity) {
				element.setAttribute('integrity',integrity)
			}
			if (crossorigin) {
				element.setAttribute('crossorigin',crossorigin)
			}
		document.head.appendChild(element)
	}
}
console.timeEnd('Main.js utility object population')

{ // Import Bootstrap css and js
	// CSS
	util.linkStylesheetToPage('https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',true,'sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T','anonymous')

	// JS
	util.linkScriptToPage('https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',true,'sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM','anonymous')
}

{ // Import Main.css and fonts its dependent on
	// Lato Google Font
	//util.linkStylesheetToPage('https://fonts.googleapis.com/css?family=Lato:400,900&subset=latin-ext')

	// Main.css
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
} else {
	console.warn('Main.js is running in local mode. Google Analytics disabled.')
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

console.log('Main.js completed.')
