FGS.vampirewarsRequests = 
{
	Click:	function(currentType, id, currentURL, retry)
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
					var i1 = dataStr.indexOf('top.location.href = "');
					if(i1 != -1)
					{
						var i2 = dataStr.indexOf('"', i1+28);
						var url = dataStr.slice(i1+21, i2);
						FGS.vampirewarsRequests.Login(currentType, id, url);
						return;
					}
					throw {message: dataStr}
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
	
	Login:	function(currentType, id, currentURL, retry)
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
				
				if(typeof(retry) == 'undefined')
				{
					retry = 0;
				}
				
				if(redirectUrl != false)
				{
					if(typeof(retry) == 'undefined' || retry < 4)
					{
						retryThis(currentType, id, redirectUrl, retry++);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
					return;
				}
				
				try
				{
					var src = FGS.findIframeAfterId('#app_content_25287267406', dataStr);
					if (src == '') throw {message:"Cannot find <iframe src= in page"}
					
					FGS.vampirewarsRequests.Click4(currentType, id, src);
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
	
	Click4:	function(currentType, id, currentURL, retry)
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
					if($('div.title', dataHTML).text().indexOf('You must accept gifts within') != -1)
					{
						var error_text = $.trim($('div.title', dataHTML).text());
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					info.image = $('img:first', dataHTML).attr('src');
					info.title = $('img:first', dataHTML).attr('title');
					info.text = $('div.senderPic', dataHTML).parent().find('p').text();
					
					
					var sendInfo = '';
					
					/*
					if(data.indexOf('pic uid="') != -1 && data.indexOf('free_gift_id=') != -1)
					{
						
						var i1 = data.indexOf('free_gift_id=');
						var i2 = data.indexOf("'", i1);
						var giftName = data.slice(i1+13, i2);
						
						var i1 = data.indexOf('pic uid="');
						var i2 = data.indexOf('"', i1+9);
						var receiveUid = data.slice(i1+9, i2);
						
						
						var i1 = data.indexOf('false; " >', i2);
						var i2 = data.indexOf('</a', i1);
						var receiveName = data.slice(i1+10, i2);
						
						
						sendInfo = {
							gift: giftName,
							destInt: receiveUid,
							destName: receiveName,
						}
						
						
					}
					*/
					info.thanks = sendInfo;
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