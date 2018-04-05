var request = require("request");
var htmlparser = require("htmlparser2");

var APPID_ANDROID = 4831307;
var APPID_IOS = 4831307;
var APPID_WP = 4831307;
var DEFAULT_APP_ID = APPID_ANDROID;

function sendAuthRequest(formAction, inputs, callback){
	request({   url: formAction,
			    method: 'POST',
				form: inputs,
				jar: true
			}, function(error, response, body){
			    if(error) {
			        if (callback)
				    	callback(error, null, response);
			    } else {
			    	if (response.statusCode == 302){
				    	request({
				    		url: response.headers.location,
						    jar: true
						}, function(error, response, body){
						    if(error) {
			        			if (callback)
									callback(error, null, response);
						    } else {
						    	//find form with access confirmation
						    	var grantAccess = null;
						    	var parser = new htmlparser.Parser({
								    onopentag: function(name, attribs){
								        if(name === "form"){
								            grantAccess = attribs.action;
								        }
								    }
								});
								parser.write(body);
								parser.end();
								if((response.request.uri.query).indexOf("act=authcheck") == 0){
									var token = 'need_code'
									if (callback)
										callback(error, token, response.request.uri.href);
								}else{
									request({   url: grantAccess,
									    jar: true
									}, function(error, response, body){
									    if(error) {
													console.log(error);
				        					if (callback)
					    						callback(error, null, response);
									    } else {
												if(response.request.uri.hash == null){
													var token = 'notoken'
													if (callback)
														callback(error, token, response);
												}else{
													var token = response.request.uri.hash.split('&')[0].split('=')[1];
													if (callback)
														callback(error, token, response);
												}
									    }
									});
							    }
								}
						});
					} else {
						if (callback)
				    		callback("wrong status code!");
					}
			    }
			});
}

function sendTwoAuth(formAction, inputs, callback){
	request({   url: formAction,
			    method: 'POST',
				form: inputs,
				jar: true
			}, function(error, response, body){
			    if(error) {
						console.log(error);
			        if (callback)
				    	callback(error, null, response);
			    } else {
						console.log(body);
			    	if (response.statusCode == 302){
				    	request({
				    		url: response.headers.location,
						    jar: true
						}, function(error, response, body){
						    if(error) {
			        			if (callback)
									callback(error, null, response);
						    } else {
						    	var grantAccess = null;
						    	var parser = new htmlparser.Parser({
								    onopentag: function(name, attribs){
								        if(name === "form"){
								            grantAccess = attribs.action;
								        }
								    }
								});
								parser.write(body);
								parser.end();
									request({   url: grantAccess,
									    jar: true
									}, function(error, response, body){
									    if(error) {
													console.log(error);
				        					if (callback)
					    						callback(error, null, response);
									    } else {
												if(response.request.uri.hash == null){
													var token = 'notoken'
													console.log('bad code');
													if (callback)
														callback(token, error);
												}else{
													var token = response.request.uri.hash.split('&')[0].split('=')[1];
													console.log('good code');
													callback(token, error)
												}
									    }
									});
								}
						});
					} else {
						if (callback)
				    		callback("wrong status code!");
					}
			    }
			});
}

function twoStep(href, code, callback){
		console.log(href);
		var inputs = {};
		var formAction = null;
		var request_link = href;
		request({   url: request_link,
				    jar: true
				},
				function (error, response, body) {

				    if (!error && response.statusCode == 200) {
				    	var parser = new htmlparser.Parser({
						    onopentag: function(name, attribs){
						        if(name === "form"){
						            formAction = 'https://m.vk.com/' + attribs.action;
												console.log(formAction);
						        }
						        if (name === "input"){
						        	if (attribs.type === "hidden" || attribs.type === "text" || attribs.type === "password"){
						        		inputs[attribs.name] = attribs.value || "";
						        	}
						        }
						    }
						});
						parser.write(body);
						parser.end();
						inputs["code"] = code;
						sendTwoAuth(formAction, inputs, callback);
				    } else {
				    	if (callback)
				    		callback(error, null, response);
				    }
				}
		);
	}

function accessToken(login, password, callback, appid, scope){
		var aid = DEFAULT_APP_ID; // default is android
		if (appid){
			if (typeof appid === 'string'){
				if (appid.toLowerCase() === 'android'){
					aid = APPID_ANDROID;
				} else if (appid.toLowerCase() === 'ios'){
					aid = APPID_IOS;
				} else if (appid.toLowerCase() === 'wp'){
					aid = APPID_WP;
				}
			} else {
				aid = appid;
			}
		}
		var scopes = 'notify,friends,photos,audio,video,docs,notes,pages,status,offers,questions,wall,groups,messages,notifications,stats,ads,offline'; //Ful scope
		if (scope){
			if (Array.isArray(scope)){
				scopes = scope.join(',');
			} else {
				scopes = scope;
			}
		}
		var inputs = {};
		var formAction = null;
		var request_link = 'http://oauth.vk.com/oauth/authorize?redirect_uri=http://oauth.vk.com/blank.html&response_type=token&client_id=' + aid + '&scope=' + scopes + '&display=wap';
		request({   url: request_link,
				    jar: true
				},
				function (error, response, body) {

				    if (!error && response.statusCode == 200) {
				    	var parser = new htmlparser.Parser({
						    onopentag: function(name, attribs){
						        if(name === "form"){
						            formAction = attribs.action;
						        }
						        if (name === "input"){
						        	if (attribs.type === "hidden" || attribs.type === "text" || attribs.type === "password"){
						        		inputs[attribs.name] = attribs.value || "";
						        	}
						        }
						    }
						});
						parser.write(body);
						parser.end();
						inputs["email"] = login;
						inputs["pass"] = password;
						sendAuthRequest(formAction, inputs, callback);
				    } else {
				    	if (callback)
				    		callback(error, null, response);
				    }
				}
		);
	}

module.exports = {getAccessToken: accessToken, twoStep: twoStep};
