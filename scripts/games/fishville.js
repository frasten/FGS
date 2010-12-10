var fishvilleFreegifts = 
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
		
		$.get('http://apps.facebook.com/fishville/', params2, function(data)
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
				
				
				
				var paramTmp = $('span.fb_protected_wrapper > iframe', data).attr('src');
				
				var i1 = paramTmp.lastIndexOf('/')+2;
				
				
				params.step2params = paramTmp.slice(i1);
				fishvilleFreegifts.Click2(params);
				
			}
			catch(e)
			{
				if(typeof(retry) == 'undefined')
				{
					fishvilleFreegifts.Click(params, true);
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
	
		$.get('http://facebook.fishville.zynga.com/public/gifts_send.php?gift='+params.gift+'&view=fishville&appRef=preload_gifts&secAppRef=&reqType=gift&partial=true&'+params.step2params, params2, function(data){
			try
			{
				var i1,i2, myParms;
				var strTemp = data;

				i1       =  strTemp.indexOf('FB.init("');
				if (i1 == -1) throw {message:"Cannot find FB.init"}
				i1 += 9;
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
					fishvilleFreegifts.Click2(params, true);
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


var fishvilleRequests = 
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
				var dataFull = data2;
				var data = data2.substr(data2.indexOf('<body'),data2.lastIndexOf('</body'));
				
				if($('#app151044809337_iframe_canvas', data). length > 0)
				{
					fishvilleRequests.Click2(id, $('#app151044809337_iframe_canvas', data).attr('src'));
				}
				else
				{							
					if(typeof(retry) == 'undefined')
					{
						fishvilleRequests.Click(id, URI+'&_fb_noscript=1', true);
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
					fishvilleRequests.Click(id, URI+'&_fb_noscript=1', true);
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
				var data = data2.slice(data2.indexOf('<div class="padding_content center">'),data2.lastIndexOf('</div'))+'</div>';	
				
				
				if(data2.indexOf('seem to have already accepted this request') != -1)
				{
					info.error = 'limit';
					info.time = Math.round(new Date().getTime() / 1000);
					info.error_text = 'Sorry, you seem to have already accepted this request from the Message Center';
					
					database.updateErrorItem('requests', id, info);
					sendView('requestError', id, info);		
				}
				else if($('.reqFrom_img', data).length > 0)
				{
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
					
					var tmpStr = unescape(URI);
					
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
							destName: $(".giftFrom_name",data).children().text(),
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
					if(typeof(retry) == 'undefined')
					{
						fishvilleRequests.Click2(id, URI+'&_fb_noscript=1', true);
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
					fishvilleRequests.Click2(id, URI+'&_fb_noscript=1', true);
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