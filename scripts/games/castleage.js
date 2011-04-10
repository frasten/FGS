FGS.castleage.Freegifts =
{
	Click: function(params, retry)
	{
		params.customUrl = 'http://apps.facebook.com/castle_age/gift.php?quick=true&app_friends=c&giftSelection='+params.gift;
		FGS.getFBML(params);
	},
};

FGS.castleage.Requests = 
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
					if(dataStr.indexOf('have already accepted this gift or it has expired') != -1)
					{
						var error_text = 'You have already accepted this gift or it has expired';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('You may have already accepted this gift') != -1)
					{
						var error_text = 'You may have already accepted this gift';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var el = $('#app46755028429_results_main_wrapper', dataHTML);
					
					var tmpTxt = $(el).text();
					var pos1 = tmpTxt.indexOf('You have accepted the gift:');
					if(pos1 == -1)
					{
						var pos1 = tmpTxt.indexOf('You have been awarded the gift:');
						var pos2 = tmpTxt.indexOf(' from ');
						var tit = tmpTxt.slice(pos1+31, pos2);
					}
					else
					{
						var pos2 = tmpTxt.indexOf('.', pos1);
						var tit = tmpTxt.slice(pos1+28, pos2);
					}

					info.title = '';
					info.text = tit;
					info.image = $(el).find('img:first').attr('src');				
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
	}
};