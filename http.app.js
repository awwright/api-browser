
// var RouteNotFound = require('./lib/RouteNotFound.js');
// Application-specific types
var RouteDocument = require('./lib/RouteDocument.js').RouteDocument;
var RouteBrowserify = require('./lib/RouteBrowserify.js');

const {
	TemplateRouter,
	RouteStaticFile,
	RouteNotFound,
	RouteLocalReference,
	RoutePipeline,
	First,
} = require('dive-httpd');

var routes = new TemplateRouter.Router();
routes.addTemplate('http://localhost/', null, RouteDocument());

routes.addTemplate('http://localhost/style/ui.js', null, RouteBrowserify('./ui.js'));
routes.addTemplate('http://localhost/style{/path*}.js', {}, RouteStaticFile(__dirname+'/style', "{/path*}.js", 'application/ecmascript') );
routes.addTemplate('http://localhost/style{/path*}.css', {}, RouteStaticFile(__dirname+'/style', "{/path*}.css", 'text/css') );

routes.addTemplate('http://localhost/style/codemirror{/path*}.css', {}, RouteStaticFile(__dirname+'/codemirror', "{/path*}.css", 'text/css') );
routes.addTemplate('http://localhost/style/codemirror{/path*}.js', {}, RouteStaticFile(__dirname+'/codemirror', "{/path*}.js", 'application/ecmascript') );

routes.addTemplate('http://localhost/json-instance-lint.js', null, RouteStaticFile(__dirname, 'json-instance-lint.js', 'application/ecmascript'));

//routes.addTemplate('http://localhost/jsonschemaparse.js', null, new RouteBrowserify('../parse/index.js', 'JSONSchemaParse'));
var options = {
	fixedScheme: 'http',
	fixedAuthority: 'localhost',
	RouteNotFound: RouteNotFound,
	routes: routes,
}
module.exports = options;
