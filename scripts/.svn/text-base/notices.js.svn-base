function readNotices()
{
	$.ajax({
		type: "GET",
		url: 'http://rzadki.eu/projects/chat/notices.php',
		cache: false,
		dataType: 'json',
		success: function(data)
		{
			if(data == null || data == undefined)
			{
				setTimeout('readNotices()', 30000);
				return false;
			}
			options.developerNotices = data.data;
			options.developerNoticesLastUpdate = new Date().getTime();
			saveOptions();
			sendView('refreshNoticesData');
		},
		error: function()
		{
			setTimeout('readNotices()', 30000);
		}
	});
}

function checkNotices()
{
	if(new Date().getTime() - options.developerNoticesLastUpdate > 1800000)
	{
		readNotices();
	}
}