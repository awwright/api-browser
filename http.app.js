
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
//routes.addTemplate('http://localhost/ui.js', null, RouteStaticFile(__dirname, 'ui.js', 'application/ecmascript'));
//routes.addTemplate('http://localhost/jsonschemaparse.js', null, new RouteBrowserify('./lib/jsonschemaparse.js', 'JSONSchemaParse'));
routes.addTemplate('http://localhost/ui.js', null, new RouteBrowserify('./ui.js'));
routes.addTemplate('http://localhost/style.css', null, RouteStaticFile(__dirname, 'style/style.css', 'text/css'));

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
