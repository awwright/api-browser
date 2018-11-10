
var React = require('react');

var com = require('../ui.js');
var inherits = require('util').inherits;
var renderToString = require('react-dom/server').renderToString;

var Route = require('dive-httpd').Route;
var Resource = require('dive-httpd').Resource;
var PassThrough = require('http-transform').PassThrough;
inherits(RouteDocument, Route);
module.exports.RouteDocument = RouteDocument;

function RouteDocument(id){
	if(!(this instanceof RouteDocument)) return new RouteDocument(id);
	this.id = id;
	this.contentType = 'application/xhtml+xml';
}
RouteDocument.prototype.name = 'RouteDocument';
RouteDocument.prototype.pipeline = [];
RouteDocument.prototype.resourceType = ResourceDocument;
RouteDocument.prototype.prepare = function handleRequestDocument(match, euri, queryMap){
	var self = this;
	return Promise.resolve(new this.resourceType(self, euri, match, queryMap.instance||null));
}

inherits(ResourceDocument, Route);
module.exports.ResourceDocument = ResourceDocument;
function ResourceDocument(route, uri, params, id){
	if(!(this instanceof ResourceDocument)) return new ResourceDocument(route, uri, params, id);
	this.route = route;
	this.id = id;
}
ResourceDocument.prototype.render = function render(route, euri, match, id){
	// this.target might have a URI Template expression. Substutite route.variables into this.
	var self = this;
	var state = com.initialState().set('remoteDocumentURI', this.id);
	var props = {
		state: state,
		onLoadDocument: function(){},
	};
	console.log(self.route.contentType);
	var out = new PassThrough;
	out.setHeader('Content-Type', self.route.contentType);
	var apphtml = renderToString(React.createElement(com.ApplicationBody, props));
	var html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'
		+ '<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"><head>'
//		+ '<script type="application/ecmascript" crossorigin="" src="https://unpkg.com/react@16/umd/react.development.js"></script>'
//		+ '<script type="application/ecmascript" crossorigin="" src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>'
//		+ '<script type="application/ecmascript" crossorigin="" src="https://unpkg.com/redux-thunk@2.2.0/dist/redux-thunk.js"></script>'
//		+ '<script src="https://cdnjs.cloudflare.com/ajax/libs/redux/3.7.2/redux.js"></script>'
//		+ '<script src="https://cdnjs.cloudflare.com/ajax/libs/react-redux/5.0.6/react-redux.js"></script>'
//		+ '<script src="https://cdnjs.cloudflare.com/ajax/libs/immutable/3.8.1/immutable.js"></script>'
		+ '<script src="/style/codemirror/lib/codemirror.js"></script>'
		+ '<script src="/style/codemirror/mode/javascript/javascript.js"></script>'
//		+ '<script src="/style/codemirror/mode/css/css.js"></script>'
		+ '<script src="/style/codemirror/addon/lint/lint.js"></script>'
//		+ '<script src="/style/codemirror/addon/lint/json-lint.js"></script>'
		+ '<script src="json-instance-lint.js"></script>'
		+ '<script type="application/ecmascript" src="ui.js"></script>'
		+ '<script type="application/ecmascript">//document.addEventListener("DOMContentLoaded", onLoad);</script>'
		+ '<script type="application/json" id="state">'+com.serializeState(state).replace(/<\//g, '<\\/')+'</script>'
		+ '<link rel="stylesheet" type="text/css" href="/style.css" />'
		+ '<link rel="stylesheet" type="text/css" href="/style/codemirror/lib/codemirror.css"/>'
		+ '<link rel="stylesheet" type="text/css" href="/style/codemirror/addon/lint/lint.css"/>'
		+ '</head><body>'
		+ '<div id="main">'+apphtml+'</div>'
		+ '</body></html>';
	out.statusCode = 200;
	out.setHeader('Content-Type', 'application/xhtml+xml');
	out.end(html);
	return out;
};

