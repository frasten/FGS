FGS.charmedgems.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/charmedgems/pages/mygems.php?a=1'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params2 = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					params.step2url = url;
					params.step2params = params2;

					FGS.charmedgems.Freegifts.Click2(params);
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
			url: params.step2url+addAntiBot,
			data: params.step2params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var pos0 = dataStr.indexOf('http://charmedgems.com/pages/index.php?uid=');
					var pos1 = dataStr.indexOf('&ts=', pos0);
					var pos2 = dataStr.indexOf('"', pos1);
					
					var ts = dataStr.slice(pos1+4, pos2);
					
					params.step3params = 'uid='+FGS.userID+'ts='+ts;
					params.step3url = 'http://charmedgems.com/pages/index.php';
					
					params.step4params = 'action=get_request_2_0_data&uid='+FGS.userID+'&item=delightful_bow&ts='+ts+'&t='+new Date().getTime();
					params.step4url = 'http://charmedgems.com/ajax/action.php';
					
					FGS.charmedgems.Freegifts.Click3(params);
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
			type: "GET",
			url: params.step3url+addAntiBot,
			data: params.step3params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var pos0 = dataStr.indexOf("from_first_name:'");
					pos0+=17;
					var pos1 = dataStr.indexOf("'", pos0);
					params.from_name = dataStr.slice(pos0, pos1);
					FGS.charmedgems.Freegifts.Click4(params);
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

		$.ajax({
			type: "GET",
			url: params.step4url+addAntiBot,
			data: params.step4params,
			dataType: 'json',
			beforeSend: function(xhr)
			{
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			},
			success: function(dataStr)
			{
				try
				{
					var reqData = {};

					reqData.data = JSON.stringify([{vary:dataStr.vary,unid:dataStr.unid, item: params.gift, from_first_name:params.from_name}]);
					reqData.message = dataStr.content;
					
					params.reqData = reqData;					
					
					FGS.charmedgems.Freegifts.ClickRequest(params);				
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
	
	
	ClickRequest: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		params.channel = 'http://charmedgems.com/ajax/channel.html';

		FGS.getAppAccessTokenForSending(params, function(){});
	}
};

FGS.charmedgems.Bonuses = 
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
				
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try 
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_216230855057280', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.charmedgems.Bonuses.Click2(currentType, id, url, params);
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
					
					
					if(dataStr.indexOf('You have already received this mystery gift') != -1)
					{
						var error_text = 'You have already received this gift';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('You have already sent the') != -1)
					{
						var error_text = 'You have already sent this gift';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					
					if($('.ui-icon-info', dataHTML).length > 0)
					{ 
						var txt = $.trim($('.ui-icon-info', dataHTML).parent().text());
						
						info.text = txt;
						
						if(txt.indexOf('You have just accepted') != -1)
						{
							info.title = 'New heart';
						}
						else if(txt.indexOf('You have just sent') != -1)
						{
							info.title = 'Heart sent';
						}
						
						var pos1 = dataStr.indexOf('$(function () {');
						
						if(pos1 != -1)
						{
							var pos2 = dataStr.indexOf('var url = "', pos1);
							if(pos2 != -1)
							{
								pos2+=11;
								var pos3 = dataStr.indexOf('"', pos2);
								
								var url = dataStr.slice(pos2,pos3)+new Date().getTime();
								$.getJSON(url);
							}
						}
						
						info.image = 'gfx/90px-check.png';
						info.time = Math.round(new Date().getTime() / 1000);
						FGS.endWithSuccess(currentType, id, info);
						
						var pos0 = dataStr.indexOf('; send_w2w_notify_gift(');
						if(pos0 != -1)
						{
							FGS.charmedgems.Bonuses.TryToPost(dataStr);
						}
						
						//var error_text = $.trim($('.streamRewardAllRewardsClaimed', dataHTML).text());
						//FGS.endWithError('limit', currentType, id, error_text);
					}
					else
					{
						throw {message: 'error'}
					}
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
	
	TryToPost: function(dataStr)
	{
		var $ = FGS.jQuery;
		
		
		try
		{
			var pos0 = dataStr.indexOf('; send_w2w_notify_gift(');
			
			//publikowanie na wallu
			if(pos0 != -1)
			{
				pos0+= 23;
				var pos1 = dataStr.indexOf(')', pos0);
				
				var strTmp = dataStr.slice(pos0, pos1);
				var parArr = strTmp.split(',');
				parArr[1] = parArr[1].replace(/\'/g, '');
				parArr[1] = $.trim(parArr[1]);
				
				var pos0 = dataStr.indexOf('send_w2w_notify_gift(id');
				var pos1 = dataStr.indexOf('var url = "', pos0)+11;
				var pos2 = dataStr.indexOf('"', pos1);
				var posUrl = dataStr.slice(pos1, pos2)+parArr[0]+'&item='+parArr[1]+'&t='+new Date().getTime();
				
				$.get(posUrl, function(d)
				{
					var params = JSON.parse($.trim(d));
					
					params.message = '';
					params.attachment = JSON.stringify(params.attachment);
					params.action_links = JSON.stringify(params.action_links);
					params.fb_dtsg = FGS.fb_dtsg;
					params.post_form_id = FGS.post_form_id;
					params.preview = 0;
					params['_path'] = 'stream.publish';
					params.app_id = 216230855057280;
					params.api_key = 216230855057280;
					params.locale = 'en_US';
					params.sdk = 'joey';
					params.from_post = 1;
					params.feedform_user_message = '';
					params.publish = 'Publish';
					params.display = 'iframe';
					params.channel = 'http://charmedgems.com/ajax/channel.html?result=%22xxRESULTTOKENxx%22';
					params.redirect_uri = 'http://charmedgems.com/ajax/channel.html?result=%22xxRESULTTOKENxx%22';
					params.channel_url = 'http://charmedgems.com/ajax/channel.html?result=%22xxRESULTTOKENxx%22';
					
					delete(params.method);
					
					FGS.getAppAccessToken2('api_key=216230855057280&app_id=216230855057280&channel=http://charmedgems.com/ajax/channel.html', params, FGS.charmedgems.Bonuses.FinishPost);
				});
			}
		}
		catch(e)
		{
			//console.log(e);
		}
	},
	
	FinishPost: function(params)
	{
		var $ = FGS.jQuery;
		
		try
		{
			$.post('https://www.facebook.com/dialog/stream.publish', params);		
		}
		catch(e)
		{
			//console.log(e);
		}
	},
};

FGS.charmedgems.Requests = 
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
				
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try 
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_216230855057280', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.charmedgems.Requests.Click2(currentType, id, url, params);
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
					if(dataStr.indexOf('You have already received this mystery gift') != -1)
					{
						var error_text = 'You have already received this gift';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('You have already sent the') != -1)
					{
						var error_text = 'You have already sent this gift';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('but this gift cannot be accepted because it is too old') != -1)
					{
						var error_text = 'This gift cannot be accepted because it is too old';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if($('.ui-icon-info', dataHTML).length > 0)
					{ 
						var txt = $.trim($('.ui-icon-info:first', dataHTML).parent().text());
						
						info.text = txt;
						
						if(txt.indexOf('You have just accepted') != -1)
						{
							info.title = 'New heart';
						}
						else if(txt.indexOf('You have just sent') != -1)
						{
							info.title = 'Heart sent';
						}
						
						var pos1 = dataStr.indexOf('$(function () {');
						
						if(pos1 != -1)
						{
							var pos2 = dataStr.indexOf('var url = "', pos1);
							if(pos2 != -1)
							{
								pos2+=11;
								var pos3 = dataStr.indexOf('"', pos2);
								
								var url = dataStr.slice(pos2,pos3)+new Date().getTime();
								$.getJSON(url);
							}
						}
						info.image = 'gfx/90px-check.png';
						info.time = Math.round(new Date().getTime() / 1000);
						FGS.endWithSuccess(currentType, id, info);
						
						//var error_text = $.trim($('.streamRewardAllRewardsClaimed', dataHTML).text());
						//FGS.endWithError('limit', currentType, id, error_text);
					}
					else
					{
						throw {message: 'error'}
					}
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
};