// Base JS script to be ran on every page on the site

// Globals
let isRunningLocally = false
let urlSearchParams = new URLSearchParams(document.location.search)

if (!document.location.host) {
	isRunningLocally = true
}

if (!isRunningLocally) { // Custom QuickLinks handler
	let customQuickLink = urlSearchParams.get('cql')
	if (customQuickLink) {
		const customQuickLinksJSON = $.getJSON('Config/CustomQuickLinks.json',function(data) {
			console.log('Custom Quick Links:')
			console.log(data)
		})
	}
	// todo complete
}

console.log('main stack ran')