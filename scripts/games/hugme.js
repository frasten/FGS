FGS.hugme.Bonuses = 
{	
	Click: function(currentType, id, currentURL)
	{
		FGS.zooworld.Bonuses.Click(currentType, id, currentURL);
	}
};

FGS.hugme.Requests = 
{	
	Click: function(currentType, id, currentURL)
	{
		FGS.zooworld.Requests.Click(currentType, id, currentURL);
	}
};

FGS.hugme.Freegifts = 
{
	Click: function(params, retry)
	{
		params.zooAppname = 'hugme';
		params.zooAppId	  = '9';
		params.checkID = '2345673396';
		params.gameName = 'doittome';
		
		FGS.zooworld.Freegifts.Click(params);
	}
};