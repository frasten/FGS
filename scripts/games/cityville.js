var cityvilleRequests = 
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
				var data = data.slice(data.indexOf('<body'),data.lastIndexOf('</body')+7);
				
				try {
					var src = $('#app_content_291549705119', data).find('iframe:first').attr('src');
					if (typeof(src) == 'undefined') throw {message:"Cannot find <iframe src= in page"}
					cityvilleRequests.Click2(id, src);
				} 
				catch(err)
				{
					if(typeof(retry) == 'undefined')
					{
						cityvilleRequests.Click(id, URI+'&_fb_noscript=1', true);
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
					cityvilleRequests.Click(id, URI+'&_fb_noscript=1', true);
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
					var URL = url;
					
					var i1 = 0;
					var i2 = URL.lastIndexOf('/')+1;
					
					var nextUrl = URL.slice(i1,i2);

					var i1 = data.indexOf('ZYFrameManager.navigateTo(');
					
					if(i1 == -1) throw {}
					
					var i2 = data.indexOf("'", i1)+1;
					var i3 = data.indexOf("'", i2);
					
					var nextUrl2 = data.slice(i2,i3).replace(nextUrl, '');
					
					nextUrl = nextUrl+nextUrl2+'&overlayed=true&'+new Date().getTime()+'#overlay';

					cityvilleRequests.Click3(id, nextUrl);
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
					cityvilleRequests.Click2(id, url, true);
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
	
	Click3:	function(id, url, retry)
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
					
					if($('.errorMessage', data).length > 0)
					{ 
						info.error = 'limit';
						info.time = Math.round(new Date().getTime() / 1000);
						info.error_text = jQuery.trim($('.errorMessage', data).text());
						
						
						database.updateErrorItem('requests', id, info);
						sendView('requestError', id, info);	
						return;
					}
					
					
					
					info.title = $(".giftConfirm_name",data).children().text();
					info.time = Math.round(new Date().getTime() / 1000);

					if($('h3.gift_title', data).text().indexOf('are now neighbors') != -1)
					{
						info.image = $(".giftFrom_img",data).children().attr("src");
						info.title = 'New neighbour';
						info.text  = $(".giftFrom_name",data).children().text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						database.updateItem('requests', id, info);
						sendView('requestSuccess', id, info);
					}
					else if($('h3.gift_title', data).text().indexOf('have been made') != -1)
					{
						info.image = $(".giftConfirm_img",data).children().attr("src");
						info.title = $(".giftConfirm_name",data).children().html().replace('<br>', ' ').replace('<br \/>', ' ');
						info.text  = $('h3.gift_title', data).text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						database.updateItem('requests', id, info);
						sendView('requestSuccess', id, info);
					}
					else
					{
						var sendInfo = '';
						
						/*
						var tmpStr = unescape(url);
						
						var i1 = tmpStr.indexOf('&gift=');
						if(i1 != -1)
						{
							var i2 = tmpStr.indexOf('&', i1+1);
								
							var giftName = tmpStr.slice(i1+6,i2);
							
							var i1 = tmpStr.indexOf('&senderId=');
							var i2 = tmpStr.indexOf('&', i1+1);
							
							var giftRecipient = tmpStr.slice(i1+10,i2);						
								
							sendInfo = {
								gift: giftName,
								destInt: giftRecipient,
								destName: $('.giftFrom_name', data).children().text()
								}
						}
						*/
						//info.thanks = sendInfo;					
						
						
						info.image = $(".giftConfirm_img",data).children().attr("src");
						info.title = $(".giftConfirm_name",data).children().text();
						info.text = $(".giftFrom_name",data).children().text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						database.updateItem('requests', id, info);
						sendView('requestSuccess', id, info);
					}
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
					cityvilleRequests.Click3(id, url, true);
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

var cityvilleBonuses = 
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
				var data = data.slice(data.indexOf('<body'),data.lastIndexOf('</body')+7);
				
				try {
					var src = $('#app_content_291549705119', data).find('iframe:first').attr('src');
					if (typeof(src) == 'undefined') throw {message:"Cannot find <iframe src= in page"}
					
					cityvilleBonuses.Click2(id, src);
				} 
				catch(err)
				{
					if(typeof(retry) == 'undefined')
					{
						cityvilleBonuses.Click(id, URI+'&_fb_noscript=1', true);
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
					cityvilleBonuses.Click(id, URI+'&_fb_noscript=1', true);
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
					var URL = url;
					
					var i1 = 0;
					var i2 = URL.lastIndexOf('/')+1;
					
					var nextUrl = URL.slice(i1,i2);

					var i1 = data.indexOf('ZYFrameManager.navigateTo(');
					
					if(i1 == -1) throw {}
					
					var i2 = data.indexOf("'", i1)+1;
					var i3 = data.indexOf("'", i2);
					
					var nextUrl2 = data.slice(i2,i3).replace(nextUrl, '');
					
					nextUrl = nextUrl+nextUrl2+'&overlayed=true&'+new Date().getTime()+'#overlay';
					
					cityvilleBonuses.Click3(id, nextUrl);
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
					cityvilleBonuses.Click2(id, url, true);
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
	
	Click3:	function(id, url, retry)
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
					if($('.errorMessage', data).length > 0)
					{ 
						info.error = 'limit';
						info.time = Math.round(new Date().getTime() / 1000);
						info.error_text = jQuery.trim($('.errorMessage', data).text());
						
						
						database.updateErrorItem('bonuses', id, info);
						sendView('bonusError', id, info);	
						return;
					}
					
					
					info.text = $('h3.gift_title', data).text();
					info.title = $(".giftConfirm_name",data).children().text();
					info.image = $(".giftConfirm_img",data).children().attr("src");
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
					cityvilleBonuses.Click3(id, url, true);
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