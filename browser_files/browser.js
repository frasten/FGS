	var bkP = chrome.extension.getBackgroundPage().FGS;
	
	function loadNeighborsStats(gameID)
	{
		bkP.database.db.transaction(function(tx)
		{
			tx.executeSql("SELECT * FROM neighborStats where gameID = ?", [gameID], function(tx, res)
			{
				var game = bkP.gamesData[gameID].systemName;
				var opt = 'SendFreeGiftsList';
				
				for(var i = 0; i < res.rows.length; i++)
				{
					var el = $('tr[neighID="'+res.rows.item(i).userID+'"]','div#'+game+opt);
					var lastBonus = (res.rows.item(i).lastBonus == 0 ? 'never' : format_time_ago(res.rows.item(i).lastBonus));
					var lastGift  = (res.rows.item(i).lastGift == 0 ? 'never' : format_time_ago(res.rows.item(i).lastGift));
					el.find('.lastBonus').html('<span class="hide">'+res.rows.item(i).lastBonus+'</span>'+lastBonus);
					el.find('.lastGift').html('<span class="hide">'+res.rows.item(i).lastGift+'</span>'+lastGift);
					el.find('.totalBonuses').html('<span class="hide">'+res.rows.item(i).totalBonuses+'</span>'+res.rows.item(i).totalBonuses);
					el.find('.totalGifts').html('<span class="hide">'+res.rows.item(i).totalGifts+'</span>'+res.rows.item(i).totalGifts);
				}
				
				$('.neighborsTable', 'div#'+game+opt).tablesorter({
					sortList: [[1,0]],
					textExtraction: function(node) 
					{
						if(node.childNodes.length > 1)
						{
							return node.childNodes[0].innerHTML;
						}
						return node.innerHTML;
					} 
				});
				
				$('.favouritesTable', 'div#'+game+opt).tablesorter({
					sortList: [[1,0]],
					textExtraction: function(node) 
					{
						if(node.childNodes.length > 1)
						{
							return node.childNodes[0].innerHTML;
						}
						return node.innerHTML;
					} 
				});
				
			}, bkP.database.onSuccess, bkP.database.onError);
		});		
	}

	function loadBonuses(gID)
	{
		if(typeof(gID) != 'undefined')
		{
			var whereQry = " where gameID = '"+gID+"'";
			var andQry = " and gameID = '"+gID+"'";
		}
		else
		{
			var whereQry = '';
			var andQry = '';
		}
	
		bkP.database.db.transaction(function(tx)
		{
			if(bkP.options.deleteHistoryOlderThan != 0)
			{
				var now = Math.floor(new Date().getTime()/1000);
				var newerThan = now-bkP.options.deleteHistoryOlderThan;
				
				tx.executeSql("DELETE FROM bonuses where status = '1' and time < ? ", [newerThan], bkP.database.onSuccess, bkP.database.onError);
				tx.executeSql("DELETE FROM requests where status = '1' and time < ? ", [newerThan], bkP.database.onSuccess, bkP.database.onError);
				tx.executeSql("DELETE FROM freegifts where time < ? ", [newerThan], bkP.database.onSuccess, bkP.database.onError);
			}
			
			if(bkP.options.deleteOlderThan != 0)
			{
				var now = Math.floor(new Date().getTime()/1000);
				var newerThan = now-bkP.options.deleteOlderThan;
				
				tx.executeSql("DELETE FROM bonuses where status = '0' and time < ? ", [newerThan], bkP.database.onSuccess, bkP.database.onError);
			}

			// wczytywanie bonusow czekajacych			
			tx.executeSql("SELECT * FROM bonuses where status = '0' "+andQry +" order by time DESC", [], function(tx, res)
			{
				var htmls = {};
				var htmlsManual = {};				
				
				for(var i = 0; i < res.rows.length; i++)
				{
					var v = res.rows.item(i);
					var gameID = v.gameID;

					if(!bkP.options.games[gameID].enabled)
					{
						continue;
					}

					if(typeof(htmls[gameID]) == 'undefined')
					{
						htmls[gameID] = '';
						htmlsManual[gameID] = '';
					}
					
					
					if(checkIfBonusIsManual(gameID, v.title))
					{
						htmlsManual[gameID] += getNewManualBonusRow(gameID, v);
					}
					else
					{
						htmls[gameID] += getNewBonusRow(gameID, v, true);
					}
				}
				
				for(var tmp in htmls)
				{
					var game = bkP.gamesData[tmp].systemName;
					$('div#'+game+'ManualBonusesList').prepend(htmlsManual[tmp]);
					$('div#'+game+'BonusesPendingList').prepend(htmls[tmp]);
				}
				updateCount();
				updateLoaded();
			}, bkP.database.onSuccess, bkP.database.onError);

			tx.executeSql("SELECT * FROM requests where status = '0' "+andQry +" order by time DESC", [], function(tx, res)
			{
				var htmls = {};
				var htmlsManual = {};				
				
				for(var i = 0; i < res.rows.length; i++)
				{
					var v = res.rows.item(i);
					var gameID = v.gameID;

					if(!bkP.options.games[gameID].enabled)
					{
						continue;
					}

					if(typeof(htmls[gameID]) == 'undefined')
					{
						htmls[gameID] = '';
						htmlsManual[gameID] = '';
					}

					if(checkIfRequestIsManual(gameID, v.text))
					{
						htmlsManual[gameID] += getNewManualRequestRow(gameID, v);
					}
					else
					{		
						htmls[gameID] += getNewRequestRow(gameID, v);
					}
				}
				
				for(var tmp in htmls)
				{
					var game = bkP.gamesData[tmp].systemName;
					$('div#'+game+'ManualBonusesList').prepend(htmlsManual[tmp]);
					$('div#'+game+'RequestsPendingList').prepend(htmls[tmp]);
				}
				updateCount();
				updateLoaded();
			}, bkP.database.onSuccess, bkP.database.onError);

			tx.executeSql("SELECT * FROM bonuses where status = '1' "+andQry +" order by time DESC", [], function(tx, res)
			{
				var htmls = {};
				var htmlsError = {};

				for(var i = 0; i < res.rows.length; i++)
				{
					var v = res.rows.item(i);
					var gameID = v.gameID;

					if(!bkP.options.games[gameID].enabled)
					{
						continue;
					}
					
					if(typeof(htmls[gameID]) == 'undefined')
					{
						htmls[gameID] = '';
						htmlsError[gameID] = '';
					}
					
					var tmp = getBonusHistoryRow(v);
					
					if(tmp.indexOf('noErrorClass') != -1)
						htmls[gameID] += tmp;
					else
						htmlsError[gameID] += tmp;
				}
				
				for(var tmp in htmls)
				{
					var game = bkP.gamesData[tmp].systemName;
					
					$('div#'+game+'BonusesHistoryList').prepend(htmls[tmp]);
					$('div#'+game+'FailedBonusesList').prepend(htmlsError[tmp]);	
					
					$('div#'+game+'FailedBonusesList').children('div.processManualBonusClick').css('cursor', 'pointer !important').attr('title', 'Click to manually receive');
					
					$('div#'+game+'BonusesHistoryList').children('div.noErrorClass').find('.bonusError').css('height', '23px');								
					$('div#'+game+'BonusesHistoryList').children('div.noErrorClass').removeClass('noErrorClass');
				}
				updateCount();
				updateLoaded();
			}, bkP.database.onSuccess, bkP.database.onError);

			tx.executeSql("SELECT * FROM requests where status = '1' "+andQry +" order by time DESC", [], function(tx, res)
			{
				var htmls = {};	
				var htmlsError = {};	
				
				for(var i = 0; i < res.rows.length; i++)
				{
					var v = res.rows.item(i);
					var gameID = v.gameID;

					if(!bkP.options.games[gameID].enabled)
					{
						continue;
					}
					
					if(typeof(htmls[gameID]) == 'undefined')
					{
						htmls[gameID] = '';
						htmlsError[gameID] = '';
					}

					var tmp = getRequestHistoryRow(v);
					
					if(tmp.indexOf('noErrorClass') != -1)
						htmls[gameID] += tmp;
					else
						htmlsError[gameID] += tmp;		
				}

				for(var tmp in htmls)
				{
					var game = bkP.gamesData[tmp].systemName;
					
					$('div#'+game+'RequestsHistoryList').prepend(htmls[tmp]);
					$('div#'+game+'FailedGiftsList').prepend(htmlsError[tmp]);
					
					$('div#'+game+'FailedGiftsList').children('div.processManualRequestClick').css('cursor', 'pointer !important').attr('title', 'Click to manually receive');
					
					$('div#'+game+'RequestsHistoryList').children('div.noErrorClass').find('.bonusError').css('height', '23px');
					$('div#'+game+'RequestsHistoryList').children('div.noErrorClass').removeClass('noErrorClass');
				}
				updateCount();
				updateLoaded();
			}, bkP.database.onSuccess, bkP.database.onError);
			

			tx.executeSql("SELECT * FROM freegifts "+whereQry +" order by time DESC", [], function(tx, res)
			{
				var htmls = {};
				
				for(var i = 0; i < res.rows.length; i++)
				{
					var v = res.rows.item(i);
					var gameID = v.gameID;

					if(!bkP.options.games[gameID].enabled)
					{
						continue;
					}
					
					if(typeof(htmls[gameID]) == 'undefined')
					{
						htmls[gameID] = '';
					}
					
					htmls[gameID] += getGiftHistoryRow(gameID, res.rows.item(i), res.rows.item(i).is_thank_you);
				}

				for(var tmp in htmls)
				{
					var game = bkP.gamesData[tmp].systemName;
					
					$('div#'+game+'SendFreeGiftsHistoryList').prepend(htmls[tmp]);
				}
				updateCount();
				updateLoaded();
			}, bkP.database.onSuccess, bkP.database.onError);
		});
	}