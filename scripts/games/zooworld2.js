FGS.zooworld2.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		if(!params.zooAppId	)
		{
			params.zooAppname = 'zooparent';
			params.zooAppId	  = '74';
			params.checkID = '167746316127';
			params.gameName = 'playzoo';
		}

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/playzoo/zoo/landingZoo2.php'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{

				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
					
				try
				{
					params.click2param = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();

					FGS.zooworld2.Freegifts.Click2(params);
				
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
			url: 'http://zoo2-dev.rockyou.com/facebook_apps/zoo2/classes/Gifts/Zoo2GiftService.php',
			dataType: 'text',
			data: params.click2param+'&selectedGiftId='+params.gift,
			success: function(dataStr)
			{
				try
				{
					var app_key = params.gameID.slice(0,-1);
					//var channel = 'http://zoo2-dev.rockyou.com/channel.html';
					
					var channel_url = './channel.html';

					var tst = new RegExp(/(<fb:fbml[^>]*?[\s\S]*?<\/fb:fbml>)/mg).exec(dataStr);					
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

FGS.zooworld2.Requests = 
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
					if(dataStr.indexOf('<h3>Cannot accept gift.') != -1)
					{
						var error_text = 'This gift is too old.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					if(dataStr.indexOf('<h3>This promotion is over.') != -1)
					{
						var error_text = 'This promotion is over.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}					
					
					if($('#app_content_2405948328', dataHTML).length > 0)
					{
						var testStr = $('#app_content_2405948328', dataHTML).find('h1:first').text();
					}
					else if($('#app_content_2345673396', dataHTML).length > 0)
					{
						var testStr = $('#app_content_2345673396', dataHTML).find('h1:first').text();
					}
					else if($('#app_content_2339854854', dataHTML).length > 0)
					{
						var testStr = $('#app_content_2339854854', dataHTML).find('h1:first').text();
					}
					else if($('#app_content_14852940614', dataHTML).length > 0)
					{
						var testStr = $('#app_content_14852940614', dataHTML).find('h1:first').text();
					}
					else
					{
						var testStr = $('#app_content_167746316127', dataHTML).find('h1:first').text();
					}
					
					if(testStr.indexOf('You are now ZooMates') != -1)
					{
						info.image = $('.zoomaccept5-box', dataHTML).find('img:first').attr('longdesc');
						info.title = 'New neighbour';
						info.text  = $('.zoomaccept5-box', dataHTML).find('img:first').attr('title');
						info.time = Math.round(new Date().getTime() / 1000);
					}
					else
					{
					
						var sendInfo = '';
						
						
						var tmpStr = unescape(currentURL);
						
						var pos1 = tmpStr.indexOf('?itemId=');
						if(pos1 == -1)
						{
							pos1 = tmpStr.indexOf('&itemId=');
						}
						if(pos1 != -1)
						{
							var pos2 = tmpStr.indexOf('&', pos1+1);
							
							var giftName = tmpStr.slice(pos1+8,pos2);
							
							var pos1 = tmpStr.indexOf('&giftSenderId=');
							var pos2 = tmpStr.indexOf('&', pos1+1);
							
							var giftRecipient = tmpStr.slice(pos1+14,pos2);			
								
							sendInfo = {
								gift: giftName,
								destInt: giftRecipient,
								destName: $('img[uid]', dataHTML).attr('title')
								}
						}
						
						var pos1 = tmpStr.indexOf('?giftId=');
						if(pos1 == -1)
						{
							pos1 = tmpStr.indexOf('&giftId=');
						}
						if(pos1 != -1)
						{
							var pos2 = tmpStr.indexOf('&', pos1+1);
							
							var giftName = tmpStr.slice(pos1+8,pos2);
							
							var pos1 = tmpStr.indexOf('&senderId=');
							var pos2 = tmpStr.indexOf('&', pos1+1);
							
							var giftRecipient = tmpStr.slice(pos1+10,pos2);			
								
							sendInfo = {
								gift: giftName,
								destInt: giftRecipient,
								destName: $('img[uid]', dataHTML).attr('title')
								}
						}
						
						info.thanks = sendInfo;				
					
					
						info.image = $('.main_body', dataHTML).find('img:first').attr('longdesc');
						info.title = $('.main_body', dataHTML).find('p:first').text();
						info.text  = $('.main_body', dataHTML).find('p:last').text();
						info.time = Math.round(new Date().getTime() / 1000);
					}
					
					FGS.endWithSuccess(currentType, id, info);
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
};


FGS.zooworld2.Bonuses = 
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
						if($('#app_content_167746316127', dataHTML).length > 0)
						{
							var src = FGS.findIframeAfterId('#app_content_167746316127', dataStr);
						}
						else
						{
							throw {message: 'not zoo?'}
						}
						url = src;
					}

					if (url == '') throw {message:"no iframe"}
					
					FGS.zooworld2.Bonuses.Click2(currentType, id, url, params);
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
					var pos1 = 0;
					var pos2 = currentURL.lastIndexOf('/')+1;
					var domain = currentURL.slice(pos1,pos2);
					
					var i0 = dataStr.indexOf('feedLanding_iframe.php');
					if(i0 == -1) throw {}
					var i1 = dataStr.indexOf('"', i0);
					
					
					var nextUrl = domain+dataStr.slice(i0,i1);
					
					FGS.zooworld2.Bonuses.Click3(currentType, id, nextUrl);
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
	
	Click3:	function(currentType, id, currentURL, retry)
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
					var dataHTML = FGS.HTMLParser(dataStr);
					
					if(dataStr.indexOf('You have already claimed this reward') != -1)
					{
						var error_text = 'You have already claimed this reward';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var el = $('#zw2_feed_landing_content', dataHTML);
					
					info.title = $.trim(el.children('li:first').text());
					info.text = $('#zw2_feed_landing_unsuccessful', dataHTML).text();
					info.image = $('#zw2_feed_landing_item_image', dataHTML).attr('longdesc');					
					info.time = Math.round(new Date().getTime() / 1000);
					
					FGS.endWithSuccess(currentType, id, info);
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
};