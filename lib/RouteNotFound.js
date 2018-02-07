
module.exports = RouteNotFound;

function RouteNotFound(req, res, uri, param){
}
RouteNotFound.prototype.process = function handleNotFound(req, res, uri, param){
	res.statusCode = 404;
	res.setHeader('Content-Type', 'text/plain');
	res.write('Page not found: '+uri+'\n');
	res.write(JSON.stringify(param)+'\n');
	res.end();
}


