function readChat(start)
{
	clearTimeout(iChatTimeout);

	if(userID == null)
	{
		console.log(getCurrentTime()+'[Chat] No userID. Retrying in '+options.checkChatTimeout+' seconds');
		iChatTimeout = setTimeout('readChat()', options.checkChatTimeout*1000);
		return;
	}

	if(options.chatSessions == undefined)
	{
		var newUser = 
		{
			sessID: '',
			lastPrivateID: 0,
			lastPublicID: 0
		};
		options.chatSessions = newUser;
		console.log(getCurrentTime()+'[Chat] First connection to chat');
	}

	if(start == true)
	{
		options.chatSessions.lastPrivateID = options.chatSessions.lastPublicID = 0;
		console.log(getCurrentTime()+'[Chat] Resetting chat data');
	}

	sendView('chatIndicator', 'on');
	$.ajax({
		type: "GET",
		url: 'http://rzadki.eu/projects/chat/chat2.php',
		cache: false,
		data: {action: 'read',  userName: userName, userID: userID,
					lastPrivateID: options.chatSessions.lastPrivateID, lastPublicID: options.chatSessions.lastPublicID, sessionID: options.chatSessions.sessID},
		dataType: 'json',
		success: function(data)
		{
			if(data == null || data == undefined)
			{
				console.log(getCurrentTime()+'[Chat] Problem with server. Retrying in '+options.checkChatTimeout+' seconds');
				sendView('chatIndicator', 'off');
				iChatTimeout = setTimeout('readChat()', options.checkChatTimeout*1000);
				return false;
			}
			options.chatSessions.sessID = data.sessID;
			options.chatSessions.lastPrivateID = data.lastPrivateID;
			options.chatSessions.lastPublicID = data.lastPublicID;
			
			console.log(getCurrentTime()+'[Chat] Received new data. Populating chat.');
			
			sendView('sendChatData', data);
		},
		complete: function()
		{
			sendView('chatIndicator', 'off');
			iChatTimeout = setTimeout('readChat()', options.checkChatTimeout*1000);
		}
	});
}

function send(msg, isPrivate)
{
	if(msg == '')
		return;
	
	clearTimeout(iChatTimeout);
	
	sendView('chatIndicator', 'on');
	
	$.ajax({
		type: "POST",
		url: 'http://rzadki.eu/projects/chat/chat2.php',
		cache: false,
		data:  {action: 'send', text: msg, userName: userName, userID: userID, private: isPrivate,
					lastPrivateID: options.chatSessions.lastPrivateID, lastPublicID: options.chatSessions.lastPublicID, sessionID: options.chatSessions.sessID},
		dataType: 'json',
		success: function(data)
		{
			if(data == null || data == undefined)
			{
				console.log(getCurrentTime()+'[Chat] Problem with server. Retrying in '+options.checkChatTimeout+' seconds');
				sendView('chatIndicator', 'off');
				iChatTimeout = setTimeout('readChat()', options.checkChatTimeout*1000);
				return false;
			}
			
			options.chatSessions.sessID = data.sessID;
			options.chatSessions.lastPrivateID = data.lastPrivateID;
			options.chatSessions.lastPublicID = data.lastPublicID;
			
			console.log(getCurrentTime()+'[Chat] Received new data. Populating chat.');
			sendView('sendChatData', data);
			sendView('emptyMessageBox', isPrivate);
		},
		complete: function()
		{
			sendView('chatIndicator', 'off');
			iChatTimeout = setTimeout('readChat()', options.checkChatTimeout*1000);
		}
	});
}