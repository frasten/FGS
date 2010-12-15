var vampirewarsRequests = 
{
	Click:	function(id, URI, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}
		
		$.ajax({
			type: "GET",
			url: URI,
			success: function(data)
			{
				try {
					var i1 = data.indexOf('top.location.href = "');
					if(i1 != -1)
					{
						var i2 = data.indexOf('"', i1+28);
						var url = data.slice(i1+21, i2);
						vampirewarsRequests.Login(id, url);
					}
					else
					{
						var i1 = data.indexOf('script>window.location.replace("');
						if(i1 == -1) throw{}
						var i2 = data.indexOf('"', i1+32);
						var text = data.slice(i1+32,i2).replace(/\\/g,'');
						var url = $('<a href="'+text+'"></a>');
					}
				} 
				catch(err)
				{
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving request, Retrying request with ID: '+id);
						vampirewarsRequests.Click(id, URI+'&_fb_noscript=1', true);
					}
					else
					{
						console.log(err);
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
					console.log(getCurrentTime()+'[B] Connection error while receiving request, Retrying request with ID: '+id);
					vampirewarsRequests.Click(id, URI+'&_fb_noscript=1', true);
				}
				else
				{
					info.error = 'connection';
					info.time = Math.round(new Date().getTime() / 1000);
					database.updateErrorItem('requests', id, info);
					sendView('requestError', id, info);
				}
			}
		});
	},
	
	Login:	function(id, URI, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}
		
		$.ajax({
			type: "GET",
			url: URI,
			success: function(data)
			{
				try {
					
					
					var i1 = data.indexOf('script>window.location.replace("');
					var i2 = data.indexOf('"', i1+32);
					var text = data.slice(i1+32,i2).replace(/\\/g,'');
					var url = $('<a href="'+text+'"></a>');
					
					if(typeof(retry) == 'undefined')
					{
						retry = 0;
					}
					
					if(i1 != -1 && retry < 4)
					{
						vampirewarsRequests.Login(id, $(url).attr('href'), retry++);
					}
					else
					{
						if($('#app_content_25287267406', data).length > 0)
						{
							var url = $('#app_content_25287267406', data).find('iframe:first').attr('src');
							vampirewarsRequests.Click4(id, url);
						}
						else
						{
							throw {}
						}
					}
				} 
				catch(err)
				{
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving request, Retrying request with ID: '+id);
						vampirewarsRequests.Login(id, URI+'&_fb_noscript=1', true);
					}
					else
					{
						console.log(err);
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
					console.log(getCurrentTime()+'[B] Connection error while receiving request, Retrying request with ID: '+id);
					vampirewarsRequests.Login(id, URI+'&_fb_noscript=1', true);
				}
				else
				{
					info.error = 'connection';
					info.time = Math.round(new Date().getTime() / 1000);
					database.updateErrorItem('requests', id, info);
					sendView('requestError', id, info);
				}
			}
		});
	},
	
	Click4:	function(id, url, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}
		
		console.log(getCurrentTime()+'[B] Part four MW: '+id);	
		
		$.ajax({
			type: "GET",
			url: url,
			dataType: 'text',
			success: function(data)
			{
				var data = data.slice(data.indexOf('<div'),data.lastIndexOf('</div')+6);
				
				try
				{
					if($('div.title', data).text().indexOf('You must accept gifts within') != -1)
					{
						info.error = 'limit';
						info.time = Math.round(new Date().getTime() / 1000);
						info.error_text = jQuery.trim($('div.title', data).text());
						database.updateErrorItem('requests', id, info);
						sendView('requestError', id, info);
						return;
					}
					
					info.image = $('img:first', data).attr('src');
					info.title = $('img:first', data).attr('title');
					info.text = $('div.senderPic', data).parent().find('p').text();
					
					
					var sendInfo = '';
					
					/*
					if(data.indexOf('pic uid="') != -1 && data.indexOf('free_gift_id=') != -1)
					{
						
						var i1 = data.indexOf('free_gift_id=');
						var i2 = data.indexOf("'", i1);
						var giftName = data.slice(i1+13, i2);
						
						var i1 = data.indexOf('pic uid="');
						var i2 = data.indexOf('"', i1+9);
						var receiveUid = data.slice(i1+9, i2);
						
						
						var i1 = data.indexOf('false; " >', i2);
						var i2 = data.indexOf('</a', i1);
						var receiveName = data.slice(i1+10, i2);
						
						
						sendInfo = {
							gift: giftName,
							destInt: receiveUid,
							destName: receiveName,
						}
						
						
					}
					*/
					info.thanks = sendInfo;
					
					console.log(info);
					
					info.time = Math.round(new Date().getTime() / 1000);
					
					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);
					
					console.log(getCurrentTime()+'[B] Bonus collected SUCCESSFULLY - ID: '+id);	
				}
				catch(err)
				{
					console.log(err);
					info.error = 'receiving';
					info.time = Math.round(new Date().getTime() / 1000);
					database.updateErrorItem('requests', id, info);
					sendView('requestError', id, info);
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
					vampirewarsRequests.Click4(id, url, true);
				}
				else
				{
					info.error = 'connection';
					info.time = Math.round(new Date().getTime() / 1000);
					sendView('requestError', id, info);
				}
			}
		});
	},
};