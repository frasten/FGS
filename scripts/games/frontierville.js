FGS.frontiervilleFreegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/frontierville/?crt=&aff=tab&src=direct&newUser=&sendkey=&ref=tab'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var strTemp = '';

					i1  =   dataStr.indexOf('zySnid=');
					if (i1 == -1) throw {message:'Cannot find zySnid in page'}
					i2  =   dataStr.indexOf('&',i1);
					strTemp += dataStr.slice(i1,i2)+'&';

					i1  =   dataStr.indexOf('zySnuid=');
					if (i1 == -1) throw {message:'Cannot find zySnuid in page'}
					i2  =   dataStr.indexOf('&',i1);
					strTemp += dataStr.slice(i1,i2)+'&';

					i1  =   dataStr.indexOf('zy_user=');
					if (i1 == -1) throw {message:'Cannot find zy_user in page'}
					i2  =   dataStr.indexOf('&',i1);
					strTemp += dataStr.slice(i1,i2)+'&';

					i1  =   dataStr.indexOf('zy_ts=');
					if (i1 == -1) throw {message:'Cannot find zy_ts in page'}
					i2  =   dataStr.indexOf('&',i1);
					strTemp += dataStr.slice(i1,i2)+'&';

					i1  =   dataStr.indexOf('zy_session=');
					if (i1 == -1) throw {message:'Cannot find zy_session in page'}
					i2  =   dataStr.indexOf('&',i1);
					strTemp += dataStr.slice(i1,i2)+'&';

					i1  =   dataStr.indexOf('zySig=');
					if (i1 == -1) throw {message:'Cannot find zySig in page'}
					i2  =   dataStr.indexOf('&',i1);
					strTemp += dataStr.slice(i1,i2)+'&';
					
					params.zyParam = strTemp;

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
					
					FGS.frontiervilleFreegifts.Click2(params);
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
			url: 'http://fb-0.frontier.zynga.com/gifts_send.php?gift='+params.gift+'&view=farmville&src=direct&aff=&crt=&sendkey=&'+params.zyParam+'&overlayed=true&'+Math.round(new Date().getTime() / 1000)+''+addAntiBot+'#overlay',
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
					
					//dump(FGS.getCurrentTime()+'[Z] FBMLinfo - OK');
					
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

FGS.frontiervilleRequests = 
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
					if($('div.giftLimit', dataHTML).length > 0)
					{
						var error_text = $.trim($('div.giftLimit', dataHTML).text());
						FGS.endWithError('limit', currentType, id, error_text);					
						return;
					}				
				
					if($('.giftFrom_img', dataHTML).length > 0 && $(".giftConfirm_img",dataHTML).length == 0)
					{
						info.image = $(".giftFrom_img",dataHTML).children().attr("src");
						info.title = 'New neighbour';
						info.text  = $(".giftFrom_name",dataHTML).children().text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
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
								destName: $('.giftFrom_img', dataHTML).find('img').attr('title'),
								}
						}
						info.thanks = sendInfo;					
						
						info.image = $(".giftConfirm_img",dataHTML).children().attr("src");
						info.title = $(".giftConfirm_name",dataHTML).children().text();
						info.text  = $(".giftFrom_name",dataHTML).children().text();
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

FGS.frontiervilleBonuses = 
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
					if($('.fail_message', dataHTML).length > 0)
					{
						var error_text = $('.fail_message', dataHTML).text();
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					else if($('.morePending_bttn', dataHTML).length > 0)
					{
						var giftReceiveUrl = $('.morePending_bttn > form:first', dataHTML).attr("action");
						var giftReceivePost = $('.morePending_bttn > form:first', dataHTML).serialize();
						
						var testStr = $('.gift_from > h3', dataHTML).text();
						var testStr = testStr.replace(/^\s+|\s+$/g, '');
						
						if(testStr == 'ToHelp' || testStr == 'To Help')
						{
							var tempTitle = $(".morePending_cont > div.text:first", dataHTML).text().replace('Help out and receive', '');
						}
						else
						{
							var tempTitle = $(".giftConfirm_name",dataHTML).children().text();
						}
						
						var tempImage = $(".giftConfirm_img",dataHTML).children().attr("src");
						
						
						FGS.jQuery.ajax({
							type: "POST",
							data: giftReceivePost,
							url: giftReceiveUrl,
							success: function(d)
							{
								if(d.indexOf('giftLimit') != -1)
								{
									var i1 = d.indexOf('class="giftLimit')+18;
									var i2 = d.indexOf('div>', i1)-2;
									
									var error_text = $.trim(d.slice(i1,i2));
									
									if(error_text.indexOf('your friend will still get their') != -1)
									{
										info.title = tempTitle;
										info.image = tempImage;
										info.text = '';
										info.time = Math.round(new Date().getTime() / 1000);
									
										FGS.endWithSuccess(currentType, id, info);
									}
									else
									{
										FGS.endWithError('other', currentType, id, error_text);
									}
								}
								else
								{
									
									info.title = tempTitle;
									info.image = tempImage;
									info.text = '';
									info.time = Math.round(new Date().getTime() / 1000);
								
									FGS.endWithSuccess(currentType, id, info);
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