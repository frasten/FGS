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
						
						$('form', dataHTML).each(function()
						{
							var tmpStr = unescape($(this).attr('action'));
							
							if(tmpStr.indexOf('item_id') != -1)
							{
								var giftRecipient = $('img[uid]', dataHTML).attr('uid');
								
								var pos1 = tmpStr.indexOf('&item_id=');
								var pos2 = tmpStr.indexOf('&', pos1+1);
								
								var giftName = tmpStr.slice(pos1+9,pos2);

								sendInfo = {
									gift: giftName,
									destInt: giftRecipient,
									destName: $('img[uid]', dataHTML).attr('title')
								}							
								return false;
							}
						});
						
						//info.thanks = sendInfo;					
						
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