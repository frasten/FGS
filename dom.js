var portLogin = chrome.extension.connect({name: "FBloginPage"});

checkLogged();

function checkLogged()
{
	if($("#logout_form").length > 0)
	{
		portLogin.postMessage({loggedIn: true, html: document.body.parentNode.innerHTML});
	}
	else if($("#login_form").length > 0)
	{
		portLogin.postMessage({loggedIn: false, html: undefined});
	}
}