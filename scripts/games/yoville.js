FGS.yovilleFreegifts = 
{
	Click: function(params, retry)
	{
		params.customUrl = 'http://apps.facebook.com/yoville/send_gift.php?view=yoville&fb_force_mode=fbml&id='+params.gift;
		FGS.getFBML(params);
	}
};


FGS.yovilleRequests = 
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
					if(dataStr.indexOf('seem to have already accepted this request') != -1)
					{
						var error_text = 'Sorry, you seem to have already accepted this request from the Message Center';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('You are neighbors now') != -1)
					{
						info.image = '';
						info.title = '';
						info.text  = 'New neighbour';
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					else if($('#app21526880407_main-gift-body', dataHTML).find('div > b').length > 0)
					{
						var sendInfo = '';
						
						var tmpStr = unescape(currentURL);
						
						if(tmpStr.indexOf('iid') != -1)
						{
							var giftRecipient = FGS.Gup('sid', currentURL);
							var giftName = FGS.Gup('iid', currentURL);

							sendInfo = {
								gift: giftName,
								destInt: giftRecipient,
								destName: $('#app21526880407_main-gift-body', dataHTML).find('div > b').text()
							}
						}
						
						info.thanks = sendInfo;				
						
						info.image = $('#app21526880407_main-gift-body', dataHTML).find('div > img').attr("src");
						info.title = $('#app21526880407_main-gift-body', dataHTML).find('div > h2').text();
						info.text  = $('#app21526880407_main-gift-body', dataHTML).find('div > b').text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
						return;
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