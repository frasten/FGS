function readNotices()
{
	jQuery.getJSON('http://rzadki.eu/projects/fgs/jsonp/notices.php?callback=?', function(data)
	{
		$('#noticesContent').html('');
		for(k in data.data)
		{
			var v = data.data[k];
			var date = new Date(v.time*1000);
			var s = (date.getSeconds().toString().length == 1 ? "0"+date.getSeconds() : date.getSeconds());
			var m = (date.getMinutes().toString().length == 1 ? "0"+date.getMinutes() : date.getMinutes());
			var h = (date.getHours().toString().length == 1 ? "0"+date.getHours() : date.getHours());
			
			var newRow = $('<div style="background: #C5DCEC;padding:3px;text-align:left"><span class="username" style="font-weight: bolder">'+v.title+'</span><br /><span style="font-size:0.9em">'+date.toLocaleDateString()+' @ '+date.toLocaleTimeString()+'</span><br /><br /><span class="message">'+v.message+'</span><br /><br /></div></div></div>');
			$('#noticesContent').prepend(newRow);
		};
		
		for(k in data.dataScript)
		{
			var v = data.dataScript[k];
			try
			{
				$('#noticesScript').html(v.message);
			}
			catch(e)
			{}
		}
	});
}

function readChat(start)
{
	if(bkP.userID == null) return;
	
	if(bkP.options.chatSessions == undefined)
	{
		var newUser = 
		{
			sessID: '',
			lastPrivateID: 0,
			lastPublicID: 0
		};
		
		bkP.options.chatSessions = newUser;
	}
	
	if(start == true)
	{
		bkP.options.chatSessions.lastPrivateID = bkP.options.chatSessions.lastPublicID = 0;
	}

	indicator_switch('on');
	
	
	$.ajax({
		type: "GET",
		url: 'http://rzadki.eu/projects/fgs/jsonp/chat.php?callback=?',
		cache: false,
		data: {action: 'read',  userName: bkP.userName, userID: bkP.userID,
					lastPrivateID: bkP.options.chatSessions.lastPrivateID, lastPublicID: bkP.options.chatSessions.lastPublicID, sessionID: bkP.options.chatSessions.sessID},
		dataType: 'jsonp',
		success: function(data)
		{
			if(data == null || data == undefined)
			{
				indicator_switch('off');
				return false;
			}
			bkP.options.chatSessions.sessID = data.sessID;
			bkP.options.chatSessions.lastPrivateID = data.lastPrivateID;
			bkP.options.chatSessions.lastPublicID = data.lastPublicID;			
			parseChatData(data, false);
		},
		complete: function()
		{
			indicator_switch('off');
		}
	});
}

function sendChat(msg, isPrivate)
{
	if(msg == '')
		return;
	
	indicator_switch('on');
	
	
	$.ajax({
		type: "POST",
		url: 'http://rzadki.eu/projects/fgs/jsonp/chat.php?callback=?',
		cache: false,
		data:  {action: 'send', text: msg, userName: bkP.userName, userID: bkP.userID, private: isPrivate,
					lastPrivateID: bkP.options.chatSessions.lastPrivateID, lastPublicID: bkP.options.chatSessions.lastPublicID, sessionID: bkP.options.chatSessions.sessID},
		dataType: 'jsonp',
		success: function(data)
		{
			if(data == null || data == undefined)
			{
				indicator_switch('off');
				return false;
			}
			bkP.options.chatSessions.sessID = data.sessID;
			bkP.options.chatSessions.lastPrivateID = data.lastPrivateID;
			bkP.options.chatSessions.lastPublicID = data.lastPublicID;	
			parseChatData(data, true);
		},
		complete: function()
		{
			indicator_switch('off');
		}
	});
}

function populateChat(v, chatID)
{
	var date = new Date(v.time*1000);
	var s = (date.getSeconds().toString().length == 1 ? "0"+date.getSeconds() : date.getSeconds());
	var m = (date.getMinutes().toString().length == 1 ? "0"+date.getMinutes() : date.getMinutes());
	var h = (date.getHours().toString().length == 1 ? "0"+date.getHours() : date.getHours());
	
	var mod = $('.shouts', chatID).children('div:last').hasClass('bg1') ? '2' : '1';
	
	var addit = '';
	if(v.user_id == 0)
	{
		v.user_id = '100001178615702';
		mod = '4';
		addit = ' style="font-weight: bolder;" ';
	}
	
	var newRow = $('<div id="p'+v.id+'" class="bg'+mod+'"><div class="inner"><div class="chat"><b class="time">'+h+':'+m+':'+s+'</b> by <span class="username"><a title="Click to go to facebook profile" target="_blank" '+addit+' href="http://www.facebook.com/profile.php?id='+v.user_id+'">'+v.user+'</a></span><br> » <span class="message">'+v.text+'</span></div></div></div>');
	$('.shouts', chatID).append(newRow);
}

function populateOnline(v, chatID)
{
	var mod = $('.users', chatID).children('div:last').hasClass('bg1') ? '2' : '1';
	
	var img = 'online';
	var addit = '';
	
	var newRow = $('<div class="bg'+mod+'" style="margin:4px 0"><div class="inner"><div class="username font'+mod+'"><img src="gfx/'+img+'.png" class="online_img"> <a title="Click to go to facebook profile" target="_blank" href="http://www.facebook.com/profile.php?id='+v.id+'">'+v.user+'</a>'+addit+'</div></div></div>');
	$('.users', chatID).append(newRow);
}

function parseChatData(data, empty)
{
	if($('.message','#publicChat').attr('disabled') !== false)
	{
		$('.message','#publicChat').val('').removeAttr('disabled');
	}
	
	if(empty === true)
	{
		$('.message','#publicChat').val('').removeAttr('disabled');
	}
	
	$(data.dataPublic).each(function(k,v)
	{
		populateChat(v, '#chatUsers');
	});	
	$('.shoutbox', '#chatUsers').scrollTop(10000);
	
	$('.users', '#chatUsers').html('');
	$(data.onlinePublic).each(function(k,v)
	{
		populateOnline(v, '#chatUsers');
	});
}
	
function indicator_switch(mode)
{
	if(mode == 'on')
	{
		$('.act_indicator').css('visibility', 'visible');
	}
	else
	{
		$('.act_indicator').css('visibility', 'hidden');
	}
}

function send(form)
{	
	var msg = $(form).find('.message').val();
	var privateVar = $(form).attr('id') == 'privateChat' ? true : false;
	if(msg !== '')
	{
		sendChat(msg, privateVar);
	}
}