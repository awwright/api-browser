
var browserify = require('browserify');
var inherits = require('util').inherits;

var Route = require('dive-httpd').Route;
var Resource = require('dive-httpd').Resource;
var PassThrough = require('http-transform').PassThrough;

// Create a subclass of some constructor with some default prototype properties set
function subclass(Class, props){
	var Sub = function(){ Class.apply(this, arguments); };
	inherits(Sub, Class);
	if(typeof props=='object') for(var n in props){
		Sub.prototype[n] = props[n];
	}
	return Sub;
}

module.exports = RouteBrowserify;
function RouteBrowserify(filepath, exportName, mediatype){
	if(!(this instanceof RouteBrowserify)) return new RouteBrowserify(filepath, exportName, mediatype);
	this.name = 'Browserify: '+filepath;
	this.resourceType = subclass(ResourceBrowserify, {
		contentType: mediatype || 'application/ecmascript',
		route: this,
		exportName: exportName,
		filepath: filepath,
	});
}
RouteBrowserify.prototype.name = 'RouteBrowserify';
RouteBrowserify.prototype.prepare = function handleRequestStatic(match, euri, queryMap){
	return Promise.resolve(new this.resourceType(euri, match, queryMap));
}

inherits(ResourceBrowserify, Resource);
module.exports.ResourceBrowserify = ResourceBrowserify;
function ResourceBrowserify(route, euri, match){
	if(!(this instanceof ResourceBrowserify)) return new ResourceBrowserify(route, euri, match, stream);
	this.route = route;
	this.euri = euri;
	this.match = match;
}
ResourceBrowserify.prototype.render = function render(route, euri, match){
	// this.target might have a URI Template expression. Substutite route.variables into this.
	var self = this;
	var out = new PassThrough;
	out.setHeader('Content-Type', self.contentType);
	var b = browserify({
		entries: this.filepath,
		debug: !!this.exportName,
		standalone: this.exportName
	});
	b.bundle().pipe(out);
	return out;
};
