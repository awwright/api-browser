

var qs = require('querystring');

module.exports.handleRequest = handleRequest;
function handleRequest(options, req, res){
	var fixedScheme = options.fixedScheme;
	var fixedAuthority = options.fixedAuthority;
	var routes = options.routes;
	var RouteNotFound = options.RouteNotFound;
	if(typeof req.url!='string') throw new Error('Expected request.url to be a string');
	// Construct effective request URI
	// <https://tools.ietf.org/html/rfc7230#section-5.5>
	if(req.url[0]=='/'){
		var host = fixedAuthority || req.headers['host'];
		var euri = fixedScheme+'://'+host+req.url;
	}else if(req.url==='*'){
		// Make the server talk about itself
		var euri = 'http://localhost/';
	}else{
		var euri = req.url;
	}
	var queryOffset = euri.indexOf('?');
	var uriHier = euri;
	if(queryOffset >= 0){
		var uriHier = euri.substring(0, queryOffset);
		var uriQuery = euri.substring(queryOffset+1);
	}
	var queryMap = qs.parse(uriQuery);
	var route = routes.resolveURI(uriHier);
	var handler = route && route.name;
	console.log('Request: '+euri, route);
	if(!handler){
		handler = new RouteNotFound();
	}
	if(handler && typeof handler.process=='function'){
		return void handler.process(req, res, route, euri, queryMap);
	}else{
		res.statusCode = 500;
		res.setHeader('Content-Type', 'text/plain');
		res.write('Internal Server Error: Handler missing\n');
		res.end();
	}
}

