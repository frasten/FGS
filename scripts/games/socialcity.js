var socialcityRequests = 
{	
	Click: function(id, URI, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}
		
		$.ajax({
			type: "GET",
			url: URI,
			dataType: 'text',
			success: function(data)
			{
				var data = data.substr(data.indexOf('<body'),data.lastIndexOf('</body'));
				
				try {
					var src = $('#app_content_163965423072', data).find('iframe:first').attr('src');
					if (typeof(src) == 'undefined') throw {message:"Cannot find <iframe src= in page"}
					src = src.replace('http://city-fb-apache-active-vip.playdom.com/', 'http://city-fb-apache-active-vip.playdom.com/lib/playdom/facebook/facebook_iframe.php');
					
					
					socialcityRequests.Click2(id, src);
				} 
				catch(err)
				{
					console.log(err);
					if(typeof(retry) == 'undefined')
					{
						socialcityRequests.Click(id, URI+'&_fb_noscript=1', true);
					}
					else
					{
						info.error = 'receiving';
						info.time = Math.round(new Date().getTime() / 1000);
						database.updateErrorItem('requests', id, info);
						sendView('requestError', id, info);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					socialcityRequests.Click(id, URI+'&_fb_noscript=1', true);
				}
				else
				{
					info.error = 'connection';
					info.time = Math.round(new Date().getTime() / 1000);
					sendView('requestError', id, info);
				}
			}
		});
	},
	
	Click2:	function(id, url, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}	
		
		$.ajax({
			type: "GET",
			url: url,
			success: function(data)
			{
				var data = data.slice(data.indexOf('<body'),data.lastIndexOf('</body')+7);

				try
				{
					var src = url;
					
					
					var i1 = src.indexOf('?');
					src = src.slice(i1+1);
					
					var postParams = {}
					var extra = {}
					
					for(var idd in jQuery.unparam(src))
					{
						if(idd.indexOf('fb_') != -1)
						{
							postParams[idd] = jQuery.unparam(src)[idd];
						}
						else
						{
							extra[idd] = jQuery.unparam(src)[idd];
						}
					}

					var tmpdata = $('#pd_authToken', data).val()

					var i1 = tmpdata.indexOf('|');
					var auth_key = tmpdata.slice(0, i1);
					var auth_time = tmpdata.slice(i1+1);
					
					var landing = jQuery.unparam(src).landing;
					
					var i1 = landing.indexOf('_');
					var page = landing.slice(0, i1);
					var aaa =  landing.slice(i1+1);

					var newUrl = 'http://city-fb-apache-active-vip.playdom.com/lib/playdom/facebook/facebook_iframe.php?'+jQuery.param(postParams)+'&extra='+JSON.stringify(extra)+'&rtype=ajax&p='+page+'&a='+aaa+'&auth_key='+auth_key+'&auth_time='+auth_time+'&ts='+new Date().getTime();

					socialcityRequests.Click3(id, newUrl);
				}
				catch(err)
				{
					info.error = 'receiving';
					info.time = Math.round(new Date().getTime() / 1000);
					database.updateErrorItem('requests', id, info);
					sendView('requestError', id, info);
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					socialcityRequests.Click2(id, url, true);
				}
				else
				{
					info.error = 'connection';
					info.time = Math.round(new Date().getTime() / 1000);
					database.updateErrorItem('requests', id, info);
					sendView('requestError', id, info);
				}
			}
		});
	},
	
	Click3:	function(id, url, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}	
		
		$.ajax({
			type: "GET",
			url: url,
			success: function(data)
			{
				

				try
				{
					var data = eval('var dataHtml = '+data.slice(data.indexOf('{'),data.lastIndexOf('}')+1));
					data = dataHtml.html;
					
					
					//var sendInfo = '';
					//info.thanks = sendInfo;	
					
					if($('#neighbor_title', data).length > 0)
					{
						info.image = $('#neighbor_image', data).children('img').attr('src');
						
						var tmpTitle = $('#neighbor_title > h1', data).text();
						var i1 = tmpTitle.indexOf('with');
						info.title = 'New neighbour';
						info.text = tmpTitle.slice(i1+5);
					}
					else
					{

						info.image = $('#acceptInfo', data).children('img').attr('src');
						info.title = $("#infoText > .highlight",data).text();
						var txt =  $("#infoText", data).text();
						var i1 = txt.indexOf('from');
						
						info.text  = txt.slice(i1+5);
					}
					info.time = Math.round(new Date().getTime() / 1000);
					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);
				}
				catch(err)
				{
					info.error = 'receiving';
					info.time = Math.round(new Date().getTime() / 1000);
					database.updateErrorItem('requests', id, info);
					sendView('requestError', id, info);
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					socialcityRequests.Click3(id, url, true);
				}
				else
				{
					info.error = 'connection';
					info.time = Math.round(new Date().getTime() / 1000);
					database.updateErrorItem('requests', id, info);
					sendView('requestError', id, info);
				}
			}
		});
	},
};