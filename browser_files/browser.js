	var bkP = chrome.extension.getBackgroundPage().FGS;
	
	function loadNeighborsStats(gameID, data)
	{
		bkP.database.db.transaction(function(tx)
		{
			tx.executeSql("SELECT * FROM neighborStats where gameID = ?", [gameID], function(tx, res)
			{
				var game = bkP.gamesData[gameID].systemName;
				var opt = 'SendFreeGiftsList';
				
				for(var i = 0; i < res.rows.length; i++)
				{
					var arrIndNor = data.nor[res.rows.item(i).userID];
					var arrIndFav = data.fav[res.rows.item(i).userID];
					
					if(typeof(arrIndFav) != 'undefined')
					{
						var arrInd = arrIndFav;
						var array  = 'favArr';
					}
					else if(typeof(arrIndNor) != 'undefined')
					{
						var arrInd = arrIndNor;
						var array  = 'norArr';
					}
					else
					{
						var arrInd = undefined;
					}
					
					if(typeof(arrInd) != 'undefined')
					{
						var lastBonus = (res.rows.item(i).lastBonus == 0 ? 'never' : format_time_ago(res.rows.item(i).lastBonus));
						var lastGift  = (res.rows.item(i).lastGift == 0 ? 'never' : format_time_ago(res.rows.item(i).lastGift));
						var lastGiftSent  = (res.rows.item(i).lastGiftSent == 0 ? 'never' : format_time_ago(res.rows.item(i).lastGiftSent));
						
						data[array][arrInd][2] = '<span class="hide">'+res.rows.item(i).lastBonus+'</span>'+lastBonus;
						data[array][arrInd][3] = '<span class="hide">'+res.rows.item(i).lastGift+'</span>'+lastGift;
						data[array][arrInd][4] = '<span class="hide">'+res.rows.item(i).lastGiftSent+'</span>'+lastGiftSent;
						data[array][arrInd][5] = '<span class="hide">'+res.rows.item(i).totalBonuses+'</span>'+res.rows.item(i).totalBonuses;
						data[array][arrInd][6] = '<span class="hide">'+res.rows.item(i).totalGifts+'</span>'+res.rows.item(i).totalGifts;
						data[array][arrInd][7] = '<span class="hide">'+res.rows.item(i).totalGiftsSent+'</span>'+res.rows.item(i).totalGiftsSent;						
					}
				}

				$('.sendToFavouritesList','div#'+game+opt).html('<table cellpadding="0" cellspacing="0" border="0" class="display favouritesTable tablesorter" style="margin: 0 auto; margin-top: 15px;"></table>');
				$('.sendToNeighboursList','div#'+game+opt).html('<table cellpadding="0" cellspacing="0" border="0" class="display neighborsTable tablesorter" style="margin: 0 auto; margin-top: 15px;"></table>');
				
				
				$('.neighborsTable', 'div#'+game+opt).dataTable( {
					"aaData": data.norArr,
					"aoColumns": [
						{ "sTitle": "Fav.", "bSortable": false },
						{ "sTitle": "Name" },
						{ "sSortDataType": "dom-text", "sType": "numeric", "sTitle": "Last bonus" },
						{ "sSortDataType": "dom-text", "sType": "numeric", "sTitle": "Last gift" },
						{ "sSortDataType": "dom-text", "sType": "numeric", "sTitle": "Last gift sent" },
						{ "sSortDataType": "dom-text", "sType": "numeric", "sTitle": "Total bonuses" },
						{ "sSortDataType": "dom-text", "sType": "numeric", "sTitle": "Total gifts" },
						{ "sSortDataType": "dom-text", "sType": "numeric", "sTitle": "Total gifts sent" },
						{ "sTitle": "Select", "bSortable": false }
					],
					"aaSorting": [[ 1, "asc" ]],
					"iDisplayLength": 100,
					"oSearch": {"sSearch": ""},
					"bJQueryUI": true,
					"aLengthMenu": [[100, -1], [100, "All"]],
					"sPaginationType": "full_numbers"
				});
				
				$('.favouritesTable', 'div#'+game+opt).dataTable( {
					"aaData": data.favArr,
					"aoColumns": [
						{ "sTitle": "Fav.", "bSortable": false },
						{ "sTitle": "Name" },
						{ "sSortDataType": "dom-text", "sType": "numeric", "sTitle": "Last bonus" },
						{ "sSortDataType": "dom-text", "sType": "numeric", "sTitle": "Last gift" },
						{ "sSortDataType": "dom-text", "sType": "numeric", "sTitle": "Last gift sent" },
						{ "sSortDataType": "dom-text", "sType": "numeric", "sTitle": "Total bonuses" },
						{ "sSortDataType": "dom-text", "sType": "numeric", "sTitle": "Total gifts" },
						{ "sSortDataType": "dom-text", "sType": "numeric", "sTitle": "Total gifts sent" },
						{ "sTitle": "Select", "bSortable": false }
					],
					"aaSorting": [[ 1, "asc" ]],
					"iDisplayLength": 100,
					"oSearch": {"sSearch": ""},
					"bJQueryUI": true,
					"aLengthMenu": [[100, -1], [100, "All"]],
					"sPaginationType": "full_numbers"
				});
				
				
				$('.sendToNeighboursList','div#'+game+opt).parent().find('.hide').not('td > span').removeClass('hide');
				$('#'+game+'SendFreeGifts > .submenu > button').removeClass('hide');
				$('.sendToNeighboursList','div#'+game+opt).children('h3').remove();
				$('.sendToNeighboursList','div#'+game+opt).children('table').removeClass('hide');
				
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