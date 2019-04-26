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
		$.getJSON('Config/CustomQuickLinks.json',function(data) {
			console.log('Custom Quick Links:')
			console.log(data)
			let customQuickLink = data[customQuickLinkString]
			console.log('custom quick link is')
			console.log(customQuickLink)
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
	}
	// todo complete
}

console.log('main stack ran')
