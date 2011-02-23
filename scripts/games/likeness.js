FGS.likeness.Bonuses = 
{	
	Click: function(currentType, id, currentURL)
	{
		FGS.zooworld.Bonuses.Click(currentType, id, currentURL);
	}
};

FGS.likeness.Requests = 
{	
	Click: function(currentType, id, currentURL)
	{
		FGS.zooworld.Requests.Click(currentType, id, currentURL);
	}
};

FGS.likeness.Freegifts = 
{
	Click: function(params, retry)
	{
		params.zooAppname = 'likeness';
		params.zooAppId	  = '25';
		params.checkID = '2405948328';
		params.gameName = 'likeness';
			
		FGS.zooworld.Freegifts.Click(params);
	}
};