
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
routes.addTemplate('http://localhost/codemirror/lib/codemirror.css', null, RouteStaticFile(__dirname, 'codemirror/lib/codemirror.css', 'text/css'));
routes.addTemplate('http://localhost/codemirror/addon/lint/lint.css', null, RouteStaticFile(__dirname, 'codemirror/addon/lint/lint.css', 'text/css'));
routes.addTemplate('http://localhost/codemirror/lib/codemirror.js', null, RouteStaticFile(__dirname, 'codemirror/lib/codemirror.js', 'application/ecmascript'));
routes.addTemplate('http://localhost/codemirror/mode/javascript/javascript.js', null, RouteStaticFile(__dirname, 'codemirror/mode/javascript/javascript.js', 'application/ecmascript'));
routes.addTemplate('http://localhost/codemirror/addon/lint/lint.js', null, RouteStaticFile(__dirname, 'codemirror/addon/lint/lint.js', 'application/ecmascript'));
routes.addTemplate('http://localhost/json-instance-lint.js', null, RouteStaticFile(__dirname, 'json-instance-lint.js', 'application/ecmascript'));

//routes.addTemplate('http://localhost/jsonschemaparse.js', null, new RouteBrowserify('../parse/index.js', 'JSONSchemaParse'));
var options = {
	fixedScheme: 'http',
	fixedAuthority: 'localhost',
	RouteNotFound: RouteNotFound,
	routes: routes,
}
module.exports = options;
