var crimecityRequests = 
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
			success: function(data)
			{
				var redirectUrl = checkForLocationReload(data);
				
				if(redirectUrl != false)
				{
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving gift, Retrying bonus with ID: '+id);
						crimecityRequests.Click(id, redirectUrl, true);
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
				
				
				var data = data.slice(data.indexOf('<body'),data.lastIndexOf('</body')+7);
				
				try {
					var src = $('#app_content_129547877091100', data).find('iframe:first').attr('src');
					if (typeof(src) == 'undefined') throw {message:"Cannot find <iframe src= in page"}
					crimecityRequests.Click2(id, src);
				} 
				catch(err)
				{
					if(typeof(retry) == 'undefined')
					{
						crimecityRequests.Click(id, URI+'&_fb_noscript=1', true);
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
					crimecityRequests.Click(id, URI+'&_fb_noscript=1', true);
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
	
	Click2:	function(id, url, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}	
		
		$.ajax({
			type: "GET",
			url: url,
			success: function(data)
			{
				try
				{
					if($('.streamRewardAllRewardsClaimed', data).length > 0)
					{ 
						info.error = 'limit';
						info.time = Math.round(new Date().getTime() / 1000);
						info.error_text = jQuery.trim($('.streamRewardAllRewardsClaimed', data).text());
						
						database.updateErrorItem('requests', id, info);
						sendView('requestError', id, info);
						return;
					}
					
					if($('.acceptMafiaMemberBox', data).length > 0)
					{
						info.image = '';
						info.title = '';
						info.text  = 'New neighbour';
						info.time = Math.round(new Date().getTime() / 1000);
					}
					else
					{
						info.image = $('.acceptGiftGiftBoxImage', data).children('img').attr('src');
						info.title = '';						
						info.text  = $('.acceptGiftGiftBoxTitle', data).text();
						
						info.time = Math.round(new Date().getTime() / 1000);
					}
					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);			
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
					crimecityRequests.Click2(id, url, true);
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
};

var crimecityBonuses = 
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
			success: function(data)
			{
				var redirectUrl = checkForLocationReload(data);
				
				if(redirectUrl != false)
				{
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
						crimecityBonuses.Click(id, redirectUrl, true);
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
				
				
				var data = data.slice(data.indexOf('<body'),data.lastIndexOf('</body')+7);
				
				try {
					var src = $('#app_content_129547877091100', data).find('iframe:first').attr('src');
					if (typeof(src) == 'undefined') throw {message:"Cannot find <iframe src= in page"}
					
					crimecityBonuses.Click2(id, src);
				} 
				catch(err)
				{
					if(typeof(retry) == 'undefined')
					{
						crimecityBonuses.Click(id, URI+'&_fb_noscript=1', true);
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
					crimecityBonuses.Click(id, URI+'&_fb_noscript=1', true);
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
	
	Click2:	function(id, url, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}	
		
		$.ajax({
			type: "GET",
			url: url,
			success: function(data)
			{
				try
				{
					if($('.streamRewardAllRewardsClaimed', data).length > 0)
					{ 
						info.error = 'limit';
						info.time = Math.round(new Date().getTime() / 1000);
						info.error_text = jQuery.trim($('.streamRewardAllRewardsClaimed', data).text());
						
						database.updateErrorItem('bonuses', id, info);
						sendView('bonusError', id, info);
						return;
					}
					
					
					info.image = $('.streamRewardGiftBoxImage', data).children('img').attr('src');
					info.title = $('.streamRewardGiftBoxTitle', data).text();
					
					info.text  = $('.streamRewardGiftBoxTitle', data).text();//jQuery.trim($('.streamRewardBoxTitle', data).text());
					info.time = Math.round(new Date().getTime() / 1000);
					
					database.updateItem('bonuses', id, info);
					sendView('bonusSuccess', id, info);			
				}
				catch(err)
				{
					console.log(err);
					info.error = 'receiving';
					info.time = Math.round(new Date().getTime() / 1000);
					database.updateErrorItem('bonuses', id, info);
					sendView('bonusError', id, info);
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					crimecityBonuses.Click2(id, url, true);
				}
				else
				{
					info.error = 'connection';
					info.time = Math.round(new Date().getTime() / 1000);
					database.updateErrorItem('bonuses', id, info);
					sendView('bonusError', id, info);
				}
			}
		});
	},
};