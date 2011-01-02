function readNotices()
{
	jQuery.getJSON('http://rzadki.eu:81/projects/fgs/notices.php?callback=?', function(data)
	{
		$('#noticesContent').html('');		
		for(k in data.data)
		{
			var v = data.data[k];
			var date = new Date(v.time*1000);
			var s = (date.getSeconds().toString().length == 1 ? "0"+date.getSeconds() : date.getSeconds());
			var m = (date.getMinutes().toString().length == 1 ? "0"+date.getMinutes() : date.getMinutes());
			var h = (date.getHours().toString().length == 1 ? "0"+date.getHours() : date.getHours());
			
			var newRow = $('<div class="bg4" style="text-align:left"><span class="username" style="font-weight: bolder">'+v.title+'</span><br /><span style="font-size:0.9em">'+date.toLocaleDateString()+' @ '+date.toLocaleTimeString()+'</span><br /><br /><span class="message">'+v.message+'</span><br /><br /></div></div></div>');
			$('#noticesContent').prepend(newRow);
		};
	});
}