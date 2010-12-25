var castleageRequests = 
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
						castleageRequests.Click(id, redirectUrl, true);
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
			
				var data = data2.slice(data2.indexOf('<body'),data2.lastIndexOf('</body')+7);
				
				if(data.indexOf('have already accepted this gift or it has expired') != -1)
				{
					info.error = 'limit';
					info.time = Math.round(new Date().getTime() / 1000);
					
					database.updateErrorItem('requests', id, info);
					sendView('requestError', id, info);	
					return;
				}

				var el = $('#app46755028429_results_main_wrapper', data);
				
				var tmpTxt = $(el).text();
				var i1 = tmpTxt.indexOf('You have accepted the gift:');
				if(i1 == -1)
				{
					var i1 = tmpTxt.indexOf('You have been awarded the gift:');
					var i2 = tmpTxt.indexOf(' from ');
					var tit = tmpTxt.slice(i1+31, i2);
				}
				else
				{
					var i2 = tmpTxt.indexOf('.', i1);
					var tit = tmpTxt.slice(i1+28, i2);
				}
				
				info.title = '';
				info.text = tit;
				info.image = $(el).find('img:first').attr('src');				
				info.time = Math.round(new Date().getTime() / 1000);
				
				database.updateItem('requests', id, info);
				sendView('requestSuccess', id, info);
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					console.log(getCurrentTime()+'[R] Connection error while receiving bonus, Retrying bonus with ID: '+id);
					castleageRequests.Click(id, URI+'&_fb_noscript=1', true);
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