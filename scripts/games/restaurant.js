FGS.restaurant.Requests = 
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
					if(dataStr.indexOf('have already accepted this gift or it has expired') != -1)
					{
						var error_text = 'You have already accepted this gift or it has expired.';					
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('Sorry, the gift request from') != -1)
					{
						var error_text = 'You have already accepted this gift or it has expired.';					
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					
					
					var tempText = $('#app43016202276_gift_text', dataHTML).text();
					
					if(!tempText || tempText == '')
					{
						tempText = $('#app43016202276_request_text', dataHTML).text();
					}
					
					info.text = tempText;
					
					var pos1 =  tempText.indexOf('You have accepted ');
					var pos11 = tempText.indexOf('You have sent ');
					if(pos1 != -1)
					{
						var pos2 = tempText.indexOf('from', pos1);
						if(pos2 != -1)
						{
							info.title = tempText.slice(pos1+18,pos2);
						}
						else
						{
							info.title = tempText;
						}
					}
					else if(pos11 != -1)
					{
						var pos2 = tempText.indexOf('to ', pos11);
						if(pos2 != -1)
						{
							info.title = tempText.slice(pos11+14,pos2);
						}
						else
						{
							info.title = tempText;
						}
					}
					else
					{
						info.title = tempText;
					}
					
					if($('#app43016202276_gift_img', dataHTML).length > 0)
						info.image = $('#app43016202276_gift_img', dataHTML).children('img').attr('longdesc');
					else
						info.image = $('#app43016202276_request_img', dataHTML).children('img').attr('longdesc');
					
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
	}
};