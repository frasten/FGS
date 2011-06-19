FGS.nl2br = function(s)
{
	return s.replace( /\n/g, '<br />\n' );
}

FGS.getMsg = function(m, params)
{
	try
	{
		var lang;
		
		if(typeof FGS.options.language == 'undefined' || FGS.options.language == 0)
		{
			if(FGS.userLoc != null)
				lang = FGS.userLoc;
			else
				lang = 'en_US';
		}
		else
		{
			lang = FGS.options.language;
		}
		
		if(typeof FGS.translations[lang] =='undefined')
			lang = 'en_US';

		if(typeof FGS.translations[lang][m] == 'undefined')
			var str = FGS.translations['en_US'][m];
		else
			var str = FGS.translations[lang][m];
		
		if(typeof params != 'undefined')
		{
			for(var i=0; i < params.length; i++)
			{
				str = str.replace('__VARIABLE__', params[i]);
			}
		}
		
		return FGS.nl2br(str);
	}
	catch(e)
	{
		//console.log(e, m);
		return'Missing translation - inform developer';
	}
};