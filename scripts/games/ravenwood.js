FGS.ravenwoodFreegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/ravenwoodfair/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var src = FGS.findIframeAfterId('#app_content_120563477996213', dataStr);
					if (src == '') throw {message:"no iframe"}
					params.step2url = src;

					FGS.ravenwoodFreegifts.Click2(params);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('errorUpdatingNeighbours');
						}
						else
						{
							FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('errorUpdatingNeighbours');
					}
					else
					{
						FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	Click2: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "GET",
			url: params.step2url+''+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var pos1 = dataStr.indexOf('fbparams: "');
					var pos2 = dataStr.indexOf('"', pos1+11);
					params.step3params = '?ask_gift=-1&item_id='+params.gift+'&recipient_id=&thankyou_gift=0&default_tab=game&'+unescape(dataStr.slice(pos1+11, pos2));
					params.step3url = 'http://www.ravenwoodfair.com/app/1/gift/send';
					
					FGS.ravenwoodFreegifts.Click3(params);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('errorUpdatingNeighbours');
						}
						else
						{
							FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('errorUpdatingNeighbours');
					}
					else
					{
						FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	Click3: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "GET",
			url: params.step3url,
			data: params.step3params+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var pos1 = dataStr.lastIndexOf('fb:tab-item href="');
					var pos2 = dataStr.indexOf('"', pos1+18);
					params.step4url = dataStr.slice(pos1+18, pos2);
				
					FGS.ravenwoodFreegifts.Click4(params);
				
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('errorUpdatingNeighbours');
						}
						else
						{
							FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('errorUpdatingNeighbours');
					}
					else
					{
						FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	Click4: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "POST",
			url: params.step3url+''+addAntiBot,
			data: params.step3params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var tst = new RegExp(/(<fb:fbml[^>]*?[\s\S]*?<\/fb:fbml>)/m).exec(dataStr);
					if(tst == null) throw {message:'no fbml tag'}
					var fbml = tst[1];
					
					var nextParams  =  'api_key=120563477996213&fbml='+encodeURIComponent(fbml);		
					
					params.nextParams = nextParams;
					FGS.getFBML(params);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('errorUpdatingNeighbours');
						}
						else
						{
							FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('errorUpdatingNeighbours');
					}
					else
					{
						FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
};


FGS.ravenwoodRequests = 
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
					var el = $('#app_content_120563477996213 > div > div > div > div > div', dataHTML);
					if($(el).length > 0)
					{
						if($(el).text().indexOf('You just accepted a neighbor request') != -1)
						{
							info.image = '';
							info.title = 'New neighbour';
							info.text  = $(el).text();
							info.time = Math.round(new Date().getTime() / 1000);
						}
						else
						{
							var sendInfo = '';
							
							var tmpStr = unescape(currentURL);
							
							var pos1 = tmpStr.indexOf('?item_id=');
							if(pos1 == -1)
							{
								pos1 = tmpStr.indexOf('&item_id=');
							}
							if(pos1 != -1)
							{
								var pos2 = tmpStr.indexOf('&', pos1+1);
								
								var giftName = tmpStr.slice(pos1+9,pos2);
								
								var pos1 = tmpStr.indexOf('&sender_id=');
								var pos2 = tmpStr.indexOf('&', pos1+1);
								
								var giftRecipient = tmpStr.slice(pos1+11,pos2);			
									
								sendInfo = {
									gift: giftName,
									destInt: giftRecipient,
									destName: "Can't say"
									}
							}
							
							info.thanks = sendInfo;
							
							
						
							info.title = $(el).text();				
							
							var pos1 = $(el).text().indexOf('You just accepted this');
							if(pos1 != -1)
							{
								var pos2 = $(el).text().indexOf(' from ', pos1);
								info.title = $(el).text().slice(pos1+22, pos2);
							}
							
							info.image = $('#app_content_120563477996213', dataHTML).find('img').attr("src");
							info.text  = $(el).text();
							info.time = Math.round(new Date().getTime() / 1000);
						}
						
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