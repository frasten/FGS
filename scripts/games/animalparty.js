FGS.animalparty.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/rescue_party/?entry=bookmark'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					params.click2url   = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					params.click2param = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					FGS.animalparty.Freegifts.Click2(params);
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
			url: params.click2url,
			data: params.click2param,
			//dataType: 'text',
			beforeSend: function(xhr){
				xhr.setRequestHeader('X-Requested-With', {toString: function(){ return ''; }});
			},
			success: function(dataStr)
			{
				try
				{
				
					var pos0 = dataStr.indexOf('var cant_gift', pos1);
					if(pos0 == -1) throw {}
					
					var pos0 = dataStr.indexOf('[', pos0);
					var pos1 = dataStr.indexOf(']', pos0)+1;
					
					params.excludeUsers = JSON.parse('{"abc": '+dataStr.slice(pos0, pos1)+'}').abc;
					
					var reqData = {};
					
					var giftToItem = {
						'epack'         : 'special_item_type',
						'ingredient'    : 'ingredient',
						'ing'           : 'ingredient',
						'bait'          : 'bait',
						'mb'            : 'mystery_box_type',
						'decoration'    : 'decoration_type'
					};
					
					var pos0 = dataStr.indexOf('navObject.options.player_id');
					var pos0 = dataStr.indexOf("'", pos0)+1;
					var pos1 = dataStr.indexOf("'", pos0);
					
					var player_id = dataStr.slice(pos0, pos1);
					
					var x = params.gift.split('_');
					var item_type = giftToItem[x[0]];
					var item_id = x[1];
					
					//reqData.filters = JSON.stringify( [{name: 'Animal Party', user_ids: friends}] );

					reqData.data = JSON.stringify({"request_type":"gift","item_type":item_type,"item_id":item_id,"item_name":params.giftNameName,"sender_player_id":player_id,"entry_point":"request_gift"});
					reqData.title = 'Send free Animal Party gift to your friends';
					reqData.message = 'Here is '+params.giftNameName+' for you in Animal Party. Could you help me by sending a gift back?';
					
					params.reqData = reqData;	
					
					FGS.animalparty.Freegifts.ClickRequest(params);
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
		
		params.channel = 'http://rescue.prod.web.tbxing.com/channel.html';
		
		FGS.getAppAccessTokenForSending(params, function(params, d)
		{
			var pos0 = d.indexOf('&result=')+8;
			var pos1 = d.indexOf('"', pos0);
			
			var str = d.slice(pos0, pos1);
			var arr = JSON.parse(decodeURIComponent(JSON.parse('{"abc": "'+str+'"}').abc)).request_ids;
			
			var str = '';
			
			$(arr).each(function(k, v)
			{
				str += '&request_ids['+k+']='+v;
			});			
			
			$.get('http://rescue.prod.web.tbxing.com/index2.php/canvas_api/addGiftRequest', 'ts='+new Date().getTime()+'&'+params.click2param+str);
		});
	},
};

FGS.animalparty.Requests = 
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
						var paramTmp = FGS.findIframeAfterId('#app_content_112775362105084', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.animalparty.Requests.Click2(currentType, id, url, params);
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
					
					if(dataStr.indexOf('You have already claimed this reward') != -1)
					{
						var error_text = 'You have already claimed this reward!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('All rewards here have already been claimed') != -1)
					{
						var error_text = 'All rewards here have already been claimed.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var dataHTML = FGS.HTMLParser('<html><body>'+dataStr+'</body></html>');
					
					if($('.accept_gift_mid', dataHTML).length > 0)
					{
						info.title = $.trim($('.gift_name', dataHTML).text());
						
						info.image = $('.gift_image', dataHTML).children('img:first').attr('longdesc');
						info.time  = Math.round(new Date().getTime() / 1000);
						
						if(dataStr.indexOf('has been sent to') != -1)
							info.text  = 'sent to: ' + $.trim($('.person_name_container', dataHTML).text());
						else
						{
							info.text  = $.trim($('.person_name_container', dataHTML).text());
						
							for(var gift in FGS.giftsArray['112775362105084'])
							{
								if(FGS.giftsArray['112775362105084'][gift].name == info.title)
								{
									info.thanks = 
									{
										gift: gift
									}
									break;
								}
							}
						}
						
						FGS.endWithSuccess(currentType, id, info);
					}
					else if($('.accept_gift_mid', dataHTML).length == 0 && $('.person_image_bg', dataHTML).length > 0)
					{
						info.title = $.trim($('.person_name_container', dataHTML).text());
						
						info.image = $('.person_image_bg', dataHTML).children('img:first').attr('longdesc');
						info.time  = Math.round(new Date().getTime() / 1000);
						
						info.text  = 'New neighbor';
						
						
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

FGS.animalparty.Bonuses = 
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
						var paramTmp = FGS.findIframeAfterId('#app_content_112775362105084', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.animalparty.Bonuses.Click2(currentType, id, url, params);
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
					if(dataStr.indexOf('You have already claimed this reward') != -1)
					{
						var error_text = 'You have already claimed this reward!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('already help this person out today') != -1)
					{
						var error_text = 'You have already help this person out today!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('All rewards here have already been claimed') != -1)
					{
						var error_text = 'All rewards here have already been claimed.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var dataHTML = FGS.HTMLParser('<html><body>'+dataStr+'</body></html>');
					
					if($('.gift_name', dataHTML).length > 0)
					{
						info.title = $.trim($('.gift_name', dataHTML).text());
						
						info.image = $('.gift_image', dataHTML).children('img:first').attr('longdesc');
						info.time  = Math.round(new Date().getTime() / 1000);
						
						if(dataStr.indexOf('has been sent to') != -1)
							info.text  = 'sent to: ' + $.trim($('.person_name_container', dataHTML).text());
						else
							info.text  = $.trim($('.person_name_container', dataHTML).text());
						
						
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