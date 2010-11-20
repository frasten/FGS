var restaurantRequests = 
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
				
				if(data.indexOf('have already accepted this gift or it has expired') != -1)
				{
					info.error = 'limit';
					info.time = Math.round(new Date().getTime() / 1000);
					
					database.updateErrorItem('requests', id, info);
					sendView('requestError', id, info);	
					return;
				}
				
				
				//info.image =
				var tempText = $('#app43016202276_gift_text', data).text();
				info.text = tempText;
				
				var i1 = tempText.indexOf('You have accepted ');
				if(i1 != -1)
				{
					var i2 = tempText.indexOf('from', i1);
					if(i2 != -1)
					{
						info.title = tempText.slice(i1+18,i2);
					}
					else
					{
						info.title = tempText;
					}
				}
				else
				{
					info.title = tempText;
				}
				
				
				info.image = $('#app43016202276_gift_img', data).children('img').attr('src');
				info.time = Math.round(new Date().getTime() / 1000);
				
				database.updateItem('requests', id, info);
				sendView('requestSuccess', id, info);
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					console.log(getCurrentTime()+'[R] Connection error while receiving bonus, Retrying bonus with ID: '+id);
					restaurantRequests.Click(id, URI+'&_fb_noscript=1', true);
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