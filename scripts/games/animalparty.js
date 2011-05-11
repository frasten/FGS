FGS.animalparty.Requests = 
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
						var paramTmp = FGS.findIframeAfterId('#app_content_112775362105084', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.animalparty.Requests.Click2(currentType, id, url, params);
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
					
					if(dataStr.indexOf('You have already claimed this reward') != -1)
					{
						var error_text = 'You have already claimed this reward!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('All rewards here have already been claimed') != -1)
					{
						var error_text = 'All rewards here have already been claimed.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var dataHTML = FGS.HTMLParser('<html><body>'+dataStr+'</body></html>');
					
					if($('.accept_gift_mid', dataHTML).length > 0)
					{
						info.title = $.trim($('.gift_name', dataHTML).text());
						
						info.image = $('.gift_image', dataHTML).children('img:first').attr('src');
						info.time  = Math.round(new Date().getTime() / 1000);
						
						if(dataStr.indexOf('has been sent to') != -1)
							info.text  = 'sent to: ' + $.trim($('.person_name_container', dataHTML).text());
						else
							info.text  = $.trim($('.person_name_container', dataHTML).text());
						
						
						FGS.endWithSuccess(currentType, id, info);
					}
					else if($('.accept_gift_mid', dataHTML).length == 0 && $('.person_image_bg', dataHTML).length > 0)
					{
						info.title = $.trim($('.person_name_container', dataHTML).text());
						
						info.image = $('.person_image_bg', dataHTML).children('img:first').attr('src');
						info.time  = Math.round(new Date().getTime() / 1000);
						
						info.text  = 'New neighbor';
						
						
						FGS.endWithSuccess(currentType, id, info);
					}
					else
					{
						throw {message: dataStr}
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
	}
};

FGS.animalparty.Bonuses = 
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
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_112775362105084', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.animalparty.Bonuses.Click2(currentType, id, url, params);
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
					if(dataStr.indexOf('You have already claimed this reward') != -1)
					{
						var error_text = 'You have already claimed this reward!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('already help this person out today') != -1)
					{
						var error_text = 'You have already help this person out today!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('All rewards here have already been claimed') != -1)
					{
						var error_text = 'All rewards here have already been claimed.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var dataHTML = FGS.HTMLParser('<html><body>'+dataStr+'</body></html>');
					
					if($('.gift_name', dataHTML).length > 0)
					{
						info.title = $.trim($('.gift_name', dataHTML).text());
						
						info.image = $('.gift_image', dataHTML).children('img:first').attr('src');
						info.time  = Math.round(new Date().getTime() / 1000);
						
						if(dataStr.indexOf('has been sent to') != -1)
							info.text  = 'sent to: ' + $.trim($('.person_name_container', dataHTML).text());
						else
							info.text  = $.trim($('.person_name_container', dataHTML).text());
						
						
						FGS.endWithSuccess(currentType, id, info);
					}
					else
					{
						throw {message: 'no form'}
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
	}
};