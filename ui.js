var Immutable = require('immutable');
var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('redux');
var ReduxThunk = require('redux-thunk');
var ReactRedux = require('react-redux');
var JSONSchemaParse = require('jsonschemaparse');
//var CodeMirror = require('react-codemirror');

if(typeof window=='object') window.JSONSchemaParse = JSONSchemaParse;


if(typeof document=='object'){
	document.addEventListener("DOMContentLoaded", onLoad);
}

function mapStateProps(state){
	return {
		state: state,
	}
}

function Link(href, options){
	this.href = href;
	this.options = options;
}

function requestJSONDocument(uri, options){
  return new Promise(function(resolve, reject){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", uri);
    xhr.onload = function(){
		 resolve(xhr);
	 }
    xhr.onerror = function(){
		 reject(xhr.statusText);
	 }
    xhr.send();
  });
}

function dLoadDocument(uri){
	return function(dispatch){
		dispatch({type:'loadDocumentPending', remoteDocumentURI:'Loading...'});
		requestJSONDocument(uri).then(function(res){
			var contentType = res.getResponseHeader('Content-Type');
			dispatch({type:'loadDocument', remoteDocumentURI:uri, remoteDocumentData:res.responseText, remoteDocumentType:contentType});
			window.history.pushState(null, null, '?instance='+encodeURIComponent(uri));
		});
	}
}

// Web browser startup
function onLoad(){
	var eState = document.getElementById('state');
	var state = eState ? restoreState(eState.innerText) : initialState() ;
	var store = Redux.createStore(ApplicationReducer, state, Redux.applyMiddleware(ReduxThunk.default));
	store.subscribe(render);
	var props = {
		//state: store.getState(),
		onLoadDocument: function(remoteDocumentURI){ store.dispatch(dLoadDocument(remoteDocumentURI)); },
	};
	window.store = store;
	var ApplicationMain = ReactRedux.connect(mapStateProps)(ApplicationBody);
	var eAppBody = React.createElement(ApplicationMain, props);
	var app = ReactDOM.render(React.createElement(ReactRedux.Provider, {store:store}, eAppBody), document.getElementById('main'));
	function render(){
		//app.setState();
	}
}

exports.initialState = initialState;
function initialState(){
	var initialState = {
		stateVersion: 1,
		remoteDocumentURI: null,
	};
	return new Immutable.Map(initialState);
}

exports.ApplicationReducer = ApplicationReducer;
function ApplicationReducer(state, action){
	if (typeof state != 'object') {
		throw new Error('Missing application state');
	}
	//if(typeof action.type != 'string') return state;
	switch (action.type) {
		case '@@redux/INIT':
		case 'noop':
			return state;
		case 'loadDocumentPending':
			return state
				.set('remoteDocumentPending', true)
				.set('remoteDocumentURI', null);
		case 'loadDocument':
			var links = getLinksJSONSchema(action.remoteDocumentData);
			return state
				.set('remoteDocumentPending', false)
				.set('remoteDocumentURI', action.remoteDocumentURI)
				.set('remoteDocumentType', action.remoteDocumentType)
				.set('remoteDocumentData', action.remoteDocumentData)
				.set('remoteDocumentLinks', links);
		default:
			throw new Error('Unknown action type '+JSON.stringify(action.type));
	}
}

function getLinksJSONSchema(documentString){
	var documentData = JSON.parse(documentString);
	var links = [];
	if(documentData.avatar_url) links.push(new Link(documentData.avatar_url, {rel:'http://localhost/GitHub/avatar_url'}));
	if(documentData.url) links.push(new Link(documentData.avatar_url, {rel:'self'}));
	if(documentData.html_url) links.push(new Link(documentData.html_url, {rel:'http://localhost/GitHub/html_url'}));
	if(documentData.followers_url) links.push(new Link(documentData.followers_url, {rel:'http://localhost/GitHub/followers_url'}));
	if(documentData.following_url) links.push(new Link(documentData.following_url, {rel:'http://localhost/GitHub/following_url'}));
	if(documentData.gists_url) links.push(new Link(documentData.gists_url, {rel:'http://localhost/GitHub/gists_url'}));
	if(documentData.starred_url) links.push(new Link(documentData.starred_url, {rel:'http://localhost/GitHub/starred_url'}));
	if(documentData.subscriptions_url) links.push(new Link(documentData.subscriptions_url, {rel:'http://localhost/GitHub/subscriptions_url'}));
	return links;
}

exports.serializeState = serializeState;
function serializeState(state){
	return JSON.stringify(state);
}

exports.restoreState = restoreState;
function restoreState(json){
	var obj = JSON.parse(json);
	return Immutable.fromJS(obj);
}

exports.ApplicationBody = ApplicationBody;
function ApplicationBody(prop){
	//return React.createElement('div', {}, React.createElement("button", {onClick: function(e){ e.preventDefault(); prop.onLoadDocument('URI'); }}, "Submit"));
	var state = prop.state;
	var remoteDocumentURI = state.get('remoteDocumentURI');
	var remoteDocumentType = state.get('remoteDocumentType');

	if(typeof window=='object' && window.CodeMirror){
		var codeMirrorInstance = window.CodeMirror;
	}

	function createCodeMirror(value){
		return React.createElement('textarea', {value:value});
		if(!codeMirrorInstance) return React.createElement('textarea', {value:value});
		var codemirrorOptions = {
			lineNumbers: true,
			mode: "application/json",
			gutters: ["CodeMirror-lint-markers"],
			lint: true,
			viewportMargin: Infinity,
		};
		return React.createElement(CodeMirror, {codeMirrorInstance:codeMirrorInstance, value:value, onChange:function(){}, options:codemirrorOptions});
	}

	var eDocumentForm;

	return React.createElement("form", {
		className:'editor-form',
	}, [
		React.createElement("h2", {}, "Document "+remoteDocumentURI),
		React.createElement("div", {}, [
			React.createElement("div", {}, [
				React.createElement("label", {}, [
					"Document URL",
					React.createElement("input", {type:'text', defaultValue:remoteDocumentURI||'https://api.github.com/users/awwright', ref:function(e){ eDocumentForm=e; }}),
				]),
				React.createElement("button", {
					onClick: function(e){ e.preventDefault(); prop.onLoadDocument(eDocumentForm.value); }
				}, "Go"),
			]),
			remoteDocumentURI && React.createElement("div", {}, [
				//React.createElement("textarea", {value:state.get('remoteDocumentData')}),
				//React.createElement("pre", {}, state.get('remoteDocumentData')),
				createCodeMirror(state.get('remoteDocumentData')),
			]),
			React.createElement("div", {}, [
				React.createElement("label", {}, [
					"Content-Type",
					React.createElement('input', {type:'text', value:remoteDocumentType}),
				]),
			]),
			React.createElement("div", {}, [
				React.createElement("label", {}, [
					"Hypermedia format",
					React.createElement("select", {}, [
						React.createElement("option", {}, ""),
						React.createElement("option", {}, "JSON Schema"),
						React.createElement("option", {}, "HAL"),
					]),
				]),
			]),
			React.createElement("div", {}, [
				React.createElement("label", {}, [
					"Media type",
					React.createElement("input", {type:'text', defaultValue:'application/json'}),
				]),
			]),
			React.createElement("div", {}, [
				React.createElement("label", {}, [
					"Schema URI",
					React.createElement("input", {type:'text'}),
				]),
				React.createElement("button", {}, "Import"),
			]),
			React.createElement("div", {}, [
				React.createElement("h4", {}, "Links"),
				React.createElement("ul", {}, state.get('remoteDocumentLinks', []).map(function(link){
					return React.createElement("li", {}, [ 'rel='+link.options.rel+' <', React.createElement('a', {href:'?instance='+encodeURIComponent(link.href)}, link.href), '>']);
				})),
			]),
			React.createElement("section", {}, [
				React.createElement("h3", {}, "Persist"),
				React.createElement("div", {}, [
					React.createElement("label", {}, [
						"Authorization",
						React.createElement("select", {}, [
							React.createElement("option", {}, ""),
							React.createElement("option", {}, "Basic"),
							React.createElement("option", {}, "Bearer"),
							React.createElement("option", {}, "OAuth 2"),
						]),
					]),
				]),
				React.createElement("div", {}, [
					React.createElement("label", {}, [
						React.createElement("input", {type:'checkbox'}),
						"Post to collection",
					]),
					' ',
					React.createElement("label", {}, [
						"Collection URI",
						React.createElement("input", {type:'text'}),
					]),
				]),
				React.createElement("button", {}, "Save")
			]),
			React.createElement("section", {}, [
				React.createElement("h3", {}, "Settings"),
				React.createElement("div", {}, [
					React.createElement("label", {}, [
						"Schema overrides",
						React.createElement("textarea", {onChange:function(){}}),
					]),
				]),
			]),
		]),
	]);
}

function persistInstanceDocument(targetUri, options, document){
	
}

function loadSchemaDocument(){
	
}
