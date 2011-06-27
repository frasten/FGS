FGS.monopoly.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/monopolymillionaires/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					params.step2url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					params.step2params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					FGS.monopoly.Freegifts.Click2(params);
					
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('updateNeighbors', false, params.gameID);
						}
						else
						{
							FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
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
						FGS.sendView('updateNeighbors', false, params.gameID);
					}
					else
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	Click2: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "POST",
			url: params.step2url,
			data: params.step2params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					// trzeba wziac z typeahead ludzi z gry i usunac z request'a do restserver'a
					/*
pf_content_body	Here is a Prius mover for you in Monopoly Millionaires! Could you help me by sending a gift back?
pf_content_acceptButton	Accept
pf_excludeIds	37618876,504255948,550626590,559141324,562178086,633011371,635097081,661806729,662205391,667433598,685094506,689718040,694226043,703804417,711889566,715379538,725796599,738674258,777325633,1006226746,1035319257,1127983551,1157843512,1202041198,1253892812,1289602586,1326734180,1345606501,1348518822,1404700189,1424843835,1478929298,1495326015,1508105854,1546307781,1572609844,1582446030,1600451172,1636717001,1682012022,1699074906,1738562494,1799350472,100000051218318,100000110653029,100000117362845,100000121602904,100000137739513,100000171964153,100000187148484,100000240443003,100000245698352,100000285360649,100000288614543,100000297462940,100000362982257,100000373302575,100000490004962,100000526899060,100000576842553,100000597874257,100000650737096,100000665372828,100000735986526,100000786054167,100000833793151,100000844901538,100000974635782,100001002616784,100001051995595,100001062396244,100001205106521,100001227345069,100001262748303,100001270840881,100001272644450,100001282776926,100001336489019,100001344063553,100001364491493,100001456477810,100001479134407,100001486034235,100001539464897,100001696779257,100001701868548,100001713748069,100001750378832
pf_content_params	pf%5FgiftItemId=371&pf%5FsenderId=100001499713942
pf_cols	1
pf_requestName	Monopoly
pf_tabName	Monopoly Millionaires
pf_requestType	gift_request
pf_condensed	true
pf_giftItemId	371
pf_bgImage	
pf_selectedRows	1
pf_title	
pf_unselectedRows	15
pf_allTabNames	Suggested,All Friends,Monopoly Millionaires
					*/
					
					var tst = new RegExp(/FB[.]init\("(.*)","(.*)",/g).exec(dataStr);
					if(tst == null) throw {message: 'no fb.init'}
					
					var app_key = tst[1];
					var channel_url = tst[2];
					
					var tst = new RegExp(/(<fb:fbml[^>]*?[\s\S]*?<\/fb:fbml>)/m).exec(dataStr);
					if(tst == null) throw {message:'no fbml tag'}
					var fbml = tst[1];
					
					var paramsStr = 'app_key='+app_key+'&channel_url='+encodeURIComponent(channel_url)+'&fbml='+encodeURIComponent(fbml);
					
					params.nextParams = paramsStr;
					
					FGS.getFBML(params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('updateNeighbors', false, params.gameID);
						}
						else
						{
							FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
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
						FGS.sendView('updateNeighbors', false, params.gameID);
					}
					else
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
};

FGS.monopoly.Requests = 
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
					if(dataStr.indexOf('That item has already been claimed') != -1)
					{
						var error_text = 'That item has already been claimed.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}				
				
					if(dataStr.indexOf('You just accepted a neighbor request') != -1)
					{
						info.image = '';
						info.title = 'New neighbour';
						info.text  = '';
						info.time = Math.round(new Date().getTime() / 1000);
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					
					var el = $('#app157470434271574_landing_sender', dataHTML);
					if($(el).length > 0)
					{
						info.title = $.trim(el.text());
						info.image = $('#app157470434271574_landing_image', dataHTML).children('img').attr("longdesc");
						info.text  = $.trim(el.text());
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

FGS.monopoly.Bonuses = 
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
					if(dataStr.indexOf('That item has already been claimed') != -1)
					{
						var error_text = 'That item has already been claimed.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}				

					var el = $('#app157470434271574_landing_sender', dataHTML);
					if($(el).length > 0)
					{
						info.title = $.trim(el.text());
						info.image = $('#app157470434271574_landing_image', dataHTML).children('img').attr("longdesc");
						info.text  = $.trim(el.text());
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