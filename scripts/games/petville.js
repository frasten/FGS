FGS.petvilleRequests = 
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
					var src = FGS.findIframeAfterId('#app_content_163576248142', dataStr);
					if (src == '') throw {message:"Cannot find <iframe src= in page"}
				
					FGS.petvilleRequests.Click2(currentType, id, src);
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
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var URL = FGS.findIframeAfterId('#flashFrame', dataStr);
					if (URL == '') throw {message:"Cannot find <iframe src= in page"}

					var i1 = 0;
					var i2 = URL.lastIndexOf('/')+1;
					
					var nextUrl = URL.slice(i1,i2);

					var i1 = dataStr.indexOf('ZYFrameManager.gotoTab');
					var i2 = dataStr.indexOf(",'", i1)+2;
					var i3 = dataStr.indexOf("'", i2);
					
					nextUrl = nextUrl+dataStr.slice(i2,i3);
					
					
					FGS.petvilleRequests.Click3(currentType, id, nextUrl);
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
	
	Click3:	function(currentType, id, currentURL, retry)
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
					if($('.reqFrom_img', dataHTML).length > 0 && $(".giftConfirm_img" ,dataHTML).length == 0)
					{
						info.image = $(".reqFrom_img" ,dataHTML).children().attr("src");
						info.title = 'New neighbour';
						info.text  = $(".reqFrom_name" ,dataHTML).children().text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
					}
					else if($('.giftFrom_img', dataHTML).length > 0 && $(".giftConfirm_img" ,dataHTML).length > 0)
					{
						var sendInfo = '';
						
						var tmpStr = unescape(currentURL);
						
						var i1 = tmpStr.indexOf('&gift=');
						if(i1 != -1)
						{
							var i2 = tmpStr.indexOf('&', i1+1);
								
							var giftName = tmpStr.slice(i1+6,i2);
							
							var i1 = tmpStr.indexOf('&senderId=');
							var i2 = tmpStr.indexOf('&', i1+1);
							
							var giftRecipient = tmpStr.slice(i1+10,i2);						
								
							sendInfo = {
								gift: giftName,
								destInt: giftRecipient,
								destName: $('.giftFrom_name', dataHTML).children().text()
								}
						}
						//info.thanks = sendInfo;					
						
						info.image = $(".giftConfirm_img" ,dataHTML).children().attr("src");
						info.title = $(".giftConfirm_name" ,dataHTML).children().text();
						info.text  = $(".giftFrom_name" ,dataHTML).children().text();
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
	},
};

FGS.petvilleBonuses =
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
					var src = FGS.findIframeAfterId('#app_content_163576248142', dataStr);
					if (src == '') throw {message:"Cannot find <iframe src= in page"}

					FGS.petvilleBonuses.Click2(currentType, id, src);
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
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var URL = FGS.findIframeAfterId('#flashFrame', dataStr);
					if (URL == '') throw {message:"Cannot find <iframe src= in page"}
					
					var i1 = 0;
					var i2 = URL.lastIndexOf('/')+1;
					
					var nextUrl = URL.slice(i1,i2);

					var i1 = dataStr.indexOf('ZYFrameManager.gotoTab');
					
					if(i1 == -1) throw {message: 'No ZYframeManager'}
					
					var i2 = dataStr.indexOf(",'", i1)+2;
					var i3 = dataStr.indexOf("'", i2);
					
					var nextUrl2 = dataStr.slice(i2,i3).replace('http://fb-client-0.petville.zynga.com/current/', '');
					
					nextUrl = nextUrl+nextUrl2+'&overlayed=true&'+new Date().getTime()+'#overlay';
					
					
					FGS.petvilleBonuses.Click3(currentType, id, nextUrl);
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
	
	Click3:	function(currentType, id, currentURL, retry)
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
					var out = $.trim($('.main_giftConfirm_cont', dataHTML).text());
					
					if(out.indexOf('You already claimed') != -1 ||  out.indexOf('The item is all gone') != -1  || out.indexOf('already received') != -1 || out.indexOf('the celebration has ended') != -1 || out.indexOf('you cannot claim the celebration') != -1 || out.indexOf('this feed is only for friends') != -1)
					{
						var error_text = out;
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(out.indexOf('cannot claim more than') != -1 || out.indexOf('Claim more tomorrow') != -1)
					{
						var error_text = out;
						FGS.endWithError('other', currentType, id, error_text);
						return;
					}
					
					var outText = '';
					
					if(out.indexOf('been offered') != -1)
					{
						var i1 = out.indexOf(' been offered')+13;
						var i2 = out.indexOf('.', i1);
						var i3 = out.indexOf('!', i1);
						if(i3 != -1)
							if(i3 < i2 || i2 == -1)
								i2 = i3;
						
						outText = out.slice(i1,i2);
					}
					else if(out.indexOf('has shared a') != -1)
					{
						var i1 = out.indexOf('has shared a')+13;
						var i2 = out.indexOf('!', i1);
						var i3 = out.indexOf('with', i1);
						if(i3 != -1)
							if(i3 < i2 || i2 == -1)
								i2 = i3;
						
						outText = out.slice(i1,i2);						
						
						outText = outText.replace('bonus of', '');
					}
					else if(out.indexOf('want to claim') != -1)
					{
						var i1 = out.indexOf('want to claim')+13;
						var i2 = out.indexOf('?', i1);
						outText = out.slice(i1,i2);						
					}
					else if(out.indexOf('You recieved a') != -1)
					{
						var i1 = out.indexOf('You recieved a')+15;
						var i2 = out.indexOf('from', i1);
						outText = out.slice(i1,i2);						
					}
					else if(out.indexOf('You found a') != -1)
					{
						var i1 = out.indexOf('You found a')+12;
						var i2 = out.indexOf(',', i1);
						outText = out.slice(i1,i2);						
					}
					else if(out.indexOf('Here are ') != -1)
					{
						var i1 = out.indexOf('Here are ')+9;
						var i2 = out.indexOf('for', i1);
						outText = out.slice(i1,i2);						
					}
					else if(out.indexOf('Thank you for offering ') != -1)
					{
						outText = out;
					}
					else
					{
						outText = out;
					}
					
					var postUrl = $('.main_giftConfirm_cont', dataHTML).find('form').attr('action');
					var postData = $('.main_giftConfirm_cont', dataHTML).find('form').serialize();

					$.post(postUrl, postData);

					info.text  = outText;
					info.image = 'gfx/90px-check.png';
					info.title = 'New bonus';
					
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
};