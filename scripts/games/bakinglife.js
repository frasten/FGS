var bakinglifeRequests = 
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
						bakinglifeRequests.Click(id, redirectUrl, true);
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
				
				var dataFull = data2;
				var data = data2.substr(data2.indexOf('<body'),data2.lastIndexOf('</body'));
				
				if($('#app338051018849_iframe_canvas', data). length > 0)
				{
					bakinglifeRequests.Click2(id, $('#app338051018849_iframe_canvas', data).attr('src'));
				}
				else
				{							
					if(typeof(retry) == 'undefined')
					{
						bakinglifeRequests.Click(id, URI+'&_fb_noscript=1', true);
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
					bakinglifeRequests.Click(id, URI+'&_fb_noscript=1', true);
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
					if(data2.indexOf('Make sure you click on the request within one week') != -1)
					{
						info.error = 'limit';
						info.time = Math.round(new Date().getTime() / 1000);
						info.error_text = 'Make sure you click on the request within one week.';
						
						database.updateErrorItem('requests', id, info);
						sendView('requestError', id, info);
						return;
					}
					
					var data = data2;
					
					if($('.gift', data).length > 0)
					{
						info.image = $(".gift",data).children('img').attr("src");
						info.title = $(".gift",data).children('img').attr("alt");
						info.text  = $(".friendContainer2",data).find('b:first').text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						database.updateItem('requests', id, info);
						sendView('requestSuccess', id, info);						
					}
					else if($('td.boxPadding', data).find('h1').length > 0)
					{
						info.image = $('td.boxPadding', data).find('img:first').attr('src');
						
						if($('td.boxPadding', data).find('.bigGreen').length > 0)
						{
							info.title = $('td.boxPadding', data).find('.bigGreen').text();
						}
						else
						{
							info.title = $('td.boxPadding', data).find('h1:first').text();
						}
						info.text  = jQuery.trim($('td.boxPadding', data).find('p:first').text());
						info.time = Math.round(new Date().getTime() / 1000);
						
						database.updateItem('requests', id, info);
						sendView('requestSuccess', id, info);
					}
					else
					{
						throw{}
					}
				}
				catch(e)
				{							
					if(typeof(retry) == 'undefined')
					{
						bakinglifeRequests.Click2(id, URI+'&_fb_noscript=1', true);
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
					bakinglifeRequests.Click2(id, URI+'&_fb_noscript=1', true);
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

var bakinglifeBonuses = 
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
						bakinglifeBonuses.Click(id, redirectUrl, true);
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
					var src = $('#app338051018849_iframe_canvas', data).attr('src');
					if (typeof(src) == 'undefined') throw {message:"Cannot find <iframe src= in page"}
					bakinglifeBonuses.Click2(id, src);
				} 
				catch(err)
				{
					if(typeof(retry) == 'undefined')
					{
						bakinglifeBonuses.Click(id, URI+'&_fb_noscript=1', true);
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
					bakinglifeBonuses.Click(id, URI+'&_fb_noscript=1', true);
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
					var out = jQuery.trim($('td.boxPadding', data).find('p:first').text());
					var out2 = jQuery.trim($('td.boxPadding', data).find('h1:first').text());
					
					if(out.indexOf('already received') != -1 || out.indexOf('Make sure you click on the story within') != -1 || out2.indexOf('Bad News!') != -1 || out2.indexOf('Oops!') != -1)
					{
						info.error = 'limit';
						info.time = Math.round(new Date().getTime() / 1000);
						info.error_text = out;

						database.updateErrorItem('bonuses', id, info);
						sendView('bonusError', id, info);	
					
						return;
					}
					
					info.image = $('td.boxPadding', data).find('img:first').attr('src');
					
					if($('td.boxPadding', data).find('.bigGreen').length > 0)
					{
						info.title = $('td.boxPadding', data).find('.bigGreen').text();
					}
					else
					{
						info.title = $('td.boxPadding', data).find('h1:first').text();
					}
					info.text  = jQuery.trim(out);
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
					bakinglifeBonuses.Click2(id, url, true);
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
}