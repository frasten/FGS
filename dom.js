var portLogin = chrome.extension.connect({name: "FBloginPage"});

checkLogged();

function checkLogged()
{
	if($("#logout_form").length > 0)
	{
		portLogin.postMessage({loggedIn: true});
	}
	else if($("#login_form").length > 0)
	{
		portLogin.postMessage({loggedIn: false});
	}
}