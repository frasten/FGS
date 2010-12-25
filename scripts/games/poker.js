var pokerFreegifts = 
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
		
		$.get('http://apps.facebook.com/texas_holdem/', params2, function(data)
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
				
				var i1 = data.indexOf('app_2389801228.context');
				var i2 = data.indexOf('\\"', i1);
				var i3 = data.indexOf('\\"', i2+2);
				
				var fb_mock_hash = data.slice(i2+2,i3);
				
				var i1 = data.indexOf('app_2389801228.contextd', i1);
				var i2 = data.indexOf('\\"', i1);
				var i3 = data.indexOf('}\\"', i2+5);
				
				var fb_mock = data.slice(i2+2,i3+1).replace(/\\/g, '').replace(/\\/g, '');
				
				
				//domene sprawdzic
				
				params.postData =
				{
					url: 'http://facebook2.poker.zynga.com/poker/inc/ajax/todo_send_chip.php?box=0',
					type:1,
					require_login:true,
					fb_mockajax_context: fb_mock,
					fb_mockajax_context_hash: fb_mock_hash,
					appid: '2389801228',
					fb_dtsg: params.fb_dtsg,
					post_form_id: params.post_form_id,
					lsd:'',
					post_form_id_source: 'AsyncRequest'
				}
				
				pokerFreegifts.Click2(params);
				
			}
			catch(e)
			{
				console.log(e);
				if(typeof(retry) == 'undefined')
				{
					pokerFreegifts.Click(params, true);
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
	
		$.ajax({
			type: "POST",
			url: 'http://apps.facebook.com/fbml/fbjs_ajax_proxy.php?__a=1',
			dataType: 'text',
			data: params.postData,
			success: function(data)
			{
				try
				{
					var str = data.substring(9);
					var error = parseInt(JSON.parse(str).error);
					
					if(error > 0) throw {}
					
					var x = JSON.parse(str);
					
					var data = x.payload.data.fbml_form0;
					
					var arr = [];
					
					$('.unselected_list', data).children('label').each(function()
					{
						var itm = {}
						itm[$(this).children('input').val()] = {name: $(this).children('span').text()};
						arr.push(itm);
					});
					
					if(typeof(params.sendTo) == 'undefined')
					{
						console.log(getCurrentTime()+'[Z] Updating neighbours');
						sendView('updateNeighbours', params.gameID, arr);
						return;
					}
					
					var strTemp = data;
					var strTemp2;
					
					i1       =  strTemp.indexOf('PlatformInvite.sendInvitation');
					if (i1 == -1) throw {message:"Cannot find PlatformInvite.sendInvitation in page"}
					i1       =  strTemp.indexOf('&#123;',i1);
					i2       =  strTemp.indexOf('&#125;',i1)+6;
					strTemp2     =  strTemp.slice(i1,i2);
					strTemp2   =  strTemp2.replace(/&quot;/g,'"').replace(/&#123;/g,'{').replace(/&#125;/g,'}');
					eval("aTemp = "+strTemp2);
					
					myParms      =  'app_id='     +aTemp["app_id"];
					myParms     +=  '&request_type='  +escape(aTemp["request_type"]);
					myParms     +=  '&invite='      +aTemp["invite"];
					
					
					strTemp2 = $('form[content]:first', data).attr('content');
					/*					
					i1           =  strTemp.indexOf('content=\\"');
					if (i1 == -1) throw {message:"Cannot find  content=\\ in page"};
					i1			+=  10;
					i2           =  strTemp.indexOf('"',i1)-1;
					strTemp2    =   eval('"'+strTemp.slice(i1,i2)+'"');
					*/
					
					if(typeof(strTemp2) == 'undefined') throw {message:"Cannot find  content=\\ in page"};
					myParms     +=  '&content='     +encodeURIComponent(strTemp2);
					
					myParms     +=  '&preview=false';
					myParms     +=  '&is_multi='    +aTemp["is_multi"];
					myParms     +=  '&is_in_canvas='  +aTemp["is_in_canvas"];
					myParms     +=  '&form_id='     +aTemp["request_form"];
					myParms     +=  '&include_ci='    +aTemp["include_ci"];
					
					myParms     +=  '&prefill=true&message=&donot_send=false&__d=1';

					myParms    +=  '&post_form_id='+params.post_form_id;
					myParms     +=  '&fb_dtsg='+params.fb_dtsg;
					myParms     +=  '&post_form_id_source=AsyncRequest&lsd&';
					
					myUrl2 = $('form[content]', data).attr('action');
					
					var param2 = $('form[content]', data).serialize();
					
					params.items = arr;
					
					console.log(getCurrentTime()+'[Z] Sending');
					
					var j = 0;
					for(u in params.sendTo)
					{
						var v = params.sendTo[u];
						
						myParms     +=  '&to_ids['+j+']='   +v;
						if(params.gameID == '120563477996213')
							param2 += 'ids[]='+v+'&';
						else
							param2 += '&ids%5B%5D='+v;						
						j++;
					}
										
					params.myParms = myParms+'&lsd=';
					params.myUrl = 'http://apps.facebook.com/texas_holdem/'+myUrl2;
					params.param2 = param2;
					
					sendGift(params);
				}
				catch(e)
				{
					if(typeof(retry) == 'undefined')
					{
						pokerFreegifts.Click2(params, true);
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
			}				
		});
	},
};


var pokerRequests = 
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
				var el = $('.acceptedGift', data);
				
				if($(el).length > 0)
				{
					info.title = $('.acceptedGift', data).find('h1:first').children('span:first').text();
					info.image = $('.acceptGiftIcon', data).children('img').attr("src");
					info.text  = $('.acceptGiftFrom', data).find('img:first').attr('title');
					info.time = Math.round(new Date().getTime() / 1000);
				
					var sendInfo = '';
					
					if($('.acceptGiftFrom', data).find('img[uid]').length > 0)
					{
						sendInfo = {
							gift: 'chips',
							destInt: $('.acceptGiftFrom', data).find('img[uid]:first').attr('uid'),
							destName: $('.acceptGiftFrom', data).find('img[uid]:first').attr('title'),
							}
					}
					info.thanks = sendInfo;	
					
					
					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);
					
					
				}
				else
				{							
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
						pokerRequests.Click(id, URI+'&_fb_noscript=1', true);
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
					pokerRequests.Click(id, URI+'&_fb_noscript=1', true);
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