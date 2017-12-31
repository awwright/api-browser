
var http = require('http');
var fs = require('fs');

var React = require('react');
var Redux = require('redux');
var ReactRedux = require('react-redux');

var com = require('./ui.js');
var renderToString = require('react-dom/server').renderToString;
var TemplateRouter = require('uri-template-router');

var port = process.env.PORT || 8080;

var server = http.createServer(handleRequest);
server.listen(port);
console.log('Server running at http://127.0.0.1:' + port + '/');

var routes = new TemplateRouter.Router();
routes.addTemplate('http://localhost/{?instance}', null, new RouteDocument());
routes.addTemplate('http://localhost/ui.js', null, new RouteStatic('ui.js', 'application/ecmascript'));
routes.addTemplate('http://localhost/style.css', null, new RouteStatic('style.css', 'text/css'));

function handleRequest(req, res){
	if(typeof req.url!='string') throw new Error('Expected request.url to be a string');
	if(req.url[0]=='/'){
		var uri = 'http://localhost'+req.url;
	}else{
		var uri = req.url;
	}
	var route = routes.resolveURI(uri);
	console.log('Request: '+uri, route);
	if(route && route.name && typeof route.name.process=='function'){
		return void route.name.process(req, res);
	}
	handleRequestNotFound(req, res, uri);
}


function RouteDocument(name){
	this.name = name;
}
RouteDocument.prototype.process = function handleRequestDocument(req, res){
	var state = com.initialState();
	var props = {
		state: state,
		onLoadDocument: function(){},
	};
	var apphtml = renderToString(React.createElement(com.ApplicationBody, props));
	var html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'
		+ '<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"><head>'
		+ '<script type="application/ecmascript" crossorigin="" src="https://unpkg.com/react@16/umd/react.development.js"></script>'
		+ '<script type="application/ecmascript" crossorigin="" src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>'
		+ '<script type="application/ecmascript" crossorigin="" src="https://unpkg.com/redux-thunk@2.2.0/dist/redux-thunk.js"></script>'
		+ '<script src="https://cdnjs.cloudflare.com/ajax/libs/redux/3.7.2/redux.js"></script>'
		+ '<script src="https://cdnjs.cloudflare.com/ajax/libs/react-redux/5.0.6/react-redux.js"></script>'
		+ '<script src="https://cdnjs.cloudflare.com/ajax/libs/immutable/3.8.1/immutable.js"></script>'
		+ '<script type="application/ecmascript" src="ui.js"></script>'
		+ '<script type="application/ecmascript">document.addEventListener("DOMContentLoaded", onLoad);</script>'
		+ '<script type="application/json" id="state">'+com.serializeState(state).replace(/<\//g, '<\\/')+'</script>'
		+ '<link rel="stylesheet" type="text/css" href="style.css" />'
		+ '</head><body>'
		+ '<div id="main">'+apphtml+'</div>'
		+ '</body></html>';
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/xhtml+xml');
	res.write(html);
	res.end();
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

function handleRequestNotFound(req, res, uri){
	res.statusCode = 404;
	res.setHeader('Content-Type', 'text/plain');
	res.write('Page not found: '+uri);
	res.end();
}

