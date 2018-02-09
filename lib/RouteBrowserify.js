
var browserify = require('browserify');

module.exports = RouteBrowserify;

function RouteBrowserify(filepath, exportName, mediatype){
	this.name = 'Browserify: '+filepath;
	this.filepath = filepath;
	this.exportName = exportName;
	this.mediatype = mediatype || 'application/ecmascript';
}
RouteBrowserify.prototype.process = function handleRequestStatic(req, res){
	var filepath = this.filepath;
	var mediatype = this.mediatype;
	res.setHeader('Content-Type', mediatype);
	var b = browserify({
		entries: this.filepath,
		debug: !!this.exportName,
		standalone: this.exportName
	});
	b.bundle().pipe(res);
}
