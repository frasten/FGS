FGS.wildwesttown.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/wildwesttown/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params2 = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					var pos1 = dataStr.indexOf('new PlatformCanvasController("102518706469143", "');
					pos1+=49;
					var pos2 = dataStr.indexOf('"', pos1);
					
					params.session_key = dataStr.slice(pos1,pos2);
					
					if(!url) throw {message: 'fail'}
					
					params.step1url = url;
					params.step1params = params2;
					
					FGS.wildwesttown.Freegifts.ClickForm(params);
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
	
	ClickForm: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "POST",
			url: params.step1url+addAntiBot,
			data: params.step1params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var pos1 = dataStr.indexOf("params['signed_request'] = ");
					if(pos1 == -1) throw {}
					
					pos1+= 28;
					var pos2 = dataStr.indexOf('"', pos1);
					
					
					
					params.step2params = 
					{
						reqid: 3,
						signed_request: dataStr.slice(pos1,pos2),
					};
					
					
					FGS.wildwesttown.Freegifts.Click2(params);
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
			url: 'http://wildwest-234808553.us-east-1.elb.amazonaws.com/wildwest/pFacebook/index.php?c=CanvasCombinables&sc=ajax&mode=std&filter=rec&cr=&who=&ajax=1'+addAntiBot,
			data: params.step2params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var x = JSON.parse(dataStr);
					
					var dataStr = x.fbml_body;

					var app_key = '102518706469143';
					var channel_url = '';
					
					var tst = new RegExp(/<fb:serverfbml[^>]*?>[\s\S]*?<script[^>]*?>([\s\S]*?)<\/script>[\s\S]*?<\/fb:serverfbml>/mi).exec(dataStr);
					if(tst == null) throw {message:'no fbml tag'}
					var fbml = tst[1];
					
					fbml = fbml.replace(/&amp;/g, '&');
					
					var paramsStr = 'app_key='+app_key+'&channel_url='+encodeURIComponent(channel_url)+'&fbml='+encodeURIComponent(fbml)+'&session_key='+params.session_key;
					
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
	}
};

FGS.wildwesttown.Requests = 
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
					
					FGS.wildwesttown.Requests.Click2(currentType, id, url, params);
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
				var dataHTML = FGS.HTMLParser(dataStr);

				try
				{
					var pos1 = currentURL.indexOf('sc=acceptNeighbor');
					if(pos1 != -1)
					{
						info.image = '';
						info.title = '';
						info.text  = 'New neighbour';
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					
					if(dataStr.indexOf('something went wrong with this offer') != -1)
					{
						var error_text = 'Gift already accepted';
						FGS.endWithError('limit', currentType, id, error_text);					
						return;
					}
					
					if($(dataHTML).filter('#sendConf').length > 0)
					{
						var txt = $(dataHTML).filter('#sendConf').text();
						
						if(txt.indexOf('Cannot accept a position with this person') != -1)
						{
							var error_text = 'Cannot accept a position with this person, you already have a job with them.';
							FGS.endWithError('limit', currentType, id, error_text);					
							return;
						}
						
						if(txt.indexOf('Position not accepted') != -1)
						{
							var error_text = 'Position not accepted, this building is already fully staffed!';
							FGS.endWithError('limit', currentType, id, error_text);					
							return;
						}
						
						var pos1 = txt.indexOf('!');
						var txt = txt.slice(0, pos1+1);
						var txt = txt.replace(/\'s/i,"");
						
						var pos1 = txt.indexOf(' in ');
						pos1+= 4;
						var title = txt.slice(pos1);
						
						info.title = title;
						info.image = 'gfx/90px-check.png';
						info.text = text;
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
					}
					else if(dataStr.indexOf('Success!') != -1)
					{
						var found = $('img[title]', dataHTML);
						
						info.title = found.attr('title');
						info.image = found.attr('longdesc');
						info.text = $("div:contains('Success!'):last", dataHTML).text();
						info.time = Math.round(new Date().getTime() / 1000);

						FGS.endWithSuccess(currentType, id, info);
					}
					else
					{
						throw {message: 'unknown'}
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

FGS.wildwesttown.Bonuses = 
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
					
					FGS.wildwesttown.Bonuses.Click2(currentType, id, url, params);
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
					
					
					if(dataStr.indexOf('Cannot accept a position with this person') != -1)
					{
						var error_text = 'Cannot accept a position with this person, you already have a job with them.';
						FGS.endWithError('limit', currentType, id, error_text);					
						return;
					}
					
					
					if(dataStr.indexOf('Position not accepted, this building is already fully staffed') != -1)
					{
						var error_text = 'Position not accepted, this building is already fully staffed';
						FGS.endWithError('limit', currentType, id, error_text);					
						return;
					}
					
					
					if(dataStr.indexOf('You have already clicked on this link') != -1)
					{
						var error_text = 'You have already clicked on this link, or sent them this item in the last 24 hours';
						FGS.endWithError('limit', currentType, id, error_text);					
						return;
					}
					else
					{
						var found = false;
						
						$('img[title]', dataHTML).each(function()
						{
							if($(this).closest('div').text().indexOf('Bonus:') != -1)
							{
								found = $(this);
								return false;
							}
						});
						
						if(found !== false)
						{
							info.title = found.attr('title');
							info.image = found.attr('longdesc');
							info.text = $("td:contains('You also received'):last", dataHTML).text();
							info.time = Math.round(new Date().getTime() / 1000);

							FGS.endWithSuccess(currentType, id, info);
						}
						else if(dataStr.indexOf('You have accepted a position in ') != -1)
						{
							info.title = $.trim($("div:contains('You have accepted a position in'):last", dataHTML).text());
							info.text = $.trim($("td:contains('You received a'):last", dataHTML).text());
							info.image = 'gfx/90px-check.png';
							
							info.time = Math.round(new Date().getTime() / 1000);

							FGS.endWithSuccess(currentType, id, info);
						}
						else
						{
							throw {message: 'unknown'}
						}
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
	},
};