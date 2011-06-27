FGS.sorority.Requests = 
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
					if($('#app8630423715_claimGift', dataHTML).length > 0)
					{
						var el = $('#app8630423715_claimGift', dataHTML);
					}
					else
					{
						var el = $('#app8630423715_acceptInvite', dataHTML);
					}

					var out = $(el).text();
					
					
					if(out.indexOf('been claimed. Go claim ') != -1 || out.indexOf('You can only claim gifts from your friends') != -1)
					{
						var error_text = 'This Gift has already been claimed.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}

					if($(el).find('img[uid]').length > 0)
					{
						info.image = '';
						info.title = '';
						info.text  = 'New neighbour';
						info.time = Math.round(new Date().getTime() / 1000);
					}
					else
					{
						info.image = $(el).find('.left:first').children('img').attr('longdesc');
						info.title = '';
						info.text  = $(el).find('.left:last').children('span').text();
						info.time = Math.round(new Date().getTime() / 1000);
					}
					
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