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
					
					var src = FGS.findIframeByName('mafiawars', dataStr);
					if (src == '') throw {message:"Cannot find <iframe src= in page"}
					
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
					var i1, i2, strTemp, myUrl, myParms;

					strTemp = dataStr;

					i1 = strTemp.indexOf('action="');
					if (i1 == -1) throw {message:"Cannot find action= in page"}
					
					i1 += 8;
					i2 = strTemp.indexOf('"',i1);
					myUrl = strTemp.slice(i1,i2);

					myParms = '';
					
					
					var count = strTemp.match(/<input[^>]*?.*?>/g);
					
					$(count).each(function(k,v)
					{
						
						var i1 = v.indexOf('name="')+6;
						if(i1 == 5) return;
						i2 = v.indexOf('"',i1);
						
						
						
						if (myParms=='')
							var tmpName = v.slice(i1,i2)+'=';
						else
							var tmpName = '&'+v.slice(i1,i2)+'=';
						
						
						var i1 = v.indexOf('value="')+7;
						if(i1 == 6) return;
						
						i2 = v.indexOf('"',i1);
						myParms += tmpName+escape(v.slice(i1,i2));
					});
					
					var useridtmp = $('input[name="sf_xw_user_id"]', dataHTML).val();
					var i1 = useridtmp.indexOf('|')+1;
					var useridfin = useridtmp.slice(i1);
					
					var i1 = myUrl.indexOf('&tmp=');
					var i2 = myUrl.indexOf('&', i1+1);
					var tmpTmp = myUrl.slice(i1, i2);
					
					var i1 = myUrl.indexOf('&cb=');				
					var i2 = myUrl.indexOf('&', i1+1);
					var tmpCb = myUrl.slice(i1, i2);
					
					params.sf_xw_user_id = $('input[name="sf_xw_user_id"]', dataHTML).val();
					params.sf_xw_sig = $('input[name="sf_xw_sig"]', dataHTML).val();				
					
					params.click3param = myParms;
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
				
					var i1,i2, myParms;
					var strTemp = dataStr;

					i1       =  strTemp.indexOf('FB.Facebook.init("');
					if (i1 == -1) throw {message:"Cannot find FB.init"}
					i1 += 18;
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
					if (src == '') throw {message:"Cannot find <iframe src= in page"}
					
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
					var i1, i2, strTemp, myUrl, myParms;

					strTemp = dataStr;

					i1 = strTemp.indexOf('action="');
					if (i1 == -1) throw {message:"Cannot find action= in page"}
					
					i1 += 8;
					i2 = strTemp.indexOf('"',i1);
					myUrl = strTemp.slice(i1,i2);

					myParms = '';
					
					
					var count = strTemp.match(/<input[^>]*?.*?>/g);
					
					$(count).each(function(k,v)
					{
						
						var i1 = v.indexOf('name="')+6;
						if(i1 == 5) return;
						i2 = v.indexOf('"',i1);
						
						
						
						if (myParms=='')
							var tmpName = v.slice(i1,i2)+'=';
						else
							var tmpName = '&'+v.slice(i1,i2)+'=';
						
						
						var i1 = v.indexOf('value="')+7;
						if(i1 == 6) return;
						
						i2 = v.indexOf('"',i1);
						myParms += tmpName+escape(v.slice(i1,i2));
					});
					
					
					var isBoost = false;
					
					if(myUrl.indexOf('mastery_boost') != -1)
					{
						isBoost = true;
					}
					
					FGS.mafiawarsRequests.Click4(currentType, id, myUrl, myParms, isBoost);
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
							
							var i1 = tmpText.indexOf(':');
							if(i1 != -1)
							{
								tmpText = tmpText.slice(i1+1);
							}
							
							var i2 = tmpText.indexOf('+');							
							if(i2 != -1)
							{
								info.text = tmpText.slice(i2);
								tmpText = tmpText.replace(info.text, '');
							}					
							
							info.title = tmpText;
						}
						else if(data.indexOf('You got an Energy Pack.') != -1)
						{
							var i1 = data.indexOf('You got an Energy Pack.');
							var i2 = data.indexOf('.', i1+23);
							
							info.image = $('img:first', dataHTML).attr('src');
							info.title = $('img:first', dataHTML).parent().text();
							info.text = data.slice(i1,i2);
						}
						else if(data.indexOf('Your Super Pignata contained') != -1)
						{
							info.image = $('img:first', dataHTML).attr('src');
							info.title = $('img:first', dataHTML).attr('title');
						}
						else if(data.indexOf('Requests from other Mafias') != -1)
						{
							var i1 = data.indexOf('http://facebook.mafiawars.com/mwfb/remote/html_server.php?xw_controller=recruit&xw_action=accept');
							var i2 = data.indexOf('"', i1);
							
							var newURL = data.slice(i1,i2);
							
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
					if (src == '') throw {message:"Cannot find <iframe src= in page"}

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
					var i1, i2, strTemp, myUrl, myParms;

					strTemp = dataStr;

					i1 = strTemp.indexOf('action="');
					if (i1 == -1) throw {message:"Cannot find action= in page"}
					
					i1 += 8;
					i2 = strTemp.indexOf('"',i1);
					myUrl = strTemp.slice(i1,i2);

					myParms = '';
					
					
					var count = strTemp.match(/<input[^>]*?.*?>/g);
					
					$(count).each(function(k,v)
					{
						
						var i1 = v.indexOf('name="')+6;
						if(i1 == 5) return;
						i2 = v.indexOf('"',i1);
						
						
						
						if (myParms=='')
							var tmpName = v.slice(i1,i2)+'=';
						else
							var tmpName = '&'+v.slice(i1,i2)+'=';
						
						
						var i1 = v.indexOf('value="')+7;
						if(i1 == 6) return;
						
						i2 = v.indexOf('"',i1);
						myParms += tmpName+escape(v.slice(i1,i2));
					});
					FGS.mafiawarsBonuses.Click3(currentType, id, myUrl, myParms);
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
					var strTemp = dataStr;
					
					if(strTemp.indexOf('Sorry, you already collected on this stash!') != -1 || strTemp.indexOf('secret stashes today, and have to wait') != -1 || strTemp.indexOf('You cannot claim this reward') != -1 || strTemp.indexOf('You have already received your free boost') != -1 || strTemp.indexOf('You have already helped') != -1 || strTemp.indexOf('has already paid out the bounty on this target') != -1 || strTemp.indexOf('This user has already received the maximum amount of help') != -1 || strTemp.indexOf('has already got their Energy Pack for today') != -1 || strTemp.indexOf('You cannot gift this item to people not in your mafia') != -1 || strTemp.indexOf('has received all the help allowed for today') != -1 || strTemp.indexOf('All of the available boosts have already been claimed') != -1 || strTemp.indexOf('This stash has already been found') != -1 || strTemp.indexOf('has passed out all available') != -1 || strTemp.indexOf('You already helped this user') != -1 || strTemp.indexOf('You can only receive') != -1 || strTemp.indexOf('cannot receive any more parts') != -1 || strTemp.indexOf('has no more free boosts to hand out') != -1 || strTemp.indexOf(', come back tomorrow to help out more') != -1 || strTemp.indexOf('You are too late to claim a reward') != -1 || strTemp.indexOf('You have already claimed the maximum number of') != -1)
					{
						FGS.endWithError('limit', currentType, id);
						return;
					}
					
					if(strTemp.indexOf('>Congratulations</div>') != -1) // Get Reward
					{
						var i1 = strTemp.indexOf('>Congratulations</div>');
						var i2 = strTemp.indexOf('You Have Received', i1);
						if(i2 == -1)
						{
							var i2 = strTemp.indexOf('You have received', i1);
						}
						var i3 = strTemp.indexOf('</div>', i2);
											
						info.image = 'gfx/90px-check.png';
						info.text  = strTemp.slice(i2,i3);
						info.title = strTemp.slice(i2+17,i3);					
					}
					else if(strTemp.indexOf('Congrats! You received a') != -1) // Grab your share
					{
						var i1 = strTemp.indexOf('Congrats! You received a');
						var i2 = strTemp.indexOf('from', i1);
						var i3 = strTemp.indexOf('</div>', i1);

						info.text  = strTemp.slice(i1,i3);
						info.image = $('td.message_body > div:nth-child(1)', dataHTML).find('img:first').attr('src');
						info.title = strTemp.slice(i1+25,i2);
					}
					else if(strTemp.indexOf('You received a Liquid Courage') != -1 || strTemp.indexOf(' to celebrate his recent promotion') != -1 || strTemp.indexOf('to celebrate her recent promotion') != -1)
					{
						var i1 = strTemp.indexOf('You received a');
						var i2 = strTemp.indexOf('from', i1);
						
						info.text  = $('td.message_body', dataHTML).text();
						info.image = $('td.message_body > img:nth-child(2)', dataHTML).attr('src');
						info.title = strTemp.slice(i1+15,i2);
					}
					else if(strTemp.indexOf('fight the enemy and claim a cash bounty') != -1)
					{
						info.title = 'Cash';
						info.text = 'Fight the enemy and claim a cash';
						info.image = 'http://mwfb.static.zynga.com/mwfb/graphics/buy_cash_75x75_01.gif';
					
						var strNotice = $('td.message_body', dataHTML).html();
						var myUrl = '';
						
						$('td.message_body', dataHTML).find('a').each(function()
						{
							if($(this).attr('href').indexOf('loot_confirmed=yes') != -1)
							{
								myUrl = $(this).attr('href');
								return false;
							}
						});
						
						$.post(myUrl, currentParams+'&ajax=1&liteload=1', function(){});
					}
					else if(strTemp.indexOf('You sent a') != -1 || strTemp.indexOf('You collected a') != -1)
					{
						info.title = $('td.message_body > div:nth-child(1)', dataHTML).find('img:first').attr('title');
						info.text =  $('td.message_body > div:nth-child(1)', dataHTML).find('img:first').parent().next('div').text();
						info.image = $('td.message_body > div:nth-child(1)', dataHTML).find('img:first').attr('src');
					}
					else if(strTemp.indexOf('loot_confirmed=yes') != -1)
					{
						var strTemp2 = $('td.message_body', dataHTML).text();
					
						var i1 = strTemp2.indexOf('You received a');
						var i2 = strTemp2.indexOf('from', i1);
						
						info.title = $('td.message_body > div:nth-child(2)', dataHTML).find('img:first').parent().next('div').text();
						info.text =  strTemp2.slice(i1,i2);
						info.image = $('td.message_body > div:nth-child(2)', dataHTML).find('img:first').attr('src');
						
						var body = $('td.message_body', dataHTML).html();
						
						if(body.indexOf('No Thanks') != -1)
						{
							var myUrl = '';
							
							$('td.message_body', dataHTML).find('a').each(function()
							{
								if($(this).attr('href').indexOf('loot_confirmed=yes') != -1)
								{
									myUrl = $(this).attr('href');
									return false;
								}
							});
							
							$.post(myUrl, currentParams+'&ajax=1&liteload=1', function(){});				
						}
					}
					else if(strTemp.indexOf('You collected a') != -1)
					{
						var i1 = strTemp.indexOf('You collected a');
						var i2 = strTemp.indexOf('from', i1);
						var i3 = strTemp.indexOf('</div>', i1);

						info.text  = strTemp.slice(i1,i3);
						info.image = $('td.message_body > div:nth-child(1)', dataHTML).find('img:first').attr('src');
						info.title = strTemp.slice(i1+16,i2);
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