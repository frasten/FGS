FGS.evony.Requests = 
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
					if(dataStr.indexOf('You have accepted this Gift') != -1)
					{
						var error_text = 'You have already accepted this Gift.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					if(dataStr.indexOf('You are neighbor already') != -1)
					{
						var error_text = 'You are neighbor already.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf("You and your friend are Allies now!") != -1)
					{
						info.image = '';
						info.title = '';
						info.text  = 'New ally';
						info.time = Math.round(new Date().getTime() / 1000);
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					
					if($('.prompt', dataHTML).length > 0)
					{
						var nextParams = $('.prompt', dataHTML).find('form:first').serialize();
						
						var pos1 = 0;
						var pos2 = currentURL.lastIndexOf('/')+1;
						var domain = currentURL.slice(pos1,pos2);
						
						var nextURL = domain+$('.prompt', dataHTML).find('form:first').attr('action')+'?'+nextParams;

						FGS.evony.Requests.Click2(currentType, id, nextURL);
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
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try 
				{
					info.image = $('.shop', dataHTML).find('img:first').attr('longdesc');
					info.title = $('.shop', dataHTML).find('h2:first').text();
					info.text  = $('.shop', dataHTML).next('div').find('h2:first').text();
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

FGS.evony.Bonuses = 
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
					if(dataStr.indexOf('You have already completed this event') != -1)
					{
						var error_text = 'You have already completed this event';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					if(dataStr.indexOf('This feed has expired.') != -1)
					{
						var error_text = 'This feed has expired.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if($('.prompt', dataHTML).length > 0)
					{
						var nextParams = $('.prompt', dataHTML).find('form:first').serialize();
						
						var pos1 = 0;
						var pos2 = currentURL.lastIndexOf('/')+1;
						var domain = currentURL.slice(pos1,pos2);
						
						var nextURL = domain+$('.prompt', dataHTML).find('form:first').attr('action')+'?'+nextParams;

						$.get(nextURL);
						
						info.image = 'gfx/90px-check.png';
						info.time = Math.round(new Date().getTime() / 1000);
						info.title = 'New item';
						info.text = $('.prompt', dataHTML).find('h2:first').text();
						
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

