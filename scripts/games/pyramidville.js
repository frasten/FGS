FGS.pyramidville.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/pyramidville/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				var fullDataStr = dataStr;
				
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					params.step2url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					params.step2params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					var pos0 = fullDataStr.indexOf("').init([");
					if(pos0 == -1) throw {}
					
					pos0+=8;
					
					var pos1 = fullDataStr.indexOf(']', pos0);
					var tmp = fullDataStr.slice(pos0,pos1+1).replace(/\\/g, '');
					
					params.pv_friends = JSON.parse('{"abc": '+tmp+'}').abc;
					
					FGS.pyramidville.Freegifts.Click2(params);
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
			url: params.step2url,
			data: params.step2params,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					params.signed_user = $('input[name="signed_user"]', dataHTML).val();	
					
					FGS.pyramidville.Freegifts.Click3(params);
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
			url: params.step2url+'/gifts/invite?id='+params.gift,
			data: params.step2params+'&signed_user='+params.signed_user,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var tmp = [];
					var pos0 = dataStr.indexOf('parent.requests.send(');
					pos0+=21;
					
					var pos1 = dataStr.indexOf('"', pos0)+1;
					var pos1a = dataStr.indexOf('"', pos1);
					
					tmp.push(dataStr.slice(pos1, pos1a));
					
					var pos1 = dataStr.indexOf('"', pos1a)+1;
					var pos1a = dataStr.indexOf('"', pos1);
					
					tmp.push(dataStr.slice(pos1, pos1a));
					
					var pos1 = dataStr.indexOf("'", pos1a)+1;
					var pos1a = dataStr.indexOf("'", pos1);
					
					tmp.push(dataStr.slice(pos1, pos1a));
					
					var pos1 = dataStr.indexOf('"', pos1a)+1;
					var pos1a = dataStr.indexOf('"', pos1);
					
					params.excludeUsers = dataStr.slice(pos1, pos1a).split(',');
				
					var reqData = {};
					
					reqData.data = tmp[2];
					reqData.title = tmp[0];
					reqData.message = tmp[1];
					
					//reqData.filters = JSON.stringify( [{name: 'PyramidVille Friends', user_ids: user_ids}] );
					
					params.reqData = reqData;
					
					FGS.pyramidville.Freegifts.ClickRequest(params);
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
		
		params.channel = 'http://front.pyramid.kobojo.com/request.html';
		
		
		FGS.getAppAccessTokenForSending(params, function(params, d)
		{
			var pos0 = d.indexOf('&result=')+8;
			var pos1 = d.indexOf('"', pos0);
			
			var str = d.slice(pos0, pos1);
			var arr = JSON.parse(decodeURIComponent(JSON.parse('{"abc": "'+str+'"}').abc)).request_ids;
			
			var str = arr.join(',');
			$.post('http://front.pyramid.kobojo.com/inbox/eat', 'ids='+str+'&signed_user='+encodeURIComponent(params.signed_user)+'&excludeKey=gifted');
		});
	},
};

FGS.pyramidville.Requests = 
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
						var paramTmp = FGS.findIframeAfterId('#app_content_105557406133988', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.pyramidville.Requests.Click2(currentType, id, url, params);
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
					
					var singleRequest = FGS.Gup('request_ids', currentURL);
					
					var sig = $('input[name="signed_user"]', dataHTML).val();
					
					FGS.getAppAccessToken(currentType, id, currentURL, 'api_key=115301331874715&app_id=115301331874715&channel=http://front.pyramid.kobojo.com/custom_channel.html', FGS.pyramidville.Requests.ParseAppRequests, {single: singleRequest, signed_user: sig});
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
	
	ParseAppRequests: function(currentType, id, currentURL, params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
	
		try
		{
			var data = params[1];
			
			var fbrequest = JSON.parse(data);

			var fbrequestData = $.base64Decode(fbrequest.data);
			
			var pvrequest = $.parseJSON(fbrequestData);
			
			
			
			if(pvrequest.type == 'invite')
			{
				var title = 'New neighbor';
				var image = 'http://graph.facebook.com/'+fbrequest.from.id+'/picture';
			}
			else
			{
				var title = (pvrequest.loot.Amount > 1 ? pvrequest.loot.Amount + " ": "") + pvrequest.loot.Caption;
				var image = 'http://s.cn.kobojo.com/pyramidville/assets/thumbnails70/'+pvrequest.loot.LocId.toLowerCase()+'.png';
			}
			
			var user = typeof fbrequest.from != 'undefined'
					? fbrequest.from.name
					: 'Cleopatra';
						
			var paramsNew = {
				access: '?'+$.param(params[0]),
				rid: fbrequest.id,
				post: {signed_user: params[2].signed_user, id: pvrequest.id},
				data: {image: image, user: user, title: title}
			};
			
			FGS.pyramidville.Requests.ClickNew(currentType, id, currentURL, paramsNew);
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
	
	ClickNew: function(currentType, id, currentURL, params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "POST",
			url: 'http://front.pyramid.kobojo.com/inbox/accept',
			data: params.post,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var x = JSON.parse(dataStr);
					
					if(x.status != 0)
					{
						FGS.endWithError('limit', currentType, id, 'Expired!');
						FGS.deleteNewRequests(id, params.access);
						return;
					}
					
					info.image = params.data.image;
					info.title = params.data.title;
					info.text  = params.data.user;
					info.time = Math.round(new Date().getTime() / 1000);
						
					FGS.endWithSuccess(currentType, id, info);
					
					FGS.deleteNewRequests(id, params.access);
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

FGS.pyramidville.Bonuses = 
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
						var paramTmp = FGS.findIframeAfterId('#app_content_105557406133988', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.pyramidville.Bonuses.Click2(currentType, id, url, params);
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
					
					if(dataStr.indexOf('You have already collected this bonus') != -1)
					{
						var error_text = 'You have already collected this bonus!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var dataHTML = FGS.HTMLParser(dataStr);
					
					if($('.error', dataHTML).length > 0)
					{
						var error_text = 'You have already collected this bonus!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if($('.cardLoot', dataHTML).length > 0)
					{
						info.title = $.trim($('.card:first', dataHTML).text());
						info.image = $('.cardLoot', dataHTML).attr('src');
						info.time  = Math.round(new Date().getTime() / 1000);
						info.text  = $.trim($('.card:last', dataHTML).text());
						
						
						FGS.endWithSuccess(currentType, id, info);
					}
					else
					{
						throw {message: 'no form'}
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
	}
};