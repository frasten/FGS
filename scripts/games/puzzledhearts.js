FGS.puzzledhearts.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/phearts/pages/myhearts.php?a=1'+addAntiBot,
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

					FGS.puzzledhearts.Freegifts.Click2(params);
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
					var pos0 = dataStr.indexOf('http://8.17.172.90/ph/pages/myhearts.php');
					var pos1 = dataStr.indexOf('&ts=', pos0);
					var pos2 = dataStr.indexOf('"', pos1);
					
					var ts = dataStr.slice(pos1+4, pos2);
				
				
					params.step3params = 'to_uid=&step=step2&gift_id='+params.gift+'&uid='+FGS.userID+'&ts='+ts;
					params.step3url = 'http://8.17.172.90/ph/pages/index.php';
					
					FGS.puzzledhearts.Freegifts.Click3(params);
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
			url: params.step3url+addAntiBot,
			data: params.step3params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var tst = new RegExp(/(<fb:fbml[^>]*?[\s\S]*?<\/fb:fbml>)/m).exec(dataStr);
					if(tst == null) throw {message:'no fbml tag'}
					dataStr = dataStr.replace(tst[1], '');
					
					var tst = new RegExp(/(<fb:fbml[^>]*?[\s\S]*?<\/fb:fbml>)/m).exec(dataStr);
					if(tst == null) throw {message:'no fbml tag'}
					var fbml = tst[1];
					
					fbml = fbml.replace('</fb:request-form>', '<fb:request-form-submit import_external_friends="false"  label="Send to %n" /></fb:request-form>');
					fbml = fbml.replace('condensed="false"', 'condensed="true"');
					
					var channel_url = 'http://8.17.172.90/ph/pages/xd_receiver.htm';
					
					var nextParams  =  'api_key='+params.gameID+'&channel_url='+encodeURIComponent(channel_url)+'&fbml='+encodeURIComponent(fbml);		
					
					params.nextParams = nextParams;
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
	},
};

FGS.puzzledhearts.Bonuses = 
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
						var paramTmp = FGS.findIframeAfterId('#app_content_166309140062981', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.puzzledhearts.Bonuses.Click2(currentType, id, url, params);
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
							FGS.puzzledhearts.Bonuses.TryToPost(dataStr);
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
					params.app_id = 166309140062981;
					params.api_key = 166309140062981;
					params.locale = 'en_US';
					params.sdk = 'joey';
					params.from_post = 1;
					params.feedform_user_message = '';
					params.publish = 'Publish';
					params.display = 'iframe';
					params.channel = 'http://8.17.172.90/ph/ajax/channel.html?result=%22xxRESULTTOKENxx%22';
					params.redirect_uri = 'http://8.17.172.90/ph/ajax/channel.html?result=%22xxRESULTTOKENxx%22';
					params.channel_url = 'http://8.17.172.90/ph/ajax/channel.html?result=%22xxRESULTTOKENxx%22';
					
					delete(params.method);
					
					FGS.getAppAccessToken2('api_key=166309140062981&app_id=166309140062981&channel=http://8.17.172.90/ph/ajax/channel.html', params, FGS.puzzledhearts.Bonuses.FinishPost);
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

FGS.puzzledhearts.Requests = 
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
						var paramTmp = FGS.findIframeAfterId('#app_content_166309140062981', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.puzzledhearts.Requests.Click2(currentType, id, url, params);
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