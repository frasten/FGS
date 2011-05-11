var FGS = {
	alreadyOpened: false,
	
	formExclusionString: '[action*="www\\.facebook\\.com\\/connect\\/connect.php"],[action*="custom_ads\\/islandAd\\.php"]',
	
	initializeDefaults: function ()
	{
		FGS.giftlistFocus = false;

		FGS.databaseAlreadyOpen = false;
		
		FGS.FBloginError  = null;
		FGS.iBonusTimeout = {};
		
		FGS.iRequestTimeout = null;
		
		FGS.options = {};
		FGS.optionsLoaded = false;
		
		FGS.defaultOptions =
		{
			defaultGame: '0',
			games: {},
			chatSessions: {},
			
			defaultCommentsMessages: [],
			
			checkChatTimeout: 60,
			checkBonusesTimeout: 60,
			deleteOlderThan: 0,
			deleteHistoryOlderThan: 0,
			displayXbonuses: 300,
			showDescriptionsOnStartup: 0,
			collectXbonusesAtTheSameTime: 2,
			breakStartupLoadingOption: 0,
			breakStartupLoadingCount: 300,
			breakStartupLoadingTime: 300
		}

		FGS.defaultGameOptions = { enabled: false,	lastBonusTime: 0, likeBonus: false, sendbackGift: false, hideFromFeed: false, hideFromFeedLimitError: false, listOnSearch: false, filter: [], favourites: [], defaultGift: 0, hiddenIcon: false, useRandomTimeoutOnBonuses: false, autoAcceptBonus: false };

		for(var idd in FGS.gamesData)
		{
			FGS.defaultOptions.games[idd] = FGS.jQuery.extend(true,{},FGS.defaultGameOptions);
		}

		FGS.post_form_id = '';
		FGS.fb_dtsg = '';
		FGS.charset_test = '';
		FGS.userID				= null;
		FGS.userName			= null;
		FGS.newElements = 0;
		FGS.bonusLoadingProgress = {};
		
		FGS.xhrFarmQueue = [];
		FGS.xhrFarmNextBonus  = 0;		
		FGS.xhrFarmWorking = 0;
		
		FGS.xhrQueue = [];
		FGS.xhrWorking = 0;
		FGS.xhrInterval = null;
		
		
		FGS.debugLog = [];
	},
	
	timeoutToNumber: function()
	{
		var num = 50;
		
		switch(parseInt(FGS.options.checkBonusesTimeout))
		{
			case 15:
				num = 10;
				break;
			case 30:
				num = 20;
				break;
			case 60:
				num = 30;
				break;
			case 120:
				num = 40;
				break;
			case 300:
				num = 50;
				break;
			case 600:
				num = 100;
				break;
		}
		return num;
	},
	
	deleteNewRequests: function(id, access_token)
	{
		FGS.jQuery.ajax({
			type: "GET",
			url: 'https://graph.facebook.com/'+id+access_token+'&method=delete',
			dataType: 'text',
			success: function(data)
			{}
		});
	},
	
	getGameRequests: function(currentType, id, currentURL, params, callback, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {}
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'https://graph.facebook.com/me/apprequests',
			data: params,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					callback(currentType, id, currentURL, [params, data]);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, params, callback, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(currentType, id, currentURL, params, callback, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	getSendingForm: function(params, callback, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {}
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'https://www.facebook.com/dialog/apprequests',
			data: $.param(params.reqData)+'&'+$.param(params.access)+'&'+params.getToken+'&sdk=joey&display=iframe&locale=en_US',
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);
					
					var tst = new RegExp(/["]bootstrapData["]:(.*)[\,]["]boo/).exec(dataStr);
					if(tst == null) throw {message:'no bootstrap tag'}					
					
					var postD = JSON.parse(tst[1]); 
					
					var newPost =
					{
						viewer: postD.viewer,
						token: postD.token,
					}
					
					var i = 0;
					for(var id in postD.filter)
					{
						newPost['filter['+i+']'] = postD.filter[id];
						i++;
					}
					
					var i = 0;
					for(var id in postD.options)
					{
						newPost['options['+i+']'] = postD.options[id];
						i++;
					}
					
					params.requestPost = $.param(newPost).replace(/%5B/g,'[').replace(/%5D/g,']');
					
					var tmpObj = {}
					var parStr = '';
					
					$(params.sendTo).each(function(k,v)
					{
						tmpObj[v] = 1;
						parStr += '&checkableitems[]='+v;
					});
					
					$('input[name="profileChooserItems"]', dataHTML).remove();
					
					params.formUrl = $('#uiserver_form', dataHTML).attr('action');
					params.formParam = $('#uiserver_form', dataHTML).serialize()+parStr+'&profileChooserItems='+encodeURIComponent(JSON.stringify(tmpObj));
					
					FGS.getFriendsFromRequest(params, callback);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, callback, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('updateNeighbors', false, params.gameID);
						}
						else
						{
							FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, callback, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', false, params.gameID);
					}
					else
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	
	getFriendsFromRequest: function(params, callback, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {}
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'https://www.facebook.com/ajax/typeahead/first_degree.php?__a=1',
			data: params.requestPost,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var str = dataStr.substring(9);
					var str2 = JSON.parse(str).error;
					
					var data = JSON.parse(str);
					
					if(typeof(str2) != 'undefined')
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						return;
					}
					
					var arr = {};
					
					$(data.payload.entries).each(function(k,v)
					{
						arr[v.uid] = {name: v.text};
					});
					
					params.tmpFriends = arr;
					
					FGS.getFriendsFromGame(params, callback);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, callback, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('updateNeighbors', false, params.gameID);
						}
						else
						{
							FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, callback, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', false, params.gameID);
					}
					else
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	
	getFriendsFromGame: function(params, callback, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {}
		
		FGS.jQuery.ajax({
			type: "POST",
			url: 'https://www.facebook.com/ajax/chooser/list/friends/app_user/?__a=1&app_id='+params.gameID,
			data: 'post_form_id='+FGS.post_form_id+'&fb_dtsg='+FGS.fb_dtsg+'&lsd&post_form_id_source=AsyncRequest',
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var str = dataStr.substring(9);
					var str2 = JSON.parse(str).error;
					
					var data = JSON.parse(str);
					
					if(typeof(str2) != 'undefined')
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						return;
					}
					
					var finalArr = [];
					
					$(data.payload.ids).each(function(k, v)
					{
						var x = {};
						x[v] = params.tmpFriends[v];
						if(typeof(x[v]) != 'undefined')
							finalArr.push(x);						
					});
					
					params.items = finalArr;
					
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', finalArr, params.gameID);
						return;
					}
					
					$.post(params.formUrl, params.formParam+'&ok_clicked=Send%20Requests', function()
					{
						var curTime = Math.round(new Date().getTime() / 1000);

						var found = false;
						
						if(typeof(params.thankYou) == 'undefined')
							FGS.ListNeighbours(params.gameID);
						
						$(params.items).each(function(k,val)
						{
							for(var i in val)
							{
								var id = i;
							}
							var v = val[id];				
							
							if($.inArray(id, params.sendTo) > -1)
							{
								var sendHistory = {
									gift: params.gift,
									gameID: params.gameID,
									friend: v.name,
									time: curTime,
									friendID: id
								};
								FGS.database.addFreegift(params.gameID, v.name, params.gift, curTime, typeof(params.thankYou));
								
								if(typeof(params.thankYou) != 'undefined')
								{
									FGS.database.updateItemGiftBack((params.isRequest ? 'requests' : 'bonuses'), params.bonusID);
								}
								
								FGS.sendView('freegiftSuccess', sendHistory, (typeof(params.thankYou) != 'undefined' ? params.bonusID : ''));
								
								found = true;
							}
							i++;
						});
						
						if(!found && typeof(params.thankYou) != 'undefined')
						{
							//thank you gift
							var sendHistory = {
								gift: params.gift,
								gameID: params.gameID,
								friend: params.sendToName,
								time: curTime,
								friendID: params.sendTo[0]
							};
							
							FGS.database.addFreegift(params.gameID, params.sendToName, params.gift, curTime, typeof(params.thankYou));
							FGS.database.updateItemGiftBack((params.isRequest ? 'requests' : 'bonuses'), params.bonusID);
							
							FGS.sendView('freegiftSuccess', sendHistory, (typeof(params.thankYou) != 'undefined' ? params.bonusID : ''));
						}
					});
					
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, callback, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('updateNeighbors', false, params.gameID);
						}
						else
						{
							FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, callback, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', false, params.gameID);
					}
					else
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	
	getAppAccessTokenForSending: function(params, callback, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
					
		FGS.jQuery.ajax({
			type: "GET",
			url: 'http://www.facebook.com/extern/login_status.php?locale=en_US&sdk=joey&session_version=3&display=hidden&extern=0',
			data: params.getToken,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					var parseStr = data;

					var pos1 = parseStr.indexOf('var config = {');
					if(pos1 == -1) throw {message:"no URI"}
					
					var pos2 = parseStr.indexOf('};',pos1);
					
					parseStr = parseStr.slice(pos1+13,pos2+1);
					var parseStr = JSON.parse(parseStr);
					
					params.access = {access_token: parseStr.session.access_token};
					
					FGS.getSendingForm(params, callback);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, callback, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('updateNeighbors', false, params.gameID);
						}
						else
						{
							FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, callback, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', false, params.gameID);
					}
					else
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	
	getAppAccessToken2: function(params, params2, callback)
	{
		var $ = FGS.jQuery;
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'http://www.facebook.com/extern/login_status.php?locale=en_US&sdk=joey&session_version=3&display=hidden&extern=0',
			data: params,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					var parseStr = data;

					var pos1 = parseStr.indexOf('var config = {');
					if(pos1 == -1) throw {message:"no URI"}
					
					var pos2 = parseStr.indexOf('};',pos1);
					
					parseStr = parseStr.slice(pos1+13,pos2+1);
					var parseStr = JSON.parse(parseStr);
					
					params2.access_token = parseStr.session.access_token;
					
					callback(params2);			
				}
				catch(err)
				{
				}
			},
			error: function()
			{
			}
		});
	},
	
	getAppAuthInfo: function(params, callback, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'http://www.facebook.com/extern/login_status.php?locale=en_US&sdk=joey&session_version=3&display=hidden&extern=0',
			data: params.app_info,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					var parseStr = data;

					var pos1 = parseStr.indexOf('var config = {');
					if(pos1 == -1) throw {message:"no URI"}
					
					var pos2 = parseStr.indexOf('};',pos1);
					
					parseStr = parseStr.slice(pos1+13,pos2+1);
					var parseStr = JSON.parse(parseStr);
					
					params.auth_info = parseStr;
					
					callback(params);
				}
				catch(err)
				{
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, callback, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('updateNeighbors', false, params.gameID);
						}
						else
						{
							FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, callback, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', false, params.gameID);
					}
					else
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},	getAppAuthInfo: function(params, callback, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'http://www.facebook.com/extern/login_status.php?locale=en_US&sdk=joey&session_version=3&display=hidden&extern=0',
			data: params.app_info,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					var parseStr = data;

					var pos1 = parseStr.indexOf('var config = {');
					if(pos1 == -1) throw {message:"no URI"}
					
					var pos2 = parseStr.indexOf('};',pos1);
					
					parseStr = parseStr.slice(pos1+13,pos2+1);
					var parseStr = JSON.parse(parseStr);
					
					params.auth_info = parseStr;
					
					callback(params);
				}
				catch(err)
				{
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, callback, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('updateNeighbors', false, params.gameID);
						}
						else
						{
							FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, callback, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', false, params.gameID);
					}
					else
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	
	getAppAccessToken: function(currentType, id, currentURL, params, callback, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {}
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'http://www.facebook.com/extern/login_status.php?locale=en_US&sdk=joey&session_version=3&display=hidden&extern=0',
			data: params,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					var parseStr = data;

					var pos1 = parseStr.indexOf('var config = {');
					if(pos1 == -1) throw {message:"no URI"}
					
					var pos2 = parseStr.indexOf('};',pos1);
					
					parseStr = parseStr.slice(pos1+13,pos2+1);
					var parseStr = JSON.parse(parseStr);
					
					var access = {access_token: parseStr.session.access_token};
					
					FGS.getGameRequests(currentType, id, currentURL, access, callback);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, params, callback, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(currentType, id, currentURL, params, callback, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	prepareLinkForGameStep2: function(url, game, id, dataPost, newWindow, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {};
		
		FGS.jQuery.ajax({
			type: "GET",
			url: url,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					var pos1 = data.indexOf('document.location.replace("');
					if(pos1 == -1) throw {message: 'a'}
					var pos2 = data.indexOf('"', pos1+27);
					var text = data.slice(pos1+27,pos2);
					text = text.replace(/\\u0025/g, '%');
					text = text.replace(/\\/g,'');
					var url = $(FGS.HTMLParser('<p class="link" href="'+text+'">abc</p>')).find('p.link');
					var URI = url.attr('href');							
				
					if(newWindow)
						FGS.openURI(URI, true);
					else
						FGS[game].Requests.Click("request", id, URI);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(url, game, id, dataPost, newWindow, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(url, game, id, dataPost, newWindow, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	prepareLinkForGame: function(game, id, dataPost, newWindow, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {}
		
		if(FGS.Gup('secondLink', dataPost) == 1)
			var url = 'http://www.facebook.com/ajax/games/apprequest/apprequest.php?__a=1'
		else
			var url = 'http://www.facebook.com/ajax/reqs.php?__a=1';
		
		var dataPost2 = dataPost + '&post_form_id='+FGS.post_form_id+'&fb_dtsg='+FGS.fb_dtsg+'&nctr[_mod]=pagelet_requests';
		
		
		FGS.jQuery.ajax({
			type: "POST",
			url: url,
			data: dataPost2,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					var parseStr = data;
					
					var pos1 = parseStr.indexOf('goURI');
					if(pos1 == -1) throw {message:"no URI"}

					var pos2 = parseStr.indexOf(');',pos1);
					var parseStr = '{"abc":"'+parseStr.slice(pos1+8,pos2-2)+'"}';
					var parseStr = JSON.parse(parseStr);
					
					var url2 = parseStr.abc.toString();
					
					if(url2.indexOf('l.php') == 2)
					{
						var parseStr = '{"abc":"'+url2+'"}';
						var parseStr = JSON.parse(parseStr);
						var newStr = 'http://www.facebook.com'+parseStr.abc;
						
						FGS.prepareLinkForGameStep2(newStr, game, id, dataPost, newWindow);
					}
					else
					{
						var parseStr = parseStr.abc.replace(/\\u0025/g, '%');
						
						var URI = JSON.parse('"'+parseStr+'"');
						
						if(newWindow)
							FGS.openURI(URI, true);
						else
							FGS[game].Requests.Click("request", id, URI);
					}
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(game, id, dataPost, newWindow, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(game, id, dataPost, newWindow, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	emptyUnwantedGifts: function(dataPost)
	{
		if(FGS.Gup('secondLink', dataPost) == 1)
			var url = 'http://www.facebook.com/ajax/games/apprequest/apprequest.php?__a=1'
		else
			var url = 'http://www.facebook.com/ajax/reqs.php?__a=1';
		
		var dataPost2 = dataPost + '&post_form_id='+FGS.post_form_id+'&fb_dtsg='+FGS.fb_dtsg+'&nctr[_mod]=pagelet_requests';
		
		
		FGS.jQuery.ajax({
			type: "POST",
			url: url,
			data: dataPost2,
			dataType: 'text',
			success: function(data)
			{}
		});
	},
	
	stopAll: function(wait)
	{
		FGS.sendView('close');
		
		FGS.iBonusTimeout = {};
		
		if(FGS.xhrInterval !== null)
		clearInterval(FGS.xhrInterval);
		
		FGS.initializeDefaults();
		
		if(wait)
			FGS.FBloginError = null;
		else
			FGS.FBloginError = true;
		
		FGS.database.db = null;
		FGS.updateIcon();
	},
	
	loginStatusChanged: function(bool, html)
	{
		FGS.dump(FGS.getCurrentTime()+'[L] Received new login status. Checking if I have to start or stop updates.');
		
		if(bool == true)
		{
			if(FGS.userID == null)
			{
				FGS.FBloginError = null;
				FGS.updateIcon();
				
				if(html != undefined)
					FGS.parseStartupData(html);
				else
					FGS.startup();
			}
		}
		else
		{
			FGS.stopAll();
		}
	},
	
	parseStartupData: function(data2)
	{
		var data = FGS.HTMLParser(data2);		
		
		if(FGS.jQuery("#login_form", data).length > 0)
		{
			FGS.dump(FGS.getCurrentTime()+'[R] Error: probably logged out');
			FGS.stopAll();
			return true;
		}

		if(FGS.userID == null || FGS.userName == null)
		{
			var pos1 = data2.indexOf('Env={')+4;
			var pos2 = data2.indexOf('user:', pos1)+5;
			var pos3 = data2.indexOf(',', pos2);

			FGS.userID = data2.slice(pos2, pos3);
			FGS.userName = FGS.jQuery('#navAccountName', data).text();
		}
		
		if(FGS.databaseAlreadyOpen == false)
		{
			FGS.database.open(FGS.userID);
			FGS.database.createTable();
		}

		if(FGS.post_form_id == '' || FGS.fb_dtsg == '')
		{
			FGS.fb_dtsg 		= FGS.jQuery('input[name="fb_dtsg"]', data).val();
			FGS.post_form_id 	= FGS.jQuery('input[name="post_form_id"]', data).val();
		}
	},
	
	startup: function()
	{
		FGS.jQuery.ajax({
			type: "GET",
			url: 'http://www.facebook.com/help/',
			dataType: 'text',
			timeout: 30000,
			success: function(data2)
			{
				FGS.parseStartupData(data2);
			},
			error: function()
			{
				setTimeout(FGS.startup, 3000);
			}
		});		
	},
	
	finishStartup: function()
	{
		FGS.FBloginError = false;
		FGS.updateIcon();
		FGS.xhrInterval = setInterval(FGS.checkXhrQueue,100);
		FGS.restartRequests();
		FGS.restartBonuses();
	},
	
	encodeHtmlEntities: function (str) 
	{
		return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	},

	checkForLocationReload: function(data)
	{
		var $ = jQuery = FGS.jQuery;
				
		try
		{
			var pos1 = data.indexOf('script>window.location.replace("');
			if(pos1 == -1) return false;
			var pos2 = data.indexOf('"', pos1+32);
			var text = data.slice(pos1+32,pos2);
			text = text.replace(/\\u0025/g, '%');
			text = text.replace(/\\/g,'');
			var url = $(FGS.HTMLParser('<p class="link" href="'+text+'">abc</p>')).find('p.link');
			var ret = url.attr('href');
			
			return ret;
		}
		catch(err)
		{
			FGS.dump('checkForLocationReload'+err);
			return false;
		}
	},
	
	endWithSuccess: function(type, id, info)
	{
		if(type == 'request' || type == 'requests')
		{
			var viewMsg = 'requestSuccess';
			var table = 'requests';
		}
		else if(type == 'bonus' || type == 'bonuses')
		{
			var viewMsg = 'bonusSuccess';
			var table = 'bonuses';
		}
		
		FGS.sendView(viewMsg, id, info);
		FGS.database.updateItem(table, id, info);
			
	},
	
	endWithError: function(error, type, id, error_text)
	{
		var info = 
		{
			time: Math.round(new Date().getTime() / 1000),
			error: error,
			image: 'gfx/90px-cancel.png'
		};
		
		if(type == 'request' || type == 'requests')
		{
			var viewMsg = 'requestError';
			var table = 'requests';
		}
		else if(type == 'bonus' || type == 'bonuses')
		{
			var viewMsg = 'bonusError';
			var table = 'bonuses';
		}
		
		if(error == 'receiving')
		{
			FGS.database.updateErrorItem(table, id, info);
			FGS.sendView(viewMsg, id, info);	
		}
		else if(error == 'connection')
		{
			FGS.sendView(viewMsg, id, info);
		}
		else if(error == 'other')
		{
			if(typeof(error_text) != 'undefined')
			{
				info.error_text = error_text;
			}
			FGS.sendView(viewMsg, id, info);
		}
		else if(error == 'limit')
		{
			if(typeof(error_text) != 'undefined')
			{
				info.error_text = error_text;
			}
			
			FGS.database.updateErrorItem(table, id, info);
			FGS.sendView(viewMsg, id, info);	
		}
		else if(error == 'not found')
		{
			info.error_text = 'This gift has expired or was collected from requests page.';
			FGS.database.updateErrorItem(table, id, info);
			FGS.sendView(viewMsg, id, info);
			//alert('nieznany error - powiedz mezowi: '+error+' ID: '+id);
		}
	},
	
	checkForNotFound: function(url)
	{
		var errorsArr = ['gifterror=notfound', 'countrylife/play', 'apps.facebook.com/ravenwoodfair/home', '/cafeworld/?ref=requests', '/cityofwonder/gift/?track=bookmark', '/myshopsgame/?ref=received_gift_failed'];
		
		var errorsFullArr = ['http://apps.facebook.com/cafeworld'];
		
		
		var ret = false;
		
		FGS.jQuery(errorsArr).each(function(k,v)
		{
			if(url.indexOf(v) != -1)
			{
				ret = true;
				return false;				
			}		
		});
		
		FGS.jQuery(errorsFullArr).each(function(k,v)
		{
			if(url == v)
			{
				ret = true;
				return false;				
			}		
		});
		
		return ret;
	},
	
	findIframeByName: function(name, data)
	{
		var $ = jQuery = FGS.jQuery;
		
		try
		{
			var count = data.match(/<iframe[^>]*?>/gm);
			
			var v = '';
			
			$(count).each(function(k,x)
			{
				if(x.indexOf(' name="'+name+'"') != -1)
				{
					v = x;
					return false;
				}
			});
			
			if(v == '') throw {message: 'no iframe with name - '+name}
			
			var nextUrl = false;
			
			var pos1 = v.indexOf('src="');
			if(pos1 != -1)
			{
				pos1+=5;
				var pos2 = v.indexOf('"', pos1);
				var url = v.slice(pos1,pos2);
				var url = $(FGS.HTMLParser('<p class="link" href="'+url+'">abc</p>')).find('p.link');
				nextUrl = url.attr('href');
			}
			else
			{
				return '';
			}
			return nextUrl;
		}
		catch(e)
		{
			return '';
		}
	},
	
	getRandomTimeout: function()
	{
		var secs = Math.floor((Math.random()*25)+5);
		
		FGS.dump('Next bonus starts in: '+ secs);
		
		var start = secs*1000;
		return (new Date().getTime() + start);
	},
	
	findIframeAfterId: function(id, data)
	{
		var $ = jQuery = FGS.jQuery;
		
		try
		{
			var pos1 = data.indexOf('"'+id.slice(1)+'"');
			var data = data.slice(pos1);
			
			var count = data.match(/<iframe[^>]*?>/gm);
			if(count == 0) throw {message: 'iframe not found'}
			
			var nextUrl = false;
			v = count[0];
			
			var pos1 = v.indexOf('src="');
			if(pos1 != -1)
			{
				pos1+=5;
				var pos2 = v.indexOf('"', pos1);
				var url = v.slice(pos1,pos2);
				var url = $(FGS.HTMLParser('<p class="link" href="'+url+'">abc</p>')).find('p.link');
				nextUrl = url.attr('href');
			}
			else
			{
				return '';
			}
			return nextUrl;
		}
		catch(e)
		{
			return '';
		}
	},
	
	stopQueue: function()
	{
		var resetArr = FGS.xhrQueue.concat(FGS.xhrFarmQueue);
		FGS.xhrQueue = [];
		FGS.xhrFarmQueue = [];
		
		return resetArr;
	},
	
	setNewFarmvilleBonus: function()
	{
		FGS.xhrFarmWorking = 0;
		FGS.xhrFarmNextBonus = FGS.getRandomTimeout();
	},
	
	checkXhrQueue: function()
	{
		if(new Date().getTime() > FGS.xhrFarmNextBonus)
		{
			if(FGS.xhrFarmQueue.length > 0 && FGS.xhrFarmWorking == 0)
			{
				FGS.xhrFarmWorking = FGS.xhrFarmQueue[0].id;
				FGS[FGS.xhrFarmQueue[0].game].Bonuses.Click("bonus", FGS.xhrFarmQueue[0].id, FGS.xhrFarmQueue[0].url);
				FGS.xhrFarmQueue = FGS.xhrFarmQueue.slice(1);				
			}
		}
	
		if(FGS.xhrWorking < FGS.options.collectXbonusesAtTheSameTime)
		{
			if(FGS.xhrQueue.length > 0)
			{
				if(FGS.xhrQueue[0].type == 'request')
				{
					FGS.prepareLinkForGame(FGS.xhrQueue[0].game, FGS.xhrQueue[0].id, FGS.xhrQueue[0].post, false);
					FGS.xhrQueue = FGS.xhrQueue.slice(1);
					FGS.xhrWorking++;
				}
				else if(FGS.xhrQueue[0].type == 'bonus')
				{
					FGS[FGS.xhrQueue[0].game].Bonuses.Click("bonus", FGS.xhrQueue[0].id, FGS.xhrQueue[0].url);
					FGS.xhrQueue = FGS.xhrQueue.slice(1);
					FGS.xhrWorking++;
				}
			}
		}
	},
	
	startBonusesForGame: function(gameID)
	{
		FGS.iBonusTimeout[gameID] = setTimeout('FGS.checkBonuses("'+gameID+'");', 1000);
	},
	
	stopBonusesForGame: function(gameID)
	{
		try
		{
			delete(FGS.iBonusTimeout[gameID]);
		}
		catch(e)
		{
			FGS.dump(e);
		}
	},
	
	setTimeoutOnBonuses: function(gameID)
	{
		if(FGS.options.games[gameID].enabled)
		{
			FGS.iBonusTimeout[gameID] = setTimeout('FGS.checkBonuses("'+gameID+'");', FGS.options.checkBonusesTimeout*1000);
		}
		else
		{
			FGS.stopBonusesForGame(gameID);
		}
	},	
	
	restartBonuses: function()
	{
		for(var id in FGS.options.games)
		{
			if(FGS.options.games[id].enabled)
			{
				if(typeof(FGS.iBonusTimeout[id]) == 'undefined' || FGS.iBonusTimeout[id] == null)
				{
					FGS.startBonusesForGame(id);
					FGS.dump(FGS.getCurrentTime()+'[B] Starting '+id);
				}
			}
		}
	},
	
	restartRequests: function()
	{
		FGS.dump(FGS.getCurrentTime()+'[R] Restarting requests');
		clearInterval(FGS.iRequestTimeout);
		FGS.iRequestTimeout = null;
		FGS.checkRequests();
		FGS.iRequestTimeout = setInterval('FGS.checkRequests();', 600000);
	},
	
	
	checkRequests: function(apps)
	{
		if(typeof(apps) == 'undefined')
			var urlIK = 'http://www.facebook.com/games';
		else
			var urlIK = 'http://www.facebook.com/?sk=apps&ap=1';
	
		FGS.jQuery.ajax({
			type: "GET",
			url: urlIK,
			dataType: 'text',
			timeout: 180000,
			success: function(data)
			{
				if(typeof(apps) == 'undefined')
					FGS.checkRequests(true);
				
				if(data.indexOf('"content":{"pagelet_requests":"') != -1)
				{
					var pos1 = data.indexOf('"content":{"pagelet_requests":"')+10;
					var pos2 = data.indexOf('"}});', pos1)+2;
					var pos2a = data.indexOf('"},', pos1)+2;
					if(pos2a < pos2)
						pos2 = pos2a;
					
					var tempD = JSON.parse(data.slice(pos1,pos2));

					data = tempD.pagelet_requests;				
				}
				else if(data.indexOf("content: {pagelet_requests: '") != -1)
				{
					var pos1 = data.indexOf("content: {pagelet_requests: '")+9;
					var pos2 = data.indexOf("'}});", pos1)+2;
					var pos2a = data.indexOf("'},", pos1)+2;
					if(pos2a < pos2)
						pos2 = pos2a;
					
					var tempD = JSON.parse(data.slice(pos1,pos2));
					
					data = tempD.pagelet_requests;	
				}
				
				data = data.replace(/ src=\"/gi, ' notsrc="');

				var data = FGS.HTMLParser(data);
				
				var $ = FGS.jQuery;
				
				var FBdata = $('input[name="params\[app_id\]"]', data).parent('form:first');
				
				if(FGS.post_form_id == '')
				{
					var p = $(FBdata).children('input[name=post_form_id]').val();
					if(p != undefined)
						FGS.post_form_id = p;
				}
				
				if(FGS.fb_dtsg == '' )
				{
					var p = FGS.fb_dtsg = $(FBdata).children('input[name=fb_dtsg]').val();
					if(p != undefined)
						FGS.fb_dtsg = p;
				}
				
				if(FGS.charset_test == '')
				{
					var p = $(FBdata).children('input[name=charset_test]').val();
					if(p != undefined)
						FGS.charset_test = p;
				}
				
				var giftArr = [];
				
				FGS.jQuery('input[name="params\[app_id\]"]',data).parent('form').each(function()
				{
					var APPID = $(this).find('input[name="params\[app_id\]"]').val();

					if(FGS.options.games[APPID] == undefined || FGS.options.games[APPID].enabled == false)
					{
						return;
					}

					var el = $(this);
					
					if($(this).attr('action') == '/ajax/games/apprequest/apprequest.php')
					{
						var dataPost = 
							'charset_test='			+el.children('input[name=charset_test]').val() +
							'&id='					+el.children('input[name=id]').val() +							
							'&params[from_id]='		+el.find('input[name="params\[from_id\]"]').val() +
							'&params[app_id]='		+ APPID +
							'&div_id='		+el.children('input[name=div_id]').val()	+
							'&nctr[_mod]=pagelet_requests' +
							'&lsd=' +
							'&actions[accept]=Akceptuj' +
							'&post_form_id_source=AsyncRequest&secondLink=1';
						
						var typeText = '';
					}
					else
					{
						var dataPost = 
							'charset_test='			+el.children('input[name=charset_test]').val() +
							'&id='					+el.children('input[name=id]').val() +
							'&type='				+el.children('input[name=type]').val() +
							'&status_div_id='		+el.children('input[name=status_div_id]').val()	+
							'&params[from_id]='		+el.find('input[name="params\[from_id\]"]').val() +
							'&params[app_id]='		+ APPID +
							'&params[req_type]='	+el.find('input[name="params\[req_type\]"]').val() +
							'&params[is_invite]='	+el.find('input[name="params\[is_invite\]"]').val() +
							'&lsd' +
							'&post_form_id_source=AsyncRequest';
							
						var typeText = el.find('input[type="submit"]').attr('name');
						
						var ret = false;
						
						$(FGS.gamesData[APPID].filter.requests).each(function(k,v)
						{
							var re = new RegExp(v, "i") ;
							
							if(re.test(typeText))
							{
								dataPost += '&actions[reject]=Ignore';
								FGS.emptyUnwantedGifts(dataPost);
								ret = true;
								return false;
							}
						});
						
						if(ret) return;
						
						dataPost += '&'+escape(el.find('input[type="submit"]:first').attr('name'))+'='+el.find('input[type="submit"]:first').attr('value');
					}

					var elID = el.children('input[name=id]').val();
					if(el.find('.appRequestBodyNewA').length > 0)
					{
						var testEl = el.find('.appRequestBodyNewA:first');
						
						if(testEl.children().length > 1)
						{
							var txtP1 = '<span style="color: blue;font-weight: bold;">'+testEl.children(':last').text()+'</span><br />';
							var txtP2 = testEl.children(':first').text();
							
							var newText = txtP1 + txtP2;
						}
						else
						{
							var newText = testEl.text();
						}
					}
					else
					{
						var testEl = el.find('.UIImageBlock_ICON_Content:first');
						
						if(testEl.children().length > 1)
						{
							var txtP1 = '<span style="color: blue;font-weight: bold;">'+testEl.children(':last').text()+'</span><br />';
							var txtP2 = testEl.children(':first').text();
							
							var newText = txtP1 + txtP2;
						}
						else
						{
							var newText = testEl.text();
						}
					
					
					}
					
					if(newText.indexOf('to be neighbors') != -1 || newText.indexOf('join my mafia') != -1 || newText.indexOf('be neighbours in') != -1 || newText.indexOf('be neighbors in') != -1 || newText.indexOf('be my neighbor') != -1 || newText.indexOf('neighbor in YoVille') != -1 || newText.indexOf('my neighbor in') != -1 || newText.indexOf('Come be my friend') != -1 || newText.indexOf('neighbor in') != -1 || newText.indexOf('Come join me in Evony') != -1 || newText.indexOf('as my new neighbor') != -1)
					{
						var type =  el.find('.UIImageBlock_SMALL_Image').find('img').attr('notsrc');				
					}
					else
					{
						if(APPID == 120563477996213)
						{
							var searchStr = 'item_id';
						}
						else if(APPID == 101539264719)
						{
							var searchStr = 'gid';
						}
						else if(APPID == 167746316127 || APPID == 2405948328 || APPID == 2345673396 || APPID == 2339854854 || APPID == 14852940614)
						{
							var searchStr = 'giftId';
						}
						else
						{
							var searchStr = 'gift';
						}
						
						var typeText = unescape(typeText);

						var pos1 = FGS.Gup(searchStr, typeText);

						if(pos1 == "")
						{
							if(APPID == 10979261223)
							{
							
								var typeText = unescape(typeText);
								var pos1 = typeText.indexOf('"item_id":"');
								if(pos1 == -1)
								{
									var type = 'unknown';
								}
								else
								{
									pos1 += 11;
									pos2 = typeText.indexOf('"', pos1);
									var type = typeText.slice(pos1, pos2);
								}
							}
							else
							{
								var type = 'unknown';
							}
						}
						else
						{
							var type = pos1;
						}
					}
					
					var curTime = Math.round(new Date().getTime() / 1000);
					
					
					
					var bTitle = el.find('.UIImageBlock_SMALL_Content').find('a:first').text().replace(/'/gi, '');		
					
					var fromUser = el.find('input[name="params\[from_id\]"]').val();
					
					if(fromUser != undefined)
					{
						var stats = [fromUser, APPID, curTime];
					}
					else
					{
						var stats = [];
					}
					
					if(el.find('.appRequestBodyNewA').length > 0)
					{
						bTitle = el.find('.uiTooltipText:first').text();
					}
					
					
					var gift = [elID, APPID, bTitle, newText, type, dataPost, curTime, stats];
					giftArr.push(gift);
				});
				
				
				
				if(giftArr.length > 0)
				{
					FGS.database.addRequest(giftArr);
				}
				FGS.dump(FGS.getCurrentTime()+'[R] Setting up new update in 10 minutes');
			},
			error: function(e)
			{
				FGS.dump(FGS.getCurrentTime()+'[R] Connection error. Setting up new update in 10 seconds');
			}
		});
	},
	
	Gup: function(name, str)
	{
		var results = (new RegExp("[\\?&]"+name+"=([^&#]*)")).exec(str);
		if(results == null)
			return ''
		else
			return results[1];
	},
	
	ListNeighbours: function(gameID)
	{
		var game = FGS.gamesData[gameID].systemName;
		
		var params = 
		{
			gift: FGS.freeGiftForGame[gameID],
			gameID:	gameID,
			loadList: true
		}
		
		if(FGS.options.games[gameID].enabled)
		{
			FGS[game].Freegifts.Click(params);
		}
	},
	
	checkBonuses: function(appID, params, retry)
	{
		var $ = jQuery = FGS.jQuery;
		
		if(appID == '176611639027113')
		{
			FGS.rewardville.Freegifts.Click({onlyLogin: true});
			
			if(FGS.options.games[appID].enabled)
			{
				FGS.iBonusTimeout[appID] = setTimeout('FGS.checkBonuses("'+appID+'");', 180000);
			}
			else
			{
				FGS.stopBonusesForGame(appID);
			}
			return;
		}
		
		if(typeof(FGS.iBonusTimeout[appID]) == 'undefined' || FGS.FBloginError !== false)
		{
			return;
		}
		
		if(typeof(FGS.bonusLoadingProgress[appID]) == 'undefined')
		{
			FGS.bonusLoadingProgress[appID] =
			{
				loaded: false
			};
		}
		
		var number = 150;
		
		if(FGS.bonusLoadingProgress[appID].loaded == false)
		{
			if(FGS.options.breakStartupLoadingOption === 0)
				if(FGS.options.breakStartupLoadingCount > 500)
					var number = 300;
		}
		else
		{
			var number = FGS.timeoutToNumber();
		}
		
		if(typeof(params) == 'undefined')
		{
			var params = {};
			
			params.items = [];
			params.time = 0;
			params.first = 0;
			var paramsStr = '';
			
			FGS.dump(FGS.getCurrentTime()+'[B] Starting. Checking for bonuses for game '+appID);
		}
		else
		{
			var paramsStr = '&show_hidden=false&ignore_self=false&oldest='+params.time;
		}
		
		$.ajax({
			type: "GET",
			url: 'http://www.facebook.com/ajax/apps/app_stories.php',
			data: '__a=1&is_game=1&app_ids='+appID+'&max_stories='+number+'&user_action=0'+paramsStr,
			dataType: 'text',
			timeout: 180000,
			success: function(str)
			{
				try
				{
					var str = str.substring(9);
					var error = JSON.parse(str).error;

					if(typeof(error) != 'undefined')
					{
						FGS.dump(FGS.getCurrentTime()+'[B] Error: logged out');
						FGS.stopAll();
						return true;
					}
					
					var data = JSON.parse(str).onload.toString();

					var i0 = data.indexOf('"#app_stories"');
					var pos1 = data.indexOf('HTML("', i0)+6;
					var pos2 = data.indexOf('"))',pos1);
					
					var data = data.slice(pos1,pos2);
					
					var tmpData = JSON.parse('{"html": "'+data+'"}');
					
					if(tmpData.html == "")
					{
						throw {message: 'empty'};
					}
				
					var htmlData = FGS.HTMLParser(tmpData.html);					
					
					var now = new Date().getTime();
					
					var lastBonusTime = FGS.options.games[appID].lastBonusTime;
					
					var finishCollecting = false;
					var oldest = 0;
					
					
					if(data.indexOf('uiBoxLightblue') != -1)
					{
						FGS.sendView('hiddenFeed', appID);
						throw {message: 'no feed'}
					}
					
					if($('li.uiStreamStory', htmlData).length == 0)
					{
						throw {message: 'empty'}
					}
					
					$('li.uiStreamStory', htmlData).each(function()
					{
						var el = $(this);

						var data = el.find('input[name="feedback_params"]').val();
						
						var bonusData = JSON.parse(data);
						
						var tmpDateStr = el.find('abbr').attr('data-date');
						
						if(typeof(tmpDateStr) == 'undefined')
							return;
						
						var bonusTimeTmp = new Date(tmpDateStr).getTime();					
						var bonusTime = Math.round(bonusTimeTmp / 1000);
						
						var diff = now-bonusTimeTmp;
						var secs = Math.floor(diff.valueOf()/1000);
						
						var elID = bonusData.target_fbid;
						var actr = bonusData.actor;
						
						if(params.first == 0)
						{
							params.first = bonusTimeTmp+1;
						}
						
						oldest = bonusTime;
						
						if(bonusTimeTmp < lastBonusTime)
						{
							finishCollecting = true;
							return true;
						}
						
						var targets = bonusData.target_profile_id;
						
						if(actr != targets)
						{
							if(FGS.userID != targets)
							{
								return true;
							}
						}
						
						if(FGS.options.breakStartupLoadingOption == 0)
						{
							if(params.items.length >= parseInt(FGS.options.breakStartupLoadingCount))
							{
								finishCollecting = true;
								return false;
							}
						}
						else
						{
							if(secs >= parseInt(FGS.options.breakStartupLoadingTime))
							{
								finishCollecting = true;
								return false;
							}
						}

						if(actr == FGS.userID)	
						{
							if(appID.toString() != '166309140062981' && appID.toString() != '216230855057280') // wlasny bonus w puzzle hearts i charmed gems
								return true;
						}

						var ret = false;
						
						var testLink = el.find('.UIActionLinks_bottom > a:last');
						if(testLink.length == 0)
						{
							var testLink = el.find('.uiAttachmentTitle').find('a');
							if(testLink.length == 0)
								return;
						}
						var testLink = testLink.first();
						
						var bTitle = jQuery.trim(testLink.text().replace(/'/gi, ''));

						$(FGS.gamesData[appID].filter.bonuses).each(function(k,v)
						{
							var re = new RegExp(v, "i");
							
							if(re.test(bTitle))
							{
								ret = true;
								return false;
							}
						});
						
						if(ret) return;

						var feedback = el.find('input[name="feedback_params"]').val();
						var link_data = el.attr('data-ft');
						
						if(typeof(link_data) == 'undefined' || link_data == null)
							return;

						//sprawdzanie filtrow usera
						var ret = false;
						$(FGS.options.games[appID].filter).each(function(k,v)
						{
							var re = new RegExp(v, "i") ;
							
							if($.trim(v) != '' && re.test(bTitle))
							{
								FGS.dump('Filtering: '+bTitle);
								ret = true;
								return false;
							}
						});
						if(ret) return;
						//koniec filtry usera
						
						var link = el.find('.UIActionLinks_bottom > a:last').attr('href');
						
						if(link == undefined)
						{
							var link = el.find('.uiAttachmentTitle').find('a').attr('href');
							if(link == undefined)
								return;							
						}						
						
						var bonus = [elID, appID, bTitle, el.find('.uiAttachmentTitle').text(), el.find('.uiStreamAttachments').find('img').attr('src'), link, bonusTime, feedback, link_data];
						
						params.items.push(bonus);
						
						if(params.items.length >= 2500)
						{
							finishCollecting = true;
							return false;
						}
					});
					
					if(finishCollecting)
					{
						if(params.first > 0)
							FGS.options.games[appID].lastBonusTime = params.first;
						
						if(params.items.length > 0)
							FGS.database.addBonus(params.items);
						
						if(!FGS.bonusLoadingProgress[appID].loaded)
							FGS.bonusLoadingProgress[appID].loaded = true;
						
						FGS.saveOptions();						
						FGS.setTimeoutOnBonuses(appID);
						FGS.dump(FGS.getCurrentTime()+'[B] Setting up new update in '+FGS.options.checkBonusesTimeout+' seconds');
					}
					else
					{
						if(oldest > 0)
							params.time = oldest;
						FGS.checkBonuses(appID, params);
					}
				}
				catch(e)
				{
					if(typeof(retry) == 'undefined')
					{
						if(oldest == 0 && params.items.length == 0)
						{
							FGS.checkBonuses(appID, undefined, true);
							return;
						}
						
						if(e.message == 'empty')
						{	
							if(oldest > 0)
								params.time = oldest;
						}
						FGS.checkBonuses(appID, params, true);
					}
					else
					{
						if(params.first > 0)
							FGS.options.games[appID].lastBonusTime = params.first;
						
						if(params.items.length > 0)
							FGS.database.addBonus(params.items);
						
						if(!FGS.bonusLoadingProgress[appID].loaded)
							FGS.bonusLoadingProgress[appID].loaded = true;
						
						FGS.saveOptions();
						FGS.setTimeoutOnBonuses(appID);
						FGS.dump(FGS.getCurrentTime()+'[B] Setting up new update in '+FGS.options.checkBonusesTimeout+' seconds');
					}
				}
			},
			error: function(e)
			{
				if(typeof(retry) == 'undefined')
				{
					FGS.checkBonuses(appID, params, true);
				}
				else
				{
					if(params.first > 0)
						FGS.options.games[appID].lastBonusTime = params.first;
					
					if(params.items.length > 0)
						FGS.database.addBonus(params.items);
					
					if(!FGS.bonusLoadingProgress[appID].loaded)
						FGS.bonusLoadingProgress[appID].loaded = true;
					
					FGS.saveOptions();					
					FGS.setTimeoutOnBonuses(appID);					
					FGS.dump(FGS.getCurrentTime()+'[B] Setting up new update in '+FGS.options.checkBonusesTimeout+' seconds');
				}
			}
		});
	},
	
	getCurrentTime: function()
	{
		var d = new Date();
		var h = d.getHours()+"";
		var m = d.getMinutes()+"";
		var s = d.getSeconds()+"";
		if (h.length == 1) h = "0" + h;
		if (m.length == 1) m = "0" + m;
		if (s.length == 1) s = "0" + s;

		return h+':'+m+':'+s;
	},
	
	processPageletOnFacebook: function(dataStr)
	{
		var pos0 = dataStr.indexOf('"content":{"pagelet');
		if(pos0 != -1)
		{
			var pos0 = 0;
			var dataStr2 = '';
			
			while(true)
			{
				var pos0a = dataStr.indexOf('"content":{"pagelet', pos0);
				if(pos0a == -1) break;
				
				var pos0c = dataStr.indexOf('":',  pos0a+10);
				var pos0b = dataStr.indexOf('>"}', pos0a);
				if(pos0b == -1)
				{
					pos0 = pos0a+15;
					continue;
				}
				try
				{
					dataStr2 += JSON.parse(dataStr.slice(pos0a+10, pos0b+3))[dataStr.slice(pos0a+12, pos0c)];
				}
				catch(e)
				{
					pos0 = pos0a+15;
					continue;
				}
				
				pos0 = pos0b;
			}
			
			var dataStr = dataStr2;
		}
		return dataStr;
	},
	
	searchForNeighbors:
	{
		Step1: function(gameID)
		{
			FGS.jQuery.ajax({
				url: 'https://developers.facebook.com/docs/api',
				method: 'GET',
				dataType: 'text',
				success: function(d)
				{
					var pos1 = d.indexOf('?access_token=')+1;
					if(pos1 == 0)
					{
						FGS.sendView('friendsLoaded', gameID, false);
						return;
					}
					var pos2 = d.indexOf('"', pos1);
					
					FGS.searchForNeighbors.Step2(gameID, d.slice(pos1,pos2));
				},
				error: function()
				{
					FGS.sendView('friendsLoaded', gameID, false);
				}
			});
		},
		Step2: function(gameID, access)
		{
			FGS.jQuery.ajax({
				url: 'https://graph.facebook.com/me/friends?'+access,
				method: 'GET',
				dataType: 'text',
				success:function(obj)
				{
					try
					{
						var usersObj = {}
						
						var users = JSON.parse(obj);
						FGS.jQuery(users.data).each(function(k,v)
						{
							usersObj[v.id] = v.name;
						});
						
						FGS.searchForNeighbors.Step3(gameID, usersObj);
					}
					catch(e)
					{
						FGS.sendView('friendsLoaded', gameID, false);
					}
				},
				error: function()
				{
					FGS.sendView('friendsLoaded', gameID, false);
				}
			});
		},
		Step3: function(gameID, users)
		{
			FGS.jQuery.ajax({
				url: 'http://rzadki.eu/projects/fgs/jsonp/friends.php',
				data: {callback: '?', action: 'get', games: gameID, userID: FGS.userID},
				method: 'GET',
				dataType: 'json',
				success:function(obj)
				{
					try
					{
						var usersArr = [];
						
						//var obj = JSON.parse(data);
						
						FGS.jQuery(obj).each(function(k,v)
						{
							if(typeof(users[v]) == 'undefined' && v.toString() != FGS.userID.toString())
							{
								usersArr.push(v);
							}
						});
						FGS.sendView('friendsLoaded', gameID, usersArr);
					}
					catch(e)
					{
						FGS.sendView('friendsLoaded', gameID, false);
					}
				},
				error: function()
				{
					FGS.sendView('friendsLoaded', gameID, false);
				}
			});
		},
	}
};
