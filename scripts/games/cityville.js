var cityvilleFreegifts = 
{
	Click: function(params, retry)
	{
		if(typeof(retry) !== 'undefined')
		{
			var params2 = '_fb_noscript=1';
		}
		else
		{
			var params2 = '';
		}
		
		$.get('http://apps.facebook.com/cityville/', params2, function(data)
		{
			try
			{
				i1          =   data.indexOf('post_form_id:"')
				if (i1 == -1) throw {message:'Cannot post_form_id in page'}
				i1			+=	14;
				i2          =   data.indexOf('"',i1);
				
				params.post_form_id = data.slice(i1,i2);
				
				
				i1          =   data.indexOf('fb_dtsg:"',i1)
				if (i1 == -1) throw {message:'Cannot find fb_dtsg in page'}
				i1			+=	9;
				i2          = data.indexOf('"',i1);
				params.fb_dtsg		= data.slice(i1,i2);
				
				params.step2url = $('#app_content_291549705119', data).find('iframe:first').attr('src');
				cityvilleFreegifts.Click2(params);
				
			}
			catch(e)
			{
				if(typeof(retry) == 'undefined')
				{
					cityvilleFreegifts.Click(params, true);
				}
				else
				{
					console.log(getCurrentTime()+'[Z] Error: '+e.message);
					
					if(typeof(params.sendTo) == 'undefined')
					{
						sendView('errorUpdatingNeighbours');
					}
					else
					{
						sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}		
		});
	},
	Click2: function(params, retry)
	{
		if(typeof(retry) !== 'undefined')
		{
			var params2 = '_fb_noscript=1';
		}
		else
		{
			var params2 = '';
		}
	
		$.get(params.step2url, params2, function(data){
			try
			{
				var dataStr = '';

				
				var i1 = data.indexOf('new ZY(');
				if(i1 == -1) throw {}
				i1+=7;				
				var i2 = data.indexOf('},')+1;
				
				eval('var zyParam ='+data.slice(i1,i2));
				
				var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
				params.domain = params.step2url.match(re)[1].toString();
				params.zyParam = jQuery.param(zyParam);
				
				cityvilleFreegifts.Click3(params);
			}
			catch(e)
			{
				if(typeof(retry) == 'undefined')
				{
					cityvilleFreegifts.Click2(params, true);
				}
				else
				{
					console.log(getCurrentTime()+'[Z] Error: '+e.message);
					
					if(typeof(params.sendTo) == 'undefined')
					{
						sendView('errorUpdatingNeighbours');
					}
					else
					{
						sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}		
		});
	},
	Click3: function(params, retry)
	{
		if(typeof(retry) !== 'undefined')
		{
			var params2 = '_fb_noscript=1';
		}
		else
		{
			var params2 = '';
		}
	
		$.get('http://'+params.domain+'/gifts.php?action=chooseRecipient&gift='+params.gift+'&view=app&ref=&'+params.zyParam, params2, function(data){
			try
			{
			
				var i1,i2, myParms;
				var strTemp = data;
				
				myParms = 'api_key=291549705119&locale=en_US&sdk=joey';

				/*
				i1       =  strTemp.indexOf('FB.init("');
				if (i1 == -1) throw {message:"Cannot find FB.init"}
				i1 += 9;
				i2       =  strTemp.indexOf('"',i1);

				myParms  =  'app_key='+strTemp.slice(i1,i2);
				i1     =  i2 +1;
				i1       =  strTemp.indexOf('"',i1)+1;
				i2       =  strTemp.indexOf('"',i1);
				
				myParms +=  '&channel_url='+ encodeURIComponent(strTemp.slice(i1,i2));
				*/

				//var i1 = data.indexOf('serverSnml>');
				//var i2 = data.indexOf('
				data = data.replace(/snml:/g, 'fb_');
				
				var el2 = $('<div></div>');
				
				$('fb_serverSnml', data).find('style:first').appendTo(el2);
				$('fb_serverSnml', data).find('div:first').appendTo(el2);

				var exclude = $('fb_multi-friend-selector', data).attr('exclude_ids');
				
				
				
				var cmd_id = new Date().getTime();
				
				var i1 = data.indexOf('SNAPI.init(');
				var i2 = data.indexOf('{', i1);
				var i3 = data.indexOf('}},', i2)+2;
				
				var session = data.slice(i2,i3);
				
				var exArr = exclude.split(',');
				
				var str = '';
				$(exArr).each(function(k,v)
				{
					str += '"'+v+'"'
					
					if(k+1 < exArr.length)
						str+= ',';
				});
				
				var i1 = data.indexOf('"zy_user":"')+11;
				var i2 = data.indexOf('"', i1);
				var zy_user = data.slice(i1,i2);	
				
				
				var postData = 
				{
					method: 'getSNUIDs',
					params:	'[['+str+'],"1"]',
					cmd_id:	cmd_id,
					app_id:	'75',
					session: session,
					zid:	zy_user,
					snid:	1,
				}				
				
				$.post('http://fb-client-0.cityville.zynga.com/snapi_proxy.php', postData, function(data2)
				{
					var info = JSON.parse(data2);
					
					var str = '';
					
					for(var uid in info.body)
					{
						var t = info.body[uid];
						str+= t+',';
					}
					exclude = str.slice(0, -1);					
					
					var el = $('div.mfs', data);
					
					$(el).prepend('<fbGood_request-form invite="'+$('fb_request-form', data).attr('invite')+'"  action="'+$('fb_request-form', data).attr('action')+'" method="'+$('fb_request-form', data).attr('method')+'"  type="'+$('fb_request-form', data).attr('type')+'" content="'+$('fb_content', data).html().replace(/\"/g, "'")+'" ><div><fb:multi-friend-selector cols="5" condensed="true" max="30" unselected_rows="6" selected_rows="5" email_invite="false" rows="5" exclude_ids="'+exclude+'" actiontext="Select a gift" import_external_friends="false"></fb:multi-friend-selector><fb:request-form-submit import_external_friends="false"></fb:request-form-submit><a style="display: none" href="http://fb-0.cityville.zynga.com/flash.php?skip=1">Skip</a></div></fbGood_request-form');
					$(el).find('form, fb_request-form').remove();
				
					$(el).appendTo(el2);
					
					var str = $(el2).html();
					
					str = str.replace(/fbgood_/g, 'fb:');
					str = str.replace(/fb_req-choice/g, 'fb:req-choice');
					str = str.replace('/fb:req-choice', '/fb:request');
					str = str.replace('/fb:req-choice', '/fb:req');
					
					
					
					var fbml = '<fb:fbml>'+str+'</fb:fbml>';
					
					
					myParms +=  '&fbml='+encodeURIComponent(fbml);
					// myParms +=  '&channel_url=http://static.ak.fbcdn.net/connect/xd_proxy.php#cb=f268243e1c&origin=http%3A%2F%2Ffb-0.cityville.zynga.com%2Ff366dc9ba8&relation=parent.parent&transport=postmessage';

					params.myParms = myParms;

					console.log(getCurrentTime()+'[Z] FBMLinfo - OK');

					getFBML(params);
				});

			}
			catch(e)
			{
				
				if(typeof(retry) == 'undefined')
				{
					cityvilleFreegifts.Click3(params, true);
				}
				else
				{
					console.log(getCurrentTime()+'[Z] Error: '+e.message);
					
					if(typeof(params.sendTo) == 'undefined')
					{
						sendView('errorUpdatingNeighbours');
					}
					else
					{
						sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}		
		});
	},
};


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
				var redirectUrl = checkForLocationReload(data);
				
				if(redirectUrl != false)
				{
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving gift, Retrying bonus with ID: '+id);
						cityvilleRequests.Click(id, redirectUrl, true);
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
						info.error = 'receiving';
						info.time = Math.round(new Date().getTime() / 1000);
						//info.error_text = jQuery.trim($('.errorMessage', data).text());
						
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
						
						var tmpStr = unescape(url);
						
						var i1 = tmpStr.indexOf('?gift=');
						if(i1 == -1)
						{
							i1 = tmpStr.indexOf('&gift=');
						}
						if(i1 != -1)
						{
							var i2 = tmpStr.indexOf('&', i1+1);
								
							var giftName = tmpStr.slice(i1+6,i2);
							
							var i1 = tmpStr.indexOf('senderId=');
							var i2 = tmpStr.indexOf('&', i1+1);
							
							var giftRecipient = tmpStr.slice(i1+9,i2);						
								
							sendInfo = {
								gift: giftName,
								destInt: giftRecipient,
								destName: $('.giftFrom_name', data).children().text()
								}
						}
						info.thanks = sendInfo;
						
						
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
				var redirectUrl = checkForLocationReload(data);
				
				if(redirectUrl != false)
				{
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
						cityvilleBonuses.Click(id, redirectUrl, true);
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