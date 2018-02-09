
var React = require('react');

var com = require('../ui.js');
var renderToString = require('react-dom/server').renderToString;

module.exports = RouteDocument;

function RouteDocument(name){
	this.name = name;
}
RouteDocument.prototype.process = function handleRequestDocument(req, res, route, uri, params){
	var state = com.initialState().set('remoteDocumentURI', params.instance||null);
	var props = {
		state: state,
		onLoadDocument: function(){},
	};
	var apphtml = renderToString(React.createElement(com.ApplicationBody, props));
	var html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'
		+ '<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"><head>'
//		+ '<script type="application/ecmascript" crossorigin="" src="https://unpkg.com/react@16/umd/react.development.js"></script>'
//		+ '<script type="application/ecmascript" crossorigin="" src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>'
//		+ '<script type="application/ecmascript" crossorigin="" src="https://unpkg.com/redux-thunk@2.2.0/dist/redux-thunk.js"></script>'
//		+ '<script src="https://cdnjs.cloudflare.com/ajax/libs/redux/3.7.2/redux.js"></script>'
//		+ '<script src="https://cdnjs.cloudflare.com/ajax/libs/react-redux/5.0.6/react-redux.js"></script>'
//		+ '<script src="https://cdnjs.cloudflare.com/ajax/libs/immutable/3.8.1/immutable.js"></script>'
		+ '<script src="codemirror/lib/codemirror.js"></script>'
		+ '<script src="codemirror/mode/javascript/javascript.js"></script>'
//		+ '<script src="codemirror/mode/css/css.js"></script>'
		+ '<script src="codemirror/addon/lint/lint.js"></script>'
//		+ '<script src="codemirror/addon/lint/json-lint.js"></script>'
		+ '<script src="json-instance-lint.js"></script>'
		+ '<script type="application/ecmascript" src="ui.js"></script>'
		+ '<script type="application/ecmascript">//document.addEventListener("DOMContentLoaded", onLoad);</script>'
		+ '<script type="application/json" id="state">'+com.serializeState(state).replace(/<\//g, '<\\/')+'</script>'
		+ '<link rel="stylesheet" type="text/css" href="/style.css" />'
		+ '<link rel="stylesheet" type="text/css" href="/codemirror/lib/codemirror.css"/>'
		+ '<link rel="stylesheet" type="text/css" href="/codemirror/addon/lint/lint.css"/>'
		+ '</head><body>'
		+ '<div id="main">'+apphtml+'</div>'
		+ '</body></html>';
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/xhtml+xml');
	res.write(html);
	res.end();
}
