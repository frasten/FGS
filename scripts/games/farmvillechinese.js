FGS.farmvillechinese.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/farmvillechinese/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var tst = new RegExp(/<iframe[^>].*src=\s*["](.*farmvillechinese.com\/flash.php.*[^"]+)[^>]*>*?.*?<\/iframe>/gm).exec(dataStr);
					if(tst == null) throw {message:'no farmvillechinese iframe tag'}
					params.click2url = $(FGS.HTMLParser('<p class="link" href="'+tst[1]+'">abc</p>')).find('p.link').attr('href');
					FGS.farmvillechinese.Freegifts.Click2(params);
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
							FGS.sendView('updateNeighbors', false, params.gameID);
						}
						else
						{
							FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
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
						FGS.sendView('updateNeighbors', false, params.gameID);
					}
					else
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
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
			url: params.click2url+''+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.click2url.match(re)[1].toString();
					
					var tst = new RegExp(/Farm.StatsURL =  '.*stats_counter.php[?](.*)'/).exec(dataStr);
					if(tst == null) throw {message:'no zy_params'}
					params.zyParam = tst[1];
					
					FGS.farmvillechinese.Freegifts.Click3(params);
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
							FGS.sendView('updateNeighbors', false, params.gameID);
						}
						else
						{
							FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
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
						FGS.sendView('updateNeighbors', false, params.gameID);
					}
					else
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
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
			url: 'http://'+params.domain+'/gifts_send.php?gift='+params.gift+'&view=farmville&src=direct&aff=&crt=&sendkey=&'+params.zyParam+'&overlayed=true&'+addAntiBot+''+Math.round(new Date().getTime() / 1000)+'#overlay',
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var tst = new RegExp(/FB[.]init\("(.*)".*"(.*)"/g).exec(dataStr);
					if(tst == null) throw {message: 'no fb.init'}
					
					var app_key = tst[1];
					var channel_url = tst[2];
					
					var tst = new RegExp(/(<fb:fbml[^>]*?[\s\S]*?<\/fb:fbml>)/m).exec(dataStr);
					if(tst == null) throw {message:'no fbml tag'}
					var fbml = tst[1];
					
					var paramsStr = 'app_key='+app_key+'&channel_url='+encodeURIComponent(channel_url)+'&fbml='+encodeURIComponent(fbml);
					
					params.nextParams = paramsStr;
					
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
							FGS.sendView('updateNeighbors', false, params.gameID);
						}
						else
						{
							FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
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
						FGS.sendView('updateNeighbors', false, params.gameID);
					}
					else
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	}
	
};


FGS.farmvillechinese.Requests = 
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
				
				var pos1 = currentURL.indexOf('addneighbo');
				if(pos1 != -1)
				{
					info.image = '';
					info.title = '';
					info.text  = 'New neighbour';
					info.time = Math.round(new Date().getTime() / 1000);
					
					FGS.endWithSuccess(currentType, id, info);
					return;
				}
				
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
					if($('.main_giftConfirm_cont', dataHTML).length > 0)
					{
						if($('.main_giftConfirm_cont', dataHTML).text().indexOf('看來你已經接受過這份禮物') != -1)
						{
							var error_text = "It seems that you have received this gift.";
							FGS.endWithError('limit', currentType, id, error_text);							
							return;
						}
						if($('.main_giftConfirm_cont', dataHTML).text().indexOf('這個兔年禮物的邀請已經過期了') != -1)
						{
							var error_text = "這個兔年禮物的邀請已經過期了";
							FGS.endWithError('limit', currentType, id, error_text);							
							return;
						}
						
					}
					
					if($('.giftFrom_img', dataHTML).length > 0 && $(".giftConfirm_img",dataHTML).length > 0)
					{
						info.image = $(".giftConfirm_img",dataHTML).children().attr("src");
						info.title = $(".giftConfirm_name",dataHTML).children().text();
						info.text  = $(".giftFrom_name",dataHTML).children().text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						
						var sendInfo = '';
						
						$('form', dataHTML).each(function()
						{
						
							var tmpStr = unescape($(this).attr('action'));
							
							if(tmpStr.indexOf('sendThankYou') != -1)
							{
								var pos1 = tmpStr.indexOf('&giftRecipient=');
								var pos2 = tmpStr.indexOf('&', pos1+1);
								
								var giftRecipient = tmpStr.slice(pos1+15,pos2);
								
								var pos1 = tmpStr.indexOf('&gift=');
								var pos2 = tmpStr.indexOf('&', pos1+1);
								
								var giftName = tmpStr.slice(pos1+6,pos2);
								
								
								sendInfo = {
									gift: giftName,
									destInt: giftRecipient,
									destName: $('.giftFrom_name', dataHTML).text()
								}							
								return false;
							}
						});
						
						if(sendInfo == '')
						{
							var tmpStr = unescape(currentURL);
												
							var pos1 = tmpStr.indexOf('&gift=');
							var pos2 = tmpStr.indexOf('&', pos1+1);
							
							var giftName = tmpStr.slice(pos1+6,pos2);
							
							sendInfo = {
								gift: giftName,
								destInt: $('.giftFrom_img', dataHTML).find('img').attr('uid'),
								destName: $('.giftFrom_img', dataHTML).find('img').attr('title'),
							}
						}
						info.thanks = sendInfo;
						
						FGS.endWithSuccess(currentType, id, info);
					}
					else if($('.giftFrom_img', dataHTML).length == 0 && $(".giftConfirm_img",dataHTML).length > 0)
					{
						info.image = $(".giftConfirm_img",dataHTML).children().attr("src");
						info.title = $(".giftConfirm_name",dataHTML).children().text();
						info.text  = $(".padding_content",dataHTML).find('h3').text();
						info.time = Math.round(new Date().getTime() / 1000);

						FGS.endWithSuccess(currentType, id, info);
					}
					else if($('.giftLimit', dataHTML).length > 0)
					{
						var error_text = $.trim($('.giftLimit', dataHTML).text());
						FGS.endWithError('limit', currentType, id, error_text);
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


FGS.farmvillechinese.Bonuses = 
{
	Click:	function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		var otherLimits = 
		{
			'have any room to store that bushel': ['Get a Bushel', 'Take a Bushel'],
			'need to use some of your fuel to be eligible to find more': [],
			'All that lightning fast clicking is leaving the bits': [],
		}
		
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
					if($('.inputsubmit[value="確定"]',dataHTML).length > 0)
					{
						var stop = false;
						for(var checkStr in otherLimits)
						{
							var arr = otherLimits[checkStr];
							
							try
							{
								if($(".main_giftConfirm_cont", dataHTML).find('h3').text().indexOf(checkStr) != -1)
								{
									var error_text = $(".main_giftConfirm_cont", dataHTML).find('h3').text();
									FGS.endWithError('other', currentType, id, error_text);
									stop = true;
									break;
								}
							}
							catch(e){}			
						}
						if(stop) return;			
						
						var error_text = $(".main_giftConfirm_cont", dataHTML).find('h3').text();
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					else if($('.main_giftConfirm_cont', dataHTML).length > 0)
					{
						var newUrl = '';
						
						if($('.inner_giftConfirm_cont > form', dataHTML).length > 0)
						{
							var pos1 = dataStr.indexOf('media="handheld" href="');
							if(pos1 != -1)
							{
								var pos2 = dataStr.indexOf('"', pos1+23);
								newUrl = dataStr.slice(pos1+23,pos2);
							}		
						}

						if(newUrl == '')
						{
							newUrl = unescape(newUrl);
							newUrl = newUrl.substr(newUrl.indexOf('next')+5);

							var giftReceiveUrl = 'http://apps.facebook.com/onthefarm/'+newUrl;
						}
						else
						{
							var giftReceiveUrl = newUrl.replace(/&amp;/g,'&');;
						}
						
						var num = 1;

						var giftReceivePost = $('.inner_giftConfirm_cont', dataHTML).find('form:nth-child('+num+')').serialize()+'&'+escape($('.inner_giftConfirm_cont', dataHTML).find('form:nth-child('+num+')').find('input[type="submit"]').attr('name'))+'='+$('.inner_giftConfirm_cont', dataHTML).find('form:nth-child('+num+')').find('input[type="submit"]').attr('value');
						
						info.title = $(".giftConfirm_name",dataHTML).children().text();
						info.image = $(".giftConfirm_img",dataHTML).children().attr("src");
						info.text  = $(".main_giftConfirm_cont", dataHTML).find('h3').text();
						
						
						$.ajax({
							type: "POST",
							data: giftReceivePost,
							url: giftReceiveUrl,
							success: function(d)
							{
								info.time = Math.round(new Date().getTime() / 1000);
								
								FGS.endWithSuccess(currentType, id, info);
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