FGS.puzzledhearts.Bonuses = 
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
					var url = $('form[target]', dataHTML).attr('action');
					var params = $('form[target]', dataHTML).serialize();
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_166309140062981', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.puzzledhearts.Bonuses.Click2(currentType, id, url, params);
				} 
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
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
	
	Click2:	function(currentType, id, currentURL, params, retry)
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
				var dataHTML = FGS.HTMLParser(dataStr);
				
				
				try
				{
					
					
					if(dataStr.indexOf('You have already received this mystery gift') != -1)
					{
						var error_text = 'You have already received this gift';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('You have already sent the') != -1)
					{
						var error_text = 'You have already sent this gift';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					
					if($('.ui-icon-info', dataHTML).length > 0)
					{ 
						var txt = $('.ui-icon-info', dataHTML).parent().text();
						
						info.text = txt;
						
						if(txt.indexOf('You have just accepted') != -1)
						{
							info.title = 'New heart';
						}
						else if(txt.indexOf('You have just sent') != -1)
						{
							info.title = 'Heart sent';
						}
						
						var pos1 = dataStr.indexOf('$(function () {');
						
						if(pos1 != -1)
						{
							var pos2 = dataStr.indexOf('var url = "', pos1);
							if(pos2 != -1)
							{
								pos2+=11;
								var pos3 = dataStr.indexOf('"', pos2);
								
								var url = dataStr.slice(pos2,pos3)+new Date().getTime();
								$.getJSON(url);
							}
						}
						info.image = 'gfx/90px-check.png';
						info.time = Math.round(new Date().getTime() / 1000);
						FGS.endWithSuccess(currentType, id, info);
						
						//var error_text = $.trim($('.streamRewardAllRewardsClaimed', dataHTML).text());
						//FGS.endWithError('limit', currentType, id, error_text);
					}
					else
					{
						throw {message: 'error'}
					}
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', params, true);
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
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', params, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
};

FGS.puzzledhearts.Requests = 
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
					var url = $('form[target]', dataHTML).attr('action');
					var params = $('form[target]', dataHTML).serialize();
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_166309140062981', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.puzzledhearts.Requests.Click2(currentType, id, url, params);
				} 
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
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
	
	Click2:	function(currentType, id, currentURL, params, retry)
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
				var dataHTML = FGS.HTMLParser(dataStr);

				try
				{
					if(dataStr.indexOf('You have already received this mystery gift') != -1)
					{
						var error_text = 'You have already received this gift';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('You have already sent the') != -1)
					{
						var error_text = 'You have already sent this gift';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('but this gift cannot be accepted because it is too old') != -1)
					{
						var error_text = 'This gift cannot be accepted because it is too old';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if($('.ui-icon-info', dataHTML).length > 0)
					{ 
						var txt = $('.ui-icon-info:first', dataHTML).parent().text();
						
						info.text = txt;
						
						if(txt.indexOf('You have just accepted') != -1)
						{
							info.title = 'New heart';
						}
						else if(txt.indexOf('You have just sent') != -1)
						{
							info.title = 'Heart sent';
						}
						
						var pos1 = dataStr.indexOf('$(function () {');
						
						if(pos1 != -1)
						{
							var pos2 = dataStr.indexOf('var url = "', pos1);
							if(pos2 != -1)
							{
								pos2+=11;
								var pos3 = dataStr.indexOf('"', pos2);
								
								var url = dataStr.slice(pos2,pos3)+new Date().getTime();
								$.getJSON(url);
							}
						}
						info.image = 'gfx/90px-check.png';
						info.time = Math.round(new Date().getTime() / 1000);
						FGS.endWithSuccess(currentType, id, info);
						
						//var error_text = $.trim($('.streamRewardAllRewardsClaimed', dataHTML).text());
						//FGS.endWithError('limit', currentType, id, error_text);
					}
					else
					{
						throw {message: 'error'}
					}
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', params, true);
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
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', params, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
};