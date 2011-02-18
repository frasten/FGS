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
					var tst = new RegExp(/<iframe[^>].*src=\s*["](.*farmville.com\/flash.php.*[^"]+)[^>]*>*?.*?<\/iframe>/gm).exec(dataStr);
					if(tst == null) throw {message:'no farmville iframe tag'}
					params.step2url = $(FGS.HTMLParser('<p class="link" href="'+tst[1]+'">abc</p>')).find('p.link').attr('href');
					
					FGS.farmvilleFreegifts.Click2(params);		
				}
				catch(err)
				{
					dump(err);
					dump(err.message);
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
			url: params.step2url+''+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.step2url.match(re)[1].toString();
					
					var nextUrl = 'http://'+params.domain+'/';					
					var pos1 = dataStr.indexOf("ZYFrameManager.navigateTo('");
					
					if(pos1 != -1)
					{
						var pos2 = dataStr.indexOf("'", pos1)+1;
						var pos3 = dataStr.indexOf("'", pos2);
						
						params.step2url = nextUrl+dataStr.slice(pos2,pos3).replace(nextUrl, '');
						retryThis(params, true);
						return;
					}
					
					var pos1 = dataStr.indexOf('new ZY(');
					if(pos1 == -1) throw {message: 'No new ZY'}
					pos1+=7;
					var pos2 = dataStr.indexOf('},', pos1)+1;
					
					eval('var zyParam ='+dataStr.slice(pos1,pos2));
					
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.step2url.match(re)[1].toString();
					params.zyParam = FGS.jQuery.param(zyParam);
					
					FGS.farmvilleFreegifts.Click3(params);
				}
				catch(err)
				{
					dump(err);
					dump(err.message);
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
			type: "POST",
			url: 'http://'+params.domain+'/gifts_send.php?_force_iframe=&fv_canvas=1&'+params.zyParam+''+addAntiBot,
			data: 'ref=tab&gift='+params.gift,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var pos1,pos2;
					
					if(dataStr.indexOf('snml:') == -1)
					{
						retry = true;
						throw {message: 'invalid gift'}
					}
					
					var data = dataStr.replace(/snml:/g, 'fb_');
					
					var outStr = '';
					
					var pos1 = data.indexOf('<fb_serverSnml');
					
					var s1 = data.indexOf('<style', pos1);
					var s2 = data.indexOf('/style', s1);
					
					outStr += data.slice(s1, s2+7);
					
					var s1 = data.indexOf('<div', pos1);
					var s2 = data.indexOf('/div', s1);
					
					outStr += data.slice(s1, s2+5);
					
					var s1 	= data.indexOf('<fb_multi-friend-selector', pos1);
					var s11 = data.indexOf('exclude_ids="', s1);
					s11+=13;
					var s12 = data.indexOf('"', s11);

					var exclude = data.slice(s11, s12);
					
					var f1 = data.indexOf('<fb_request-form', pos1);
					
					var pos1 = data.indexOf('invite="', f1);
					var a1 = data.indexOf('action="', f1);
					var m1 = data.indexOf('method="', f1);
					var t1 = data.indexOf('type="', f1);
					
					outStr += '<div class="mfs">';
					
					var inviteAttr 	= data.slice(pos1+8, data.indexOf('"', pos1+8));
					var actionAttr	= data.slice(a1+8, data.indexOf('"', a1+8));
					var methodAttr 	= data.slice(m1+8, data.indexOf('"', m1+8));
					var typeAttr	= data.slice(t1+6, data.indexOf('"', t1+6));
					
					var c1 = data.indexOf('<fb_content', f1);
					var c11 = data.indexOf('>', c1);
					var c12 = data.indexOf('/fb_content>',c11);
					
					var contentTmp = data.slice(c11+1, c12-1).replace(/\"/g, "'");
					
					var contentAttr = FGS.encodeHtmlEntities(contentTmp);

					outStr += '<fbGood_request-form invite="'+inviteAttr+'" action="'+actionAttr+'" method="'+methodAttr+'" type="'+typeAttr+'" content="'+contentAttr+'"><div><fb:multi-friend-selector cols="5" condensed="true" max="30" unselected_rows="6" selected_rows="5" email_invite="false" rows="5" exclude_ids="EXCLUDE_ARRAY_LIST" actiontext="Select a gift" import_external_friends="false"></fb:multi-friend-selector><fb:request-form-submit import_external_friends="false"></fb:request-form-submit><a style="display: none" href="http://fb-0.FGS.farmville.zynga.com/flash.php?skip=1">Skip</a></div></fbGood_request-form>';
					
					outStr += '</div>';
					
					var cmd_id = new Date().getTime();
					
					var pos1 = data.indexOf('SNAPI.init(');
					var pos2 = data.indexOf('{', pos1);
					var pos3 = data.indexOf('}},', pos2)+3;
					
					var session = data.slice(pos2,pos3);
					
					var exArr = exclude.split(',');
					
					var str = '';
					$(exArr).each(function(k,v)
					{
						str += '"'+v+'"'
						
						if(k+1 < exArr.length)
							str+= ',';
					});
					
					var pos1 = data.indexOf('"zy_user":"')+11;
					var pos2 = data.indexOf('"', pos1);
					var zy_user = data.slice(pos1,pos2);	
					
					
					if(typeof(params.thankYou) != 'undefined')
					{
						str = params.sendTo[0];
					}
					
					var postData = 
					{
						method: 'getSNUIDs',
						params:	'[['+str+'],"1"]',
						cmd_id:	cmd_id,
						app_id:	'63',
						authHash: session,
						zid:	zy_user,
						snid:	1,
					}
					
					console.log(session);
					
					eval('var a = '+session);
					console.log(a);
					
					params.postData = postData;
					params.excludeCity = exclude;
					
					params.outStr = outStr;

					FGS.farmvilleFreegifts.Click4(params);
					
				}
				catch(err)
				{
					dump(err);
					dump(err.message);
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

	Click4: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		var outStr = params.outStr;
		
		
		$.post('http://'+params.domain+'/SNAPIProxy.php', params.postData, function(data2)
		{
		
			var nextParams = 'api_key=102452128776&locale=en_US&sdk=joey';
			
			var info = JSON.parse(data2);
			
			var str = '';
			
			for(var uid in info.body)
			{
				var t = info.body[uid];
				str+= t+',';					
			}
			params.excludeCity = str.slice(0, -1);
			
			if(typeof(params.thankYou) != 'undefined')
			{
				params.sendTo[0] = info.body[params.sendTo[0]];
			}
			
			outStr = outStr.replace('EXCLUDE_ARRAY_LIST', params.excludeCity);
			
			var str = outStr;
			
			str = str.replace(/fbgood_/gi, 'fb:');
			str = str.replace(/fb_req-choice/gi, 'fb:req-choice');
			str = str.replace('/fb:req-choice', '/fb:request');
			str = str.replace('/fb:req-choice', '/fb:req');
			
			var fbml = '<fb:fbml>'+str+'</fb:fbml>';
			
			nextParams +=  '&fbml='+encodeURIComponent(fbml);

			params.nextParams = nextParams;

			dump(FGS.getCurrentTime()+'[Z] FBMLinfo - OK');

			FGS.getFBML(params);
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
					dump(err);
					dump(err.message);
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
					dump(err);
					dump(err.message);
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