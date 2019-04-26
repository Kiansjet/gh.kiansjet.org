export default {
	test1: function(data) {
		alert('test1 cql')
	},
	test2: function(data) {
		if (data) {
			console.log('test2 cql with data ' + data)
		} else {
			console.log('test2 cql with no data')
		}
	}
}
