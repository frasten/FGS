FGS.horoscopes.Bonuses = 
{	
	Click: function(currentType, id, currentURL)
	{
		FGS.zooworld.Bonuses.Click(currentType, id, currentURL);
	}
};

FGS.horoscopes.Requests = 
{	
	Click: function(currentType, id, currentURL)
	{
		FGS.zooworld.Requests.Click(currentType, id, currentURL);
	}
};

FGS.horoscopes.Freegifts = 
{
	Click: function(params, retry)
	{
		params.zooAppname = 'horoscope';
		params.zooAppId	  = '2';
		params.checkID = '2339854854';
		params.gameName = 'horoscopes';
		
		FGS.zooworld.Freegifts.Click(params);
	}
};