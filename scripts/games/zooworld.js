var zooworldFreegifts = 
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
		
		$.get('http://apps.facebook.com/playzoo/', params2, function(data)
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
				
				var src = $('#app_content_167746316127', data).find('iframe:first').attr('src');
					
					
				var i1 = src.indexOf('?');
				src = src.slice(i1+1);
				
				var postParams = {}
				
				for(var idd in jQuery.unparam(src))
				{
					if(idd.indexOf('fb_') != -1)
					{
						postParams[idd] = jQuery.unparam(src)[idd];
					}
				}
				
				postParams['service'] 	= 'dsplygiftinvite';
				postParams['giftId'] 	= params.gift;
				postParams['appname']	= 'zooparent';
				postParams['appId'] 	= '74';
				//postParams['straightToGift'] = '1';
				
				params.param2 = postParams;
//http://fbeq.rockyou.com/facebook_apps/zoo/giftInIframe.php?service=dsplygiftinvite&giftId=977&appname=zooparent&appId=74&fb_sig_in_iframe=1&fb_sig_base_domain=rockyou.com&fb_sig_locale=pl_PL&fb_sig_in_new_facebook=1&fb_sig_time=1293477719.0314&fb_sig_added=1&fb_sig_profile_update_time=1291727948&fb_sig_expires=1293483600&fb_sig_user=100001178615702&fb_sig_session_key=2.CXT_hOTef4C_zohaK3MG1w__.3600.1293483600-100001178615702&fb_sig_ss=5ptmukWpwN3GOKXxHq2u8g__&fb_sig_cookie_sig=d7f71a284392c238406d31b01a9a8118&fb_sig_country=pl&fb_sig_api_key=daa4b920374244da1829a0df63cd815f&fb_sig_app_id=167746316127&fb_sig=b174aef00662d0cb251ceae3d091da82



				zooworldFreegifts.Click2(params);
				
			}
			catch(e)
			{
				if(typeof(retry) == 'undefined')
				{
					zooworldFreegifts.Click(params, true);
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
	
		$.get('http://fbeq.rockyou.com/facebook_apps/zoo/giftInIframe.php', params.param2, function(data){
			try
			{
			
				var i1,i2, myParms;
				var strTemp = data;

				i1       =  strTemp.indexOf('FB.Facebook.init("');
				if (i1 == -1) throw {message:"Cannot find FB.init"}
				i1 += 18;
				i2       =  strTemp.indexOf('"',i1);

				myParms  =  'app_key='+strTemp.slice(i1,i2);
				i1     =  i2 +1;
				i1       =  strTemp.indexOf('"',i1)+1;
				i2       =  strTemp.indexOf('"',i1);
				
				myParms +=  '&channel_url='+ encodeURIComponent(strTemp.slice(i1,i2));

				i1       =  strTemp.indexOf('<fb:fbml>');
				i2       =  strTemp.indexOf('/script>',i1)-1;
				myParms +=  '&fbml='+encodeURIComponent(strTemp.slice(i1,i2));
				
				params.myParms = myParms;
				
				console.log(getCurrentTime()+'[Z] FBMLinfo - OK');
				
				getFBML(params);
			}
			catch(e)
			{
				if(typeof(retry) == 'undefined')
				{
					zooworldFreegifts.Click2(params, true);
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
	}
};


var zooworldRequests = 
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
						zooworldRequests.Click(id, redirectUrl, true);
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
					var testStr = $('#app_content_167746316127', data).find('h1:first').text();
					
					if(testStr.indexOf('You are now ZooMates') != -1)
					{
						info.image = $('.zoomaccept5-box', data).find('img:first').attr('src');
						info.title = 'New neighbour';
						info.text  = $('.zoomaccept5-box', data).find('img:first').attr('title');
						info.time = Math.round(new Date().getTime() / 1000);
					}
					else
					{
						info.image = $('.main_body', data).find('img:first').attr('src');
						info.title = $('.main_body', data).find('p:first').text();
						info.text  = $('.main_body', data).find('p:last').text();
						info.time = Math.round(new Date().getTime() / 1000);
					}
					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);
				} 
				catch(err)
				{
					if(typeof(retry) == 'undefined')
					{
						zooworldRequests.Click(id, URI+'&_fb_noscript=1', true);
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
					zooworldRequests.Click(id, URI+'&_fb_noscript=1', true);
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


var zooworldBonuses = 
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
						zooworldBonuses.Click(id, redirectUrl, true);
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
					if($('#app_content_167746316127', data).length > 0)
						var el = $('#app_content_167746316127', data);
					else
						var el = $('#app_content_2345673396', data);
					
					if($(el).text().indexOf('No Thanks') != -1)
					{
						console.log(URI);
					}
					else
					{
						var src = $(el).find('iframe:first').attr('src');
						
						if (typeof(src) == 'undefined') throw {message:"Cannot find <iframe src= in page"}
						zooworldBonuses.Click2(id, src);
					}
				} 
				catch(err)
				{
					console.log(err);
					if(typeof(retry) == 'undefined')
					{
						zooworldBonuses.Click(id, URI+'&_fb_noscript=1', true);
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
					zooworldBonuses.Click(id, URI+'&_fb_noscript=1', true);
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
					var i1 = 0;
					var i2 = url.lastIndexOf('/')+1;
					var domain = url.slice(i1,i2);

					var lastPos = 0;

					var count = data.match(/var serviceObj/g);

					for(var i = 0; i < count.length; i++)
					{
						var ii1 = data.indexOf('var serviceObj =', lastPos);
						var i1  = data.indexOf('data:', ii1);
						if(i1 == -1) continue;
						i1+=5;
						var i2 = data.indexOf('},', i1)+1;
						lastPos = i2;
						
						if(data.slice(i1, i2).indexOf('zooparent') != -1 || data.slice(i1, i2).indexOf('"hugme"') != -1)
						{
							eval('var tempVars = '+data.slice(i1,i2));
							break;
						}
					}
					
					if(typeof(tempVars) == 'undefined') throw{}
					
					var getStr = '?oauth_consumer_key=facebook.com&oauth_signature=1&vip&version=100';
					
					for(var idd in tempVars)
					{
						if(idd.indexOf('fb_') != -1)
						{
							getStr += '&'+idd+'='+tempVars[idd];
						}
					}
					
					var i3 = data.indexOf('url: "', i2);
					i3+=6;
					var i4 = data.indexOf('"', i3);
					
					
					var nextUrl = domain+data.slice(i3,i4)+getStr;
					var params = tempVars;
					
					zooworldBonuses.Click3(id, nextUrl, params);
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
					zooworldBonuses.Click2(id, url, true);
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
	
	Click3:	function(id, url, params, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}	
		
		$.ajax({
			type: "POST",
			url: url,
			data: params,
			success: function(data)
			{
				
				try
				{
					var out = data.return_data.dialogData.subtitle;
					var body = data.return_data.dialogData.bodyText;
					var head = data.return_data.dialogData.header;
					var image = data.return_data.dialogData.image;
					
					if(head == 'HEADER_SORRY_PAL' || head == 'HEADER_UH_OH' || body.indexOf('has been helped already') != -1 || out == 'You cannot claim this drum!')
					{
					
						if(out.indexOf('<b>') == -1)
						{
							info.error = 'limit';
							info.time = Math.round(new Date().getTime() / 1000);
							if(out == 'Thank You for Trying!' || out == 'Try Again!' || out == 'You cannot claim this drum!' || jQuery.trim(out) == '')
								info.error_text = body;
							else
								info.error_text = out;
							
							
							database.updateErrorItem('bonuses', id, info);
							sendView('bonusError', id, info);	
						
							return;
						}
						var i1 = out.indexOf('<b')+3;
						var i2 = out.indexOf('b>',i1)-2;
						out = out.slice(i1,i2);
					}
					
					if(body.indexOf('You have adopted the') != -1)
					{
						out = body;
						body = '';
					}
					
					if(body.indexOf('you received a special gift') != -1)
					{
						var temp = out;

						var i1 = body.indexOf('<b')+3;
						var i2 = body.indexOf('</',i1);
						out = body.slice(i1,i2);
						
						body = temp;
					}

					if(jQuery.trim(out) == '')
					{
						out = body;
					}
					
					if(out.indexOf("Hurray! You've claimed the") != -1)
					{
						var i1 = out.indexOf("Hurray! You've claimed the ");
						var i2 = out.indexOf('for', i1);
						out = out.slice(i1+27, i2);
					}
					
					if(out.indexOf('For trying, you received a ') != -1)
					{
						var i1 = out.indexOf("For trying, you received a ");
						var i2 = out.indexOf('!', i1);
						out = out.slice(i1+27, i2);
					}
					
					
					if(out.indexOf('You opened the mystery gift box and found a ') != -1)
					{
						var i1 = out.indexOf("You opened the mystery gift box and found a ");
						var i2 = out.indexOf('!', i1);
						out = out.slice(i1+44, i2);
					}
					
					if(out.indexOf(' from ') != -1)
					{
						var i1 = 0;
						var i2 = out.indexOf(' from ', i1);
						out = out.slice(i1, i2);
					}
					
					
					out = out.replace('You helped and received a','').replace(' has been added to your inventory.').replace('You received a', '').replace('You have adopted the','').replace('You got a', '').replace('!','');
					
					info.title = out;
					info.text = body;
					info.image = image;					
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
					zooworldBonuses.Click3(id, url, params, true);
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
};