
var http = require('http');
var qs = require('querystring');
var fs = require('fs');

//var Redux = require('redux');
//var ReactRedux = require('react-redux');

var TemplateRouter = require('uri-template-router');

var RouteDocument = require('./lib/route-document.js');
//var RouteStatic = require('./lib/route-static.js');

var listenPort = process.env.PORT || 8080;
var fixedScheme = 'http';
var fixedAuthority = 'localhost';

var server = http.createServer(handleRequest);
server.listen(listenPort);
console.log('Server running at http://127.0.0.1:' + listenPort + '/');

var routes = new TemplateRouter.Router();
routes.addTemplate('http://localhost/{?instance}', null, new RouteDocument());
routes.addTemplate('http://localhost/ui.js', null, new RouteStatic('ui.js', 'application/ecmascript'));
routes.addTemplate('http://localhost/style.css', null, new RouteStatic('style.css', 'text/css'));

function handleRequest(req, res){
	if(typeof req.url!='string') throw new Error('Expected request.url to be a string');
	// Construct effective request URI
	// <https://tools.ietf.org/html/rfc7230#section-5.5>
	// var port
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
	console.log('Request: '+euri, route);
	if(route && route.name && typeof route.name.process=='function'){
		return void route.name.process(req, res, route, euri, queryMap);
	}
	handleRequestNotFound(req, res, uriHier, queryMap);
}

function RouteStatic(filepath, mediatype){
	this.name = 'Static: '+filepath;
	this.filepath = filepath;
	this.mediatype = mediatype;
}
RouteStatic.prototype.process = function handleRequestStatic(req, res){
	var filepath = this.filepath;
	var mediatype = this.mediatype;
	res.statusCode = 200;
	res.setHeader('Content-Type', mediatype);
	fs.readFile(filepath, function(err, stream){
		res.end(stream);
	});
}

function handleRequestNotFound(req, res, uri, param){
	res.statusCode = 404;
	res.setHeader('Content-Type', 'text/plain');
	res.write('Page not found: '+uri+'\n');
	res.write(JSON.stringify(param)+'\n');
	res.end();
}

