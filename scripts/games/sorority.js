var sororityRequests = 
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
				var data = data.substr(data.indexOf('<body'),data.lastIndexOf('</body'));
				
				try {
					if($('#app8630423715_claimGift', data).length > 0)
					{
						var el = $('#app8630423715_claimGift', data);
					}
					else
					{
						var el = $('#app8630423715_acceptInvite', data);
					}

					var out = $(el).text();
					
					if(out.indexOf('been claimed. Go claim ') != -1 || out.indexOf('You can only claim gifts from your friends') != -1)
					{
						info.error = 'limit';
						info.time = Math.round(new Date().getTime() / 1000);
						info.error_text = 'This Gift has already been claimed.';
						
						database.updateErrorItem('requests', id, info);
						sendView('requestError', id, info);
						return;
					}
					
					if($(el).find('img[uid]').length > 0)
					{
						info.image = $(el).find('img[uid]:first').attr('src');
						info.title = '';
						info.text  = 'New neighbour';
						info.time = Math.round(new Date().getTime() / 1000);
					}
					else
					{
						info.image = $(el).find('.left:first').children('img').attr('src');
						info.title = '';
						info.text  = $(el).find('.left:last').children('span').text();
						info.time = Math.round(new Date().getTime() / 1000);
					}
					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);		
				} 
				catch(err)
				{
					console.log(err);
					if(typeof(retry) == 'undefined')
					{
						sororityRequests.Click(id, URI+'&_fb_noscript=1', true);
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
					sororityRequests.Click(id, URI+'&_fb_noscript=1', true);
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