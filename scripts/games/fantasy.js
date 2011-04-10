FGS.fantasy.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/fantasykingdoms/FreeGifts'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);

					var url = $('form[target]', dataHTML).attr('action');
					var params2 = $('form[target]', dataHTML).serialize();
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_213518941553', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					params.step1url = url;
					params.step1params = params2;
					
					FGS.fantasy.Freegifts.Click2(params);
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
					var dataHTML = FGS.HTMLParser(dataStr);
					
					var giftName = '';
					
					if(typeof(FGS.giftsArray['213518941553'][params.gift]) != 'undefined')
					{
						giftName = FGS.giftsArray['213518941553'][params.gift].name;
					}
					
					params.step3url = 'http://fantasykingdoms.cloudapp.net/Facebook/SendGifts?v=1.0&storeItemId='+params.gift+'&userId='+$('#UserId', dataHTML).val()+'&giftName='+giftName;
					
					FGS.fantasy.Freegifts.Click3(params);
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
			type: "POST",
			url: params.step3url,
			data: params.step1params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);
					
					
					var tst = new RegExp(/FB[.]Facebook[.]init\("(.*)".*"(.*)"/g).exec(dataStr);
					if(tst == null) throw {message: 'no fb.init'}
					
					var app_key = tst[1];
					var channel_url = tst[2];
					
					var pos0 = dataStr.indexOf('id="kingdomsFriends"');
					var testStr = dataStr.slice(pos0);
					
					var tst = new RegExp(/<fb:serverfbml[^>]*?>[\s\S]*?<script[^>]*?>([\s\S]*?)<\/script>[\s\S]*?<\/fb:serverfbml>/mg).exec(testStr);					
					if(tst == null) throw {message:'no fbml tag'}
					var fbml = tst[1];
					
					var paramsStr = 'app_key='+app_key+'&channel_url='+encodeURIComponent(channel_url)+'&fbml='+encodeURIComponent(fbml);
					
					params.nextParams = paramsStr;
					
					FGS.getFBML(params);
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
	}
};


FGS.fantasy.Requests = 
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
				
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);
					
					var url = $('form[target]:first', dataHTML).attr('action');
					var paramTmp = $('form[target]:first', dataHTML).serialize();
					
					if(!url)
					{
						var src = FGS.findIframeAfterId('#app_content_213518941553', dataStr);
						if (src == '') throw {message:"no iframe"}
						
						url = src;
					}
					
					FGS.fantasy.Requests.Click2(currentType, id, url, paramTmp);
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
	
	Click2:	function(currentType, id, currentURL, params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "POST",
			data: params,
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					if(dataStr.indexOf('Gift Accept Error:') != -1 || dataStr.indexOf('Gift Already Accepted') != -1)
					{
						var error_text = 'This gift was already accepted';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var tst = new RegExp(/<fb:serverfbml[^>]*?>[\s\S]*?<script[^>]*?>([\s\S]*?)<\/script>[\s\S]*?<\/fb:serverfbml>/m).exec(dataStr);
					if(tst != null)
					{
						var dataHTML = FGS.HTMLParser(tst[1]);	
					}
					
					var el = $('#giftbox', dataHTML);
					
					if(el.length > 0)
					{
						info.image = $(el).find('img:first').attr('src');
						info.title = $(el).find('.giftname:first').text();
						info.text  = $(el).find('.textbold:last').text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						for(var gift in FGS.giftsArray['213518941553'])
						{
							if(FGS.giftsArray['213518941553'][gift].name == info.title)
							{
								var tmpStr = tst[1];
								
								var pos1 = tmpStr.indexOf('uid="');
								var pos2 = tmpStr.indexOf('"', pos1+5);
								var giftRecipient = tmpStr.slice(pos1+5,pos2);

								var destName = $('#giftbox', dataHTML).children('div:last').children().children('div:last').text();
								
								info.thanks = 
								{
									gift: gift,
									destInt: giftRecipient,
									destName: destName,
								}
								break;
							}
						}
					
						FGS.endWithSuccess(currentType, id, info);
					}
					else
					{
						throw {message: 'no data'}
					}
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

FGS.fantasy.Bonuses = 
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
				
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);
					
					var url = $('form[target]:first', dataHTML).attr('action');
					var paramTmp = $('form[target]:first', dataHTML).serialize();
					
					if(!url)
					{
						var src = FGS.findIframeAfterId('#app_content_213518941553', dataStr);
						if (src == '') throw {message:"no iframe"}
						
						url = src;
					}
					
					FGS.fantasy.Bonuses.Click2(currentType, id, url, paramTmp);
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
	
	Click2:	function(currentType, id, currentURL, params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "POST",
			data: params,
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					info.image = '';
					info.title = '';
					info.text  = ' ';
					info.time = Math.round(new Date().getTime() / 1000);
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
	},
};