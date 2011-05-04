FGS.gardensoftime.Requests = 
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
				
				if(FGS.checkForNotFound(currentURL) === true)
				{
					FGS.endWithError('not found', currentType, id);
					return;
				}
				
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
					var pos0 = dataStr.indexOf('"content":{"pagelet_canvas_content":');
					if(pos0 != -1)
					{
						var pos1 = dataStr.indexOf('>"}', pos0);
						var dataStr = JSON.parse(dataStr.slice(pos0+10, pos1+3)).pagelet_canvas_content;
						var dataHTML = FGS.HTMLParser(dataStr);		
					}
					
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						var src = FGS.findIframeAfterId('#app_content_175251882520655', dataStr);
						if (src == '') throw {message:"no iframe"}
						url = src;
					}
					
					FGS.gardensoftime.Requests.Click2(currentType, id, url, params);
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
		
		if(typeof(params) != 'object')
		{
			var method = 'POST';
		}
		else
		{
			var method = 'GET';
		}
		
		$.ajax({
			type: method,
			data: params,
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					if(dataStr.indexOf('DisplayTab("theGame");') != -1)
					{
						var error_text = 'Thie gift has been already accepted';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('GameData.query_string') != -1)
					{
						if(typeof(retry) != 'undefined')
							throw {message:'something wrong'}
						
						var getStr = $.param(params);
						
						var pos0 = dataStr.indexOf('GameData.query_string');
						var pos1 = dataStr.indexOf("'", pos0)+1;
						var pos2 = dataStr.indexOf("'", pos1);
						
						var pos3 = dataStr.indexOf('GameData.new_user');
						var pos4 = dataStr.indexOf("'", pos3)+1;
						var pos5 = dataStr.indexOf("'", pos4);
						
						getStr = getStr + '&'+dataStr.slice(pos1, pos2) + '&new_user='+dataStr.slice(pos4, pos5);
						var getStr = $.unparam(getStr);
						
						FGS.gardensoftime.Requests.Click2(currentType, id, currentURL, getStr, true);
						return;
					}
					else
					{
						var tst = new RegExp(/<fb:serverfbml[^>]*?>[\s\S]*?<script[^>]*?>([\s\S]*?)<\/script>[\s\S]*?<\/fb:serverfbml>/m).exec(dataStr);
						if(tst == null)
							var data = dataStr;
						else
							var data = tst[1];
						
						var dataHTML = FGS.HTMLParser(data);
						
						
						if(data.indexOf('You already collected this bonus') != -1 || data.indexOf('is already complete') != -1 || data.indexOf('you cannot help now') != -1 || data.indexOf('No more bonuses to collect') != -1 || data.indexOf('already helped with') != -1 || data.indexOf('You have already helped!') != -1)
						{
							var error_text = 'You have collected this gift';
							FGS.endWithError('limit', currentType, id, error_text);
						
							return;
						}
						
						if(data.indexOf('You are now neighbors') != -1)
						{
							info.image = '';
							info.title = '';
							info.text  = 'New neighbour';
							info.time = Math.round(new Date().getTime() / 1000);
							
							FGS.endWithSuccess(currentType, id, info);
							return;							
						}
						
						if(data.indexOf('hog_interstitial_wrapper') != -1)
						{
							info.image = 'gfx/90px-check.png';
							info.title = 'Silver';
							info.text  = $('#desc', dataHTML).text();
							info.time = Math.round(new Date().getTime() / 1000);							
							
							var pos1 = dataStr.indexOf('onclick="awardClicked(');
							if(pos1 != -1)
							{
								pos1+=23;
								var pos2 = dataStr.indexOf("'", pos1);					
								var link = dataStr.slice(pos1, pos2);
								FGS.dump(link);
								$.get(link);
							}
							
							FGS.endWithSuccess(currentType, id, info);
							return;	
						}
						
						var tmpImg = $('#gift_inner', dataHTML).css('background-image');
						tmpImg = tmpImg.replace('url(','').replace(')', '');
						
						info.image = tmpImg;
						
						
						var txt = $('#desc', dataHTML).text();

						txt = txt.replace('You just accepted ','');
						var pos2 = txt.indexOf(' from ');
						txt = txt.slice(0, pos2);
						
						info.title = txt;
						info.text  = $('#desc', dataHTML).text();
						
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
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

FGS.gardensoftime.Bonuses = 
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
					var pos0 = dataStr.indexOf('"content":{"pagelet_canvas_content":');
					if(pos0 != -1)
					{
						var pos1 = dataStr.indexOf('>"}', pos0);
						var dataStr = JSON.parse(dataStr.slice(pos0+10, pos1+3)).pagelet_canvas_content;
						var dataHTML = FGS.HTMLParser(dataStr);		
					}
					
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						var src = FGS.findIframeAfterId('#app_content_175251882520655', dataStr);
						if (src == '') throw {message:"no iframe"}
						url = src;
					}
					FGS.gardensoftime.Bonuses.Click2(currentType, id, url, params);
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
					info.title = 'Silver';
					info.text  = out.replace('<br>', ' ');;
					info.time = Math.round(new Date().getTime() / 1000);
					
					
					var pos1 = dataStr.indexOf('onclick="awardClicked(');
					if(pos1 != -1)
					{
						pos1+=23;
						var pos2 = dataStr.indexOf("'", pos1);					
						var link = dataStr.slice(pos1, pos2);
						FGS.dump(link);
						$.get(link);
					}
					
					FGS.endWithSuccess(currentType, id, info);
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
}