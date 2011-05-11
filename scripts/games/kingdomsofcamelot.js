FGS.kingdomsofcamelot.Requests = 
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
				var redirectUrl = FGS.checkForLocationReload(dataStr);
				
				if(redirectUrl != false)
				{
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, redirectUrl, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
					return;
				}
				
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_130402594779', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.kingdomsofcamelot.Requests.Click2(currentType, id, url, params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, true);
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
					retryThis(currentType, id, currentURL, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	Click2: function(currentType, id, currentURL, params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var info = {}
		
		$.ajax({
			type: "POST",
			url: currentURL,
			data: params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);
					
					var el = $(dataHTML);
					
					if(dataStr.indexOf('We were unable to find your gift') != -1)
					{
						var error_text = 'Sorry, you seem to have already accepted this request.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('AjaxCall.gPostRequest') != -1)
					{
						
						var domain = currentURL.slice(0, currentURL.lastIndexOf('/')+1);
						
						var pos0 = dataStr.indexOf('AjaxCall.gPostRequest');
						var pos0a = dataStr.indexOf("'", pos0);
						var pos0b = dataStr.indexOf("'", pos0a+1);
						
						domain += dataStr.slice(pos0a+1, pos0b);
						
						posG = dataStr.indexOf('giftinviteid', pos0b);
						
						var giftId = dataStr.slice(posG+13, dataStr.indexOf(',', posG));
						
						
						var pos1 = dataStr.indexOf('var tvuid');
						var pos1a = dataStr.indexOf("'", pos1);
						var pos1b = dataStr.indexOf("'", pos1a+1);
						
						var tvuid = dataStr.slice(pos1a+1, pos1b);
						
						var pos1 = dataStr.indexOf('var kabamuid');
						var pos1a = dataStr.indexOf("'", pos1);
						var pos1b = dataStr.indexOf("'", pos1a+1);
						
						var kabamuid = dataStr.slice(pos1a+1, pos1b);
						
						var pos1 = dataStr.indexOf('var tpuid');
						var pos1a = dataStr.indexOf("'", pos1);
						var pos1b = dataStr.indexOf("'", pos1a+1);
						
						var tpuid = dataStr.slice(pos1a+1, pos1b);
						
						el.find('#serverid').children('option:first').remove();
						var selServ = el.find('#serverid').children('option:first').val();
						
						params += '&standalone=0&lang=en&tpuid='+tpuid+'&kabamuid='+kabamuid+'&ver=2&tvuid='+tvuid+'&giftinviteid='+giftId+'&selectedS='+selServ;
						
						$.post(domain, params);
						
						info.title = el.find('.nm:first').text();
						info.image = el.find('.giftdesc > img:first').attr('src');
						info.text  = el.find('.giftmsg:first').text();
						info.time = Math.round(new Date().getTime() / 1000);
					
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					else if(el.find('.giftdesc').length > 0 && el.find('form').length > 0)
					{
						el.find('#serverid').children('option:first').remove();
						el.find('#serverid').children('option:first').attr('selected', 'selected');
						var par = el.find('form').serialize(); // params+'&'+
						
						if(typeof(retry) == 'undefined')
							retryThis(currentType, id, currentURL, par, true);
						else
							throw {message: 'error'}
						return;
					}
					else if(el.find('.giftdesc').length > 0 && el.find('form').length == 0)
					{
						info.title = el.find('.nm:first').text();
						info.image = el.find('.giftdesc > img:first').attr('src');
						info.text  = el.find('.giftmsg:first').text();
						info.time = Math.round(new Date().getTime() / 1000);
					
						FGS.endWithSuccess(currentType, id, info);
					}
					else
					{
						throw {message: dataStr}
					}
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, params, true);
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
					retryThis(currentType, id, currentURL, params, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	}
};