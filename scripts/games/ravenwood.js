var ravenwoodFreegifts = 
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
		
		$.get('http://apps.facebook.com/ravenwoodfair/', params2, function(data)
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
				
				params.step2url = $('span.fb_protected_wrapper > iframe', data).attr('src');
				
				ravenwoodFreegifts.Click2(params);
				
			}
			catch(e)
			{
				if(typeof(retry) == 'undefined')
				{
					ravenwoodFreegifts.Click(params, true);
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
				//var nextUrl = $('#app101539264719_frmGifts', data).attr('action');
				
				var i1 = data.indexOf('fbparams: "');
				var i2 = data.indexOf('"', i1+11);
				params.step3params = unescape(data.slice(i1+11, i2))+'&ask_gift=-1&item_id='+params.gift+'&recipient_id=0&thankyou_gift=0';
				params.step3url = 'http://www.ravenwoodfair.com/app/1/gift/send';
				
				ravenwoodFreegifts.Click3(params);
				//var formParam = $('#app101539264719_frmGifts', data).serialize();
				
				//console.log(getCurrentTime()+'[Z] Zynga params updated');
				
				//var tempUrl = nextUrl+'?'+formParam;
				
				//var i1 = tempUrl.indexOf('gid=');
				
				//params.cafeUrl = tempUrl.slice(0, i1+4)+params.gift+'&view=cafe';
				//getFBML(params);
			}
			catch(e)
			{
				if(typeof(retry) == 'undefined')
				{
					ravenwoodFreegifts.Click2(params, true);
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
	
		$.post(params.step3url, params.step3params, function(data){
			try
			{
				var i1 = data.lastIndexOf('fb:tab-item href="');
				var i2 = data.indexOf('"', i1+18);
				
				params.step4url = data.slice(i1+18, i2);
				
				ravenwoodFreegifts.Click4(params);
				
				//getFBML(params);
			}
			catch(e)
			{
				if(typeof(retry) == 'undefined')
				{
					ravenwoodFreegifts.Click3(params, true);
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
	Click4: function(params, retry)
	{
		if(typeof(retry) !== 'undefined')
		{
			var params2 = '_fb_noscript=1';
		}
		else
		{
			var params2 = '';
		}
	
		$.get(params.step4url, '',
		function(data){
			try
			{
				var i1,i2, myParms;
				var strTemp = data;

				myParms  =  'api_key=120563477996213';				


				i1       =  strTemp.indexOf('<fb:fbml>');
				i2       =  strTemp.indexOf('/script>',i1)-1;
				myParms +=  '&fbml='+encodeURIComponent(strTemp.slice(i1,i2));
				
				params.myParms = myParms;
				getFBML(params);
			}
			catch(e)
			{
				if(typeof(retry) == 'undefined')
				{
					ravenwoodFreegifts.Click4(params, true);
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


var ravenwoodRequests = 
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
				
				//info.image =
				var el = $('#app_content_120563477996213 > div > div > div > div > div', data);
				if($(el).length > 0)
				{
					if($(el).text().indexOf('You just accepted a neighbor request') != -1)
					{
						info.image = '';
						info.title = 'New neighbour';
						info.text  = $(el).text();
						info.time = Math.round(new Date().getTime() / 1000);
					}
					else
					{
						info.title = $(el).text();
						
						
						var i1 = $(el).text().indexOf('You just accepted this');
						if(i1 != -1)
						{
							var i2 = $(el).text().indexOf(' from ', i1);
							info.title = $(el).text().slice(i1+22, i2);
						}
						
						info.image = $('#app_content_120563477996213', data).find('img').attr("src");
						info.text  = $(el).text();
						info.time = Math.round(new Date().getTime() / 1000);
					}
					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);
				}
				else
				{							
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
						ravenwoodRequests.Click(id, URI+'&_fb_noscript=1', true);
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
					ravenwoodRequests.Click(id, URI+'&_fb_noscript=1', true);
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