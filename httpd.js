
var http = require('http');

var TemplateRouter = require('uri-template-router');

var RouteNotFound = require('./lib/RouteNotFound.js');
// Application-specific types
var RouteDocument = require('./lib/RouteDocument.js');
var RouteStatic = require('./lib/RouteStatic.js');
var RouteBrowserify = require('./lib/RouteBrowserify.js');
var handleRequest = require('./lib/http.js').handleRequest;

var listenPort = process.env.PORT || 8080;

var routes = new TemplateRouter.Router();
routes.addTemplate('http://localhost/{?instance}', null, new RouteDocument());
//routes.addTemplate('http://localhost/ui.js', null, new RouteStatic('ui.js', 'application/ecmascript'));
//routes.addTemplate('http://localhost/jsonschemaparse.js', null, new RouteBrowserify('./lib/jsonschemaparse.js', 'JSONSchemaParse'));
routes.addTemplate('http://localhost/ui.js', null, new RouteBrowserify('./ui.js'));
routes.addTemplate('http://localhost/style.css', null, new RouteStatic('style/style.css', 'text/css'));
routes.addTemplate('http://localhost/codemirror/lib/codemirror.css', null, new RouteStatic('codemirror-5.34.0/lib/codemirror.css', 'text/css'));
routes.addTemplate('http://localhost/codemirror/addon/lint/lint.css', null, new RouteStatic('codemirror-5.34.0/addon/lint/lint.css', 'text/css'));
routes.addTemplate('http://localhost/codemirror/lib/codemirror.js', null, new RouteStatic('codemirror-5.34.0/lib/codemirror.js', 'application/ecmascript'));
routes.addTemplate('http://localhost/codemirror/mode/javascript/javascript.js', null, new RouteStatic('codemirror-5.34.0/mode/javascript/javascript.js', 'application/ecmascript'));
routes.addTemplate('http://localhost/codemirror/addon/lint/lint.js', null, new RouteStatic('codemirror-5.34.0/addon/lint/lint.js', 'application/ecmascript'));
routes.addTemplate('http://localhost/json-instance-lint.js', null, new RouteStatic('json-instance-lint.js', 'application/ecmascript'));

//routes.addTemplate('http://localhost/jsonschemaparse.js', null, new RouteBrowserify('../parse/index.js', 'JSONSchemaParse'));
var options = {
	fixedScheme: 'http',
	fixedAuthority: 'localhost',
	RouteNotFound: RouteNotFound,
	routes: routes,
}

var server = http.createServer(handleRequest.bind(null, options));
server.listen(listenPort);
console.log('Server running at http://127.0.0.1:' + listenPort + '/');

