	var bkP = chrome.extension.getBackgroundPage().FGS;

	
	function loadNeighboursFromDatabase(gameID, game, opt)
	{
		bkP.database.db.transaction(function(tx)
		{
			tx.executeSql("SELECT * FROM neighbours where gameID = ?", [gameID], function(tx, res)
			{
				for(var i = 0; i < res.rows.length; i++)
				{
					$('input[neighID="'+res.rows.item(i)['id']+'"]', 'div#'+game+opt).siblings('img').trigger('click');
				}
				$('.sendToFavouritesList','div#'+game+opt).append('<br style="clear:both" />');
			}, null, bkP.database.onSuccess, bkP.database.onError);
		});
	}
	
	function loadBonuses()
	{
		bkP.database.db.transaction(function(tx)
		{
			tx.executeSql('delete from neighbours where exists (select 1 from neighbours t2 where neighbours.id = t2.id and neighbours.gameID = t2.gameID and  neighbours.autoID > t2.autoID)');
			
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
			tx.executeSql("SELECT * FROM bonuses where status = '0' order by time DESC", [], function(tx, res)
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
						htmls[gameID] += getNewBonusRow(gameID, v);
					}
				}
				
				for(var tmp in htmls)
				{
					var game = bkP.gamesData[tmp].systemName;
					$('div#'+game+'ManualBonusesList').prepend(htmlsManual[tmp]);
					$('div#'+game+'ManualBonusesList').children('div.manualBonus').removeClass('awaitingClick').click(processManualBonusClick);
					
					$('div#'+game+'BonusesPendingList').prepend(htmls[tmp]);
					$('div#'+game+'BonusesPendingList').children('div').removeClass('awaitingClick').click(processBonusClick);
					
					selectFirstTab(tmp);
				}
				
				updateLoaded();
			}, bkP.database.onSuccess, bkP.database.onError);

			tx.executeSql("SELECT * FROM requests where status = '0' order by time DESC", [], function(tx, res)
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
					$('div#'+game+'ManualBonusesList').children('div.manualRequest').removeClass('awaitingClick').click(processManualRequestClick);
					
					$('div#'+game+'RequestsPendingList').prepend(htmls[tmp]);
					$('div#'+game+'RequestsPendingList').children('div').removeClass('awaitingClick').click(processRequestsClick);
				}
				
				updateLoaded();
			}, bkP.database.onSuccess, bkP.database.onError);

			tx.executeSql("SELECT * FROM bonuses where status = '1' order by time DESC", [], function(tx, res)
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
					
					
					htmls[gameID] += getBonusHistoryRow(v);
				}
				
				for(var tmp in htmls)
				{
					var game = bkP.gamesData[tmp].systemName;
					
					$('div#'+game+'BonusesHistoryList').prepend(htmls[tmp]);
					
					
					$('div#'+game+'BonusesHistoryList').children('div.receivingErrorClass').removeClass('receivingErrorClass').css('cursor', 'pointer !important').attr('title', 'Click to manually receive').click(processManualBonusClick);
					
					$('div#'+game+'BonusesHistoryList').children('div.noErrorClass').find('.bonusError').css('height', '23px');
					$('div#'+game+'BonusesHistoryList').children('div.noErrorClass').find('.likeBonus').click(processLikeBonus);
					$('div#'+game+'BonusesHistoryList').children('div.noErrorClass').find('.commentBonus').click(processCommentBonus);
					$('div#'+game+'BonusesHistoryList').children('div.noErrorClass').find('.sendBack').click(processSendBack);	
										
					$('div#'+game+'BonusesHistoryList').children('div.noErrorClass').removeClass('noErrorClass');
				}
				updateLoaded();
			}, bkP.database.onSuccess, bkP.database.onError);

			tx.executeSql("SELECT * FROM requests where status = '1' order by time DESC", [], function(tx, res)
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

					htmls[gameID] += getRequestHistoryRow(v);
				}

				for(var tmp in htmls)
				{
					var game = bkP.gamesData[tmp].systemName;
					
					$('div#'+game+'RequestsHistoryList').prepend(htmls[tmp]);

					$('div#'+game+'RequestsHistoryList').children('div.receivingErrorClass').removeClass('receivingErrorClass').css('cursor', 'pointer !important').attr('title', 'Click to manually receive').click(processManualRequestClick);
					
					$('div#'+game+'RequestsHistoryList').children('div.noErrorClass').find('.bonusError').css('height', '23px');
					$('div#'+game+'RequestsHistoryList').children('div.noErrorClass').find('.sendBack').click(processSendBack);	
					$('div#'+game+'RequestsHistoryList').children('div.noErrorClass').removeClass('noErrorClass');
				}

				updateLoaded();
			}, bkP.database.onSuccess, bkP.database.onError);

			tx.executeSql("SELECT * FROM freegifts order by time DESC", [], function(tx, res)
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
				updateLoaded();
			}, bkP.database.onSuccess, bkP.database.onError);
			
			
			for(var gameID in bkP.options.games)
			{
				if(!bkP.options.games[gameID].enabled)
				{
					continue;
				}
				prepareNeighboursList(gameID);
			}
		});
	}