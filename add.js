function gup( name )
{
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results == null )
		return "";
	else
		return unescape(results[1]);
}

var el = document.getElementById('message');
el.value = 'I found you by FGS ( http://fgs.rzadki.eu ). You stated that you are looking for neighbors in: '+gup('fromFGS');