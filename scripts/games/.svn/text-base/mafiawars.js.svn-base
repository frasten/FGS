var mafiawarsRequests = 
{
	Click:	function(id, URI, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}
		
		$.ajax({
			type: "GET",
			url: URI,
			success: function(data)
			{
				var data = data.substr(data.indexOf('<body'),data.lastIndexOf('</body'));
				
				try {
					var i1,i2, myUrl;
					var strTemp;
			
			
					var src = $('iframe[name="mafiawars"]', data).attr('src');
					if (typeof(src) == 'undefined') throw {message:"Cannot find <iframe src= in page"}

					mafiawarsRequests.Click3(id, src);
				} 
				catch(err)
				{
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving request, Retrying request with ID: '+id);
						mafiawarsRequests.Click(id, URI+'&_fb_noscript=1', true);
					}
					else
					{
						console.log(err);
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
					console.log(getCurrentTime()+'[B] Connection error while receiving request, Retrying request with ID: '+id);
					mafiawarsRequests.Click(id, URI+'&_fb_noscript=1', true);
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
		
		console.log(getCurrentTime()+'[B] Part three MW: '+id);		
		
		$.ajax({
			type: "GET",
			url: url,
			success: function(data)
			{
				var data = data.substr(data.indexOf('<body'),data.lastIndexOf('</body'));

				try {
					var i1, i2, strTemp, myUrl, myParms;

					strTemp = data;

					i1 = strTemp.indexOf('action="');
					if (i1 == -1) throw {message:"Cannot find action= in page"}
					
					i1 += 8;
					i2 = strTemp.indexOf('"',i1);
					myUrl = strTemp.slice(i1,i2);

					myParms = '';
					i1 = strTemp.indexOf('<input',i1);
					while (i1!=-1)
					{
						i1 = strTemp.indexOf('name="',i1)+6;
						i2 = strTemp.indexOf('"',i1);
						if (myParms=='')
							myParms = strTemp.slice(i1,i2)+'='
						else
							myParms += '&'+strTemp.slice(i1,i2)+'=';
						i1 = strTemp.indexOf('value="',i1)+7;
						i2 = strTemp.indexOf('"',i1);
						myParms += escape(strTemp.slice(i1,i2));

						i1 = strTemp.indexOf('<input',i1);
					}
					
					var isBoost = false;
					
					if(myUrl.indexOf('mastery_boost') != -1)
					{
						isBoost = true;
					}
					
					mafiawarsRequests.Click4(id, myUrl, myParms, isBoost);
				} 
				catch(err)
				{
					console.log(err);
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
					console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
					mafiawarsRequests.Click3(id, url, true);
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
	
	Click4:	function(id, url, params, isBoost, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}
		
		console.log(getCurrentTime()+'[B] Part four MW: '+id);	
		
		$.ajax({
			type: "POST",
			url: url,
			data: params,
			dataType: 'text',
			success: function(data)
			{
				var data = data.substr(data.indexOf('<body'),data.lastIndexOf('</body'));
				
				try
				{
					if(data.indexOf('Something has gone wrong') != -1)  throw {message:"Something is wrong"}
					if(data.indexOf('This gift is expired') != -1)		throw {message:"Gift expired"}
					
					info.text = '';
					
					console.log('start MW gift');
					
					if(isBoost)
					{
						info.image = 'icons/reqs/noimage.png';
						info.title = 'Mastery Boost';
					}
					else
					{
						if(data.indexOf('Mystery Bag contained') != -1 || data.indexOf('Secret Drop contained') != -1 || data.indexOf('Your Mystery Animal is') != -1 || data.indexOf('You just accepted') != -1)
						{

							var testStr = $('img:first', data).attr('src');
							
							console.log('Mystery bag, secret drop or animal');
							console.log(testStr);
							
							if(testStr.indexOf('CRM_LP-icon-bonus.png') != -1)
							{
								info.text = $('img:first', data).parent().text();
							}
							
							
							$('img', data).each(function()
							{
								if($(this).css('height') == '75px')
								{
									info.image = $(this).attr('src');
									info.title = '';
									
									$(this).parent().children('div').each(function()
									{
										if($.trim($(this).text()) != '')
										{
											info.title = $(this).text();
											return false;
										}
									});
								}							
							});
						}
						else if(data.indexOf('a Mystery Bag item instead') != -1)
						{
						
							console.log('mystery bag instead');
							info.image = $('img:first', data).attr('src');
							var tmpText = $('.good:first', data).text();
							
							var i1 = tmpText.indexOf(':');
							if(i1 != -1)
							{
								tmpText = tmpText.slice(i1+1);
							}
							
							var i2 = tmpText.indexOf('+');							
							if(i2 != -1)
							{
								info.text = tmpText.slice(i2);
								tmpText = tmpText.replace(info.text, '');
							}					
							
							info.title = tmpText;
						}
						else if(data.indexOf('You got an Energy Pack.') != -1)
						{
							console.log('energy pack');
							var i1 = data.indexOf('You got an Energy Pack.');
							var i2 = data.indexOf('.', i1+23);
							
							console.log(i1);
							console.log(i2);
							
							info.image = $('img:first', data).attr('src');
							info.title = $('img:first', data).parent().text();
							info.text = data.slice(i1,i2);
						}
						else if(data.indexOf('Your Super Pignata contained') != -1)
						{
							info.image = $('img:first', data).attr('src');
							info.title = $('img:first', data).attr('title');
						}
						else if(data.indexOf('Requests from other Mafias') != -1)
						{
							var i1 = data.indexOf('http://facebook.mafiawars.com/mwfb/remote/html_server.php?xw_controller=recruit&xw_action=accept');
							var i2 = data.indexOf('"', i1);
							
							var newURL = data.slice(i1,i2);
							
							$.ajax({
								type: "POST",
								url: newURL,
								data: params,
								dataType: 'text',
								success: function(data) {}
							});
							
							//$.post(newURL, {sf_xw_user_id: '', sf_xw_sig: ''}, function(d){});
							info.image = 'icons/reqs/noimage.png';
							info.title = 'New recruits';
						}
						else
						{
							info.image = $('img:first', data).attr('src');
							info.title = $('img:first', data).parent().text();
						}
					}
					
					if(info.title.indexOf('Try Refreshing') != -1)
					{
						info.image = 'gfx/90px-cancel.png';
						//info.text = 'Error';
						throw {message:"Unknown page"}
					}
					
					info.time = Math.round(new Date().getTime() / 1000);
					
					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);
					
					console.log(getCurrentTime()+'[B] Bonus collected SUCCESSFULLY - ID: '+id);	
				}
				catch(err)
				{
					console.log(err);
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
					console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
					mafiawarsRequests.Click4(id, url, params, isBoost, true);
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
};


var mafiawarsBonuses = 
{
	Click:	function(id, url, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}
		
		console.log(getCurrentTime()+'[B] Receiving bonus with ID: '+id);
		
		
	
		$.ajax({
			type: "GET",
			url: url,
			success: function(data)
			{
				var data = data.substr(data.indexOf('<body'),data.lastIndexOf('</body'));
				
				try {
					var i1,i2, myUrl;
					var strTemp;
			
					var src = $('iframe[name="mafiawars"]', data).attr('src');
					if (typeof(src) == 'undefined') throw {message:"Cannot find <iframe src= in page"}

					mafiawarsBonuses.Click2(id, src);
				} 
				catch(err)
				{
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
						mafiawarsBonuses.Click(id, url+'&_fb_noscript=1', true);
					}
					else
					{
						info.error = 'receiving';
						info.time = Math.round(new Date().getTime() / 1000);
						database.updateErrorItem('bonuses', id, info);
						sendView('bonusError', id, info);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
					mafiawarsBonuses.Click(id, url, true);
				}
				else
				{
					info.error = 'connection';
					info.time = Math.round(new Date().getTime() / 1000);
					sendView('bonusError', id, info);
				}
			}
		});
	},
	
	Click2:	function(id, url, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}
		
		console.log(getCurrentTime()+'[B] Part second MW: '+id);		
		
		$.ajax({
			type: "GET",
			url: url,
			success: function(data)
			{
				var data = data.substr(data.indexOf('<body'),data.lastIndexOf('</body'));

				try {
					var i1, i2, strTemp, myUrl, myParms;

					strTemp = data;

					i1 = strTemp.indexOf('action="');
					if (i1 == -1) throw {message:"Cannot find action= in page"}
					
					i1 += 8;
					i2 = strTemp.indexOf('"',i1);
					myUrl = strTemp.slice(i1,i2);

					myParms = '';
					i1 = strTemp.indexOf('<input',i1);
					while (i1!=-1)
					{
						i1 = strTemp.indexOf('name="',i1)+6;
						i2 = strTemp.indexOf('"',i1);
						if (myParms=='')
							myParms = strTemp.slice(i1,i2)+'='
						else
							myParms += '&'+strTemp.slice(i1,i2)+'=';
						i1 = strTemp.indexOf('value="',i1)+7;
						i2 = strTemp.indexOf('"',i1);
						myParms += escape(strTemp.slice(i1,i2));

						i1 = strTemp.indexOf('<input',i1);
					}

					 mafiawarsBonuses.Click3(id, myUrl, myParms);
				} 
				catch(err)
				{
					console.log(err);
					info.error = 'receiving';
					info.time = Math.round(new Date().getTime() / 1000);
					database.updateErrorItem('bonuses', id, info);
					sendView('bonusError', id, info);
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
					mafiawarsBonuses.Click2(id, url, true);
				}
				else
				{
					info.error = 'connection';
					info.time = Math.round(new Date().getTime() / 1000);
					database.updateErrorItem('bonuses', id, info);
					sendView('bonusError', id, info);
				}
			}
		});
	},
	
	Click3:	function(id, url, params, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}
		
		console.log(getCurrentTime()+'[B] Part three MW: '+id);		
		
		$.ajax({
			type: "POST",
			url: url,
			data: params,
			success: function(data)
			{
				var data = data.substr(data.indexOf('<body'),data.lastIndexOf('</body'));

				try {
					var strTemp = data;					
					if(strTemp.indexOf('Sorry, you already collected on this stash!') != -1 || strTemp.indexOf('secret stashes today, and have to wait') != -1 || strTemp.indexOf('You cannot claim this reward') != -1 || strTemp.indexOf('You have already received your free boost') != -1 || strTemp.indexOf('You have already helped') != -1 || strTemp.indexOf('has already paid out the bounty on this target') != -1 || strTemp.indexOf('This user has already received the maximum amount of help') != -1 || strTemp.indexOf('has already got their Energy Pack for today') != -1 || strTemp.indexOf('You cannot gift this item to people not in your mafia') != -1 || strTemp.indexOf('has received all the help allowed for today') != -1 || strTemp.indexOf('All of the available boosts have already been claimed') != -1 || strTemp.indexOf('This stash has already been found') != -1 || strTemp.indexOf('has passed out all available') != -1 || strTemp.indexOf('You already helped this user') != -1 || strTemp.indexOf('You can only receive') != -1 || strTemp.indexOf('cannot receive any more parts') != -1 || strTemp.indexOf('has no more free boosts to hand out') != -1 || strTemp.indexOf(', come back tomorrow to help out more') != -1)
					{
					
						// has passed out all available
						//
						info.error = 'limit';
						info.time = Math.round(new Date().getTime() / 1000);
						database.updateErrorItem('bonuses', id, info);
						sendView('bonusError', id, info);
						return;
					}
					
					if(strTemp.indexOf('>Congratulations</div>') != -1) // Get Reward
					{
						var i1 = strTemp.indexOf('>Congratulations</div>');
						var i2 = strTemp.indexOf('You Have Received', i1);
						if(i2 == -1)
						{
							var i2 = strTemp.indexOf('You have received', i1);
						}
						var i3 = strTemp.indexOf('</div>', i2);
											
						info.image = 'gfx/90px-check.png';
						info.text  = strTemp.slice(i2,i3);
						info.title = strTemp.slice(i2+17,i3);					
					}
					else if(strTemp.indexOf('Congrats! You received a') != -1) // Grab your share
					{
						var i1 = strTemp.indexOf('Congrats! You received a');
						var i2 = strTemp.indexOf('from', i1);
						var i3 = strTemp.indexOf('</div>', i1);

						info.text  = strTemp.slice(i1,i3);
						info.image = $('td.message_body > div:nth-child(1)', data).find('img:first').attr('src');
						info.title = strTemp.slice(i1+25,i2);
					}
					else if(strTemp.indexOf('You received a Liquid Courage') != -1 || strTemp.indexOf(' to celebrate his recent promotion') != -1 || strTemp.indexOf('to celebrate her recent promotion') != -1)
					{
						var i1 = strTemp.indexOf('You received a');
						var i2 = strTemp.indexOf('from', i1);
						
						info.text  = $('td.message_body', data).text();
						info.image = $('td.message_body > img:nth-child(2)', data).attr('src');
						info.title = strTemp.slice(i1+15,i2);
					}
					else if(strTemp.indexOf('fight the enemy and claim a cash bounty') != -1)
					{
						info.title = 'Cash';
						info.text = 'Fight the enemy and claim a cash';
						info.image = 'http://mwfb.static.zynga.com/mwfb/graphics/buy_cash_75x75_01.gif';
					
						var strNotice = $('td.message_body', data).html();
						var myUrl = '';
						
						$('td.message_body', data).find('a').each(function()
						{
							if($(this).attr('href').indexOf('loot_confirmed=yes') != -1)
							{
								myUrl = $(this).attr('href');
								return false;
							}
						});
						
						$.post(myUrl, params+'&ajax=1&liteload=1', function(){});
					}
					else if(strTemp.indexOf('You sent a') != -1 || strTemp.indexOf('You collected a') != -1)
					{
						info.title = $('td.message_body > div:nth-child(1)', data).find('img:first').attr('title');
						info.text =  $('td.message_body > div:nth-child(1)', data).find('img:first').parent().next('div').text();
						info.image = $('td.message_body > div:nth-child(1)', data).find('img:first').attr('src');
					}
					else if(strTemp.indexOf('loot_confirmed=yes') != -1)
					{
						var strTemp2 = $('td.message_body', data).text();
					
						var i1 = strTemp2.indexOf('You received a');
						var i2 = strTemp2.indexOf('from', i1);
						
						info.title = $('td.message_body > div:nth-child(2)', data).find('img:first').parent().next('div').text();
						info.text =  strTemp2.slice(i1,i2);
						info.image = $('td.message_body > div:nth-child(2)', data).find('img:first').attr('src');
						
						var body = $('td.message_body', data).html();
						
						if(body.indexOf('No Thanks') != -1)
						{
							var myUrl = '';
							
							$('td.message_body', data).find('a').each(function()
							{
								if($(this).attr('href').indexOf('loot_confirmed=yes') != -1)
								{
									myUrl = $(this).attr('href');
									return false;
								}
							});
							
							$.post(myUrl, params+'&ajax=1&liteload=1', function(){});				
						}
					}
					else if(strTemp.indexOf('You collected a') != -1)
					{
						var i1 = strTemp.indexOf('You collected a');
						var i2 = strTemp.indexOf('from', i1);
						var i3 = strTemp.indexOf('</div>', i1);

						info.text  = strTemp.slice(i1,i3);
						info.image = $('td.message_body > div:nth-child(1)', data).find('img:first').attr('src');
						info.title = strTemp.slice(i1+16,i2);
					}
					else
					{
						throw {message:$('td.message_body', data).text()}
					}
					
					console.log(info);
					
					
					
					/*
					else
					{
						var i1 = strTemp.indexOf('<td class="message_body">');
					
					

						if (i1 == -1) throw {message:"Cannot find message_body"}
						
						var i2 = strTemp.indexOf('</td>',i1);
						var strNotice = strTemp.slice(i1+25,i2);
						
						i1 = strNotice.indexOf('><a href="');
						if (i1 == -1) throw {message:"Cannot find a href"}

						i2 = strNotice.indexOf('"',i1+10);

						myUrl =  strNotice.slice(i1+10,i2) + '&xw_client_id=8';
						myUrl =  myUrl.replace(/\s/g, '%20');

						if(strNotice.indexOf('received all the help allowed') != -1)
						{
							info.error = 'limit';
							info.time = Math.round(new Date().getTime() / 1000);
							
							database.updateErrorItem('bonuses', id, info);
							sendView('bonusError', id, info);
							return;
						}

						info.text  = '';
						info.image = $('td.message_body > div:nth-child(2)', data).find('img:first').attr('src');
						info.title =    $('td.message_body > div:nth-child(2)', data).find('img:first').parent().siblings().text();
						
						
						
						$.ajax({
							type: "GET",
							url: myUrl,
							success: function(d)
							{
								info.time = Math.round(new Date().getTime() / 1000);
								
								database.updateItem('bonuses', id, info);
								sendView('bonusSuccess', id, info);							
								
								console.log(getCurrentTime()+'[B] Bonus collected SUCCESSFULLY - ID: '+id);
							},
							error: function()
							{
								if(typeof(retry) == 'undefined')
								{
									console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
									mafiawarsBonuses.Click3(id, url, params, true);
								}
								else
								{
									info.error = 'connection';
									info.time = Math.round(new Date().getTime() / 1000);
									sendView('bonusError', id, info);
								}
							}
						});	
					}
					*/
					
					
					
					info.time  = Math.round(new Date().getTime() / 1000);
					
					database.updateItem('bonuses', id, info);
					sendView('bonusSuccess', id, info);					
					console.log(getCurrentTime()+'[B] Bonus collected SUCCESSFULLY - ID: '+id);
				}
				catch(err)
				{
					console.log(err.message);
					info.error = 'receiving';
					info.time = Math.round(new Date().getTime() / 1000);
					database.updateErrorItem('bonuses', id, info);
					sendView('bonusError', id, info);
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
					mafiawarsBonuses.Click3(id, url, params, true);
				}
				else
				{
					info.error = 'connection';
					info.time = Math.round(new Date().getTime() / 1000);
					sendView('bonusError', id, info);
				}
			}
		});
	},
};