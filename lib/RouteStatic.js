
var fs = require('fs');

module.exports = RouteStatic;

function RouteStatic(filepath, mediatype){
	this.name = 'Static: '+filepath;
	this.filepath = filepath;
	this.mediatype = mediatype;
}
RouteStatic.prototype.process = function handleRequestStatic(req, res){
	var filepath = this.filepath;
	var mediatype = this.mediatype;
	res.setHeader('Content-Type', mediatype);
	fs.readFile(filepath, function(err, stream){
		res.end(stream);
	});
}

