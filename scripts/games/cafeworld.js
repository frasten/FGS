var cafeworldFreegifts = 
{
	Click: function(params, retry)
	{
		if(typeof(retry) !== 'undefined')
		{
			var params2 = '_fb_noscript=1';
		}
		else
		{
			var params2 = '';
		}
		
		$.get('http://apps.facebook.com/cafeworld/', params2, function(data)
		{
			try
			{
				i1          =   data.indexOf('post_form_id:"')
				if (i1 == -1) throw {message:'Cannot post_form_id in page'}
				i1			+=	14;
				i2          =   data.indexOf('"',i1);
				
				params.post_form_id = data.slice(i1,i2);
				
				
				i1          =   data.indexOf('fb_dtsg:"',i1)
				if (i1 == -1) throw {message:'Cannot find fb_dtsg in page'}
				i1			+=	9;
				i2          = data.indexOf('"',i1);
				params.fb_dtsg		= data.slice(i1,i2);
				
				cafeworldFreegifts.Click2(params);
				
			}
			catch(e)
			{
				if(typeof(retry) == 'undefined')
				{
					cafeworldFreegifts.Click(params, true);
				}
				else
				{
					console.log(getCurrentTime()+'[Z] Error: '+e.message);
					
					if(typeof(params.sendTo) == 'undefined')
					{
						sendView('errorUpdatingNeighbours');
					}
					else
					{
						sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}		
		});
	},
	Click2: function(params, retry)
	{
		if(typeof(retry) !== 'undefined')
		{
			var params2 = '_fb_noscript=1';
		}
		else
		{
			var params2 = '';
		}
	
		$.get('http://apps.facebook.com/cafeworld/view_gift.php?ref=tab', params2, function(data){
			try
			{
				var nextUrl = $('#app101539264719_frmGifts', data).attr('action');
				
				var formParam = $('#app101539264719_frmGifts', data).serialize();
				
				console.log(getCurrentTime()+'[Z] Zynga params updated');
				
				var tempUrl = nextUrl+'?'+formParam;
				
				var i1 = tempUrl.indexOf('gid=');
				
				params.cafeUrl = tempUrl.slice(0, i1+4)+params.gift+'&view=farm';
				getFBML(params);
			}
			catch(e)
			{
				if(typeof(retry) == 'undefined')
				{
					cafeworldFreegifts.Click2(params, true);
				}
				else
				{
					console.log(getCurrentTime()+'[Z] Error: '+e.message);
					
					if(typeof(params.sendTo) == 'undefined')
					{
						sendView('errorUpdatingNeighbours');
					}
					else
					{
						sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}		
		});
	}
};

var cafeworldRequests = 
{	
	Click: function(id, URI, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}
		
		$.ajax({
			type: "GET",
			url: URI,
			dataType: 'text',
			success: function(data2)
			{
				var redirectUrl = checkForLocationReload(data2);
				
				if(redirectUrl != false)
				{
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving gift, Retrying bonus with ID: '+id);
						cafeworldRequests.Click(id, redirectUrl, true);
					}
					else
					{
						info.error = 'receiving';
						info.time = Math.round(new Date().getTime() / 1000);
						
						database.updateErrorItem('requests', id, info);
						sendView('requestError', id, info);	
					}
					return;
				}
				
				
				var data = data2.substr(data2.indexOf('<body'),data2.lastIndexOf('</body'));
				
				if(data.indexOf('There is a problem in the kitchen') != -1)
				{
					info.error = 'limit';
					info.time = Math.round(new Date().getTime() / 1000);
					
					database.updateErrorItem('requests', id, info);
					sendView('requestError', id, info);
					return;
				}
				
				if(data.indexOf('is now your neighbor!') != -1)
				{
					info.image = 'gfx/90px-check.png';
					info.title = '';
					info.text = 'is now your neighbor!';
					info.time = Math.round(new Date().getTime() / 1000);
					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);
					return;
				}

				if($('#app101539264719_gift_items', data).length > 0)
				{
					var titleX = $('#app101539264719_gift_items', data).find('h1:first').text();
					
					if(titleX.indexOf('You just accepted this ') != -1)
					{
						titleX = titleX.replace('You just accepted this ','').replace('!','');
						var i1= titleX.indexOf(' from ');
						var gift = titleX.slice(0,i1)+' from';
						var from = titleX.slice(i1+6);
					}
					else if(titleX.indexOf('You just sent this ') != -1)
					{
						titleX = titleX.replace('You just sent this ','').replace('!','');
						var i1= titleX.indexOf(' to ');
						var gift = titleX.slice(0,i1);
						var from = ' sent to '+titleX.slice(i1+4);
					}
					else if(titleX.indexOf('You have given ') != -1)
					{
						titleX = titleX.replace('You have given ','').replace('!','');
						var i1= titleX.indexOf(' to ');
						var gift = ' sent to '+titleX.slice(0,i1);
						var from = titleX.slice(i1+4);
					}
					else
					{
						var gift =  $('#app101539264719_gift_items', data).find('h1:first').text();
						var from = $('#app101539264719_gift_items', data).find('h1:first').text();
					}
					
					
					var sendInfo = '';

					var tmpStr = unescape(URI);					
					var i1 = tmpStr.indexOf('&gid=');
					if(i1 != -1)
					{
						var i2 = tmpStr.indexOf('&', i1+1);
							
						var giftName = tmpStr.slice(i1+5,i2);
						
						var i1 = tmpStr.indexOf('&from=');
						var i2 = tmpStr.indexOf('&', i1+1);
						
						var giftRecipient = tmpStr.slice(i1+6,i2);						
							
						sendInfo = {
							gift: giftName,
							destInt: giftRecipient,
							destName: from,
							}
					}
					info.thanks = sendInfo;	
					
					
					info.image = $('#app101539264719_gift_items', data).find('img:first').attr("src");
					info.title = gift;
					info.text  = from;
					info.time = Math.round(new Date().getTime() / 1000);

					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);
				}
				else
				{
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
						cafeworldRequests.Click(id, URI+'&_fb_noscript=1', true);
					}
					else
					{
						info.error = 'receiving';
						info.time = Math.round(new Date().getTime() / 1000);
						
						database.updateErrorItem('requests', id, info);
						sendView('requestError', id, info);	
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					console.log(getCurrentTime()+'[R] Connection error while receiving bonus, Retrying bonus with ID: '+id);
					cafeworldRequests.Click(id, URI+'&_fb_noscript=1', true);
				}
				else
				{
					info.error = 'connection';
					info.time = Math.round(new Date().getTime() / 1000);
					
					sendView('requestError', id, info);
				}
			}
		});
	}
};


var cafeworldBonuses = 
{
	Click:	function(id, url, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}
	
		console.log(getCurrentTime()+'[B] Receiving bonus with ID: '+id);
		
		$.ajax({
			type: "GET",
			url: url,
			success: function(data)
			{
				var dataFull = data;
				
				var redirectUrl = checkForLocationReload(data);
				
				if(redirectUrl != false)
				{
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
						cafeworldBonuses.Click(id, redirectUrl, true);
					}
					else
					{
						info.error = 'receiving';
						info.time = Math.round(new Date().getTime() / 1000);
						
						database.updateErrorItem('bonuses', id, info);
						sendView('bonusError', id, info);	
					}
					return;
				}

				data = data.substr(data.indexOf('<body'),data.lastIndexOf('</body'));
				
				if(data.indexOf('There are no more servings left') != -1 || data.indexOf('Looks like all the prizes have') != -1 || data.indexOf('already claimed') != -1 || data.indexOf('You are either too late or you clicked here previously') != -1 || data.indexOf('You already received this bonus') != -1 || data.indexOf(' Perfect Servings once today!') != -1 || data.indexOf('already received all the help they could handle') != -1 || data.indexOf('You have already helped today!') != -1)
				{
					info.error = 'limit';
					info.time = Math.round(new Date().getTime() / 1000);
					
					database.updateErrorItem('bonuses', id, info);
					sendView('bonusError', id, info);
					return;
				}
				
				if(data.indexOf('please pick a mystery gift as a thank you') != -1)
				{
					var newUrl = $('.lotto-container', data).children('a:first').attr('href');
					cafeworldBonuses.Click(id, unescape(newUrl), true);
					return;
				}
				
				if(data.indexOf('give you some in return but they can') != -1)
				{
					var newUrl = $('#app101539264719_item_wrapper', data).find('a:first').attr('href');
					cafeworldBonuses.Click(id, unescape(newUrl), true);
					return;
				}

				try
				{				
					if($('.one-button-container', data).length > 0)
					{
						var URL = $('.one-button-container', data).children('a.ok').attr('href');
					}
					else
					{
						var URL = $('.two-button-container', data).children('a.ok').attr('href');

						
						if(typeof(URL) == 'undefined') 
						{
							var URL = $('div.center', data).find('a[href^="http://apps.facebook.com/cafeworld/track.php"]:first').attr('href');
							
							if(typeof(URL) == 'undefined')
							{
								var URL = $('div.center', data).find('a[href^="http://apps.facebook.com/cafeworld/accept"]:first').attr('href');
							}
						}
					}
					
					if( $(".reward-image-container",data).length > 0)
					{
						if($('.reward-image-container', data).find('img').length > 3)
						{
							info.image = $('.reward-image-container-left', data).find('img:last').attr('src');
						}
						else
						{
							info.image = $(".reward-image-container",data).children('img').attr("src");
						}
					}
					else if($(".page-title",data).find('img').length > 0)
					{
						info.image = $(".page-title",data).find('img').attr("src");
					}
					else if($("#app101539264719_item_wrapper",data).find('.left_cell').find('img').length > 0)
					{
						info.image = $("#app101539264719_item_wrapper",data).find('.left_cell').find('img').attr("src");
					}
					else
					{
						info.image = $('div.cell_wrapper', data).find('img:first').attr('src');
					}
					
					
					
					if($(".reward-text-contents", data).length > 0)
					{				
						var titleX = $(".reward-text-contents", data).text();
						
						
						if(titleX.indexOf('You have a free ') != -1)
						{
							titleX = titleX.replace('You have a free ','').replace('!','');
							var i1= titleX.indexOf(' from ');
							var gift = titleX.slice(0,i1);
						}
						else if(titleX.indexOf('have been added to your gift') != -1)
						{
							var gift = titleX.replace(' have been added to your gift box.','');
						}
						else if(titleX.indexOf('earned a big tip for great service') != -1)
						{
							var i1 = titleX.indexOf(' will get ');
							var gift = titleX.slice(i1+10);
						}
						else
						{
							var gift = $(".reward-text-contents", data).text();
							gift = gift.replace('You were first! Click the button below to claim a ','');
							gift = gift.replace('You were first! Click the button below to claim an','');
							gift = gift.replace('You were first! Click the button below to claim','');
							gift = gift.replace('You were the first! You got a ','');
							gift = gift.replace('You were the first! You got an ','');
							gift = gift.replace('Click the button below to claim a ','');
							gift = gift.replace('Click the button below to claim an ','');
							
							if(gift.indexOf(' from ') != -1)
							{
								var i1 = gift.indexOf(' from ');
								var gift = gift.slice(0,i1);
							}
							
							if(gift.indexOf(' is giving out ') != -1)
							{
								var i1 = gift.indexOf(' is giving out ')+15;
								var i2 = gift.indexOf(' in celebration!');
								if(i2 != -1)
								{
									var gift = gift.slice(i1,i2);
								}
								else
								{
									var gift = gift.slice(0,i1);
								}
							}
							
						}
						info.text  = $(".reward-text-contents", data).text();
					}
					else if($(".title-text-contents", data).length > 0)
					{				
						var titleX = $(".title-text-contents:last", data).text();
						
						if(titleX.indexOf(' will be added to your gift box!') != -1)
						{
							var gift = titleX.replace(' will be added to your gift box!','');
						}
						else
						{
							var gift = $(".title-text-contents:last", data).text();
						}
						info.text  = $(".reward-text-contents:first", data).text();
					}
					else if($("#app101539264719_item_wrapper",data).find('.right_cell').find('h3').length > 0)
					{
						var titleX = $("#app101539264719_item_wrapper",data).find('.right_cell').find('h3').text();
						var i1 = titleX.indexOf('to claim ');
						if(i1 != -1)
						{
							titleX = titleX.slice(i1+9);
						}
						var i1 = titleX.indexOf('to collect ');
						if(i1 != -1)
						{
							titleX = titleX.slice(i1+11);
						}
							
						if(titleX.indexOf(' from ') != -1)
						{
							var i1 = titleX.indexOf(' from ');
							titleX = titleX.slice(0,i1);
						}
						var gift = titleX;
						
						info.text  = $("#app101539264719_item_wrapper",data).find('.right_cell').find('h3').text();
					}
					else if($('div.cell_wrapper', data).find('h1:first').length > 0)
					{
						var titleX = $('div.cell_wrapper', data).find('h1:first').text();
						
						info.text = titleX;
						
						var i1 = titleX.indexOf('completed a collection and shared');
						if(i1 != -1)
						{
							titleX = titleX.slice(i1+33);
						}
						
						if(titleX.indexOf('with you!') != -1)
						{
							var i1 = titleX.indexOf('with you!');
							titleX = titleX.slice(0,i1);
						}
						var gift = titleX;
					}
					else
					{
						var gift = $("#app101539264719_item_wrapper",data).children('.pad:nth-child(1)').text();
						info.text = $("#app101539264719_item_wrapper",data).children('.pad:nth-child(2)').text();
						info.image = $("#app101539264719_item_wrapper",data).children('.pad:nth-child(3)').children('img').attr('src');
					}
					
					
					if(typeof(info.image) == 'undefined') throw {message: $("#app101539264719_item_wrapper",data).html()}
					
					
					
					
					
					info.title = gift;
					info.time = Math.round(new Date().getTime() / 1000);
					
					
					database.updateItem('bonuses', id, info);
					sendView('bonusSuccess', id, info);

					console.log(info);
					if(typeof(URL) !== 'undefined')
					{
						console.log('opening new url');
						var URL = unescape(URL);
						$.ajax({
							type: "GET",
							url: URL,
							success: function(d){}
						});
					}
				}
				catch(err)
				{
					console.log(err);
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
						
						var i1 = dataFull.indexOf('window.location.replace("');
						
						if(i1 != -1)
						{
							i2 = dataFull.indexOf('");',i1);
							var newUrl = dataFull.slice(i1+25,i2);
							newUrl = newUrl.replace(/\\/g,'');

							cafeworldBonuses.Click(id, newUrl+'&_fb_noscript=1', true);
						}
						else
						{
							cafeworldBonuses.Click(id, url+'&_fb_noscript=1', true);
						}
					}
					else
					{
						info.image = 'gfx/90px-cancel.png';
						info.error = 'receiving';
						info.time = Math.round(new Date().getTime() / 1000);
						
						database.updateErrorItem('bonuses', id, info);
						sendView('bonusError', id, info);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
					cafeworldBonuses.Click(id, url, true);
				}
				else
				{
					info.error = 'connection';
					info.time = Math.round(new Date().getTime() / 1000);
					sendView('bonusError', id, info);
				}
			}
		});
	},
};