FGS.rewardville.Freegifts = 
{
	UpdateZyngaSession: function(params, callback)
	{
		var $ = FGS.jQuery;
		
		$.ajax({
			type: "GET",
			url: 'https://sslrewards.zynga.com/update_session.php?nextURL='+escape('http://rewards.zynga.com'),
			dataType: 'text',
			success: function(dataStr)
			{
				callback(params, 1);
			},
			error: function()
			{
				callback(params, 1);
			}
		});
	},
	
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		
		if(typeof(retry) == 'undefined')
			retry = 1;
		else
			retry++;		
		
		$.ajax({
			type: "GET",
			url: 'http://rewards.zynga.com',
			dataType: 'text',
			success: function(dataStr,a,b)
			{
				try
				{
					if(dataStr.indexOf('update_session.php?nextURL') != -1)
					{
						if(retry > 2) throw {}
						
						FGS.rewardville.Freegifts.UpdateZyngaSession(params, FGS.rewardville.Freegifts.Click);
						return;
					}
					
					if(dataStr.indexOf('Having trouble logging in') != -1)
					{
						if(retry > 2) throw {}
						
						var channel = 'http://rewards.zynga.com/channel.html';
						
						params.app_info = 'api_key=176611639027113&app_id=176611639027113&channel='+encodeURIComponent(channel)+'&channel_url='+encodeURIComponent(channel)+'&next='+encodeURIComponent(channel);
					
						FGS.getAppAuthInfo(params, FGS.rewardville.Freegifts.Login);
						return;
					}
					
					if(typeof(params.onlyLogin) != 'undefined')
					{
						return;
					}
					
					var pos0mb = dataStr.indexOf('mysterybox: {');
					if(pos0mb == -1) throw {}
					
					var pos0us = dataStr.indexOf('user: {');
					if(pos0us == -1) throw {}
					
					params.formData = {};

					var formAction = 'http://rewards.zynga.com?';
					var fbmlAction = 'http://rewards.zynga.com?';
					var tmpStr = {};
					var tmpStr2 = {};
					
					var pos1a 	= dataStr.indexOf("ts: '", pos0mb)+5;
					var pos1b 	= dataStr.indexOf("'", pos1a);
					tmpStr.ts 	= dataStr.slice(pos1a,pos1b);
					tmpStr2.ts 	= dataStr.slice(pos1a,pos1b);
					
					var pos1a = dataStr.indexOf("rewardId: '", pos0mb)+11;
					var pos1b = dataStr.indexOf("'", pos1a);
					tmpStr.rewardId = dataStr.slice(pos1a,pos1b);
					tmpStr2.rp = dataStr.slice(pos1a,pos1b);
					
					var pos1a = dataStr.indexOf("mbSendKey: '", pos0mb)+12;
					var pos1b = dataStr.indexOf("'", pos1a);
					tmpStr.sendkey = dataStr.slice(pos1a,pos1b);
					tmpStr2.sendkey = escape(dataStr.slice(pos1a,pos1b));
					
					var pos1a = dataStr.indexOf("mbKey: '", pos0mb)+8;
					var pos1b = dataStr.indexOf("'", pos1a);
					tmpStr.key = dataStr.slice(pos1a,pos1b);
					tmpStr2.key = dataStr.slice(pos1a,pos1b);
					
					var pos1a = dataStr.indexOf("fname: '", pos0us)+8;
					var pos1b = dataStr.indexOf("'", pos1a);
					var formUser = dataStr.slice(pos1a,pos1b);
					
					var pos1a = dataStr.indexOf("zid: '", pos0us)+6;
					var pos1b = dataStr.indexOf("'", pos1a);
					tmpStr2.r = dataStr.slice(pos1a,pos1b);
					
					tmpStr.mfs = true;
					
					formAction += $.param(tmpStr);
					fbmlAction += $.param(tmpStr2);
					
					params.formData.formAction = formAction;
					params.formData.fbmlAction = fbmlAction;
					params.formData.formUser   = formUser;
					
					params.cookieToGet = {url: 'http://zynga.com', name: 'zy_token'};
					
					FGS.GetCookieToken(params, FGS.rewardville.Freegifts.getSendInfo);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(retry < 3)
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
				if(retry < 3)
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
	
	getSendInfo: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		var zy_id = params.cookieValue.slice(0,8);
		
		$.ajax({
			type: "GET",
			// or rewardStore_onboardFriends/
			url: 'http://rewards.zynga.com/ajax/rewardStore_mysteryGift/'+zy_id,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var obj = JSON.parse(dataStr);
					var exclIds = obj.giftExcludeFriends;
					if(obj.sharedExcludeFriends.length > 0)
						exclIds += ',' + obj.sharedExcludeFriends;
					
					var fbml = '<style type="text/css">div.zy-mfs-bg { background: url(http://zgn.static.zynga.com/r28990-rewards-prod/images/rewards/mysterybox/starburst_bg_mfs.png) no-repeat; height: 100%; left: 0; position: absolute; top: -7px; width: 100%; z-index: 0; }form { background: url(http://zgn.static.zynga.com/r28990-rewards-prod/images/rewards/mysterybox/gift-mysteryGift.png) 15px 0 no-repeat; padding-left: 230px; }form .fb_protected_wrapper { position: relative; z-index: 10; }div.unselected_list, div.selected_list { background: #fff; }</style><fb:request-form method="post" action="'+params.formData.formAction+'" content="Hi! '+params.formData.formUser+' sent you a Mystery Gift that might contain up to 100 zCoins or other bonuses to help you get free in-game stuff in RewardVille. <fb:req-choice url=\''+params.formData.fbmlAction+'\' label=\'Go to RewardVille\' />" type="RewardVille Gift" invite="false" fb_protected="true" target="_self"><div class="zy-mfs-bg" /><div class="clear" style="margin: 0 0 5px;"><fb:multi-friend-selector max="50"condensed="true" exclude_ids="'+exclIds+'" /></div><fb:request-form-submit import_external_friends="false" /></fb:request-form>';
					
					var channel_url = 'http://rewards.zynga.com/channel.html';
					var app_key = '176611639027113';
					
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
			error: function(e)
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
	
	Login: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		$.ajax({
			type: "GET",
			url: 'https://sslrewards.zynga.com/regLoginFb.php',
			data: {"fbphp": true, "altLogin": true, "session": JSON.stringify(params.auth_info.session)},
			dataType: 'text',
			success: function(dataStr)
			{
				FGS.rewardville.Freegifts.Click(params, 1);
			},
			error: function(e)
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

FGS.rewardville.Requests = 
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
				try
				{
					if(dataStr.indexOf('update_session.php?nextURL') != -1)
						throw {}
					
					if(dataStr.indexOf('Having trouble logging in') != -1)
						throw {}
					
					var pos0mb = dataStr.indexOf('mysterybox: {');
					if(pos0mb == -1) throw {}
					
					var pos0us = dataStr.indexOf('user: {');
					if(pos0us == -1) throw {}
					
					if(dataStr.indexOf("mbShareResult: [],", pos0mb) != -1)
					{
						var error_text = 'No reward. Maybe daily limit.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}

					var pos1a 	= dataStr.indexOf("mbShareResult: {", pos0mb)+15;
					var pos1b 	= dataStr.indexOf("}", pos1a)+1;
					var data = JSON.parse(dataStr.slice(pos1a, pos1b));
					
					if(data.result < 1)
					{
						var error_text = 'No reward. Maybe daily limit.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var pos1a 	= dataStr.indexOf("canRegift: '", pos0mb)+12;
					var pos1b 	= dataStr.indexOf("'", pos1a);
					
					var sendInfo = '';		
					
					if(dataStr.slice(pos1a,pos1b) == '1')
					{
						var sendInfo = 
						{
								gift: '1',
								destInt: data.fbid ,
								destName: '',
						}
					}
					info.thanks = sendInfo;

					info.title = data.result + ' ' + data.type;
					info.image = 'gfx/90px-check.png';
					info.text = 'You have received: '+data.result + ' ' + data.type;
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