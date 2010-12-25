var database = {};
var databaseAlreadyOpen = false;

database.db = null;
database.open = function(userID)
{
	var dbSize = 10 * 1024 * 1024 * 1024; // 100MB
	database.db = openDatabase(userID, '1.0', 'Games data', dbSize);
}

database.onError = function(tx, e) 
{
	console.log('Something unexpected happened: ' + e.message );
}

database.onSuccess = function(tx, e) 
{
	//console.log('Success ' + e.message );
}

database.createTable = function()
{
	database.db.transaction(function(tx)
	{
		tx.executeSql('CREATE TABLE IF NOT EXISTS ' + 
                  'bonuses (id TEXT PRIMARY KEY ASC, gameID INTEGER, status INTEGER, error TEXT, title TEXT, text TEXT, image TEXT, url TEXT, time INTEGER, feedback TEXT, link_data TEXT, like_bonus INTEGER, comment_bonus INTEGER, resend_gift TEXT, error_text TEXT)', [],  database.onSuccess, database.onError);
		
		tx.executeSql('ALTER TABLE bonuses ADD COLUMN comment_bonus INTEGER', [],  database.onSuccess, database.onError);
		tx.executeSql('ALTER TABLE bonuses ADD COLUMN resend_gift TEXT', [],  database.onSuccess, database.onError);
		tx.executeSql('ALTER TABLE bonuses ADD COLUMN error_text TEXT', [],  database.onSuccess, database.onError);

		tx.executeSql('CREATE TABLE IF NOT EXISTS ' + 
				'requests(id TEXT PRIMARY KEY ASC, gameID INTEGER, status INTEGER, error TEXT, title TEXT, text TEXT, image TEXT, post TEXT, time INTEGER, resend_gift TEXT, error_text TEXT)', [],  database.onSuccess, database.onError);

		tx.executeSql('ALTER TABLE requests ADD COLUMN resend_gift TEXT', [],  database.onSuccess, database.onError);
		tx.executeSql('ALTER TABLE requests ADD COLUMN error_text TEXT', [],  database.onSuccess, database.onError);
		
		tx.executeSql('CREATE TABLE IF NOT EXISTS ' + 
                  'neighbours(autoID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, id INTEGER, gameID INTEGER)', [], database.onSuccess, database.onError);
		
		tx.executeSql('CREATE TABLE IF NOT EXISTS ' + 
                  'freegifts(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, gameID INTEGER, friend TEXT, gift TEXT, time INTEGER, is_thank_you INTEGER)', [], database.onSuccess, database.onError);
		
		tx.executeSql('ALTER TABLE freegifts ADD COLUMN is_thank_you INTEGER', [],  database.onSuccess, database.onError);
		
		
//tx.executeSql('DELETE FROM freegifts', [], database.onSuccess, database.onError);
//tx.executeSql('DELETE FROM bonuses', [], database.onSuccess, database.onError);
//tx.executeSql('DELETE FROM requests', [], database.onSuccess, database.onError);
//tx.executeSql('DELETE FROM freegifts', [], database.onSuccess, database.onError);
			 
	});
}

database.likeBonus = function(bonusID)
{
	database.db.transaction(function(tx)
	{
		tx.executeSql("UPDATE bonuses SET like_bonus = 1 where id = ?", [bonusID], database.onSuccess, database.onError);
	});
}

database.commentBonus = function(bonusID)
{
	database.db.transaction(function(tx)
	{
		tx.executeSql("UPDATE bonuses SET comment_bonus = 1 where id = ?", [bonusID], database.onSuccess, database.onError);
	});
}

// GIFTLIST

database.clearTable = function(table, gameID, status)
{
	if(table == 'freegifts')
	{
		database.db.transaction(function(tx)
		{
			tx.executeSql('DELETE FROM freegifts where gameID = ?', [gameID], database.onSuccess, database.onError);
		});
	}
	else
	{
		database.db.transaction(function(tx)
		{
			tx.executeSql('DELETE FROM '+table+' where status = ? and gameID = ?', [status, gameID], database.onSuccess, database.onError);
		});
	}
}

database.clearLimitErrors = function(gameID)
{
	database.db.transaction(function(tx)
	{
		tx.executeSql('DELETE FROM bonuses where status = 1 and gameID = ? and error = "limit"', [gameID], database.onSuccess, database.onError);
	});
}

database.clearReceivingErrors = function(gameID)
{
	database.db.transaction(function(tx)
	{
		tx.executeSql('DELETE FROM bonuses where status = 1 and gameID = ? and error = "receiving"', [gameID], database.onSuccess, database.onError);
	});
}

database.clearRequestReceivingErrors = function(gameID)
{
	database.db.transaction(function(tx)
	{
		tx.executeSql('DELETE FROM requests where status = 1 and gameID = ? and error = "receiving"', [gameID], database.onSuccess, database.onError);
	});
}

database.clearByGameID = function(gameID)
{
	database.db.transaction(function(tx)
	{
		tx.executeSql('DELETE FROM bonuses where gameID = ?', [gameID], database.onSuccess, database.onError);
		tx.executeSql('DELETE FROM requests where gameID = ?', [gameID], database.onSuccess, database.onError);
		tx.executeSql('DELETE FROM freegifts where gameID = ?', [gameID], database.onSuccess, database.onError);
		tx.executeSql('DELETE FROM neighbours where gameID = ?', [gameID], database.onSuccess, database.onError);
	});
}

database.deleteItem = function(table, gameID, id, status)
{
	database.db.transaction(function(tx)
	{
		tx.executeSql('DELETE FROM '+table+' where status = ? and gameID = ? and id = ?', [status, gameID, id], database.onSuccess, database.onError);
	});
}

database.deleteItemArray = function(table, gameID, query, status)
{
	database.db.transaction(function(tx)
	{
		tx.executeSql('DELETE FROM '+table+' '+query+' and status = ? and gameID = ?', [status, gameID], database.onSuccess, database.onError);
	});
}

database.deleteItemByTitle = function(table, gameID, title, status)
{
	database.db.transaction(function(tx)
	{
		tx.executeSql('DELETE FROM '+table+' where status = ? and gameID = ? and title = ?', [status, gameID, title], database.onSuccess, database.onError);
	});
}

database.deleteOlderThan = function(table, status, time)
{
	if(table == 'freegifts')
	{
		database.db.transaction(function(tx)
		{
			tx.executeSql('DELETE FROM freegifts where time < ?', [time], database.onSuccess, database.onError);
		});
	}
	else
	{
		database.db.transaction(function(tx)
		{
			tx.executeSql('DELETE FROM '+table+' where status = ? and time < ?', [status,time], database.onSuccess, database.onError);
		});
	}
}

database.addFavourite = function(gameID, neighID)
{
	database.db.transaction(function(tx)
	{
		tx.executeSql('INSERT INTO neighbours (id, gameID) VALUES(?,?)', [neighID, gameID], database.onSuccess, database.onError);
	});
}

database.delFavourite = function(gameID, neighID)
{
	database.db.transaction(function(tx)
	{
		tx.executeSql('DELETE FROM neighbours where id = ? and gameID = ?', [neighID, gameID], database.onSuccess, database.onError);
	});
}


database.addFreegift = function(gameID, friend, gift, time, thankYou)
{
	database.db.transaction(function(tx)
	{
		var isThankYou = (thankYou == 'undefined' ? 0 : 1);
		tx.executeSql('INSERT INTO freegifts (gameID, friend, gift, time, is_thank_you) VALUES(?,?,?,?,?)', [gameID, friend, gift, time, isThankYou], database.onSuccess, database.onError);
	});
}


database.updateItem = function(table, itemID, info)
{
	database.db.transaction(function(tx)
	{
		var arrQry = [info.time];
		var textQry = '';
		var titleQry = '';
		var imageQry = '';
		var thanksQry = '';
		var errorQry = '';
		
		if(info.text !== '')
		{
			textQry = ', text = ?';
			arrQry.push(info.text);
		}
		if(info.title !=='')
		{
			titleQry = ', title = ?';
			arrQry.push(info.title);
		}
		
		if(info.image !== '')
		{
			imageQry = ', image = ?';
			arrQry.push(info.image);
		}
		
		if(typeof(info.thanks) !== 'undefined')
		{
			thanksQry = ', resend_gift = ?';
			arrQry.push(JSON.stringify(info.thanks));
		}

		if(typeof(info.error_text) !== 'undefined')
		{
			errorQry = ', error_text = ?';
			arrQry.push(info.error_text);
		}


		tx.executeSql('UPDATE '+table+' SET status = 1, time = ? '+textQry+' '+titleQry+' '+imageQry+' '+thanksQry+' '+errorQry+' where id = "'+itemID+'"', arrQry, database.onSuccess, database.onError);
	});
}

		
database.updateItemGiftBack = function(table, itemID)
{
	database.db.transaction(function(tx)
	{
	
		console.log(table);
		console.log(itemID);
		
		var temp = {sent: true};
		var tempStr = JSON.stringify(temp);
		
		tx.executeSql('UPDATE '+table+' SET resend_gift = ? where id = "'+itemID+'"', [tempStr], database.onSuccess, database.onError);
	});
}

database.updateErrorItem = function(table, itemID, info)
{
	database.db.transaction(function(tx)
	{
		var arrQry = [info.error, info.time, info.image];
		
		var errorQry = '';

		if(typeof(info.error_text) !== 'undefined')
		{
			errorQry = ', error_text = ?';
			arrQry.push(info.error_text);
		}

		//have any room to store that bushel
		
		
		tx.executeSql('UPDATE '+table+' SET status = 1, error = ?, time = ?, image = ? '+errorQry+' where id = "'+itemID+'"', arrQry, database.onSuccess, database.onError);
	});
}


database.updateErrorText = function(table, itemID, text)
{
	database.db.transaction(function(tx)
	{
		tx.executeSql('UPDATE '+table+' SET error_text = ? where id = "'+itemID+'"', [text], database.onSuccess, database.onError);
	});
}

// BACKGROUND.HTML
database.addBonus = function(data2)
{
	database.db.transaction(function(tx)
	{
		var outArr = [];

		var total = data2.length;
		
		$(data2).each(function(k, data)
		{
			tx.executeSql("INSERT OR IGNORE INTO bonuses VALUES (?,?,0,'',?,?,?,?,?,?,?,0,0,'','')", data,
			function(t,r)
			{
				total--;
				if(r.rowsAffected == 1)
				{
					outArr.push(data);
					if(giftlistFocus == false)
					{
						newElements++;
					}
				}
				if(total == 0)
				{
					if(outArr.length > 0)
					{
						sendView('addNewBonus', '', '', outArr);
					}
					updateIcon();
				}				
			}, database.onSuccess, database.onError);
		});
	});
}

database.addRequest = function(data2)
{
	database.db.transaction(function(tx)
	{
		var outArr = [];

		var total = data2.length;		
		
		$(data2).each(function(k, data)
		{
			tx.executeSql("INSERT OR IGNORE INTO requests VALUES (?,?,0,'',?,?,?,?,?,'','')", data,
			function(t,r)
			{
				total--;
				if(r.rowsAffected == 1)
				{
					outArr.push(data);
					if(giftlistFocus == false)
					{
						newElements++;
					}
				}
				if(total == 0)
				{
					if(outArr.length > 0)
					{
						sendView('addNewRequest', '', '', outArr);
					}
					updateIcon();
				}		
			}, database.onSuccess, database.onError);
		});
	});
}