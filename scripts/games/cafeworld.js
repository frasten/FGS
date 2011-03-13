FGS.cafeworld.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/cafeworld/view_gift.php?ref=tab'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);
					var nextUrl = $('#app101539264719_frmGifts', dataHTML).attr('action');
					var formParam = $('#app101539264719_frmGifts', dataHTML).serialize();
					var tempUrl = nextUrl+'?'+formParam;
					var pos1 = tempUrl.indexOf('gid=');
					params.cafeUrl = tempUrl.slice(0, pos1+4)+params.gift+'&view=farm';
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

FGS.cafeworld.Requests = 
{	
	Click: function(currentType, id, currentURL, retry)
	{
		if(currentURL.length == 2)
		{
			var method = 'POST';
			var newUrl = currentURL[0];
			var params = currentURL[1];
		}
		else
		{
			var method = 'GET';
			var newUrl = currentURL;
			var params = '';
		}
	
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: method,
			url: newUrl,
			data: params,
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
				
				if($('form[action*="request_v2_landing_page.php"]', dataHTML).length > 0)
				{
					var url 	= $('form[action*="request_v2_landing_page.php"]', dataHTML).attr('action');
					var params2 = $('form[action*="request_v2_landing_page.php"]', dataHTML).serialize();
					
					retryThis(currentType, id, [url, params2]);
					return;
				}
				
				if(dataStr.indexOf('/me/apprequests') != -1)
				{
					FGS.getAppAccessToken(currentType, id, currentURL, 'api_key=101539264719&app_id=101539264719&channel=http://fb-0.cafe.zynga.com/current//channel/custom_channel.html', FGS.cafeworld.Requests.ParseAppRequests);
					return;
				}
				
				
				try
				{
					if(dataStr.indexOf('There is a problem in the kitchen') != -1)
					{
						var error_text = 'There was problem receiving this gift. You have probably already accepted it';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('is now your neighbor!') != -1)
					{
						info.image = '';
						info.title = '';
						info.text = 'New neighbour';
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					
					var el = $('#gift_items', dataHTML);
					
					if(el.length > 0)
					{
						var titleX = el.children('h1').text();
						
						if(titleX.indexOf('You just accepted ') != -1)
						{
							titleX = titleX.replace('You just accepted ','').replace('!','');
							var pos1 = titleX.indexOf(' from ');
							var gift = titleX.slice(0,pos1)+' from';
							var from = titleX.slice(pos1+6);
						}
					
						info.image = el.children('p:first').children('img').attr('src');
						info.title = gift;
						info.text  = from;
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					
					if($('#app101539264719_gift_items', dataHTML).length > 0)
					{
						var titleX = $('#app101539264719_gift_items', dataHTML).find('h1:first').text();
						
						if(titleX.indexOf('You just accepted this ') != -1)
						{
							titleX = titleX.replace('You just accepted this ','').replace('!','');
							var pos1 = titleX.indexOf(' from ');
							var gift = titleX.slice(0,pos1)+' from';
							var from = titleX.slice(pos1+6);
						}
						else if(titleX.indexOf('You just sent this ') != -1)
						{
							titleX = titleX.replace('You just sent this ','').replace('!','');
							var pos1 = titleX.indexOf(' to ');
							var gift = titleX.slice(0,pos1);
							var from = ' sent to '+titleX.slice(pos1+4);
						}
						else if(titleX.indexOf('You have given ') != -1)
						{
							titleX = titleX.replace('You have given ','').replace('!','');
							var pos1 = titleX.indexOf(' to ');
							var gift = ' sent to '+titleX.slice(0,pos1);
							var from = titleX.slice(pos1+4);
						}
						else
						{
							var gift =  $('#app101539264719_gift_items', dataHTML).find('h1:first').text();
							var from = $('#app101539264719_gift_items', dataHTML).find('h1:first').text();
						}
						
						var sendInfo = '';

						var tmpStr = unescape(newUrl);					
						var pos1 = tmpStr.indexOf('&gid=');
						if(pos1 != -1)
						{
							var pos2 = tmpStr.indexOf('&', pos1+1);
								
							var giftName = tmpStr.slice(pos1+5,pos2);
							
							var pos1 = tmpStr.indexOf('&from=');
							var pos2 = tmpStr.indexOf('&', pos1+1);
							
							var giftRecipient = tmpStr.slice(pos1+6,pos2);						
								
							sendInfo = {
								gift: giftName,
								destInt: giftRecipient,
								destName: from,
								}
						}
						info.thanks = sendInfo;	
						
						
						info.image = $('#app101539264719_gift_items', dataHTML).find('img:first').attr("src");
						info.title = gift;
						info.text  = from;
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
	
	ParseAppRequests: function(currentType, id, currentURL, params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
	
		try
		{
			var access_token = params[0].access_token;
			var data = params[1];
			
			var response = JSON.parse(data);
			var tmpData;
			
			for(var i=0; i<response.data.length; i++)
			{
				if(response.data[i].id == id)
				{
					tmpData = response.data[i];
					break;
				}
			}
			
			if (!tmpData) {
				throw {message: 'old gift'} // not found
				return;
			}

            var tmp = tmpData.data.split('|||');
            var uPar = '?sk=' + tmp[0] + '&rid=' + tmp[2];
			uPar += '&from=' + tmpData.from.id;
            uPar += '&skip_tracking=1';
            uPar += '&fb_request_id=' + tmpData.id;
			
			var url = 'http://fb-0.cafe.zynga.com/current/fb//request_v2_landing_page.php' + uPar;
			var params2 = {access_token: '?access_token='+access_token}
			
			
			
			FGS.cafeworld.Requests.ClickNew(currentType, id, url, params2);
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
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				var redirectUrl = FGS.checkForLocationReload(dataStr);
				
				try
				{
					if(dataStr.indexOf('There is a problem in the kitchen') != -1 || dataStr.indexOf('but it seems that something went wrong in the kitchen') != -1)
					{
						var error_text = 'There was problem receiving this gift. You have probably already accepted it';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var el = $('#gift_items', dataHTML);
					
					if(el.length > 0)
					{
						var titleX = el.children('h1').text();
						
						if(titleX.indexOf('You just accepted ') != -1)
						{
							titleX = titleX.replace('You just accepted ','').replace('!','');
							var pos1 = titleX.indexOf(' from ');
							var gift = titleX.slice(0,pos1)+' from';
							var from = titleX.slice(pos1+6);
						}
					
						info.image = el.children('p:first').children('img').attr('src');
						info.title = gift;
						info.text  = from;
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
						FGS.deleteNewRequests(id, params.access_token);		
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

FGS.cafeworld.Bonuses = 
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
				
				var limitArr = [
					{ search: 'There are no more servings left', error: 'There are no more servings left.' },
					{ search: 'Looks like all the prizes have', error: 'Looks like all the prizes have been already taken.' },
					{ search: 'already claimed', error: 'Looks like all the prizes have been already claimed.' },
					{ search: 'You are either too late or you clicked here previously', error: 'You are either too late or you clicked here previously' },
					{ search: 'You already received this bonus', error: 'You already received this bonus' },
					{ search: 'Perfect Servings once today!', error: 'You have already received Perfect Servings once today!' },
					{ search: 'already received all the help they could handle', error: 'Looks like your friend already received all the help they could handle' },
					{ search: 'You have already helped today!', error: 'You have already helped today!' },
					
				];
				
				
				var isLimit = false;
				
				$(limitArr).each(function(k,v)
				{
					if(dataStr.indexOf(v.search) != -1)
					{
						FGS.endWithError('limit', currentType, id, v.error);
						isLimit = true;
						return false;
					}
				});
				
				if(isLimit) return;
				
				
				
				try
				{
					if(dataStr.indexOf('please pick a mystery gift as a thank you') != -1)
					{
						var newUrl = $('.lotto-container', dataHTML).children('a:first').attr('href');
						retryThis(currentType, id, unescape(newUrl), true);
						return;
					}
					
					if(dataStr.indexOf('give you some in return but they can') != -1)
					{
						var newUrl = $('#app101539264719_item_wrapper', dataHTML).find('a:first').attr('href');
						
						if(typeof(retry) == 'undefined')
						{
							retryThis(currentType, id, unescape(newUrl), true);
						}
						else
						{
							throw {message: 'error'}
						}
						return;
					}
				
					if($('.one-button-container', dataHTML).length > 0)
					{
						var URL = $('.one-button-container', dataHTML).children('a.ok').attr('href');
					}
					else
					{
						var URL = $('.two-button-container', dataHTML).children('a.ok').attr('href');

						
						if(typeof(URL) == 'undefined') 
						{
							var URL = $('div.center', dataHTML).find('a[href^="http://apps.facebook.com/cafeworld/track.php"]:first').attr('href');
							
							if(typeof(URL) == 'undefined')
							{
								var URL = $('div.center', dataHTML).find('a[href^="http://apps.facebook.com/cafeworld/accept"]:first').attr('href');
							}
						}
					}
					
					if( $(".reward-image-container",dataHTML).length > 0)
					{
						if($('.reward-image-container', dataHTML).find('img').length > 3)
						{
							info.image = $('.reward-image-container-left', dataHTML).find('img:last').attr('src');
						}
						else
						{
							info.image = $(".reward-image-container",dataHTML).children('img').attr("src");
						}
					}
					else if($(".page-title",dataHTML).find('img').length > 0)
					{
						info.image = $(".page-title",dataHTML).find('img').attr("src");
					}
					else if($("#app101539264719_item_wrapper",dataHTML).find('.left_cell').find('img').length > 0)
					{
						info.image = $("#app101539264719_item_wrapper",dataHTML).find('.left_cell').find('img').attr("src");
					}
					else
					{
						info.image = $('div.cell_wrapper', dataHTML).find('img:first').attr('src');
					}					
					
					if($(".reward-text-contents", dataHTML).length > 0)
					{				
						var titleX = $(".reward-text-contents", dataHTML).text();
						
						
						if(titleX.indexOf('You have a free ') != -1)
						{
							titleX = titleX.replace('You have a free ','').replace('!','');
							var pos1= titleX.indexOf(' from ');
							var gift = titleX.slice(0,pos1);
						}
						else if(titleX.indexOf('have been added to your gift') != -1)
						{
							var gift = titleX.replace(' have been added to your gift box.','');
						}
						else if(titleX.indexOf('earned a big tip for great service') != -1)
						{
							var pos1 = titleX.indexOf(' will get ');
							var gift = titleX.slice(pos1+10);
						}
						else
						{
							var gift = $(".reward-text-contents", dataHTML).text();
							gift = gift.replace('You were first! Click the button below to claim a ','');
							gift = gift.replace('You were first! Click the button below to claim an','');
							gift = gift.replace('You were first! Click the button below to claim','');
							gift = gift.replace('You were the first! You got a ','');
							gift = gift.replace('You were the first! You got an ','');
							gift = gift.replace('Click the button below to claim a ','');
							gift = gift.replace('Click the button below to claim an ','');
							
							if(gift.indexOf(' from ') != -1)
							{
								var pos1 = gift.indexOf(' from ');
								var gift = gift.slice(0,pos1);
							}
							
							if(gift.indexOf(' is giving out ') != -1)
							{
								var pos1 = gift.indexOf(' is giving out ')+15;
								var pos2 = gift.indexOf(' in celebration!');
								if(pos2 != -1)
								{
									var gift = gift.slice(pos1,pos2);
								}
								else
								{
									var gift = gift.slice(0,pos1);
								}
							}
							
						}
						info.text  = $(".reward-text-contents", dataHTML).text();
					}
					else if($(".title-text-contents", dataHTML).length > 0)
					{				
						var titleX = $(".title-text-contents:last", dataHTML).text();
						
						if(titleX.indexOf(' will be added to your gift box!') != -1)
						{
							var gift = titleX.replace(' will be added to your gift box!','');
						}
						else
						{
							var gift = $(".title-text-contents:last", dataHTML).text();
						}
						info.text  = $(".reward-text-contents:first", dataHTML).text();
					}
					else if($("#app101539264719_item_wrapper",dataHTML).find('.right_cell').find('h3').length > 0)
					{
						var titleX = $("#app101539264719_item_wrapper",dataHTML).find('.right_cell').find('h3').text();
						var pos1 = titleX.indexOf('to claim ');
						if(pos1 != -1)
						{
							titleX = titleX.slice(pos1+9);
						}
						var pos1 = titleX.indexOf('to collect ');
						if(pos1 != -1)
						{
							titleX = titleX.slice(pos1+11);
						}
							
						if(titleX.indexOf(' from ') != -1)
						{
							var pos1 = titleX.indexOf(' from ');
							titleX = titleX.slice(0,pos1);
						}
						var gift = titleX;
						
						info.text  = $("#app101539264719_item_wrapper",dataHTML).find('.right_cell').find('h3').text();
					}
					else if($('div.cell_wrapper', dataHTML).find('h1:first').length > 0)
					{
						var titleX = $('div.cell_wrapper', dataHTML).find('h1:first').text();
						
						info.text = titleX;
						
						var pos1 = titleX.indexOf('completed a collection and shared');
						if(pos1 != -1)
						{
							titleX = titleX.slice(pos1+33);
						}
						
						if(titleX.indexOf('with you!') != -1)
						{
							var pos1 = titleX.indexOf('with you!');
							titleX = titleX.slice(0,pos1);
						}
						var gift = titleX;
					}
					else
					{
						var gift = $("#app101539264719_item_wrapper",dataHTML).children('.pad:nth-child(1)').text();
						info.text = $("#app101539264719_item_wrapper",dataHTML).children('.pad:nth-child(2)').text();
						info.image = $("#app101539264719_item_wrapper",dataHTML).children('.pad:nth-child(3)').children('img').attr('src');
					}

					if(typeof(info.image) == 'undefined') throw {message: $("#app101539264719_item_wrapper",dataHTML).html()}

					info.title = gift;
					info.time = Math.round(new Date().getTime() / 1000);

					if(typeof(URL) !== 'undefined')
					{
						var URL = unescape(URL);
						$.get(URL);
					}
					
					FGS.endWithSuccess(currentType, id, info);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
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