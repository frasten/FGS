FGS.mafiawarsFreegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/inthemafia/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var src = FGS.findIframeByName('mafiawars', dataStr);
					if (src == '') throw {message:"no iframe"}
					params.click2url = src;					
					FGS.mafiawarsFreegifts.Click2(params);
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
			url: params.click2url+''+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var tst = new RegExp(/<form.*[^>]action="(.*)" .*>/).exec(dataStr);
					if(tst == null) throw {message: 'no form'}
					
					var tmpUrl = tst[1];
					
					var count = dataStr.match(/<input[^>]*?.*?>/g);
					
					var nextParams = '';
					
					$(count).each(function(k,v)
					{
						
						var pos1 = v.indexOf('name="')+6;
						if(pos1 == 5) return;
						pos2 = v.indexOf('"',pos1);
						
						if (nextParams=='')
							var tmpName = v.slice(pos1,pos2)+'=';
						else
							var tmpName = '&'+v.slice(pos1,pos2)+'=';
						
						
						var pos1 = v.indexOf('value="')+7;
						if(pos1 == 6) return;
						
						pos2 = v.indexOf('"',pos1);
						nextParams += tmpName+escape(v.slice(pos1,pos2));
					});
					
					var useridtmp = $('input[name="sf_xw_user_id"]', dataHTML).val();
					var pos1 = useridtmp.indexOf('|')+1;
					var useridfin = useridtmp.slice(pos1);
					
					
					var pos1 = tmpUrl.indexOf('&tmp=');
					var pos2 = tmpUrl.indexOf('&', pos1+1);
					var tmpTmp = tmpUrl.slice(pos1, pos2);
					
					
					var pos1 = tmpUrl.indexOf('&cb=');				
					var pos2 = tmpUrl.indexOf('&', pos1+1);
					var tmpCb = tmpUrl.slice(pos1, pos2);
					
					
					params.sf_xw_user_id = $('input[name="sf_xw_user_id"]', dataHTML).val();
					params.sf_xw_sig = $('input[name="sf_xw_sig"]', dataHTML).val();				
					
					params.click3param = nextParams;
					params.click3url = 'http://facebook.mafiawars.com/mwfb/remote/html_server.php?xw_controller=requests&xw_action=friend_selector&xw_city=1&req_controller=freegifts&free_gift_id='+params.gift+'&free_gift_cat=1&xw_client_id=8&ajax=1&liteload=1&fbml_iframe=1&xw_person='+useridfin+tmpTmp+tmpCb;
				
					FGS.mafiawarsFreegifts.Click3(params);
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
,
	Click3: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "POST",
			url: params.click3url+''+addAntiBot,
			data: params.click3param,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var tst = new RegExp(/FB[.]Facebook[.]init\("(.*)".*"(.*)"/g).exec(dataStr);
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


FGS.mafiawarsRequests = 
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
				
					var src = FGS.findIframeByName('mafiawars', dataStr);
					if (src == '') throw {message:"no iframe"}
					
					FGS.mafiawarsRequests.Click3(currentType, id, src);
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
					var tst = new RegExp(/<form.*[^>]action="(.*)" .*>/).exec(dataStr);
					if(tst == null) throw {message: 'no form'}
					
					var tmpUrl = tst[1];
					
					var count = dataStr.match(/<input[^>]*?.*?>/g);
					
					var nextParams = '';
					
					$(count).each(function(k,v)
					{
						var pos1 = v.indexOf('name="')+6;
						if(pos1 == 5) return;
						pos2 = v.indexOf('"',pos1);
						
						if (nextParams=='')
							var tmpName = v.slice(pos1,pos2)+'=';
						else
							var tmpName = '&'+v.slice(pos1,pos2)+'=';

						var pos1 = v.indexOf('value="')+7;
						if(pos1 == 6) return;
						
						pos2 = v.indexOf('"',pos1);
						nextParams += tmpName+escape(v.slice(pos1,pos2));
					});
					
					var isBoost = false;
					
					if(tmpUrl.indexOf('mastery_boost') != -1)
					{
						isBoost = true;
					}
					
					FGS.mafiawarsRequests.Click4(currentType, id, tmpUrl, nextParams, isBoost);
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
	
	Click4:function(currentType, id, currentURL, currentParams, isBoost, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "POST",
			url: currentURL,
			data: currentParams,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);

				try
				{
					var data = dataStr;
					
					if(data.indexOf('Something has gone wrong') != -1)  throw {message:"Something is wrong"}
					if(data.indexOf('This gift is expired') != -1)		throw {message:"Gift expired"}
					
					info.text = '';
					
					if(isBoost)
					{
						info.image = 'icons/reqs/noimage.png';
						info.title = 'Mastery Boost';
					}
					else
					{
						if(data.indexOf('Mystery Bag contained') != -1 || data.indexOf('Secret Drop contained') != -1 || data.indexOf('Your Mystery Animal is') != -1 || data.indexOf('You just accepted') != -1)
						{

							var testStr = $('img:first', dataHTML).attr('src');
							
							if(testStr.indexOf('CRM_LP-icon-bonus.png') != -1)
							{
								info.text = $('img:first', dataHTML).parent().text();
							}

							$('img', dataHTML).each(function()
							{
								if($(this).css('height') == '75px')
								{
									info.image = $(this).attr('src');
									info.title = '';
									
									$(this).parent().children('div').each(function()
									{
										if($.trim($(this).text()) != '')
										{
											info.title = $(this).text();
											return false;
										}
									});
								}
							});
						}
						else if(data.indexOf('a Mystery Bag item instead') != -1)
						{
							info.image = $('img:first', dataHTML).attr('src');
							var tmpText = $('.good:first', dataHTML).text();
							
							var pos1 = tmpText.indexOf(':');
							if(pos1 != -1)
							{
								tmpText = tmpText.slice(pos1+1);
							}
							
							var pos2 = tmpText.indexOf('+');							
							if(pos2 != -1)
							{
								info.text = tmpText.slice(pos2);
								tmpText = tmpText.replace(info.text, '');
							}					
							
							info.title = tmpText;
						}
						else if(data.indexOf('You got an Energy Pack.') != -1)
						{
							var pos1 = data.indexOf('You got an Energy Pack.');
							var pos2 = data.indexOf('.', pos1+23);
							
							info.image = $('img:first', dataHTML).attr('src');
							info.title = $('img:first', dataHTML).parent().text();
							info.text = data.slice(pos1,pos2);
						}
						else if(data.indexOf('Your Super Pignata contained') != -1)
						{
							info.image = $('img:first', dataHTML).attr('src');
							info.title = $('img:first', dataHTML).attr('title');
						}
						else if(data.indexOf('Requests from other Mafias') != -1)
						{
							var pos1 = data.indexOf('http://facebook.mafiawars.com/mwfb/remote/html_server.php?xw_controller=recruit&xw_action=accept');
							var pos2 = data.indexOf('"', pos1);
							
							var newURL = data.slice(pos1,pos2);
							
							$.ajax({
								type: "POST",
								url: newURL,
								data: currentParams,
								dataType: 'text',
								success: function(data) {}
							});
							
							//$.post(newURL, {sf_xw_user_id: '', sf_xw_sig: ''}, function(d){});
							info.image = 'icons/reqs/noimage.png';
							info.title = 'New recruits';
						}
						else
						{
							info.image = $('img:first', dataHTML).attr('src');
							info.title = $('img:first', dataHTML).parent().text();
						}
					}
					
					if(info.title.indexOf('Try Refreshing') != -1)
					{
						throw {message:"Unknown page"}
					}

					var sendInfo = '';
					
					if(data.indexOf('pic uid="') != -1 && data.indexOf('free_gift_id=') != -1)
					{
						
						var pos1 = data.indexOf('free_gift_id=');
						var pos2 = data.indexOf("'", pos1);
						var giftName = data.slice(pos1+13, pos2);
						
						var pos1 = data.indexOf('pic uid="');
						var pos2 = data.indexOf('"', pos1+9);
						var receiveUid = data.slice(pos1+9, pos2);
						
						
						var pos1 = data.indexOf('false; " >', pos2);
						var pos2 = data.indexOf('</a', pos1);
						var receiveName = data.slice(pos1+10, pos2);

						sendInfo = {
							gift: giftName,
							destInt: receiveUid,
							destName: receiveName,
						}
					}
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
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', currentParams, isBoost, true);
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
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', currentParams, isBoost, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
};


FGS.mafiawarsBonuses = 
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
					var src = FGS.findIframeByName('mafiawars', dataStr);
					if (src == '') throw {message:"no iframe"}

					FGS.mafiawarsBonuses.Click2(currentType, id, src);
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
			//dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = dataStr.substr(dataStr.indexOf('<body'),dataStr.lastIndexOf('</body'));
				
				try
				{
					var tst = new RegExp(/<form.*[^>]action="(.*)" .*>/).exec(dataStr);
					if(tst == null) throw {message: 'no form'}
					
					var tmpUrl = tst[1];
					
					var count = dataStr.match(/<input[^>]*?.*?>/g);
					
					var nextParams = '';
					
					var count = dataStr.match(/<input[^>]*?.*?>/g);
					
					$(count).each(function(k,v)
					{
						
						var pos1 = v.indexOf('name="')+6;
						if(pos1 == 5) return;
						pos2 = v.indexOf('"',pos1);

						if (nextParams=='')
							var tmpName = v.slice(pos1,pos2)+'=';
						else
							var tmpName = '&'+v.slice(pos1,pos2)+'=';
						
						
						var pos1 = v.indexOf('value="')+7;
						if(pos1 == 6) return;
						
						pos2 = v.indexOf('"',pos1);
						nextParams += tmpName+escape(v.slice(pos1,pos2));
					});
					
					FGS.mafiawarsBonuses.Click3(currentType, id, tmpUrl, nextParams);
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
	
	Click3:	function(currentType, id, currentURL, currentParams, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "POST",
			url: currentURL,
			data: currentParams,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);

				try
				{
					if(dataStr.indexOf('Sorry, you already collected on this stash!') != -1 || dataStr.indexOf('secret stashes today, and have to wait') != -1 || dataStr.indexOf('You cannot claim this reward') != -1 || dataStr.indexOf('You have already received your free boost') != -1 || dataStr.indexOf('You have already helped') != -1 || dataStr.indexOf('has already paid out the bounty on this target') != -1 || dataStr.indexOf('This user has already received the maximum amount of help') != -1 || dataStr.indexOf('has already got their Energy Pack for today') != -1 || dataStr.indexOf('You cannot gift this item to people not in your mafia') != -1 || dataStr.indexOf('has received all the help allowed for today') != -1 || dataStr.indexOf('All of the available boosts have already been claimed') != -1 || dataStr.indexOf('This stash has already been found') != -1 || dataStr.indexOf('has passed out all available') != -1 || dataStr.indexOf('You already helped this user') != -1 || dataStr.indexOf('You can only receive') != -1 || dataStr.indexOf('cannot receive any more parts') != -1 || dataStr.indexOf('has no more free boosts to hand out') != -1 || dataStr.indexOf(', come back tomorrow to help out more') != -1 || dataStr.indexOf('You are too late to claim a reward') != -1 || dataStr.indexOf('You have already claimed the maximum number of') != -1) // You are too late to help
					{
						FGS.endWithError('limit', currentType, id);
						return;
					}
					
					if(dataStr.indexOf('>Congratulations</div>') != -1) // Get Reward
					{
						var pos1 = dataStr.indexOf('>Congratulations</div>');
						var pos2 = dataStr.indexOf('You Have Received', pos1);
						if(pos2 == -1)
						{
							var pos2 = dataStr.indexOf('You have received', pos1);
						}
						var pos3 = dataStr.indexOf('</div>', pos2);
											
						info.image = 'gfx/90px-check.png';
						info.text  = dataStr.slice(pos2,pos3);
						info.title = dataStr.slice(pos2+17,pos3);					
					}
					else if(dataStr.indexOf('Congrats! You received a') != -1) // Grab your share
					{
						var pos1 = dataStr.indexOf('Congrats! You received a');
						var pos2 = dataStr.indexOf('from', pos1);
						var pos3 = dataStr.indexOf('</div>', pos1);

						info.text  = dataStr.slice(pos1,pos3);
						info.image = $('td.message_body > div:nth-child(1)', dataHTML).find('img:first').attr('src');
						info.title = dataStr.slice(pos1+25,pos2);
					}
					else if(dataStr.indexOf('You received a Liquid Courage') != -1 || dataStr.indexOf(' to celebrate his recent promotion') != -1 || dataStr.indexOf('to celebrate her recent promotion') != -1)
					{
						var pos1 = dataStr.indexOf('You received a');
						var pos2 = dataStr.indexOf('from', pos1);
						
						info.text  = $('td.message_body', dataHTML).text();
						info.image = $('td.message_body > img:nth-child(2)', dataHTML).attr('src');
						info.title = dataStr.slice(pos1+15,pos2);
					}
					else if(dataStr.indexOf('fight the enemy and claim a cash bounty') != -1)
					{
						info.title = 'Cash';
						info.text = 'Fight the enemy and claim a cash';
						info.image = 'http://mwfb.static.zynga.com/mwfb/graphics/buy_cash_75x75_01.gif';
					
						var strNotice = $('td.message_body', dataHTML).html();
						var tmpUrl = '';
						
						$('td.message_body', dataHTML).find('a').each(function()
						{
							if($(this).attr('href').indexOf('loot_confirmed=yes') != -1)
							{
								tmpUrl = $(this).attr('href');
								return false;
							}
						});
						
						$.post(tmpUrl, currentParams+'&ajax=1&liteload=1', function(){});
					}
					else if(dataStr.indexOf('You sent a') != -1 || dataStr.indexOf('You collected a') != -1)
					{
						info.title = $('td.message_body > div:nth-child(1)', dataHTML).find('img:first').attr('title');
						info.text =  $('td.message_body > div:nth-child(1)', dataHTML).find('img:first').parent().next('div').text();
						info.image = $('td.message_body > div:nth-child(1)', dataHTML).find('img:first').attr('src');
					}
					else if(dataStr.indexOf('loot_confirmed=yes') != -1)
					{
						var dataStr2 = $('td.message_body', dataHTML).text();
					
						var pos1 = dataStr2.indexOf('You received a');
						var pos2 = dataStr2.indexOf('from', pos1);
						
						info.title = $('td.message_body > div:nth-child(2)', dataHTML).find('img:first').parent().next('div').text();
						info.text =  dataStr2.slice(pos1,pos2);
						info.image = $('td.message_body > div:nth-child(2)', dataHTML).find('img:first').attr('src');
						
						var body = $('td.message_body', dataHTML).html();
						
						if(body.indexOf('No Thanks') != -1)
						{
							var tmpUrl = '';
							
							$('td.message_body', dataHTML).find('a').each(function()
							{
								if($(this).attr('href').indexOf('loot_confirmed=yes') != -1)
								{
									tmpUrl = $(this).attr('href');
									return false;
								}
							});
							
							$.post(tmpUrl, currentParams+'&ajax=1&liteload=1', function(){});				
						}
					}
					else if(dataStr.indexOf('You collected a') != -1)
					{
						var pos1 = dataStr.indexOf('You collected a');
						var pos2 = dataStr.indexOf('from', pos1);
						var pos3 = dataStr.indexOf('</div>', pos1);

						info.text  = dataStr.slice(pos1,pos3);
						info.image = $('td.message_body > div:nth-child(1)', dataHTML).find('img:first').attr('src');
						info.title = dataStr.slice(pos1+16,pos2);
					}
					else
					{
						throw {message: dataStr}
					}
					
					info.time  = Math.round(new Date().getTime() / 1000);
					
					FGS.endWithSuccess(currentType, id, info);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', currentParams, true);
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
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', currentParams, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
};