FGS.pokerFreegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/texas_holdem/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var i1, i2;

					i1          =   dataStr.indexOf('post_form_id:"')
					if (i1 == -1) throw {message:'Cannot post_form_id in page'}
					i1			+=	14;
					i2          =   dataStr.indexOf('"',i1);
					
					params.post_form_id = dataStr.slice(i1,i2);
					
					
					i1          =   dataStr.indexOf('fb_dtsg:"',i1)
					if (i1 == -1) throw {message:'Cannot find fb_dtsg in page'}
					i1			+=	9;
					i2          = dataStr.indexOf('"',i1);
					params.fb_dtsg		= dataStr.slice(i1,i2);
					
					var i1 = dataStr.indexOf('app_2389801228.context');
					var i2 = dataStr.indexOf('\\"', i1);
					var i3 = dataStr.indexOf('\\"', i2+2);
					
					var fb_mock_hash = dataStr.slice(i2+2,i3);
					
					var i1 = dataStr.indexOf('app_2389801228.contextd', i1);
					var i2 = dataStr.indexOf('\\"', i1);
					var i3 = dataStr.indexOf('}\\"', i2+5);
					
					var fb_mock = dataStr.slice(i2+2,i3+1).replace(/\\/g, '').replace(/\\/g, '');
					
					
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
					
					FGS.pokerFreegifts.Click2(params);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('errorUpdatingNeighbours');
						}
						else
						{
							FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('errorUpdatingNeighbours');
					}
					else
					{
						FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	Click2: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;


		$.ajax({
			type: "POST",
			url: 'http://apps.facebook.com/fbml/fbjs_ajax_proxy.php?__a=1',
			dataType: 'text',
			data: params.postData,
			success: function(dataStr)
			{
				try
				{
					var str = dataStr.substring(9);
					var error = parseInt(JSON.parse(str).error);

					if(error > 0) throw {message: dataStr}
					
					var x = JSON.parse(str);
					
					var data = x.payload.data.fbml_form0;
					
					var strTemp = data;
					
					var arr = [];
					
					var dataHTML = FGS.HTMLParser(data);
					
					$('.unselected_list', dataHTML).children('label').each(function()
					{
						var itm = {}
						itm[$(this).children('input').val()] = {name: $(this).children('span').text()};
						arr.push(itm);
					});
					
					if(typeof(params.sendTo) == 'undefined')
					{
						//dump(FGS.getCurrentTime()+'[Z] Updating neighbours');
						FGS.sendView('updateNeighbours', params.gameID, arr);
						return;
					}
										
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
					
					
					//strTemp2 = $('form[content]:first', dataHTML).attr('content');

					i1           =  strTemp.indexOf('" content="');
					if (i1 == -1) throw {message:"Cannot find  content=\\ in page"};
					i1			+=  11;
					i2           =  strTemp.indexOf('"',i1)-1;
					strTemp2    =   eval('"'+strTemp.slice(i1,i2)+'"');
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
					
					myUrl2 = $('form[type]', dataHTML).attr('action');
					
					var param2 = $('form[type]', dataHTML).serialize();
					
					params.items = arr;
					
					//dump(FGS.getCurrentTime()+'[Z] Sending');
					
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
					params.myUrl = 'http://apps.facebook.com/texas_holdem/requests/chipgift/chipgift_post.php';
					params.param2 = param2;
					
					FGS.sendGift(params);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('errorUpdatingNeighbours');
						}
						else
						{
							FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('errorUpdatingNeighbours');
					}
					else
					{
						FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
};


FGS.pokerRequests = 
{	
	Click: function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				var redirectUrl = FGS.checkForLocationReload(dataStr);
				
				if(typeof(retry) == 'undefined')
				{
					retry = 0;
				}
				
				if(redirectUrl != false)
				{
					if(typeof(retry) == 'undefined' || retry < 4)
					{
						var redirectUrl = redirectUrl.replace(/%21/g, '!').replace(/%2A/g, '*');
						retryThis(currentType, id, redirectUrl, retry++);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
					return;
				}
				
				try
				{
					if(dataStr.indexOf('This gift is old and expired! Make sure to accept your gifts as soon as possible next time') != -1)
					{
						var error_text = 'This gift is old and expired! Make sure to accept your gifts as soon as possible next time.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;						
					}

					var el = $('.acceptedGift', dataHTML);
					
					
					if($(el).length > 0)
					{
						info.title = $('.acceptedGift', dataHTML).find('h1:first').children('span:first').text();
						info.image = $('.acceptGiftIcon', dataHTML).children('img').attr("src");
						info.text  = $('.acceptGiftFrom', dataHTML).find('img:first').attr('title');
						info.time = Math.round(new Date().getTime() / 1000);
					
						var sendInfo = '';
						
						if($('.acceptGiftFrom', dataHTML).find('img[uid]').length > 0)
						{
							sendInfo = {
								gift: 'chips',
								destInt: $('.acceptGiftFrom', dataHTML).find('img[uid]:first').attr('uid'),
								destName: $('.acceptGiftFrom', dataHTML).find('img[uid]:first').attr('title'),
								}
						}
						info.thanks = sendInfo;
						
						FGS.endWithSuccess(currentType, id, info);				
					}
					else
					{
						throw {message: dataStr}
					}
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	}
};