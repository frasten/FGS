var petvilleRequests = 
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
						petvilleRequests.Click(id, redirectUrl, true);
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
					var src = $('#app_content_163576248142', data).find('iframe:first').attr('src');
					if (typeof(src) == 'undefined') throw {message:"Cannot find <iframe src= in page"}
					petvilleRequests.Click2(id, src);
				} 
				catch(err)
				{
					if(typeof(retry) == 'undefined')
					{
						petvilleRequests.Click(id, URI+'&_fb_noscript=1', true);
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
					petvilleRequests.Click(id, URI+'&_fb_noscript=1', true);
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
					var URL = $('#flashiframe', data).attr('src');
					
					var i1 = 0;
					var i2 = URL.lastIndexOf('/')+1;
					
					var nextUrl = URL.slice(i1,i2);

					var i1 = data.indexOf('ZYFrameManager.gotoTab');
					var i2 = data.indexOf(",'", i1)+2;
					var i3 = data.indexOf("'", i2);
					
					nextUrl = nextUrl+data.slice(i2,i3);
					
					
					petvilleRequests.Click3(id, nextUrl);
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
					petvilleRequests.Click2(id, url, true);
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
					if($('.reqFrom_img', data).length > 0 && $(".giftConfirm_img",data).length == 0)
					{
						console.log('New neighbour');

						info.image = $(".reqFrom_img",data).children().attr("src");
						info.title = 'New neighbour';
						info.text  = $(".reqFrom_name",data).children().text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						database.updateItem('requests', id, info);
						sendView('requestSuccess', id, info);
					}
					else if($('.giftFrom_img', data).length > 0 && $(".giftConfirm_img",data).length > 0)
					{
						var sendInfo = '';
						
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
						//info.thanks = sendInfo;					
						
						info.image = $(".giftConfirm_img",data).children().attr("src");
						info.title = $(".giftConfirm_name",data).children().text();
						info.text  = $(".giftFrom_name",data).children().text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						database.updateItem('requests', id, info);
						sendView('requestSuccess', id, info);
					}
					else
					{
						throw {}
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
					petvilleRequests.Click3(id, url, true);
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

var petvilleBonuses = 
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
						petvilleBonuses.Click(id, redirectUrl, true);
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
					var src = $('#app_content_163576248142', data).find('iframe:first').attr('src');
					if (typeof(src) == 'undefined') throw {message:"Cannot find <iframe src= in page"}
					petvilleBonuses.Click2(id, src);
				} 
				catch(err)
				{
					if(typeof(retry) == 'undefined')
					{
						petvilleBonuses.Click(id, URI+'&_fb_noscript=1', true);
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
					petvilleBonuses.Click(id, URI+'&_fb_noscript=1', true);
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
					var URL = $('#flashiframe', data).attr('src');
					
					var i1 = 0;
					var i2 = URL.lastIndexOf('/')+1;
					
					var nextUrl = URL.slice(i1,i2);

					var i1 = data.indexOf('ZYFrameManager.gotoTab');
					
					if(i1 == -1) throw {}
					
					var i2 = data.indexOf(",'", i1)+2;
					var i3 = data.indexOf("'", i2);
					
					var nextUrl2 = data.slice(i2,i3).replace('http://fb-client-0.petville.zynga.com/current/', '');
					
					nextUrl = nextUrl+nextUrl2+'&overlayed=true&'+new Date().getTime()+'#overlay';
					
					
					petvilleBonuses.Click3(id, nextUrl);
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
					petvilleBonuses.Click2(id, url, true);
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
					var out = jQuery.trim($('.main_giftConfirm_cont', data).text());
					
					if(out.indexOf('You already claimed') != -1 ||  out.indexOf('The item is all gone') != -1  || out.indexOf('already received') != -1 || out.indexOf('the celebration has ended') != -1 || out.indexOf('you cannot claim the celebration') != -1 || out.indexOf('this feed is only for friends') != -1)
					{
						info.error = 'limit';
						info.time = Math.round(new Date().getTime() / 1000);
						info.error_text = out;
						
						
						database.updateErrorItem('bonuses', id, info);
						sendView('bonusError', id, info);	
					
						return;
					}
					
					if(out.indexOf('cannot claim more than') != -1 || out.indexOf('Claim more tomorrow') != -1)
					{
						info.error = 'other';
						info.time = Math.round(new Date().getTime() / 1000);
						
						info.error_text = out;
					
						sendView('bonusError', id, info);
						return;						
					}
					
					var outText = '';
					
					if(out.indexOf('been offered') != -1)
					{
						var i1 = out.indexOf(' been offered')+13;
						var i2 = out.indexOf('.', i1);
						var i3 = out.indexOf('!', i1);
						if(i3 != -1)
							if(i3 < i2 || i2 == -1)
								i2 = i3;
								
						outText = out.slice(i1,i2);
					}
					else if(out.indexOf('has shared a') != -1)
					{
						var i1 = out.indexOf('has shared a')+13;
						var i2 = out.indexOf('!', i1);
						var i3 = out.indexOf('with', i1);
						if(i3 != -1)
							if(i3 < i2 || i2 == -1)
								i2 = i3;
						
						outText = out.slice(i1,i2);						
						
						outText = outText.replace('bonus of', '');
					}
					else if(out.indexOf('want to claim') != -1)
					{
						var i1 = out.indexOf('want to claim')+13;
						var i2 = out.indexOf('?', i1);
						outText = out.slice(i1,i2);						
					}
					else if(out.indexOf('You recieved a') != -1)
					{
						var i1 = out.indexOf('You recieved a')+15;
						var i2 = out.indexOf('from', i1);
						outText = out.slice(i1,i2);						
					}
					else if(out.indexOf('You found a') != -1)
					{
						var i1 = out.indexOf('You found a')+12;
						var i2 = out.indexOf(',', i1);
						outText = out.slice(i1,i2);						
					}
					else if(out.indexOf('Here are ') != -1)
					{
						var i1 = out.indexOf('Here are ')+9;
						var i2 = out.indexOf('for', i1);
						outText = out.slice(i1,i2);						
					}
					else if(out.indexOf('Thank you for offering ') != -1)
					{
						outText = out;
					}
					else
					{
						outText = out;
					}
					
					var postUrl = $('.main_giftConfirm_cont', data).find('form').attr('action');
					var postData = $('.main_giftConfirm_cont', data).find('form').serialize();
					
					console.log(postData);
					console.log(postUrl);
					
					$.post(postUrl, postData);
					
					

					info.text  = outText;
					info.image = 'gfx/90px-check.png';
					info.title = 'New bonus';
					
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
					petvilleBonuses.Click3(id, url, true);
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