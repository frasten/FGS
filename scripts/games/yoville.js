var yovilleRequests = 
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
						yovilleRequests.Click(id, redirectUrl, true);
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
			
				var data = data2.slice(data2.indexOf('<body'),data2.lastIndexOf('</body'))+'</body>';
				
				if(data2.indexOf('seem to have already accepted this request') != -1)
				{
					info.error = 'limit';
					info.time = Math.round(new Date().getTime() / 1000);
					info.error_text = 'Sorry, you seem to have already accepted this request from the Message Center';
					
					database.updateErrorItem('requests', id, info);
					sendView('requestError', id, info);		
				}
				else if(data2.indexOf('You are neighbors now') != -1)
				{
					info.image = 'gfx/90px-check.png';
					info.text = 'New neighbour';
					//info.text  = $(".reqFrom_name",data).children().text();
					info.time = Math.round(new Date().getTime() / 1000);
					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);
				}
				else if($('#app21526880407_main-gift-body', data).find('div > b').length > 0)
				{
					var sendInfo = '';
					
					$('form', data).each(function()
					{
					
						var tmpStr = unescape($(this).attr('action'));
						
						if(tmpStr.indexOf('item_id') != -1)
						{
							var giftRecipient = $('img[uid]', data).attr('uid');
							
							var i1 = tmpStr.indexOf('&item_id=');
							var i2 = tmpStr.indexOf('&', i1+1);
							
							var giftName = tmpStr.slice(i1+9,i2);
							
							
							sendInfo = {
								gift: giftName,
								destInt: giftRecipient,
								destName: $('img[uid]', data).attr('title')
							}							
							return false;
						}
					});
					
					//info.thanks = sendInfo;					
					
					info.image = $('#app21526880407_main-gift-body', data).find('div > img').attr("src");
					info.title = $('#app21526880407_main-gift-body', data).find('div > h2').text();
					info.text  = $('#app21526880407_main-gift-body', data).find('div > b').text();
					info.time = Math.round(new Date().getTime() / 1000);
					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);
				}
				else
				{							
					if(typeof(retry) == 'undefined')
					{
						yovilleRequests.Click(id, URI+'&_fb_noscript=1', true);
						console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
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
					yovilleRequests.Click(id, URI+'&_fb_noscript=1', true);
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