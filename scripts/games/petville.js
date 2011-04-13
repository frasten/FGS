FGS.petville.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/petvillegame/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var pos0 = dataStr.indexOf('"content":{"pagelet_canvas_content":');
					var pos1 = dataStr.indexOf('>"}', pos0);
					
					var dataStr = JSON.parse(dataStr.slice(pos0+10, pos1+3)).pagelet_canvas_content;
					var dataHTML = FGS.HTMLParser(dataStr);		


					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params2 = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();					
					
					if(!url) throw {message: 'fail'}
					
					

					var pos1 = url.indexOf('pv_session=')+11;
					var pos2 = url.indexOf('&', pos1);
					
					params.pv_session = url.slice(pos1, pos2);
					FGS.petville.Freegifts.Click2(params);
					
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
			type: "GET",
			url: 'http://fb-client-0.petville.zynga.com/current/gifts_send.php?pv_session='+params.pv_session+'&giftRecipient=&ref=tab&view=petville&overlayed=true&send_gift=Proceed+to+Send+%3E%3E%3E&gift='+params.gift+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					if(dataStr.indexOf('snml:') == -1)
					{
						retry = true;
						throw {message: 'invalid gift'}
					}
					
					var data = dataStr.replace(/snml:/g, 'fb_');
					
					var outStr = '';
										
					
					var pos1 = data.indexOf('<fb_serverSnml');
					
					var s1 = data.indexOf('<table', pos1);
					var s2 = data.indexOf('/center>', s1);
					
					outStr += data.slice(s1, s2+8);
					
					//var s1 = data.indexOf('<div', pos1);
					//var s2 = data.indexOf('/div', s1);
					
					//outStr += data.slice(s1, s2+5);
					
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
					
					//outStr += '<div class="mfs">';
					
					var inviteAttr 	= data.slice(pos1+8, data.indexOf('"', pos1+8));
					var actionAttr	= data.slice(a1+8, data.indexOf('"', a1+8));
					var methodAttr 	= data.slice(m1+8, data.indexOf('"', m1+8));
					var typeAttr	= data.slice(t1+6, data.indexOf('"', t1+6));
					
					var c1 = data.indexOf('<fb_content', f1);
					var c11 = data.indexOf('>', c1);
					var c12 = data.indexOf('/fb_content>',c11);
					
					var contentTmp = data.slice(c11+1, c12-1).replace(/\"/g, "'");
					
					var contentAttr = FGS.encodeHtmlEntities(contentTmp);

					//$(FGS.HTMLParser('<p class="link" href="'+contentTmp+'">abc</p>')).find('p.link').attr('href');
					//var contentAttr = encodeURIComponent(data.slice(c11+1, c12-1));
					//var contentAttr = data.slice(c11+1, c12);
					
					
					outStr += '<fbGood_request-form invite="'+inviteAttr+'" action="'+actionAttr+'" method="'+methodAttr+'" type="'+typeAttr+'" content="'+contentAttr+'"><div><fb:multi-friend-selector cols="5" condensed="true" max="30" unselected_rows="6" selected_rows="5" email_invite="false" rows="5" exclude_ids="EXCLUDE_ARRAY_LIST" actiontext="Select a gift" import_external_friends="false"></fb:multi-friend-selector><fb:request-form-submit import_external_friends="false"></fb:request-form-submit><a style="display: none" href="http://fb-0.FGS.cityville.zynga.com/flash.php?skip=1">Skip</a></div></fbGood_request-form>';
					
					
					
					outStr += '</td></tr></table>';
					
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
						authHash: session,
						zid:	zy_user,
						snid:	1,
					}
					
					params.postData = postData;
					params.excludeCity = exclude;
					
					params.outStr = outStr;
					
					
					
					FGS.petville.Freegifts.Click3(params);
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

		var outStr = params.outStr;
		
		
		$.post('http://fb-client-0.petville.zynga.com/current/SNAPIProxy.php', params.postData, function(data2)
		{
		
			var nextParams = 'api_key=163576248142&locale=en_US&sdk=joey';
			
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
				//params.sendTo[0] = info.body[params.sendTo[0]];
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
		});
	}
};

FGS.petville.Requests = 
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
					var pos0 = dataStr.indexOf('"content":{"pagelet_canvas_content":');
					var pos1 = dataStr.indexOf('>"}', pos0);
					
					var dataStr = JSON.parse(dataStr.slice(pos0+10, pos1+3)).pagelet_canvas_content;
					var dataHTML = FGS.HTMLParser(dataStr);		


					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					FGS.petville.Requests.Click2(currentType, id, url, params);
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
			url: currentURL,
			data: params,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var URL = FGS.findIframeAfterId('#flashFrame', dataStr);
					if (URL == '') throw {message:"no iframe"}

					var pos1 = 0;
					var pos2 = URL.lastIndexOf('/')+1;
					
					var nextUrl = URL.slice(pos1,pos2);

					var pos1 = dataStr.indexOf('ZYFrameManager.gotoTab');
					var pos2 = dataStr.indexOf(",'", pos1)+2;
					var pos3 = dataStr.indexOf("'", pos2);
					
					nextUrl = nextUrl+dataStr.slice(pos2,pos3);
					
					
					FGS.petville.Requests.Click3(currentType, id, nextUrl);
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
					if($('.reqFrom_img', dataHTML).length > 0 && $(".giftConfirm_img" ,dataHTML).length == 0)
					{
						info.image = $(".reqFrom_img" ,dataHTML).children().attr("src");
						info.title = 'New neighbour';
						info.text  = $(".reqFrom_name" ,dataHTML).children().text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
					}
					else if($('.giftFrom_img', dataHTML).length > 0 && $(".giftConfirm_img" ,dataHTML).length > 0)
					{
						var sendInfo = '';
						
						var tmpStr = unescape(currentURL);
						
						var pos1 = tmpStr.indexOf('&gift=');
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
						
						info.image = $(".giftConfirm_img" ,dataHTML).children().attr("src");
						info.title = $(".giftConfirm_name" ,dataHTML).children().text();
						info.text  = $(".giftFrom_name" ,dataHTML).children().text();
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

FGS.petville.Bonuses =
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
					var pos1 = dataStr.indexOf('>"}', pos0);
					
					var dataStr = JSON.parse(dataStr.slice(pos0+10, pos1+3)).pagelet_canvas_content;
					var dataHTML = FGS.HTMLParser(dataStr);		


					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					FGS.petville.Bonuses.Click2(currentType, id, url, params);

					//FGS.petville.Bonuses.Click2(currentType, id, src);
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
			url: currentURL,
			data: params,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var URL = FGS.findIframeAfterId('#flashFrame', dataStr);
					if (URL == '') throw {message:"no iframe"}
					
					var pos1 = 0;
					var pos2 = URL.lastIndexOf('/')+1;
					
					var nextUrl = URL.slice(pos1,pos2);

					var pos1 = dataStr.indexOf('ZYFrameManager.gotoTab');
					
					if(pos1 == -1) throw {message: 'No ZYframeManager'}
					
					var pos2 = dataStr.indexOf(",'", pos1)+2;
					var pos3 = dataStr.indexOf("'", pos2);
					
					var nextUrl2 = dataStr.slice(pos2,pos3).replace('http://fb-client-0.petville.zynga.com/current/', '');
					
					nextUrl = nextUrl+nextUrl2+'&overlayed=true&'+new Date().getTime()+'#overlay';
					
					
					FGS.petville.Bonuses.Click3(currentType, id, nextUrl);
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
					var out = $.trim($('.main_giftConfirm_cont', dataHTML).text());
					
					if(out.indexOf('You already claimed') != -1 ||  out.indexOf('The item is all gone') != -1  || out.indexOf('already received') != -1 || out.indexOf('the celebration has ended') != -1 || out.indexOf('you cannot claim the celebration') != -1 || out.indexOf('this feed is only for friends') != -1)
					{
						var error_text = out;
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(out.indexOf('cannot claim more than') != -1 || out.indexOf('Claim more tomorrow') != -1)
					{
						var error_text = out;
						FGS.endWithError('other', currentType, id, error_text);
						return;
					}
					
					var outText = '';
					
					if(out.indexOf('been offered') != -1)
					{
						var pos1 = out.indexOf(' been offered')+13;
						var pos2 = out.indexOf('.', pos1);
						var pos3 = out.indexOf('!', pos1);
						if(pos3 != -1)
							if(pos3 < pos2 || pos2 == -1)
								pos2 = pos3;
						
						outText = out.slice(pos1,pos2);
					}
					else if(out.indexOf('has shared a') != -1)
					{
						var pos1 = out.indexOf('has shared a')+13;
						var pos2 = out.indexOf('!', pos1);
						var pos3 = out.indexOf('with', pos1);
						if(pos3 != -1)
							if(pos3 < pos2 || pos2 == -1)
								pos2 = pos3;
						
						outText = out.slice(pos1,pos2);						
						
						outText = outText.replace('bonus of', '');
					}
					else if(out.indexOf('want to claim') != -1)
					{
						var pos1 = out.indexOf('want to claim')+13;
						var pos2 = out.indexOf('?', pos1);
						outText = out.slice(pos1,pos2);						
					}
					else if(out.indexOf('You recieved a') != -1)
					{
						var pos1 = out.indexOf('You recieved a')+15;
						var pos2 = out.indexOf('from', pos1);
						outText = out.slice(pos1,pos2);						
					}
					else if(out.indexOf('You found a') != -1)
					{
						var pos1 = out.indexOf('You found a')+12;
						var pos2 = out.indexOf(',', pos1);
						outText = out.slice(pos1,pos2);						
					}
					else if(out.indexOf('Here are ') != -1)
					{
						var pos1 = out.indexOf('Here are ')+9;
						var pos2 = out.indexOf('for', pos1);
						outText = out.slice(pos1,pos2);						
					}
					else if(out.indexOf('Thank you for offering ') != -1)
					{
						outText = out;
					}
					else
					{
						outText = out;
					}
					
					var postUrl = $('.main_giftConfirm_cont', dataHTML).find('form').attr('action');
					var postData = $('.main_giftConfirm_cont', dataHTML).find('form').serialize();

					$.post(postUrl, postData);

					info.text  = outText;
					info.image = 'gfx/90px-check.png';
					info.title = 'New bonus';
					
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