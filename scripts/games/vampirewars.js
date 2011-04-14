FGS.vampirewars.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/vampiresgame/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var pos0 = dataStr.indexOf('"content":{"pagelet_canvas_content":');
					if(pos0 != -1)
					{
						var pos1 = dataStr.indexOf('>"}', pos0);
						var dataStr = JSON.parse(dataStr.slice(pos0+10, pos1+3)).pagelet_canvas_content;
					}
					var dataHTML = FGS.HTMLParser(dataStr);

					params.step1url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					params.step1params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					FGS.vampirewars.Freegifts.Click2(params);
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
	
	Login:	function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: params.loginUrl,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var pos0 = dataStr.indexOf('"content":{"pagelet_canvas_content":');
					if(pos0 != -1)
					{
						var pos1 = dataStr.indexOf('>"}', pos0);
						var dataStr = JSON.parse(dataStr.slice(pos0+10, pos1+3)).pagelet_canvas_content;
					}
					
					var dataHTML = FGS.HTMLParser(dataStr);

					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var paramTmp = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						var url = FGS.findIframeAfterId('#app_content_25287267406', dataStr);
						if(url == '') throw {message: 'no iframe'}
						var pos1 = url.lastIndexOf('/')+2;
						params.step2params = url.slice(pos1);
					}
					else
					{
						params.step2params = paramTmp;
					}
					
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = url.match(re)[1].toString();
					var pos1 = url.lastIndexOf('?')+1;
					params.step3param = 'send_gifts_mfs.php?ajax=1&noredirect=1&giftId='+params.gift+'&mfsID=5source=normal&'+url.slice(pos1);
					
					
					FGS.vampirewars.Freegifts.Click3(params);
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
			url: params.step1url,
			data: params.step1params+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var pos1 = dataStr.indexOf('top.location.href = "');
					if(pos1 != -1)
					{
						var pos2 = dataStr.indexOf('"', pos1+28);
						params.loginUrl = dataStr.slice(pos1+21, pos2);
						FGS.vampirewars.Freegifts.Login(params);
						return;
					}
					throw {message: dataStr}
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
			url: 'http://'+params.domain+'/'+params.step3param,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var tst = new RegExp(/(<fb:fbml[^>]*?[\s\S]*?<\/fb:fbml>)/m).exec(dataStr);
					if(tst == null) throw {message:'no fbml tag'}
					var fbml = tst[1];
					
					var app_key = '25287267406';
					var channel_url = 'http://static.ak.fbcdn.net/connect/xd_proxy.php';
					
	
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
	},
};

FGS.vampirewars.Requests = 
{
	Click:	function(currentType, id, currentURL, retry)
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
				
				try
				{
					var pos1 = dataStr.indexOf('top.location.href = "');
					if(pos1 != -1)
					{
						var pos2 = dataStr.indexOf('"', pos1+28);
						var url = dataStr.slice(pos1+21, pos2);
						FGS.vampirewars.Requests.Login(currentType, id, url);
						return;
					}
					throw {message: dataStr}
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
	
	Login:	function(currentType, id, currentURL, retry)
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
				var redirectUrl = FGS.checkForLocationReload(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				if(typeof(retry) == 'undefined')
				{
					retry = 0;
				}
				
				if(redirectUrl != false)
				{
					if(typeof(retry) == 'undefined' || retry < 4)
					{
						retryThis(currentType, id, redirectUrl, retry++);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
					return;
				}
				
				try
				{
					
					var pos0 = dataStr.indexOf('"content":{"pagelet_canvas_content":');
					if(pos0 != -1)
					{
						var pos1 = dataStr.indexOf('>"}', pos0);
						var dataStr = JSON.parse(dataStr.slice(pos0+10, pos1+3)).pagelet_canvas_content;
						var dataHTML = FGS.HTMLParser(dataStr);
					}
					
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						var src = FGS.findIframeAfterId('#app_content_25287267406', dataStr);
						if (src == '') throw {message:"no iframe"}
						url = src;
					}
					
					FGS.vampirewars.Requests.Click4(currentType, id, url, params);
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
	
	Click4:	function(currentType, id, currentURL, params, retry)
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
					var redirectUrl = FGS.checkForLocationReload(dataStr);
					
					if(redirectUrl != false)
					{
						if(typeof(retry) == 'undefined')
						{
							FGS.vampirewars.Requests.Login(currentType, id, redirectUrl, true);
						}
						else
						{
							FGS.endWithError('receiving', currentType, id);
						}
						return;
					}
					
					var pos1 = dataStr.indexOf('top.location.href = "');
					if(pos1 != -1)
					{
						var pos2 = dataStr.indexOf('"', pos1+28);
						var url = dataStr.slice(pos1+21, pos2);
						FGS.vampirewars.Requests.Login(currentType, id, url);
						return;
					}
					
					var pos0 = dataStr.indexOf('"content":{"pagelet_canvas_content":');
					
					if(pos0 != -1)
					{
						var pos1 = dataStr.indexOf('>"}', pos0);
						
						var dataStr = JSON.parse(dataStr.slice(pos0+10, pos1+3)).pagelet_canvas_content;
						var dataHTML = FGS.HTMLParser(dataStr);		
						
						var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
						var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
						
						retryThis(currentType, id, url, params, retry);						
						return;
					}
					
					
					
					
					if($('div.title', dataHTML).text().indexOf('You must accept gifts within') != -1)
					{
						var error_text = $.trim($('div.title', dataHTML).text());
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if($('div.title', dataHTML).text().indexOf('You have already accepted this gift') != -1)
					{
						var error_text = $.trim($('div.title', dataHTML).text());
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					
					info.image = $('img:first', dataHTML).attr('src');
					info.title = $('img:first', dataHTML).attr('title');
					info.text = $('div.senderPic', dataHTML).parent().find('p').text();
					
					
					var sendInfo = '';
					
					var tmpStr = unescape(currentURL);
					
					var pos1 = tmpStr.indexOf('&iid=');
					if(pos1 != -1)
					{
						var pos2 = tmpStr.indexOf('&', pos1+1);
							
						var giftName = tmpStr.slice(pos1+5,pos2);
						
						var pos1 = tmpStr.indexOf('senderId=');
						var pos2 = tmpStr.indexOf('&', pos1+1);
						
						var giftRecipient = tmpStr.slice(pos1+9,pos2);						
							
						sendInfo = {
							gift: giftName,
							destInt: giftRecipient,
							destName: $('div.senderPic', dataHTML).parent().find('p').text(),
							}
					}
					info.thanks = sendInfo;
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