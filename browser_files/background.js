FGS.HTMLParser = function (aHTMLString)
{
	if(aHTMLString.indexOf('<body') != -1)
	{
		var html = aHTMLString.slice(aHTMLString.indexOf('<body'),aHTMLString.lastIndexOf('</body')+7);
	}
	else
	{
		var html = '<div>'+aHTMLString+'</div>';
	}
	return html;
};

FGS.openURI = function (url, background)
{
	chrome.tabs.getAllInWindow(null, function tabSearch(tabs)
	{
		for(var i in tabs) 
		{
			var tab = tabs[i];
			if(tab.url == url)
			{
				return false;
			}		
		}
		chrome.tabs.create({url: url, selected: !background});
	});
};

FGS.commentBonus = function(bonusID, comment)
{
	FGS.database.db.transaction(function(tx)
	{
		tx.executeSql("SELECT * FROM bonuses where id = ?", [bonusID], function(tx2, res)
		{
			var v = res.rows.item(0);
			var postData = { 
				'charset_test': FGS.charset_test,
				'post_form_id': FGS.post_form_id,
				'fb_dtsg':	FGS.fb_dtsg,
				'xhp_ufi': 1,
				'comment': 'Add comment',
				'feedback_params': v.feedback,
				'add_comment_text': comment,
				'link_data': v.link_data,
				'nctr[_mod]': 'pagelet_home_stream',
				'lsd':	'',
				'post_form_id_source':'AsyncRequest'	
			};

			var postData = FGS.jQuery.param(postData).replace(/%5B/g,'[').replace(/%5D/g,']');
			
			FGS.jQuery.ajax({
				type: "POST",
				url: 'http://www.facebook.com/ajax/ufi/modify.php?__a=1',
				data: postData,
				dataType: 'text',
				success: function(data)
				{
					var str = data.substring(9);
					var error = parseInt(JSON.parse(str).error);
					
					if(error == 0)
					{
						FGS.database.commentBonus(bonusID);
					}

					FGS.sendView('updateComment', bonusID, error);
				}
			});
		});
	});
};

FGS.likeBonus = function (bonusID, autolike)
{
	FGS.database.db.transaction(function(tx)
	{
		tx.executeSql("SELECT * FROM bonuses where id = ?", [bonusID], function(tx2, res)
		{
			var v = res.rows.item(0);
			
			if(typeof(autolike) != 'undefined')
			{
				if(!FGS.options.games[v.gameID].likeBonus)
				{	
					return;
				}
			}
			
			var postData = {
				'charset_test': FGS.charset_test,
				'post_form_id': FGS.post_form_id,
				'fb_dtsg':	FGS.fb_dtsg,
				'xhp_ufi': 1,
				'like': '',
				'feedback_params': v.feedback,
				'add_comment_text': '',
				'link_data': v.link_data,
				'nctr[_mod]': 'pagelet_home_stream',
				'lsd':	'',
				'post_form_id_source':'AsyncRequest'	
			};
			
			var postData = FGS.jQuery.param(postData).replace(/%5B/g,'[').replace(/%5D/g,']');
			
			FGS.jQuery.ajax({
				type: "POST",
				url: 'http://www.facebook.com/ajax/ufi/modify.php?__a=1',
				data: postData,
				dataType: 'text',
				success: function(data)
				{
					var str = data.substring(9);
					var error = parseInt(JSON.parse(str).error);
					
					if(error == 0)
					{
						FGS.database.likeBonus(bonusID);
					}

					FGS.sendView('updateLike', bonusID, error);
				}
			});
		});
	});
};

FGS.sendbackGift = function (bonusID, sendbackData)
{
	FGS.database.db.transaction(function(tx)
	{
		tx.executeSql("SELECT * FROM requests where id = ?", [bonusID], function(tx2, res)
		{
			var v = res.rows.item(0);
			if(!FGS.options.games[v.gameID].sendbackGift)
			{	
				return;
			}
			var gameID = v.gameID;			
			
			FGS.sendView('changeSendbackState', bonusID);
			
			var tempData = sendbackData;
			
			var params = {
				gift: tempData.gift,
				gameID:	gameID,
				sendTo: [tempData.destInt],
				sendToName: tempData.destName,
				thankYou: true,
				bonusID: bonusID,	
				isRequest: true
			};
			
			var game = FGS.gamesData[gameID].systemName;
			
			eval('FGS.'+game+'Freegifts.Click(params)');			
		});
	});
};

FGS.sendView = function (msg, data, data2, data3)
{
	if(msg == 'requestError' || msg == 'requestSuccess' || msg == 'bonusError' || msg == 'bonusSuccess')
	{
		FGS.xhrWorking--;
		delete(FGS.xhrWorkingQueue[data]);
	}

	var viewTabUrl = chrome.extension.getURL('giftlist.html');
						
	var views = chrome.extension.getViews();
	
	for (var i = 0; i < views.length; i++)
	{
		var view = views[i];
		//If this view has the right URL and hasn't been used yet...
		if (view.location.href == viewTabUrl)
		{
			if(msg == 'close')
			{
				view.close();
			}
			// chat off/
			
			else if(msg == 'changeSendbackState')
			{
				view.changeSendbackState(data);
			}

			// bonusy //
			else if(msg == 'bonusError')
			{
				view.bonusError(data, data2);
			}
			else if(msg == 'bonusSuccess')
			{
				FGS.likeBonus(data, true);
				view.bonusSuccess(data, data2);
			}
			else if(msg == 'updateLike')
			{
				view.updateLike(data, data2);
			}
			else if(msg == 'updateComment')
			{
				view.updateComment(data, data2);
			}
			// bonusy off //
	
	
			// request //
			else if(msg == 'requestError')
			{
				view.requestError(data, data2);
			}
			else if(msg == 'requestSuccess')
			{
				if(typeof(data2.thanks) != 'undefined' && data2.thanks != '')
				{
					FGS.sendbackGift(data, data2.thanks);
				}
				view.requestSuccess(data, data2);
			}
			// request off //
			
			else if(msg == 'updateNeighbours')
			{
				view.ListNeighbours(data,data2);
			}
			else if(msg == 'errorWithSend')
			{
				if(data != '')
				{
					view.updateSendback(data, false);
				}
				view.freegiftError();
			}		
			else if(msg == 'freegiftSuccess')
			{
				if(data2 != '')
				{
					view.updateSendback(data2, true);
				}
				view.freegiftSuccess(data, data2);
			}	
			
			else if(msg == 'addNewBonus')
			{
				view.addNewBonus(data3);
			}
			else if(msg == 'addNewRequest')
			{
				view.addNewRequest(data3);
			}
			
			else if(msg == 'hiddenFeed')
			{
				view.hiddenFeed(data);
			}
			
			else if(msg == 'refresh')
			{
				view.location.reload();
			}
			break;
		}
	}
};

FGS.loadOptions = function (userID)
{
	var lastOptions = localStorage.getItem('options_'+userID);
	
	if(lastOptions == null || lastOptions == undefined)
	{
		FGS.options = FGS.jQuery.extend(true,{}, FGS.defaultOptions);
	}
	else
	{
		FGS.options = FGS.jQuery.extend(true,{}, FGS.defaultOptions, 	JSON.parse(lastOptions));
	}
	
	FGS.optionsLoaded = true;
};

FGS.saveOptions = function()
{
	if(FGS.userID != null)
	{
		FGS.options = FGS.jQuery.extend(true, {}, FGS.options);
		localStorage.removeItem('options_'+FGS.userID);
		localStorage.setItem('options_'+FGS.userID, JSON.stringify(FGS.options));
	}
};

FGS.updateIcon = function()
{
	var iconName = (FGS.FBloginError === true ? '48px-icon-bw.png' : '48px-icon.png');
	var fullPath = "gfx/" +iconName;

	try 
	{
		chrome.browserAction.setIcon({path:fullPath});
	} 
	catch(e) 
	{
		console.error("FGS: Could not set browser action icon '" + fullPath + "'.");
	}
	
	if(FGS.FBloginError === false)
	{
		var badge = FGS.newElements == 0 ? '' : FGS.newElements;
		
		chrome.browserAction.setTitle({title: "FGS: Click to open bonuses and gifts list"});
		chrome.browserAction.setBadgeText({text: badge.toString()});
	}
	else
	{
		chrome.browserAction.setTitle({title: "FGS: Click to login to Facebook"});
		chrome.browserAction.setBadgeText({text:"x"});
	}
};

FGS.openGiftList = function()
{
	var url = "giftlist.html";
	var url2 = "giftlist.html?";
	
	var fullUrl = chrome.extension.getURL(url);
	var fullUrl2 = chrome.extension.getURL(url2);
	chrome.tabs.getAllInWindow(null, function(tabs) {
		for (var i in tabs) { // check if Options page is open already
			var tab = tabs[i];
			if (tab.url == fullUrl || tab.url == fullUrl2)
			{
				chrome.tabs.update(tab.id, { selected: true });
				return;
			}
		}
		chrome.tabs.getSelected(null, function(tab) { // open a new tab next to currently selected tab
			chrome.tabs.create({
				url: url,
				index: tab.index + 1
			});
		});
	});
};

FGS.openFacebook = function()
{
	var FBUrl = "http://www.facebook.com/login.php";

	chrome.tabs.getAllInWindow(null, function tabSearch(tabs)
	{
		for(var i in tabs) 
		{
			var tab = tabs[i];
			if(tab.url == FBUrl)
			{
				chrome.tabs.update(tab.id, {selected:true});
				return;
			}		
		}
		chrome.tabs.create({url: FBUrl});
	});
};

FGS.checkVersion = function()
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', chrome.extension.getURL('manifest.json'), false);
	xhr.send(null);
	var manifest = JSON.parse(xhr.responseText);
	FGS.currentVersion = manifest.version;
};

FGS.preStartup = function() 
{
	FGS.loadLibraries();	
	
	FGS.jQuery.ajaxSetup({
		timeout: 120000,
	});
	
	FGS.checkVersion();
	FGS.initializeDefaults();

	chrome.browserAction.setBadgeText({text:"wait"});
	chrome.browserAction.setTitle({title: "FGS is not yet loaded... Please wait..."});
	FGS.startup();
};

FGS.loadLibraries = function(context)
{
	$.ajax({
		async: false,
		cache: false,
		url: chrome.extension.getURL("scripts/buttonsAndFilters.js"),
		type: "GET",
		success: function(){},
		dataType: 'script'
	});
	
	$.ajax({
		async: false,
		cache: false,
		url: chrome.extension.getURL("browser_files/database.js"),
		type: "GET",
		success: function(){},
		dataType: 'script'
	});
	
	$.ajax({
		async: false,
		cache: false,
		url: chrome.extension.getURL("scripts/gifts.js"),
		type: "GET",
		success: function(){},
		dataType: 'script'
	});
	
	
	var arr = [];
	for(var ids in FGS.gamesData)
	{		
		$.ajax({
			async: false,
			cache: false,
			url: chrome.extension.getURL("scripts/games/"+FGS.gamesData[ids].systemName+".js"),
			type: "GET",
			success: function(){},
			dataType: 'script'
		});

		if(typeof(FGS[FGS.gamesData[ids].systemName+'Bonuses']) != 'undefined')
		{
			arr.push(FGS.gamesData[ids].systemName+' bonus');
		}
		if(typeof(FGS[FGS.gamesData[ids].systemName+'Requests']) != 'undefined')
		{
			arr.push(FGS.gamesData[ids].systemName+' request');
		}
	}
	
	//dump(arr.sort());

	var jQuery = window.jQuery.noConflict(true);
	if( typeof(jQuery.fn._init) == 'undefined') { jQuery.fn._init = jQuery.fn.init; }
	FGS.jQuery = jQuery;
};

FGS.openRecovery = function()
{
	FGS.sendView('close');
	
	var url = "recovery.html";
	var url2 = "recovery.html?";
	
	var fullUrl = chrome.extension.getURL(url);
	var fullUrl2 = chrome.extension.getURL(url2);
	chrome.tabs.getAllInWindow(null, function(tabs) {
		for (var i in tabs) { // check if Options page is open already
			var tab = tabs[i];
			if (tab.url == fullUrl || tab.url == fullUrl2)
			{
				chrome.tabs.update(tab.id, { selected: true });
				//sendView('refresh');
				return;
			}
		}
		chrome.tabs.getSelected(null, function(tab) { // open a new tab next to currently selected tab
			chrome.tabs.create({
				url: url,
				index: tab.index + 1
			});
		});
	});
};