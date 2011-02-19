FGS.bakinglife.Freegifts =
{
	Click: function(params, retry)
	{
		params.bakinglifeUrl = 'http://apps.facebook.com/bakinglife/sendGift.php?gift='+params.gift+'&fb_force_mode=fbml&friends=app';
		
		FGS.getFBML(params);
	},
};

FGS.bakinglife.Requests = 
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
					var src = FGS.findIframeAfterId('#app_content_338051018849', dataStr);
					if (src == '') throw {message:"no iframe"}
					
					FGS.bakinglife.Requests.Click2(currentType, id, src);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
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
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	Click2: function(currentType, id, currentURL, retry)
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

				try
				{
					if(dataStr.indexOf('Make sure you click on the request within one week') != -1)
					{
						var error_text = 'Make sure you click on the request within one week.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if($('.gift', dataHTML).length > 0)
					{
						var sendInfo = '';
						
						var tmpStr = unescape(currentURL);
						
						var pos1 = tmpStr.indexOf('?gift=');
						if(pos1 == -1)
						{
							pos1 = tmpStr.indexOf('&gift=');
						}
						if(pos1 != -1)
						{
							var pos2 = tmpStr.indexOf('&', pos1+1);
							
							var giftName = tmpStr.slice(pos1+6,pos2);
							
							var pos1 = tmpStr.indexOf('&senderID=');
							var pos2 = tmpStr.indexOf('&', pos1+1);
							
							var giftRecipient = tmpStr.slice(pos1+10,pos2);			
								
							sendInfo = {
								gift: giftName,
								destInt: giftRecipient,
								destName: $(".friendContainer2",dataHTML).find('b:first').text()
								}
						}
						
						info.thanks = sendInfo;
						
						
						info.image = $(".gift",dataHTML).children('img').attr("src");
						info.title = $(".gift",dataHTML).children('img').attr("alt");
						info.text  = $(".friendContainer2",dataHTML).find('b:first').text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
					}
					else if($('td.boxPadding', dataHTML).find('h1').length > 0)
					{
						info.image = $('td.boxPadding', dataHTML).find('img:first').attr('src');
						
						if($('td.boxPadding', dataHTML).find('.bigGreen').length > 0)
						{
							info.title = $('td.boxPadding', dataHTML).find('.bigGreen').text();
						}
						else
						{
							info.title = $('td.boxPadding', dataHTML).find('h1:first').text();
						}
						info.text  = $.trim($('td.boxPadding', dataHTML).find('p:first').text());
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
					}
					else
					{
						throw {message: dataStr}
					}
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
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
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	}
};

FGS.bakinglife.Bonuses = 
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
								
				try 
				{
					var src = FGS.findIframeAfterId('#app_content_338051018849', dataStr);
					if (src == '') throw {message:"no iframe"}
					FGS.bakinglife.Bonuses.Click2(currentType, id, src);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
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
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	Click2:	function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var out = $.trim($('td.boxPadding', dataHTML).find('p:first').text());
					var out2 = $.trim($('td.boxPadding', dataHTML).find('h1:first').text());
					
					if(out.indexOf('already received') != -1 || out.indexOf('Make sure you click on the story within') != -1 || out2.indexOf('Bad News!') != -1 || out2.indexOf('Oops!') != -1)
					{
						var error_text = out;
						FGS.endWithError('limit', currentType, id, error_text);						
						return;
					}
					
					info.image = $('td.boxPadding', dataHTML).find('img:first').attr('src');
					
					if($('td.boxPadding', dataHTML).find('.bigGreen').length > 0)
					{
						info.title = $('td.boxPadding', dataHTML).find('.bigGreen').text();
					}
					else
					{
						info.title = $('td.boxPadding', dataHTML).find('h1:first').text();
					}
					info.text  = $.trim(out);
					info.time = Math.round(new Date().getTime() / 1000);
					
					FGS.endWithSuccess(currentType, id, info);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
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
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
}