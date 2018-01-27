
var http = require('http');

var TemplateRouter = require('uri-template-router');

var RouteNotFound = require('./lib/RouteNotFound.js');
// Application-specific types
var RouteDocument = require('./lib/RouteDocument.js');
var RouteStatic = require('./lib/RouteStatic.js');
var handleRequest = require('./lib/http.js').handleRequest;

var listenPort = process.env.PORT || 8080;

var routes = new TemplateRouter.Router();
routes.addTemplate('http://localhost/{?instance}', null, new RouteDocument());
routes.addTemplate('http://localhost/ui.js', null, new RouteStatic('ui.js', 'application/ecmascript'));
routes.addTemplate('http://localhost/style.css', null, new RouteStatic('style/style.css', 'text/css'));
var options = {
	fixedScheme: 'http',
	fixedAuthority: 'localhost',
	RouteNotFound: RouteNotFound,
	routes: routes,
}

var server = http.createServer(handleRequest.bind(null, options));
server.listen(listenPort);
console.log('Server running at http://127.0.0.1:' + listenPort + '/');

