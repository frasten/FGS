FGS.cityofwonderRequests = 
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
					var src = FGS.findIframeAfterId('#app_content_114335335255741', dataStr);
					if (src == '') throw {message:"no iframe"}
					
					FGS.cityofwonderRequests.Click2(currentType, id, src);
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
				try
				{
					var tst = new RegExp(/(<fb:fbml[^>]*?[\s\S]*?<\/fb:fbml>)/m).exec(dataStr);
					if(tst == null) throw {message:'no fbml tag'}
					var data = tst[1];
					
					var dataHTML = FGS.HTMLParser(data);
										
					info.image = $('.ally_accept', dataHTML).find('img:first').attr('src');
					var txt = $('.ally_accept', dataHTML).find('h1').text();
					
					if(txt.indexOf('You can not accept this gift') != -1)
					{
						var error_text = txt;
						FGS.endWithError('limit', currentType, id, error_text);						
						return;
					}
					
					if(txt.indexOf('You are now allies with') != -1)
					{
						info.title = txt.replace('<br>', ' ');
						info.text  = '';
					}
					else
					{
						txt = txt.replace('You just accepted ','');
						var pos2 = txt.indexOf(' from ');
						txt = txt.slice(0, pos2);
						
						info.title = txt;
						info.text  = '';
					}
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
	}
};

FGS.cityofwonderBonuses = 
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
					var src = FGS.findIframeAfterId('#app_content_114335335255741', dataStr);
					if (src == '') throw {message:"no iframe"}
					FGS.cityofwonderBonuses.Click2(currentType, id, src);
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
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);
					
					var out = $.trim($('div.msgs', dataHTML).text());
					
					if(out.indexOf('You already collected this bonus') != -1 || out.indexOf('is already complete') != -1 || out.indexOf('you cannot help now') != -1 || out.indexOf('No more bonuses to collect') != -1 || out.indexOf('already helped with') != -1)
					{
						var error_text = out;
						FGS.endWithError('limit', currentType, id, error_text);
					
						return;
					}
					
					info.image = 'gfx/90px-check.png';
					info.title = 'Coins';
					info.text  = out.replace('<br>', ' ');;
					info.time = Math.round(new Date().getTime() / 1000);
					
					
					var pos1 = dataStr.indexOf('onclick="awardClicked(');
					if(pos1 != -1)
					{
						pos1+=23;
						var pos2 = dataStr.indexOf("'", pos1);					
						var link = dataStr.slice(pos1, pos2);
						//dump(link);
						$.get(link);
					}
					
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