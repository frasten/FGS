FGS.birthdaycards.Bonuses = 
{	
	Click: function(currentType, id, currentURL)
	{
		FGS.zooworld.Bonuses.Click(currentType, id, currentURL);
	}
};

FGS.birthdaycards.Requests = 
{	
	Click: function(currentType, id, currentURL)
	{
		FGS.zooworld.Requests.Click(currentType, id, currentURL);
	}
};

FGS.birthdaycards.Freegifts = 
{
	Click: function(params, retry)
	{
		params.zooAppname = 'birthdays';
		params.zooAppId	  = '46';
		params.checkID = '14852940614';
		params.gameName = 'rybirthday';
		
		FGS.zooworld.Freegifts.Click(params);
	}
};