// Designed for root/Experiments/ViewMarkdownRaw.html
// Generates html from a markdown doc and displays it with no additional CSS.
// Not intended to be permanent. Written before the front end was designed.


// __          __     _____  _   _ _____ _   _  _____ 
// \ \        / /\   |  __ \| \ | |_   _| \ | |/ ____|
//  \ \  /\  / /  \  | |__) |  \| | | | |  \| | |  __ 
//   \ \/  \/ / /\ \ |  _  /| . ` | | | | . ` | | |_ |
//    \  /\  / ____ \| | \ \| |\  |_| |_| |\  | |__| |
//     \/  \/_/    \_\_|  \_\_| \_|_____|_| \_|\_____|

// READ THIS EVEN IF YOU NORMALLY DON'T
// DO NOT ALLOW USERS TO SUBMIT MARKDOWN TO THE SITE!
// MARKDOWN FREELY ALLOWS FOR XSS AND I DID NOT PUT XSS
// FILTERING IN HERE AS I ONLY EXPECTED PEOPLE WITH GOOD
// INTENTIONS TO BE ABLE TO DO SO. IF YOU PLAN TO ALLOW USERS
// TO POST IN MARKDOWN, MAKE SURE TO READ THE FOLLOWING ARTICLE
// AND SANITIZE THE HTML OUTPUT OF ANY MARKDOWN YOU PROCESS TO
// KILL SCRIPTS!										   

///////////////////////////////////////////////////////////////////////////////

if (!isRunningLocally) { // Check search param and load markdown file if exists
	let urlSearchParams = new URLSearchParams(document.location.search)
	let markdownDocument = urlSearchParams.get('doc')
	if (markdownDocument) {
		console.log(`markdown document is ${markdownDocument}`)

		// Add a .md to the end if there is none
		if (!markdownDocument.toLowerCase().endsWith('.md')) {
			markdownDocument += '.md'
		}

		// Attempt to fetch the supposed markdown file
		$.get(`Assets/Markdown/${markdownDocument}`).done(function(data,status) {
			console.log('markdown fetched')
			console.log(data)
			console.log(status)
		}).fail(function(jqxhr,status,error) {
			console.log('markdown fetch failed')
			console.log(jqxhr)
			console.log(status)
			console.log(error)
		})

	} else {
		$(document.body).prepend('?doc search parameter not set.')
	}
} else {
	console.warn('ViewMarkdownRaw.js is running in local mode. Markdown loader disabled.')
	$(document.body).prepend('ViewMarkdownRaw.js is running in local mode. Markdown loader disabled.')
}
