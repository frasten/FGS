var cityofwonderRequests = 
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
						cityofwonderRequests.Click(id, redirectUrl, true);
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
				
				
				try
				{
					var src = $('#app_content_114335335255741', data).find('iframe:first').attr('src');
					if (typeof(src) == 'undefined') throw {message:"Cannot find <iframe src= in page"}
					cityofwonderRequests.Click2(id, src);
				}
				catch(err)
				{							
					if(typeof(retry) == 'undefined')
					{
						cityofwonderRequests.Click(id, URI+'&_fb_noscript=1', true);
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
					cityofwonderRequests.Click(id, URI+'&_fb_noscript=1', true);
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
	Click2: function(id, URI, retry)
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
				try
				{
				
					var i1 =  data2.indexOf('<fb:fbml>');
					var i2 =  data2.indexOf('/script>',i1)-1;
					var data = data2.slice(i1,i2);

					info.image = $('.ally_accept', data).find('img:first').attr('src');
					var txt = $('.ally_accept', data).find('h1').text();
					
					if(txt.indexOf('You can not accept this gift') != -1)
					{
						info.error = 'limit';
						info.time = Math.round(new Date().getTime() / 1000);
						info.error_text = txt;
						
						database.updateErrorItem('requests', id, info);
						sendView('requestError', id, info);	
						
						return;
					}
					
					if(txt.indexOf('You are now allies with') != -1)
					{
						info.title = txt.replace('<br>', ' ');
						info.text  = '';
					}
					else
					{
						txt = txt.replace('You just accepted ','');
						var i2 = txt.indexOf(' from ');
						
						txt = txt.slice(0, i2);
						
						info.title = txt;
						info.text  = '';
					}
					info.time = Math.round(new Date().getTime() / 1000);
					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);
				}
				catch(err)
				{							
					if(typeof(retry) == 'undefined')
					{
						cityofwonderRequests.Click2(id, URI+'&_fb_noscript=1', true);
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
					cityofwonderRequests.Click2(id, URI+'&_fb_noscript=1', true);
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

var cityofwonderBonuses = 
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
						cityofwonderBonuses.Click(id, redirectUrl, true);
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
					var src = $('#app_content_114335335255741', data).find('iframe:first').attr('src');
					if (typeof(src) == 'undefined') throw {message:"Cannot find <iframe src= in page"}
					cityofwonderBonuses.Click2(id, src);
				} 
				catch(err)
				{
					if(typeof(retry) == 'undefined')
					{
						cityofwonderBonuses.Click(id, URI+'&_fb_noscript=1', true);
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
					cityofwonderBonuses.Click(id, URI+'&_fb_noscript=1', true);
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
					var out = jQuery.trim($('div.msgs', data).text());
					
					if(out.indexOf('You already collected this bonus') != -1 || out.indexOf('is already complete') != -1 || out.indexOf('you cannot help now') != -1 || out.indexOf('No more bonuses to collect') != -1 || out.indexOf('already helped with') != -1)
					{
						info.error = 'limit';
						info.time = Math.round(new Date().getTime() / 1000);
						info.error_text = out;

						database.updateErrorItem('bonuses', id, info);
						sendView('bonusError', id, info);	
					
						return;
					}
					
					info.image = 'gfx/90px-check.png';
					info.title = 'Coins';
					info.text  = out.replace('<br>', ' ');;
					info.time = Math.round(new Date().getTime() / 1000);
					
					var link = $('div.msgs', data).find('a:first').attr('onclick').toString();
					var i1 = link.indexOf("'");
					var i2 = link.indexOf("'", i1+1);
					
					link = link.slice(i1+1, i2);
					
					$.get(link);
					
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
					cityofwonderBonuses.Click2(id, url, true);
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
}