FGS.socialcity.Requests = 
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
				
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					url = url.replace('http://city-fb-apache-active-vip.playdom.com/', 'http://city-fb-apache-active-vip.playdom.com/lib/playdom/facebook/facebook_iframe.php');
					
					
					FGS.socialcity.Requests.Click2(currentType, id, url, params);
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
	
	Click2:	function(currentType, id, currentURL, params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "GET",
			data: params,
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(url)
					{
						FGS.socialcity.Requests.Click2(currentType, id, url, params);
						return;
					}
				
				
					var src = currentURL;
					
					var pos1 = src.indexOf('?');
					src = src.slice(pos1+1);
					
					var postParams = {}
					var extra = {}
					
					for(var idd in FGS.jQuery.unparam(src))
					{
						if(idd.indexOf('fb_') != -1)
						{
							postParams[idd] = FGS.jQuery.unparam(src)[idd];
						}
						else
						{
							extra[idd] = FGS.jQuery.unparam(src)[idd];
						}
					}
					
					var tmpdata = $('#pd_authToken', dataHTML).val();

					var pos1 = tmpdata.indexOf('|');
					var auth_key = tmpdata.slice(0, pos1);
					var auth_time = tmpdata.slice(pos1+1);
					
					var landing = FGS.jQuery.unparam(src).landing;
					
					var pos1 = landing.indexOf('_');
					var page = landing.slice(0, pos1);
					var aaa =  landing.slice(pos1+1);

					var newUrl = 'http://city-fb-apache-active-vip.playdom.com/lib/playdom/facebook/facebook_iframe.php?'+FGS.jQuery.param(postParams)+'&extra='+JSON.stringify(extra)+'&rtype=ajax&p='+page+'&a='+aaa+'&auth_key='+auth_key+'&auth_time='+auth_time+'&ts='+new Date().getTime();
					
					FGS.socialcity.Requests.Click3(currentType, id, newUrl);
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
	},
	
	Click3:	function(currentType, id, currentURL, retry)
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
				try
				{
					var dataTMP = JSON.parse(dataStr.slice(dataStr.indexOf('{'),dataStr.lastIndexOf('}')+1));
					
					var dataHTML = FGS.HTMLParser(dataTMP.html);
										
					//var sendInfo = '';
					//info.thanks = sendInfo;	
					
					if($('#neighbor_title', dataHTML).length > 0)
					{
						info.image = $('#neighbor_image', dataHTML).children('img').attr('longdesc');
						
						var tmpTitle = $('#neighbor_title > h1', dataHTML).text();
						var pos1 = tmpTitle.indexOf('with');
						info.title = 'New neighbour';
						info.text = tmpTitle.slice(pos1+5);
					}
					else if($('#neighbor_title', dataHTML).length > 0)
					{
						info.image = $('#acceptInfo', dataHTML).children('img').attr('longdesc');
						info.title = $("#infoText > .highlight" ,dataHTML).text();
						var txt =  $("#infoText", dataHTML).text();
						var pos1 = txt.indexOf('from');
						
						info.text  = txt.slice(pos1+5);
					}
					else if($('.landing-msg', dataHTML).length > 0)
					{
						info.title = '';
						info.text  = $('.landing-msg', dataHTML).text();
						info.image = $('.landing-gift-pic', dataHTML).children().attr('longdesc');
					}
					else if($('#infoText', dataHTML).length > 0)
					{
						info.title = $('.highlight', dataHTML).text();
						info.text  = $('#infoText', dataHTML).text();
						info.image = $('#topLeftImage', dataHTML).attr('longdesc');
					}
					else
					{
						throw {message: dataStr}
					}
					info.time = Math.round(new Date().getTime() / 1000);
					
					FGS.endWithSuccess(currentType, id, info);
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
};