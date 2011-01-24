FGS.paradiselifeRequests = 
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
					var src = FGS.findIframeAfterId('#app_content_143547399002598', dataStr);
					if (src == '') throw {message:"Cannot find <iframe src= in page"}
					FGS.paradiselifeRequests.Click2(currentType, id, src);
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

					if(dataStr.indexOf('Sorry, there is something wrong with this page') != -1)
					{
						var error_text = 'Request already accepted.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var i1 = dataStr.indexOf('id="gifts_received"');
					
					
					if($('.gift_wrap', dataHTML).length > 0)
					{
						info.image = $('.gift_wrap', dataHTML).find('img').attr('src');
						info.title = $('.gift_wrap', dataHTML).find('p').text();
						info.text  = ' ';
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
					}
					else if(dataStr.indexOf('as your neighbor') != -1)
					{
						info.image = '';
						info.text  = 'New neighbour';
						info.title = '';
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
					}
					else if(i1 != -1)
					{
						var i2 = dataStr.indexOf('<h2', i1)+4;
						var i3 = dataStr.indexOf('<', i2);
						
						var i4 = dataStr.indexOf('<img ', i1);
						var i5 = dataStr.indexOf('src="', i4)+5;
						var i6 = dataStr.indexOf('"', i5);
						
						info.image = dataStr.slice(i5, i6);
						info.text  = ' ';
						info.title = dataStr.slice(i2, i3);
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

FGS.paradiselifeBonuses = 
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
					var src = FGS.findIframeAfterId('#app_content_143547399002598', dataStr);
					if (src == '') throw {message:"Cannot find <iframe src= in page"}
					FGS.paradiselifeBonuses.Click2(currentType, id, src);
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
					var testElem = $('.title_text_pos', dataHTML).children().attr('src')
					if(testElem != undefined)
					{
						if(testElem.indexOf('feed_expire_title') != -1)
						{
							var error_text = 'This feed has expired or you have already collected it';
							FGS.endWithError('limit', currentType, id, error_text);	
							return;
						}
					}
					
					if($('.gift_wrap', dataHTML).length == 0) throw {message: 'something is wrong'}
					
					info.image = $('.gift_wrap', dataHTML).find('img').attr('src');
					info.title = $('.gift_wrap', dataHTML).find('p').text();
					
					info.text  = ' ';
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