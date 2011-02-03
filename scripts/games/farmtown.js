FGS.farmtownRequests = 
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
				
				if(redirectUrl != false)
				{
					if(FGS.checkForNotFound(redirectUrl) === true)
					{
						FGS.endWithError('not found', currentType, id);
					}
					else if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, redirectUrl, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
					return;
				}
				
				try
				{
				
					if($('#app56748925791_this_gift_confirmation', dataHTML).length > 0)
					{
						var tempText = $.trim($('#app56748925791_this_gift_confirmation', dataHTML).text());
						
						info.title = tempText.replace('You just accepted this','');
						info.text  = $.trim($('#app56748925791_this_gift_confirmation', dataHTML).text());	
						info.image = 'gfx/90px-check.png';
						info.time = Math.round(new Date().getTime() / 1000);						
					
						FGS.endWithSuccess(currentType, id, info);
						
						
						/*
						var pos1 = dataStr.indexOf('FBML.Contexts["')+15;
						var pos2 = dataStr.indexOf('"', pos1);
						var pos3 = dataStr.indexOf('"', pos2+1)+1;
						var pos4 = dataStr.indexOf('}}";', pos3)+2;
						var hash = dataStr.slice(pos1, pos2);
						var context = dataStr.slice(pos3, pos4).replace(/\\/g,'');

						var pos5 = dataStr.indexOf('ajax.php?uid=');
						var pos6 = dataStr.indexOf("'", pos5);
						
						var ajaxData = dataStr.slice(pos5+9, pos6);
						
						var tmpStr = unescape(currentURL);
						var pos7 = tmpStr.indexOf('type=')+5;
						var pos8 = tmpStr.indexOf('&', pos7);
						
						var gift = tmpStr.slice(pos7,pos8);
						
						var postData =
						{
							url: 'http://l1.slashkey.com/facebook/farm/ajax.php',
							query: 'do=render_gift&gift_type='+gift+'&ajax_mode=fbml&'+ajaxData+'&ajax_type=fbml',
							type: 2,
							require_login: false,
							fb_mockajax_context: context,
							fb_mockajax_context_hash: hash,
							appid: 56748925791,
							post_form_id: FGS.post_form_id,
							fb_dtsg: FGS.fb_dtsg,
							lsd	: ''
						};
						
						
						$.ajax({
							type: "POST",
							url:'http://apps.facebook.com/fbml/fbjs_ajax_proxy.php?__a=1', 
							data: postData,
							dataType: 'text',
							success: function(dataStr2)
							{
								var str = dataStr2.substring(9);
								var data = JSON.parse(str).payload.data;
								
								console.log(data);
							
								FGS.endWithSuccess(currentType, id, info);
							},
							error: function()
							{
								FGS.endWithSuccess(currentType, id, info);
							}
						});
						
						*/
					}
					else
					{
						throw {message:'unknown'}
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