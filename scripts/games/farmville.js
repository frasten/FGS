FGS.farmvilleFreegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/onthefarm/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var i1,i2;
					
					i1          =   dataStr.indexOf('post_form_id:"')
					if (i1 == -1) throw {message:'Cannot post_form_id in page'}
					i1			+=	14;
					i2          =   dataStr.indexOf('"',i1);
					
					params.post_form_id = dataStr.slice(i1,i2);
					
					
					i1          =   dataStr.indexOf('fb_dtsg:"',i1)
					if (i1 == -1) throw {message:'Cannot find fb_dtsg in page'}
					i1			+=	9;
					i2          = dataStr.indexOf('"',i1);
					params.fb_dtsg		= dataStr.slice(i1,i2);
					
					
					var count = dataStr.match(/<iframe[^>]*?.*?<\/iframe>/g);
					
					var nextUrl = false;
					
					FGS.jQuery(count).each(function(k,v)
					{
						var i1 = v.indexOf('src="');
						if(i1 == -1) return true; 
						i1+=5;
						var i2 = v.indexOf('"', i1);
						var url = v.slice(i1,i2);
						if(url.indexOf('farmville.com/flash.php') != -1)
						{
							var url = $(FGS.HTMLParser('<p class="link" href="'+url+'">abc</p>')).find('p.link');
							nextUrl = $(url).attr('href');
							return false;
						}
					});
					
					if(nextUrl == false) throw {message:'no iframe'}
					params.nextUrl = nextUrl;
					
					
					FGS.farmvilleFreegifts.Click2(params);
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
			url: params.nextUrl+''+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.nextUrl.match(re)[1].toString();

					var dataParam = '&';

					var i1 = dataStr.indexOf('http://'+params.domain+'/stats_counter.php?');
					
					if (i1 == -1) throw {message:'Cannot post_form_id in page'}
					i1 += 47;
					i2 = dataStr.indexOf('\'', i1);
					dataParam	+= dataStr.slice(i1,i2);
					
					params.zyParam = dataParam;

					FGS.farmvilleFreegifts.Click3(params);
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
			url: 'http://'+params.domain+'/gifts_send.php?gift='+params.gift+'&view=farmville&src=direct&aff=&crt=&sendkey=&'+params.zyParam+'&overlayed=true&'+addAntiBot+''+Math.round(new Date().getTime() / 1000)+'#overlay',
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var i1,i2, myParms;
					var strTemp = dataStr;

					i1       =  strTemp.indexOf('FB.init("');
					if (i1 == -1) throw {message:"Cannot find FB.init"}
					i1 += 9;
					i2       =  strTemp.indexOf('"',i1);

					myParms  =  'app_key='+strTemp.slice(i1,i2);
					i1     =  i2 +1;
					i1       =  strTemp.indexOf('"',i1)+1;
					i2       =  strTemp.indexOf('"',i1);
					
					myParms +=  '&channel_url='+ encodeURIComponent(strTemp.slice(i1,i2));

					i1       =  strTemp.indexOf('<fb:fbml>');
					i2       =  strTemp.indexOf('/script>',i1)-1;
					myParms +=  '&fbml='+encodeURIComponent(strTemp.slice(i1,i2));
					
					params.myParms = myParms;
					
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
	}
	
};


FGS.farmvilleRequests = 
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
				
				var i1 = currentURL.indexOf('addneighbo');
				if(i1 != -1)
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
						if($('.main_giftConfirm_cont', dataHTML).text().indexOf('seem to send that gift to your friend right now') != -1)
						{
							var error_text = "Sorry, farmer. We can't seem to send that gift to your friend right now.";
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
								var i1 = tmpStr.indexOf('&giftRecipient=');
								var i2 = tmpStr.indexOf('&', i1+1);
								
								var giftRecipient = tmpStr.slice(i1+15,i2);
								
								var i1 = tmpStr.indexOf('&gift=');
								var i2 = tmpStr.indexOf('&', i1+1);
								
								var giftName = tmpStr.slice(i1+6,i2);
								
								
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
												
							var i1 = tmpStr.indexOf('&gift=');
							var i2 = tmpStr.indexOf('&', i1+1);
							
							var giftName = tmpStr.slice(i1+6,i2);
							
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


FGS.farmvilleBonuses = 
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
					if($('.inputsubmit[value="OK"]',dataHTML).length > 0)
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
							var i1 = dataStr.indexOf('media="handheld" href="');
							if(i1 != -1)
							{
								var i2 = dataStr.indexOf('"', i1+23);
								newUrl = dataStr.slice(i1+23,i2);
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