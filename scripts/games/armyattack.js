FGS.armyattack.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/armyattack/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params2 = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();

					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_129547877091100', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					params.step1url = url;
					params.step1params = params2;
					
					FGS.armyattack.Freegifts.Click2(params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
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
					retryThis(params, true);
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
	
	Click2: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "POST",
			url: params.step1url+addAntiBot,
			data: params.step1params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var tst = new RegExp(/crm_sig: "(.*)"/).exec(dataStr);
					if(tst == null) throw {message:'no cc_fbuid tag'}
					
					params.crm_sig = tst[1];
					
					// unique tracking id
					var date = new Date();
					var time = "" + date.getTime();
					var utid = time.substring(time.length-5, time.length);
					for(var i = 0; i < 11; i++) {
						utid +=  Math.ceil(9*Math.random());
					}
					
					params.utid = utid;
					
					
					FGS.armyattack.Freegifts.Click3(params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
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
					retryThis(params, true);
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
	
	Click3: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: params.step1url+'send_gift',
			data: 'gid='+params.gift+'&uid='+FGS.userID+'&sender='+FGS.userID+'&sig='+params.crm_sig+'&ref=&src=vir_gift_sent&recipient=-1&utid='+params.utid,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{	
					var reqData = {};

					reqData.data = 'GIFT,vir_gift_sent,'+params.utid;
					
					var tst = new RegExp(/message: "(.*)"/).exec(dataStr);
					if(tst == null) throw {message:'no message tag'}
					reqData.message = tst[1];
					
					params.reqData = reqData;
					
					FGS.armyattack.Freegifts.ClickRequest(params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
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
					retryThis(params, true);
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
	
	ClickRequest: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		params.channel = 'http://armyattack.digitalchocolate.com/Army_server/channel.html';
		
		FGS.getAppAccessTokenForSending(params, function(params, d)
		{
			var pos0 = d.indexOf('&result=')+8;
			var pos1 = d.indexOf('"', pos0);
			
			var str = d.slice(pos0, pos1);
			var arr = JSON.parse(decodeURIComponent(JSON.parse('{"abc": "'+str+'"}').abc)).request_ids;
			
			var str = arr.join(',');
			
			$.get('http://armyattack.digitalchocolate.com/Army_server/GiftSentCallback?gid='+params.gift+'&sender='+FGS.userID+'&request_ids='+str+'&src=vir_gift_sent&utid='+params.utid);		
		
		});
	},
};

FGS.armyattack.Requests = 
{	
	Click: function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				var redirectUrl = FGS.checkForLocationReload(dataStr);
				
				if(redirectUrl != false)
				{
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, redirectUrl, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
					return;
				}
				
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_174582889219848', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.armyattack.Requests.Click2(currentType, id, url, params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, true);
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
					retryThis(currentType, id, currentURL, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	
	Click2: function(currentType, id, currentURL, params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var info = {}
		
		$.ajax({
			type: "POST",
			url: currentURL,
			data: params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);

					if(dataStr.indexOf('"ERROR_1",') != -1)
					{
						var channel = 'http://armyattack.digitalchocolate.com/Army_server/custom_channel.html';
						var gameID = '174582889219848';
						
						FGS.getAccessToken('api_key='+gameID+'&app_id='+gameID+'&channel='+encodeURIComponent(channel), id, function(id, data) {
							FGS.jQuery.get('https://graph.facebook.com/'+id, FGS.jQuery.param(data)+'&method=delete');
						});
						FGS.endWithError('not found', currentType, id);
						return;
					}
					
					if(dataStr.indexOf('Oops! Something went wrong...') != -1)
					{
						var error_text = 'This has expired or have been already claimed!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('Seems like you have done this action already') != -1)
					{
						var error_text = 'Stream reward already collected!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf("find the request you clicked! No worries though") != -1)
					{
						var error_text = 'Stream reward already collected!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var pos0 = dataStr.indexOf('var flashvars');
					if(pos0 == -1) throw {message: 'no flashvars'}
					
					if(dataStr.indexOf('"Allied with') != -1)
					{
						
						var pos1 = dataStr.indexOf('description1:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var title = dataStr.slice(pos1+1, pos1b);
						
						
						var from = 'New neighbor';
						
						var pos1 = dataStr.indexOf('image1:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var image = dataStr.slice(pos1+1, pos1b);
					}
					else
					{
						var pos1 = dataStr.indexOf('description1:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var title = dataStr.slice(pos1+1, pos1b);
						
						var pos1 = dataStr.indexOf('description2:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var from = dataStr.slice(pos1+1, pos1b);
						
						var pos1 = dataStr.indexOf('image1:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var image = dataStr.slice(pos1+1, pos1b);
					}
					
					info.title = title;

					for(var gift in FGS.giftsArray['174582889219848'])
					{
						if(FGS.giftsArray['174582889219848'][gift].name == info.title)
						{
							info.thanks = 
							{
								gift: gift
							}
							break;
						}
					}
					
					info.image = image;
					info.time  = Math.round(new Date().getTime() / 1000);
					info.text  = from;
						
						
					FGS.endWithSuccess(currentType, id, info);

					
					var channel = 'http://armyattack.digitalchocolate.com/Army_server/custom_channel.html';
					var gameID = '174582889219848';
					
					FGS.getAccessToken('api_key='+gameID+'&app_id='+gameID+'&channel='+encodeURIComponent(channel), id, function(id, data) {
						FGS.jQuery.get('https://graph.facebook.com/'+id, FGS.jQuery.param(data)+'&method=delete');
					});
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, params, true);
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
					retryThis(currentType, id, currentURL, params, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	
};

FGS.armyattack.Bonuses = 
{	
	Click: function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				var redirectUrl = FGS.checkForLocationReload(dataStr);
				
				if(redirectUrl != false)
				{
					if(FGS.checkForNotFound(redirectUrl) === true)
					{
						FGS.endWithError('not found', currentType, id);
					}
					else if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, redirectUrl, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
					return;
				}
				
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
					
				try 
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_174582889219848', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.armyattack.Bonuses.Click2(currentType, id, url, params);
				} 
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, true);
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
					retryThis(currentType, id, currentURL, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	Click2: function(currentType, id, currentURL, params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var info = {}
		
		$.ajax({
			type: "POST",
			url: currentURL,
			data: params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);
					
					if(dataStr.indexOf('seems like the feed you clicked is expired') != -1)
					{
						var error_text = 'Stream reward already collected!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('rewards have run out') != -1 || dataStr.indexOf('just bit too late and the rewards have ran') != -1)
					{
						var error_text = 'Stream reward already collected!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('Seems like you have already clicked this feed') != -1)
					{
						var error_text = 'Stream post has been expired!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('Seems like you have done this action already') != -1)
					{
						var error_text = 'Stream reward already collected!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf("find the request you clicked! No worries though") != -1)
					{
						var error_text = 'Stream reward already collected!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}

					
					
					
					
					var pos0 = dataStr.indexOf('var flashvars');
					if(pos0 == -1) throw {message: 'no flashvars'}
					
					var pos1 = dataStr.indexOf('title:', pos0);
					if(pos1 == -1) throw {message: 'no flashvars'}
					var pos1 = dataStr.indexOf('"', pos1);
					var pos1b = dataStr.indexOf('"', pos1+1);
					var title = dataStr.slice(pos1+1, pos1b);
					
					var pos1 = dataStr.indexOf('description1:', pos0);
					if(pos1 == -1) throw {message: 'no flashvars'}
					var pos1 = dataStr.indexOf('"', pos1);
					var pos1b = dataStr.indexOf('"', pos1+1);
					var text = dataStr.slice(pos1+1, pos1b);
						
					var pos1 = dataStr.indexOf('image1:', pos0);
					if(pos1 == -1) throw {message: 'no flashvars'}
					var pos1 = dataStr.indexOf('"', pos1);
					var pos1b = dataStr.indexOf('"', pos1+1);
					var image = dataStr.slice(pos1+1, pos1b);
					
					info.title = title;	
					info.image = image;
					info.time  = Math.round(new Date().getTime() / 1000);
					info.text  = text;
						
						
					FGS.endWithSuccess(currentType, id, info);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, params, true);
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
					retryThis(currentType, id, currentURL, params, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	}
};