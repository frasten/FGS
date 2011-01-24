FGS.treasureFreegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/treasureisle/?ref=ts'+addAntiBot,
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
						if(url.indexOf('treasure.zynga.com/flash.php') != -1)
						{
							var url = $(FGS.HTMLParser('<p class="link" href="'+url+'">abc</p>')).find('p.link');
							nextUrl = $(url).attr('href');
							return false;
						}
					});
					
					if(nextUrl == false) throw {message:'no iframe'}
					params.nextUrl = nextUrl;
					
					
					FGS.treasureFreegifts.Click2(params);
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
					
					
					var i1 = dataStr.indexOf('new ZY({');
					if (i1 == -1) throw {message:'Cannot zyparams in page'}
					i1 += 7;
					i2 = dataStr.indexOf('"},', i1)+2;
					var dataParam	= dataStr.slice(i1,i2);				
					
					eval('var dataStrTmp = '+dataParam);
					
					params.zyParam = $.param(dataStrTmp);

					FGS.treasureFreegifts.Click3(params);
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
			url: 'http://'+params.domain+'/gifts_send.php?overlayed=1&gift='+params.gift+'&'+unescape(params.zyParam)+''+addAntiBot,
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
					
					i1 		 =  strTemp.indexOf(' exclude_ids="');
					if (i1 == -1)
						var exclArr = [];
					else
					{
						i2 = strTemp.indexOf('"', i1+14);
						eval('var exclArr = ['+strTemp.slice(i1+14, i2)+']');
					}
					
					params.exclude = exclArr;
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

FGS.treasureRequests = 
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

					if($('.giftFrom_img', dataHTML).length > 0 && $(".giftConfirm_img",dataHTML).length == 0)
					{
						if(dataStr.indexOf('Great! You helped the ') != -1)
						{
							info.image = 'gfx/90px-check.png';
							info.title = '';
							info.text = $('h2', dataHTML).text();
							info.time = Math.round(new Date().getTime() / 1000);
						}
						else if(dataStr.indexOf('You helped train the Dragon') != -1)
						{
							info.image = $(".giftFrom_img",dataHTML).children().attr("src");
							info.title = 'Train the Dragon';
							info.text  = 'You helped train the Dragon!';
							info.time = Math.round(new Date().getTime() / 1000);
						}
						else
						{
							info.image = '';
							info.title = '';
							info.text  = 'New neighbour';
							info.time = Math.round(new Date().getTime() / 1000);
						}
						
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					else if($('.giftFrom_img', dataHTML).length > 0 && $(".giftConfirm_img",dataHTML).length > 0)
					{
						var sendInfo = '';
						
						var tmpStr = unescape(currentURL);					
						var i1 = tmpStr.indexOf('&gift=');
						if(i1 != -1)
						{
							var i2 = tmpStr.indexOf('&', i1+1);
								
							var giftName = tmpStr.slice(i1+6,i2);
							
							var i1 = tmpStr.indexOf('&senderId=1:');
							var i2 = tmpStr.indexOf('&', i1+1);
							
							var giftRecipient = tmpStr.slice(i1+12,i2);						
								
							sendInfo = {
								gift: giftName,
								destInt: giftRecipient,
								destName: $(".giftFrom_img",dataHTML).siblings('p').text(),
								}
						}
						info.thanks = sendInfo;
						
						info.image = $(".giftConfirm_img",dataHTML).children().attr("src");
						info.title = $(".giftConfirm_img",dataHTML).siblings('p').text();
						info.text  = $(".giftFrom_img",dataHTML).siblings('p').text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
					}
					else if(dataStr.indexOf("explorer's pack?") != -1)
					{
						var URL = unescape($('.acceptButtons', dataHTML).children('a:first').attr('href'));
						
						FGS.treasureRequests.Click2(currentType, id, URL);
						return;
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
					if($('.giftFrom_img', dataHTML).length > 0 && $(".giftConfirm_img",dataHTML).length > 0)
					{
						info.image = $(".giftConfirm_img",dataHTML).children().attr("src");
						info.title = $(".giftConfirm_img",dataHTML).siblings('p').text();
						info.text  = $(".giftFrom_img",dataHTML).siblings('p').text();
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


FGS.treasureBonuses = 
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
					if(dataStr.indexOf('<h1>Oh no!</h1>') != -1)
					{
						var error_text = $('h2', dataHTML).text();
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}

					var URL = $('.acceptButtons', dataHTML).children('a:first').attr('href');
					if(typeof(URL) == 'undefined') throw {message: 'No url'}
					var URL = unescape(URL);
					
					FGS.treasureBonuses.Click2(currentType, id, URL);
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
					if(dataStr.indexOf('<h1>Oh no!</h1>') != -1)
					{
						var error_text = $('h2', dataHTML).text();
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if($(".giftConfirm_img",dataHTML).siblings('p').length != 0)
					{
						info.title = $(".giftConfirm_img",dataHTML).siblings('p').text();
					}
					else
					{
						info.title = 'Celebration';
					}
					info.image = $(".giftConfirm_img",dataHTML).children().attr("src");
					info.text = '';
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