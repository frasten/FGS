FGS.cityville.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/cityville/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var pos0 = dataStr.indexOf('"content":{"pagelet_canvas_content":');
					if(pos0 != -1)
					{
						var pos1 = dataStr.indexOf('>"}', pos0);
						var dataStr = JSON.parse(dataStr.slice(pos0+10, pos1+3)).pagelet_canvas_content;
					}
					
					var dataHTML = FGS.HTMLParser(dataStr);
					
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params2 = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url) throw {message: 'fail'}
					
					params.step1url = url;
					params.step1params = params2;
					
					FGS.cityville.Freegifts.Click2(params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
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
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "POST",
			url: params.step1url+addAntiBot,
			data: params.step1params,
			//url: params.step2url+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.step1url.match(re)[1].toString();
					
					var nextUrl = 'http://'+params.domain+'/';			

					dataStr = dataStr.replace(/window\.ZYFrameManager/g, '').replace("ZYFrameManager.navigateTo('invite.php", '');
					
					var pos1 = dataStr.indexOf("ZYFrameManager.navigateTo('");
					
					if(pos1 != -1)
					{
						var pos2 = dataStr.indexOf("'", pos1)+1;
						var pos3 = dataStr.indexOf("'", pos2);
						
						params.step1url = nextUrl+dataStr.slice(pos2,pos3).replace(nextUrl, '');
						retryThis(params);
						return;
					}
					
					var pos1 = dataStr.indexOf('new ZY(');
					if(pos1 == -1) throw {message: 'No new ZY'}
					pos1+=7;
					var pos2 = dataStr.indexOf('},', pos1)+1;
					
					var zyParam = JSON.parse(dataStr.slice(pos1,pos2));
					
					zyParam.snapi_auth = zyParam.zyAuthHash;
					
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.step1url.match(re)[1].toString();
					params.zyParam = FGS.jQuery.param(zyParam);
					
					FGS.cityville.Freegifts.Click3(params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
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
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		$.ajax({
			type: "POST",
			url: 'http://'+params.domain+'/gifts.php?action=chooseRecipient&view=app&ref=&'+params.zyParam+addAntiBot,
			data: 'giftRecipient=&gift='+params.gift+'&ref=&'+params.zyParam,
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

					outStr += '<fbGood_request-form invite="'+inviteAttr+'" action="'+actionAttr+'" method="'+methodAttr+'" type="'+typeAttr+'" content="'+contentAttr+'"><div><fb:multi-friend-selector cols="5" condensed="true" max="30" unselected_rows="6" selected_rows="5" email_invite="false" rows="5" exclude_ids="EXCLUDE_ARRAY_LIST" actiontext="Select a gift" import_external_friends="false"></fb:multi-friend-selector><fb:request-form-submit import_external_friends="false"></fb:request-form-submit><a style="display: none" href="http://fb-0.FGS.cityville.zynga.com/flash.php?skip=1">Skip</a></div></fbGood_request-form>';
					
					outStr += '</div>';
					
					var cmd_id = new Date().getTime();
					
					var pos1 = data.indexOf('SNAPI.init(');
					var pos2 = data.indexOf('{', pos1);
					var pos3 = data.indexOf('}},', pos2)+2;
					
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
						app_id:	'75',
						authHash: FGS.Gup('zyAuthHash', params.zyParam),
						zid:	zy_user,
						snid:	1,
					}
					
					params.altHash = session;
					params.postData = postData;
					params.excludeCity = exclude;
					
					params.outStr = outStr;

					FGS.cityville.Freegifts.Click4(params);
					
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
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
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		
		var postData = params.postData;
		if(typeof(retry) != 'undefined')
		{
			postData.authHash = params.altHash;
		}
					
		var outStr = params.outStr;
		
		$.ajax({
			type: "POST",
			url: 'http://fb-client-0.cityville.zynga.com/snapi_proxy.php',
			data: postData,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var nextParams = 'api_key=291549705119&locale=en_US&sdk=joey';
					
					var info = JSON.parse(dataStr);
					
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

					FGS.dump(FGS.getCurrentTime()+'[Z] FBMLinfo - OK');

					FGS.getFBML(params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
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


FGS.cityville.Requests =
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
					var pos0 = dataStr.indexOf('"content":{"pagelet_canvas_content":');
					if(pos0 != -1)
					{
						var pos1 = dataStr.indexOf('>"}', pos0);
						var dataStr = JSON.parse(dataStr.slice(pos0+10, pos1+3)).pagelet_canvas_content;
						var dataHTML = FGS.HTMLParser(dataStr);		
					}
					
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					FGS.cityville.Requests.Click2(currentType, id, url, params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, true);
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
					retryThis(currentType, id, currentURL, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	Click2:	function(currentType, id, currentURL, params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "POST",
			data: params,
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var URL = currentURL;
					
					var pos1 = 0;
					var pos2 = URL.lastIndexOf('/')+1;
					
					var nextUrl = URL.slice(pos1,pos2);
					
					dataStr = dataStr.replace(/window\.ZYFrameManager/g, '').replace("ZYFrameManager.navigateTo('invite.php", '');

					var pos1 = dataStr.indexOf("ZYFrameManager.navigateTo('");
					
					if(pos1 == -1) throw {}
					
					var pos2 = dataStr.indexOf("'", pos1)+1;
					var pos3 = dataStr.indexOf("'", pos2);
					
					var nextUrl2 = dataStr.slice(pos2,pos3).replace(nextUrl, '');
					
					nextUrl = nextUrl+nextUrl2+'&overlayed=true&'+new Date().getTime()+'#overlay';

					FGS.cityville.Requests.Click3(currentType, id, nextUrl);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, params, true);
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
					retryThis(currentType, id, currentURL, params, true);
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
					if($('.errorMessage', dataHTML).length > 0 || $('.giftLimit', dataHTML).length > 0 || dataStr.indexOf('Always accept requests as soon as possible') != -1 || dataStr.indexOf('You are already neighbors with this person') != -1)
					{
						if($('.errorMessage', dataHTML).length > 0)
						{
							var error_text = $.trim($('.errorMessage', dataHTML).text());
						}
						else if($('.giftLimit', dataHTML).length > 0)
						{
							var error_text = $.trim($('.giftLimit', dataHTML).text());
						}						
						else if(dataStr.indexOf('Always accept requests as soon as possible') != -1)
						{
							var error_text = $.trim($('.message', dataHTML).text());
						}
						else if(dataStr.indexOf('You are already neighbors with this person') != -1)
						{
							var error_text = 'You are already neighbors with this person';
						}
						else
						{						
							var error_text = 'There was problem receiving this gift. You have probably already accepted it';
						}
						
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}

					info.title = $(".giftConfirm_name",dataHTML).children().text();
					info.time = Math.round(new Date().getTime() / 1000);

					if($('h3.gift_title', dataHTML).text().indexOf('are now neighbors') != -1)
					{
						info.image = $(".giftFrom_img",dataHTML).children().attr("src");
						info.title = 'New neighbour';
						info.text  = $(".giftFrom_name",dataHTML).children().text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
						return;
						
					}
					else if($('.train_message', dataHTML).length > 0)
					{
						info.image = 'http://fb-client-0.cityville.zynga.com/'+$(".train_reward_icon",dataHTML).children().attr("src");
						info.title = 'Coin bonus';
						info.text  = $(".train_message",dataHTML).children().text();
						
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					else if($('.message', dataHTML).text().indexOf('You have adopted') != -1)
					{
						info.image 	= $(".img_container",dataHTML).children().attr("src");
						info.text 	= $(".message",dataHTML).text();
						
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					else if($('h3.gift_title', dataHTML).text().indexOf('have been made') != -1)
					{
						info.image = $(".giftConfirm_img",dataHTML).children().attr("src");
						
						var tempTitle = $(".giftConfirm_name",dataHTML).children().html();
						var pos1 = tempTitle.indexOf('<br');
						if(pos1 != -1)
						{
							var pos2 = tempTitle.indexOf('>', pos1);
							tempTitle = tempTitle.replace(tempTitle.slice(pos1,pos2+1), ' ');
						}
						info.title = tempTitle;
						info.text  = $('h3.gift_title', dataHTML).text();						
						
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					else if($(".giftFrom_name",dataHTML).length > 0)
					{
						var sendInfo = '';
						
						var tmpStr = unescape(currentURL);
						
						var pos1 = tmpStr.indexOf('?gift=');
						if(pos1 == -1)
						{
							pos1 = tmpStr.indexOf('&gift=');
						}
						if(pos1 != -1)
						{
							var pos2 = tmpStr.indexOf('&', pos1+1);
								
							var giftName = tmpStr.slice(pos1+6,pos2);
							
							var pos1 = tmpStr.indexOf('senderId=');
							var pos2 = tmpStr.indexOf('&', pos1+1);
							
							var giftRecipient = tmpStr.slice(pos1+9,pos2);						
								
							sendInfo = {
								gift: giftName,
								destInt: giftRecipient,
								destName: $('.giftFrom_name', dataHTML).children().text()
								}
						}
						info.thanks = sendInfo;
						
						info.image = $(".giftConfirm_img",dataHTML).children().attr("src");
						info.title = $(".giftConfirm_name",dataHTML).children().text();
						info.text = $(".giftFrom_name",dataHTML).children().text();
						
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					else
					{
						throw {message: dataStr}
					}
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, true);
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
					retryThis(currentType, id, currentURL, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
};

FGS.cityville.Bonuses = 
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
					var pos0 = dataStr.indexOf('"content":{"pagelet_canvas_content":');
					if(pos0 != -1)
					{
						var pos1 = dataStr.indexOf('>"}', pos0);
						var dataStr = JSON.parse(dataStr.slice(pos0+10, pos1+3)).pagelet_canvas_content;
						var dataHTML = FGS.HTMLParser(dataStr);
					}
					
					
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					FGS.cityville.Requests.Click2(currentType, id, url, params);
				} 
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, true);
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
					retryThis(currentType, id, currentURL, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	Click2:	function(currentType, id, currentURL, params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "POST",
			data: params,
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var URL = currentURL;
					
					var pos1 = 0;
					var pos2 = URL.lastIndexOf('/')+1;
					
					var nextUrl = URL.slice(pos1,pos2);
					
					dataStr = dataStr.replace(/window\.ZYFrameManager/g, '').replace("ZYFrameManager.navigateTo('invite.php", '');

					var pos1 = dataStr.indexOf("ZYFrameManager.navigateTo('");
					
					if(pos1 == -1) throw {message: 'no zyframe manager'}
					
					var pos2 = dataStr.indexOf("'", pos1)+1;
					var pos3 = dataStr.indexOf("'", pos2);
					
					var nextUrl2 = dataStr.slice(pos2,pos3).replace(nextUrl, '');
					
					nextUrl = nextUrl+nextUrl2+'&overlayed=true&'+new Date().getTime()+'#overlay';
					
					
					FGS.cityville.Bonuses.Click3(currentType, id, nextUrl);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, params, true);
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
					retryThis(currentType, id, currentURL, params, true);
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
					if($('.errorMessage', dataHTML).length > 0)
					{ 
						var error_text = $.trim($('.errorMessage', dataHTML).text());
						FGS.endWithError('limit', currentType, id, error_text);	
						return;
					}
					
					if(dataStr.indexOf('The train has already finished its trip') != -1)
					{
						var error_text = 'The train has already finished its trip';
						FGS.endWithError('limit', currentType, id, error_text);	
						return;
					}
					
					info.text = $('h3.gift_title', dataHTML).text();
					info.title = $(".giftConfirm_name",dataHTML).children().text();
					info.image = $(".giftConfirm_img",dataHTML).children().attr("src");
					info.time = Math.round(new Date().getTime() / 1000);

					FGS.endWithSuccess(currentType, id, info);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, true);
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
					retryThis(currentType, id, currentURL, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
};