var FGS = {
	alreadyOpened: false,
	
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
		}

		FGS.defaultGameOptions = { enabled: false,	clearOlderID:	0, likeBonus: false, sendbackGift: false, hideFromFeed: false, listOnSearch: false, filter: [], favourites: [], defaultGift: 0, hiddenIcon: false, autoAcceptBonus: false };

		for(var idd in FGS.gamesData)
		{
			FGS.defaultOptions.games[idd] = FGS.defaultGameOptions;
		}

		FGS.post_form_id = '';
		FGS.fb_dtsg = '';
		FGS.charset_test = '';
		FGS.userID				= null;
		FGS.userName			= null;
		FGS.newElements = 0;
		FGS.bonusLoadingProgress = {};
		FGS.xhrQueue = [];
		FGS.xhrWorking = 0;
		FGS.xhrInterval = null;
		FGS.xhrWorkingQueue = {};
		FGS.debugLog = [];
	},
	
	timeoutToNumber: function()
	{
		var num = 50;
		
		switch(parseInt(FGS.options.checkBonusesTimeout))
		{
			case 15:
				num = 3;
				break;
			case 30:
				num = 5;
				break;
			case 60:
				num = 10;
				break;
			case 120:
				num = 20;
				break;
			case 300:
				num = 30;
				break;
			case 600:
				num = 50;
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
					parseStr = '{"abc":"'+parseStr.slice(pos1+8,pos2-2)+'"}';

					var parseStr = JSON.parse(parseStr);
					
					var parseStr = parseStr.abc.replace(/\\u0025/g, '%');
					
					var URI = JSON.parse('"'+parseStr+'"');
					
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
	
	stopBonusesForGame: function(gameID)
	{
		clearInterval(FGS.iBonusTimeout[gameID]);
	},
	
	stopAll: function(wait)
	{
		FGS.sendView('close');
		
		for(var id in FGS.iBonusTimeout)
		{
			FGS.dump(FGS.getCurrentTime()+'[B] Stopping '+id);
			FGS.stopBonusesForGame(id);
		}
		
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
	
	startup: function()
	{
		FGS.jQuery.ajax({
			type: "GET",
			url: 'http://www.facebook.com/help/',
			dataType: 'text',
			timeout: 30000,
			success: function(data2)
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
			var ret = $(url).attr('href');
			
			FGS.dump(ret);
			
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
		var errorsArr = ['gifterror=notfound', 'countrylife/play', 'apps.facebook.com/ravenwoodfair/home', '/cafeworld/?ref=requests', '/cityofwonder/gift/?track=bookmark'];
		
		// tutaj regexp jescze np. http://apps.facebook.com/cafeworld/
		
		var ret = false;
		
		FGS.jQuery(errorsArr).each(function(k,v)
		{
			if(url.indexOf(v) != -1)
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
				nextUrl = $(url).attr('href');
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
				nextUrl = $(url).attr('href');
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
		var resetArr = FGS.xhrQueue;
		FGS.xhrQueue = [];
		
		return resetArr;
	},
	
	checkXhrQueue: function()
	{
		if(FGS.xhrWorking < FGS.options.collectXbonusesAtTheSameTime)
		{
			if(FGS.xhrQueue.length > 0)
			{
				if(FGS.xhrQueue[0].type == 'request')
				{
					FGS.xhrWorkingQueue[FGS.xhrQueue[0].id] = FGS.xhrQueue[0];
					FGS.prepareLinkForGame(FGS.xhrQueue[0].game, FGS.xhrQueue[0].id, FGS.xhrQueue[0].post, false);
					FGS.xhrQueue = FGS.xhrQueue.slice(1);
					FGS.xhrWorking++;
				}
				else if(FGS.xhrQueue[0].type == 'bonus')
				{
					FGS.xhrWorkingQueue[FGS.xhrQueue[0].id] = FGS.xhrQueue[0];
					FGS[FGS.xhrQueue[0].game].Bonuses.Click("bonus", FGS.xhrQueue[0].id, FGS.xhrQueue[0].url);
					FGS.xhrQueue = FGS.xhrQueue.slice(1);
					FGS.xhrWorking++;
				}
			}
		}
	},
	
	
	restartBonuses: function()
	{
		FGS.dump(FGS.getCurrentTime()+'[B] Restarting bonuses');		
		
		for(var id in FGS.iBonusTimeout)
		{
			FGS.dump(FGS.getCurrentTime()+'[B] Stopping '+id);
			FGS.stopBonusesForGame(id);
		}
		
		FGS.iBonusTimeout = {};
		
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
	
	
	startBonusesForGame: function(gameID)
	{
		FGS.checkBonuses(gameID);
		FGS.iBonusTimeout[gameID] = setInterval('FGS.checkBonuses("'+gameID+'");', FGS.options.checkBonusesTimeout*1000);
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
			timeout: 180000,
			success: function(data)
			{
				if(typeof(apps) == 'undefined')
					FGS.checkRequests(true);
				
				if(data.indexOf('"content":{"pagelet_requests":"') != -1)
				{
					var pos1 = data.indexOf('"content":{"pagelet_requests":"')+10;
					var pos2 = data.indexOf('"}});', pos1)+2;				
					var tempD = JSON.parse(data.slice(pos1,pos2));

					data = tempD.pagelet_requests;				
				}
				else if(data.indexOf("content: {pagelet_requests: '") != -1)
				{
					var pos1 = data.indexOf("content: {pagelet_requests: '")+9;
					var pos2 = data.indexOf("'}});", pos1)+2;
					var tempD = JSON.parse(data.slice(pos1,pos2));
					
					data = tempD.pagelet_requests;	
				}
				
				var data = FGS.HTMLParser(data);	

				var $ = FGS.jQuery;
				
				
				var FBdata = $('input[name="params\[app_id\]"]',data).parent('form:first');
				
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
							'charset_test='			+$(el).children('input[name=charset_test]').val() +
							'&id='					+$(el).children('input[name=id]').val() +							
							'&params[from_id]='		+$(el).find('input[name="params\[from_id\]"]').val() +
							'&params[app_id]='		+ APPID +
							'&div_id='		+$(el).children('input[name=div_id]').val()	+
							'&nctr[_mod]=pagelet_requests' +
							'&lsd=' +
							'&actions[accept]=Akceptuj' +
							'&post_form_id_source=AsyncRequest&secondLink=1';
						
						var typeText = '';
					}
					else
					{
						var dataPost = 
							'charset_test='			+$(el).children('input[name=charset_test]').val() +
							'&id='					+$(el).children('input[name=id]').val() +
							'&type='				+$(el).children('input[name=type]').val() +
							'&status_div_id='		+$(el).children('input[name=status_div_id]').val()	+
							'&params[from_id]='		+$(el).find('input[name="params\[from_id\]"]').val() +
							'&params[app_id]='		+ APPID +
							'&params[req_type]='	+$(el).find('input[name="params\[req_type\]"]').val() +
							'&params[is_invite]='	+$(el).find('input[name="params\[is_invite\]"]').val() +
							'&lsd' +
							'&post_form_id_source=AsyncRequest';
							
						var typeText = $(el).find('input[type="submit"]').attr('name');
						
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
						
						dataPost += '&'+escape($(el).find('input[type="submit"]:first').attr('name'))+'='+$(el).find('input[type="submit"]:first').attr('value');
					}

					var elID = $(el).children('input[name=id]').val();

					var testEl = $(el).find('.UIImageBlock_ICON_Content:first');
					
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
					
					if(newText.indexOf('to be neighbors') != -1 || newText.indexOf('join my mafia') != -1 || newText.indexOf('be neighbours in') != -1 || newText.indexOf('be neighbors in') != -1 || newText.indexOf('be my neighbor') != -1 || newText.indexOf('neighbor in YoVille') != -1 || newText.indexOf('my neighbor in') != -1 || newText.indexOf('Come be my friend') != -1 || newText.indexOf('neighbor in') != -1 || newText.indexOf('Come join me in Evony') != -1 || newText.indexOf('as my new neighbor') != -1)
					{
						var type =  $(el).find('.UIImageBlock_SMALL_Image').find('img').attr('src');				
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
					var bTitle = $(el).find('.UIImageBlock_SMALL_Content').find('a:first').text().replace(/'/gi, '');		
					
					var fromUser = $(el).find('input[name="params\[from_id\]"]').val();
					
					if(fromUser != undefined)
					{
						var stats = [fromUser, APPID, curTime];
					}
					else
					{
						var stats = [];
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
	
	checkBonuses: function(appID)
	{
		
		var $ = jQuery = FGS.jQuery;
		
		if(typeof(FGS.bonusLoadingProgress[appID]) == 'undefined')
		{
			FGS.bonusLoadingProgress[appID] =
				{
					loaded: false
				};
		}

		if(FGS.bonusLoadingProgress[appID].loaded == false)
		{
			var number = 300;
		}
		else
		{
			var number = FGS.timeoutToNumber();
		}
		
		var downAppID = appID;
		
		
		FGS.dump(FGS.getCurrentTime()+'[B] Starting. Checking for '+number+' bonuses for game '+appID);
		
		$.ajax({
			type: "GET",
			url: 'http://www.facebook.com/ajax/apps/app_stories.php',
			data: '__a=1&is_game=1&app_ids='+downAppID+'&max_stories='+number+'&user_action=1',		
			dataType: 'text',
			timeout: 180000,
			success: function(data)
			{
				try
				{
					var str = data.substring(9);
					var error = parseInt(JSON.parse(str).error);

					if(error == 1357001)
					{
						FGS.dump(FGS.getCurrentTime()+'[B] Error: logged out');
						FGS.stopAll();
						return true;
					}
					else if(error == 1357010)
					{
						throw {message: FGS.getCurrentTime()+'[B] Facebook error'};			
					}

					var data = JSON.parse(str).onload.toString();

					var i0 = data.indexOf('"#app_stories"');
					var pos1 = data.indexOf('HTML("', i0)+6;
					var pos2 = data.indexOf('"))',pos1);
					
					var data = data.slice(pos1,pos2);
					
					var tmpData = JSON.parse('{"html": "'+data+'"}');
					
					if(tmpData.html == "")
					{
						throw {message: FGS.getCurrentTime()+'[B] No new bonuses. Skipping'};
					}

					var elIDNext = 	FGS.options.games[appID].clearOlderID;
					
					var count = 0;
					
					var htmlData = FGS.HTMLParser(tmpData.html);
					
					var now = new Date().getTime();
					
					
					// brak zdarzen
					if(tmpData.html.indexOf('uiBoxLightblue') != -1)
					{
						FGS.sendView('hiddenFeed', appID);
					}
					
					var bonusArr = [];

					
					$('li.uiStreamStory', htmlData).each(function()
					{
						var el = $(this);

						var data = $(this).find('input[name="feedback_params"]').val();
						
						var bonusData = JSON.parse(data);
						
						var bonusTimeTmp = new Date($(el).find('abbr').attr('data-date')).getTime();					
						var bonusTime = Math.round(bonusTimeTmp / 1000);
						
						var diff = now-bonusTimeTmp;
						var secs = Math.floor(diff.valueOf()/1000);
						
						var elID = bonusData.target_fbid;
						var actr = bonusData.actor;
						
						
						var targets = bonusData.target_profile_id;
						
						if(actr != targets)
						{
							if(FGS.userID != targets)
							{
								FGS.dump('Rozne id: '+actr+' i '+targets+' userid: '+FGS.userID);
								return;
							}
						}
						
						if(secs > FGS.options.deleteOlderThan && FGS.options.deleteOlderThan != 0)
						{
							FGS.dump(secs);
							FGS.dump('starszy niz: ' +FGS.options.deleteOlderThan + ' sekund');
							return false;
						}
						
						if(elID.toString() == FGS.options.games[appID].clearOlderID.toString())
						{
							return false;
						}
						
						if(count == 0)
						{
							count = 1;
							elIDNext = elID;
						}
						
						if(actr == FGS.userID)	
						{
							FGS.dump('Wlasny bonus');
							return;
						}
						
						
						var ret = false;
						
						var bTitle = jQuery.trim($(el).find('.UIActionLinks_bottom > a:last').text().replace(/'/gi, ''));

						
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

						var feedback = $(el).find('input[name="feedback_params"]').val();
						var link_data = $(el).attr('data-ft');			

						//sprawdzanie filtrow usera
						var ret = false;
						$(FGS.options.games[appID].filter).each(function(k,v)
						{
							var re = new RegExp(v, "i") ;
							
							if(re.test(bTitle))
							{
								FGS.dump('Filtering: '+bTitle);
								ret = true;
								return false;
							}
						});
						if(ret) return;
						//koniec filtry usera
						
						var link = $(el).find('.UIActionLinks_bottom > a:last').attr('href');
						
						var bonus = [elID, appID, bTitle, $(el).find('.uiAttachmentTitle').text(), $(el).find('.uiStreamAttachments').find('img').attr('src'), link, bonusTime, feedback, link_data];

						bonusArr.push(bonus);
					});

					if(bonusArr.length > 0)
					{
						FGS.database.addBonus(bonusArr);
					}
					
					FGS.options.games[appID].clearOlderID = elIDNext;
					FGS.saveOptions();
					
					
					if(!FGS.bonusLoadingProgress[appID].loaded)
					{
						FGS.bonusLoadingProgress[appID].loaded = true;
					}
					FGS.dump(FGS.getCurrentTime()+'[B] Setting up new update in '+FGS.options.checkBonusesTimeout+' seconds');
				}
				catch(e)
				{
					FGS.dump(e.message);
				}
			},
			error: function(e)
			{
				FGS.dump(FGS.getCurrentTime()+'[B] There was a connection error. Setting up new update in 10 seconds');
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
	
	loginStatusChanged: function(bool)
	{
		FGS.dump(FGS.getCurrentTime()+'[L] Received new login status. Checking if I have to start or stop updates.');
		
		if(bool == true)
		{
			if(FGS.userID == null)
			{
				FGS.FBloginError = null;
				FGS.updateIcon();				
				FGS.startup();
			}
		}
		else
		{
			FGS.stopAll();
		}
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
