// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// declare global: JSONSchemaParse

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
	"use strict";
	CodeMirror.registerHelper("lint", "json", function(text) {
		console.log(text);
		var found = [];
		if (!window.JSONSchemaParse) {
			if (window.console) {
				window.console.error("Error: window.JSONSchemaParse not defined, CodeMirror JSON linting cannot run.");
			}
			return found;
		}
		try { var parse = JSONSchemaParse.parse(null, {charset:'string'}, text); }
		catch(e) {
			console.dir(e);
			var loc = e.position || {};
			found.push({
				from: CodeMirror.Pos(loc.line-1, loc.column),
				to: CodeMirror.Pos(loc.line-1, loc.column),
				message: e.message
			});
			console.dir(parse);
		}
		return found;
	});
});
