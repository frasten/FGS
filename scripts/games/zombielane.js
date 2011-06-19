FGS.zombielane.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/zombielane/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var paramTmp = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					params.click2params = paramTmp;
					params.click2url = url;
					
					if(!url)
					{
						throw {}
					}
					
					FGS.zombielane.Freegifts.Click2(params);
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
			url: params.click2url+addAntiBot,
			data: params.click2params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.click2url.match(re)[1].toString();
					
					var pos0 = dataStr.indexOf('var flashVars');
					if(pos0 == -1) throw {message: 'no flashvars'}

					var pos1 = dataStr.indexOf('uid:', pos0);
					if(pos1 == -1) throw {message: 'no flashvars_uid'}
					var pos1 = pos1+5;
					var pos1b = dataStr.indexOf(',', pos1+1);
					var uid = dataStr.slice(pos1, pos1b);
					
					var pos1 = dataStr.indexOf('crm_sig', pos0);
					if(pos1 == -1) throw {message: 'no flashvars_crm'}
					var pos1 = dataStr.indexOf('"', pos1);
					var pos1b = dataStr.indexOf('"', pos1+1);
					var sig = dataStr.slice(pos1+1, pos1b);
					
					// unique tracking id
					var date = new Date();
					var time = "" + date.getTime();
					var utid = time.substring(time.length-5, time.length);
					for(var i = 0; i < 11; i++) {
						utid +=  Math.ceil(9*Math.random());
					}

					params.utid = utid;					
					
					params.click3param = 'gid='+params.gift+'&utid='+utid+'&uid='+uid+'&sender='+uid+'&sig='+sig+'&ref=&product_detail=Default&src=vir_sendgift_'+params.gift;
					
					FGS.zombielane.Freegifts.Click3(params);
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
			url: 'http://'+params.domain+'/dead/send_gift',
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
					dataStr = dataStr.replace(tst[1], '');
					
					var tst = new RegExp(/(<fb:fbml[^>]*?[\s\S]*?<\/fb:fbml>)/m).exec(dataStr);
					if(tst == null) throw {message:'no fbml tag'}
					var fbml = tst[1];
					
					var paramsStr = 'app_key='+app_key+'&channel_url='+encodeURIComponent(channel_url)+'&fbml='+encodeURIComponent(fbml);
					
					params.nextParams = paramsStr;
					
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


FGS.zombielane.Requests = 
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
						var paramTmp = FGS.findIframeAfterId('#app_content_169557846404284', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.zombielane.Requests.Click2(currentType, id, url, params);
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
	
	
	Click2: function(currentType, id, currentURL, params, retry)
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
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);

					if(dataStr.indexOf('Oops! Something went wrong...') != -1)
					{
						var error_text = 'This has expired or have been already claimed!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var pos0 = dataStr.indexOf('var flashvars');
					if(pos0 == -1) throw {message: 'no flashvars'}
					
					if(dataStr.indexOf('You Just Accepted a New Neighbor') != -1)
					{
						
						var pos1 = dataStr.indexOf('Text_Description:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var title = dataStr.slice(pos1+1, pos1b);
						
						
						var from = 'New neighbor';
						
						var pos1 = dataStr.indexOf('Item_1:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var image = dataStr.slice(pos1+1, pos1b);
					}
					else
					{
						var pos1 = dataStr.indexOf('Text_Description:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var title = dataStr.slice(pos1+1, pos1b);
						
						var pos1 = dataStr.indexOf('Text_Description_2:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var from = dataStr.slice(pos1+1, pos1b);
						
						var pos1 = dataStr.indexOf('Item_1:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var image = dataStr.slice(pos1+1, pos1b);
					}
					
					info.title = title;						
					info.image = image;
					info.time  = Math.round(new Date().getTime() / 1000);
					info.text  = from;
						
						
					FGS.endWithSuccess(currentType, id, info);
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
	}
};

FGS.zombielane.Bonuses = 
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
				
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
					
				try 
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_169557846404284', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.zombielane.Bonuses.Click2(currentType, id, url, params);
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
	
	Click2: function(currentType, id, currentURL, params, retry)
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
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);
					
					if(dataStr.indexOf('Stream reward already collected') != -1)
					{
						var error_text = 'Stream reward already collected!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('Oops! Something went wrong...') != -1)
					{
						var error_text = 'Stream post has been expired!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var pos0 = dataStr.indexOf('var flashvars');
					if(pos0 == -1) throw {message: 'no flashvars'}
					
					var pos1 = dataStr.indexOf('Text_Title:', pos0);
					if(pos1 == -1) throw {message: 'no flashvars'}
					var pos1 = dataStr.indexOf('"', pos1);
					var pos1b = dataStr.indexOf('"', pos1+1);
					var title = dataStr.slice(pos1+1, pos1b);
					
					var pos1 = dataStr.indexOf('Text_Description:', pos0);
					if(pos1 == -1) throw {message: 'no flashvars'}
					var pos1 = dataStr.indexOf('"', pos1);
					var pos1b = dataStr.indexOf('"', pos1+1);
					var text = dataStr.slice(pos1+1, pos1b);
					
					info.title = title;						
					info.image = 'gfx/90px-check.png';
					info.time  = Math.round(new Date().getTime() / 1000);
					info.text  = text;
						
						
					FGS.endWithSuccess(currentType, id, info);
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
	}
};