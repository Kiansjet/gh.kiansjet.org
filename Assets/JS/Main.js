// Base JS script to be ran on every page on the site

// Globals
let isRunningLocally = false
let urlSearchParams = new URLSearchParams(document.location.search)

if (!document.location.host) {
	isRunningLocally = true
	console.warn('Main.js is running in local mode. Some features disabled.')
}

if (!isRunningLocally) { // Custom QuickLinks handler
	let customQuickLinkString = urlSearchParams.get('cql')
	let customQuickLinkDataString = urlSearchParams.get('cqldata')
	if (customQuickLinkString) {
		import('./CustomQuickLinks.mjs').then(function(mod) {
			let customQuickLinksModule = mod
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
		
		/* legacy json cql handler
		$.getJSON('Config/CustomQuickLinks.json',function(data) {
			let customQuickLink = data[customQuickLinkString]
			if (customQuickLink) {
				switch (customQuickLink.type) {
					case "function": // value is a function that will be ran with the customQuickLinkDataString argument
						try {
							new Function(customQuickLink.value)(customQuickLinkDataString)
						} catch (error) {
							console.error(`CustomQuickLink ${customQuickLinkString} failed to execute with given DataString:\n${customQuickLinkDataString}\nError: ${error}`)
						}
						break
					case "link": // value is a link that will be gone to.
						document.location = customQuickLink.value
						break
				}
			}
		})
		*/
	}
	// todo complete
}

console.log('main stack ran')
