FGS.cafeworldFreegifts = 
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
};

FGS.cafeworldRequests = 
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

						var tmpStr = unescape(currentURL);					
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
	}
};

FGS.cafeworldBonuses = 
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
				
				
				if(dataStr.indexOf('There are no more servings left') != -1 || dataStr.indexOf('Looks like all the prizes have') != -1 || dataStr.indexOf('already claimed') != -1 || dataStr.indexOf('You are either too late or you clicked here previously') != -1 || dataStr.indexOf('You already received this bonus') != -1 || dataStr.indexOf(' Perfect Servings once today!') != -1 || dataStr.indexOf('already received all the help they could handle') != -1 || dataStr.indexOf('You have already helped today!') != -1)
				{
					FGS.endWithError('limit', currentType, id);
					return;
				}
				
				try
				{
					if(dataStr.indexOf('please pick a mystery gift as a thank you') != -1)
					{
						var newUrl = $('.lotto-container', dataHTML).children('a:first').attr('href');
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
};