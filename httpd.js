
var http = require('http');
var qs = require('querystring');

//var Redux = require('redux');
//var ReactRedux = require('react-redux');

var TemplateRouter = require('uri-template-router');

var RouteNotFound = require('./lib/RouteNotFound.js');
// Application-specific types
var RouteDocument = require('./lib/RouteDocument.js');
var RouteStatic = require('./lib/RouteStatic.js');

var listenPort = process.env.PORT || 8080;
var fixedScheme = 'http';
var fixedAuthority = 'localhost';

var server = http.createServer(handleRequest);
server.listen(listenPort);
console.log('Server running at http://127.0.0.1:' + listenPort + '/');

var routes = new TemplateRouter.Router();
routes.addTemplate('http://localhost/{?instance}', null, new RouteDocument());
routes.addTemplate('http://localhost/ui.js', null, new RouteStatic('ui.js', 'application/ecmascript'));
routes.addTemplate('http://localhost/style.css', null, new RouteStatic('style/style.css', 'text/css'));

function handleRequest(req, res){
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

