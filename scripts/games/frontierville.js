var frontiervilleRequests = 
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
				var data = data2.substr(data2.indexOf('<body'),data2.lastIndexOf('</body'));
				

				if($('.giftFrom_img', data).length > 0 && $(".giftConfirm_img",data).length == 0)
				{
					console.log('New neighbour');

					info.image = $(".giftFrom_img",data).children().attr("src");
					info.title = 'New neighbour';
					info.text  = $(".giftFrom_name",data).children().text();
					info.time = Math.round(new Date().getTime() / 1000);
					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);
				}
				else if($('.giftFrom_img', data).length > 0 && $(".giftConfirm_img",data).length > 0)
				{
					//gift sukces
					console.log('New gift');

					
					var sendInfo = '';
					
					var tmpStr = unescape(URI);
					
					var i1 = tmpStr.indexOf('&gift=');
					if(i1 != -1)
					{
						var i2 = tmpStr.indexOf('&', i1+1);
							
						var giftName = tmpStr.slice(i1+6,i2);
						
						var i1 = tmpStr.indexOf('&senderId=1:');
						var i2 = tmpStr.indexOf('&', i1+1);
						
						var giftRecipient = tmpStr.slice(i1+12,i2);						
							
						sendInfo = {
							gift: giftName,
							destInt: giftRecipient,
							destName: $('.giftFrom_img', data).find('img').attr('title'),
							}
					}
					info.thanks = sendInfo;					
					
					info.image = $(".giftConfirm_img",data).children().attr("src");
					info.title = $(".giftConfirm_name",data).children().text();
					info.text  = $(".giftFrom_name",data).children().text();
					info.time = Math.round(new Date().getTime() / 1000);
					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);
				}
				else
				{							
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
						frontiervilleRequests.Click(id, URI+'&_fb_noscript=1', true);
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
					frontiervilleRequests.Click(id, URI+'&_fb_noscript=1', true);
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

var frontiervilleBonuses = 
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
				data = data.substr(data.indexOf('<body'),data.lastIndexOf('</body'));

				if($('.fail_message', data).length > 0)
				{
					console.log(getCurrentTime()+'[B] Bonus already claimed - deleting bonus with ID: '+id);
					
					info.error = 'limit';
					info.time = Math.round(new Date().getTime() / 1000);
					info.error_text = $('.fail_message', data).text();
					
					database.updateErrorItem('bonuses', id, info);
					sendView('bonusError', id, info);						
				}
				else if($('.morePending_bttn', data).length > 0)
				{
					var giftReceiveUrl = $('.morePending_bttn > form:first', data).attr("action");
					var giftReceivePost = $('.morePending_bttn > form:first', data).serialize();
					
					var testStr = $('.gift_from > h3', data).text();
					var testStr = testStr.replace(/^\s+|\s+$/g, '');
					
					if(testStr == 'ToHelp' || testStr == 'To Help')
					{
						var tempTitle = $(".morePending_cont > div.text:first", data).text().replace('Help out and receive', '');
					}
					else
					{
						var tempTitle = $(".giftConfirm_name",data).children().text();
					}
					
					var tempImage = $(".giftConfirm_img",data).children().attr("src");
					
					$.ajax({
						type: "POST",
						data: giftReceivePost,
						url: giftReceiveUrl,
						success: function(d)
						{
							if(d.indexOf('giftLimit') != -1)
							{
								var i1 = d.indexOf('class="giftLimit')+18;
								var i2 = d.indexOf('div>', i1)-2;
								
								info.error_text = jQuery.trim(d.slice(i1,i2));
								
								if(info.error_text.indexOf('your friend will still get their') != -1)
								{
									info.title = tempTitle;
									info.image = tempImage;
									info.text = '';
									info.time = Math.round(new Date().getTime() / 1000);
								
									database.updateItem('bonuses', id, info);
									sendView('bonusSuccess', id, info);
								}
								else
								{
									info.error = 'other';
									info.time = Math.round(new Date().getTime() / 1000);
								
									sendView('bonusError', id, info);
								}
							}
							else
							{
								info.title = tempTitle;
								info.image = tempImage;
								info.text = '';
								info.time = Math.round(new Date().getTime() / 1000);
							
								database.updateItem('bonuses', id, info);
								sendView('bonusSuccess', id, info);
								console.log(getCurrentTime()+'[B] Bonus collected SUCCESSFULLY - ID: '+id);
							}
						},
						error: function()
						{
							if(typeof(retry) == 'undefined')
							{
								console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
								frontiervilleBonuses.Click(id, url, true);
							}
							else
							{
								info.error = 'connection';
								info.time = Math.round(new Date().getTime() / 1000);
								sendView('bonusError', id, info);
							}
						}
					});
				}
				else
				{
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
						frontiervilleBonuses.Click(id, url+'&_fb_noscript=1', true);
					}
					else
					{
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
					frontiervilleBonuses.Click(id, url, true);
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