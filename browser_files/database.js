FGS.database = {};
FGS.databaseAlreadyOpen = false;

FGS.database.db = null;
FGS.database.open = function(userID)
{
	var dbSize = 10 * 1024 * 1024 * 1024; // 100MB
	FGS.database.db = openDatabase(userID, '1.0', 'Games data', dbSize);
}

FGS.database.onError = function(tx, e) 
{
	console.log('Something unexpected happened: ' + e.message );
}

FGS.database.onSuccess = function(tx, e) 
{
	//console.log('Success ' + e.message );
}

FGS.database.createTable = function()
{
	FGS.database.db.transaction(function(tx)
	{
	
		tx.executeSql('CREATE TABLE IF NOT EXISTS options (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, option LONGTEXT)', [],  FGS.database.onSuccess, FGS.database.onError);

		tx.executeSql('INSERT OR IGNORE INTO options VALUES(1,?)', ['{}'],  FGS.database.onSuccess, FGS.database.onError);
		
		tx.executeSql('CREATE TABLE IF NOT EXISTS ' + 
                  'bonuses (id TEXT PRIMARY KEY ASC, gameID INTEGER, status INTEGER, error TEXT, title TEXT, text TEXT, image TEXT, url TEXT, time INTEGER, feedback TEXT, link_data TEXT, like_bonus INTEGER, comment_bonus INTEGER, resend_gift TEXT, error_text TEXT)', [],  FGS.database.onSuccess, FGS.database.onError);
		
		tx.executeSql('ALTER TABLE bonuses ADD COLUMN comment_bonus INTEGER', [],  FGS.database.onSuccess, FGS.database.onError);
		tx.executeSql('ALTER TABLE bonuses ADD COLUMN resend_gift TEXT', [],  FGS.database.onSuccess, FGS.database.onError);
		tx.executeSql('ALTER TABLE bonuses ADD COLUMN error_text TEXT', [],  FGS.database.onSuccess, FGS.database.onError);

		tx.executeSql('CREATE TABLE IF NOT EXISTS ' + 
				'requests(id TEXT PRIMARY KEY ASC, gameID INTEGER, status INTEGER, error TEXT, title TEXT, text TEXT, image TEXT, post TEXT, time INTEGER, resend_gift TEXT, error_text TEXT)', [],  FGS.database.onSuccess, FGS.database.onError);

		tx.executeSql('ALTER TABLE requests ADD COLUMN resend_gift TEXT', [],  FGS.database.onSuccess, FGS.database.onError);
		tx.executeSql('ALTER TABLE requests ADD COLUMN error_text TEXT', [],  FGS.database.onSuccess, FGS.database.onError);
		
		tx.executeSql('CREATE TABLE IF NOT EXISTS ' + 
                  'freegifts(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, gameID INTEGER, friend TEXT, gift TEXT, time INTEGER, is_thank_you INTEGER)', [], FGS.database.onSuccess, FGS.database.onError);
		
		tx.executeSql('ALTER TABLE freegifts ADD COLUMN is_thank_you INTEGER', [],  FGS.database.onSuccess, FGS.database.onError);
		
		
//tx.executeSql('DELETE FROM freegifts', [], FGS.database.onSuccess, FGS.database.onError);
//tx.executeSql('DELETE FROM bonuses', [], FGS.database.onSuccess, FGS.database.onError);
//tx.executeSql('DELETE FROM requests', [], FGS.database.onSuccess, FGS.database.onError);
//tx.executeSql('DELETE FROM freegifts', [], FGS.database.onSuccess, FGS.database.onError);
			 
	});
}

FGS.database.likeBonus = function(bonusID)
{
	FGS.database.db.transaction(function(tx)
	{
		tx.executeSql("UPDATE bonuses SET like_bonus = 1 where id = ?", [bonusID], FGS.database.onSuccess, FGS.database.onError);
	});
}

FGS.database.commentBonus = function(bonusID)
{
	FGS.database.db.transaction(function(tx)
	{
		tx.executeSql("UPDATE bonuses SET comment_bonus = 1 where id = ?", [bonusID], FGS.database.onSuccess, FGS.database.onError);
	});
}

// GIFTLIST

FGS.database.clearTable = function(table, gameID, status)
{
	if(table == 'freegifts')
	{
		FGS.database.db.transaction(function(tx)
		{
			tx.executeSql('DELETE FROM freegifts where gameID = ?', [gameID], FGS.database.onSuccess, FGS.database.onError);
		});
	}
	else
	{
		FGS.database.db.transaction(function(tx)
		{
			tx.executeSql('DELETE FROM '+table+' where status = ? and gameID = ?', [status, gameID], FGS.database.onSuccess, FGS.database.onError);
		});
	}
}

FGS.database.clearLimitErrors = function(gameID)
{
	FGS.database.db.transaction(function(tx)
	{
		tx.executeSql('DELETE FROM bonuses where status = 1 and gameID = ? and error = "limit"', [gameID], FGS.database.onSuccess, FGS.database.onError);
	});
}

FGS.database.clearReceivingErrors = function(gameID)
{
	FGS.database.db.transaction(function(tx)
	{
		tx.executeSql('DELETE FROM bonuses where status = 1 and gameID = ? and error = "receiving"', [gameID], FGS.database.onSuccess, FGS.database.onError);
	});
}

FGS.database.clearRequestReceivingErrors = function(gameID)
{
	FGS.database.db.transaction(function(tx)
	{
		tx.executeSql('DELETE FROM requests where status = 1 and gameID = ? and error = "receiving"', [gameID], FGS.database.onSuccess, FGS.database.onError);
	});
}

FGS.database.clearByGameID = function(gameID)
{
	FGS.database.db.transaction(function(tx)
	{
		tx.executeSql('DELETE FROM bonuses where gameID = ?', [gameID], FGS.database.onSuccess, FGS.database.onError);
		tx.executeSql('DELETE FROM requests where gameID = ?', [gameID], FGS.database.onSuccess, FGS.database.onError);
		tx.executeSql('DELETE FROM freegifts where gameID = ?', [gameID], FGS.database.onSuccess, FGS.database.onError);
	});
}

FGS.database.deleteItem = function(table, gameID, id, status)
{
	FGS.database.db.transaction(function(tx)
	{
		tx.executeSql('DELETE FROM '+table+' where status = ? and gameID = ? and id = ?', [status, gameID, id], FGS.database.onSuccess, FGS.database.onError);
	});
}

FGS.database.deleteItemArray = function(table, gameID, query, status)
{
	FGS.database.db.transaction(function(tx)
	{
		tx.executeSql('DELETE FROM '+table+' '+query+' and status = ? and gameID = ?', [status, gameID], FGS.database.onSuccess, FGS.database.onError);
	});
}

FGS.database.deleteItemByTitle = function(table, gameID, title, status)
{
	FGS.database.db.transaction(function(tx)
	{
		tx.executeSql('DELETE FROM '+table+' where status = ? and gameID = ? and title = ?', [status, gameID, title], FGS.database.onSuccess, FGS.database.onError);
	});
}

FGS.database.deleteOlderThan = function(table, status, time)
{
	if(table == 'freegifts')
	{
		FGS.database.db.transaction(function(tx)
		{
			tx.executeSql('DELETE FROM freegifts where time < ?', [time], FGS.database.onSuccess, FGS.database.onError);
		});
	}
	else
	{
		FGS.database.db.transaction(function(tx)
		{
			tx.executeSql('DELETE FROM '+table+' where status = ? and time < ?', [status,time], FGS.database.onSuccess, FGS.database.onError);
		});
	}
}

FGS.database.addFreegift = function(gameID, friend, gift, time, thankYou)
{
	FGS.database.db.transaction(function(tx)
	{
		var isThankYou = (thankYou == 'undefined' ? 0 : 1);
		tx.executeSql('INSERT INTO freegifts (gameID, friend, gift, time, is_thank_you) VALUES(?,?,?,?,?)', [gameID, friend, gift, time, isThankYou], FGS.database.onSuccess, FGS.database.onError);
	});
}


FGS.database.updateItem = function(table, itemID, info)
{
	FGS.database.db.transaction(function(tx)
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


		tx.executeSql('UPDATE '+table+' SET status = 1, time = ? '+textQry+' '+titleQry+' '+imageQry+' '+thanksQry+' '+errorQry+' where id = "'+itemID+'"', arrQry, FGS.database.onSuccess, FGS.database.onError);
	});
}

		
FGS.database.updateItemGiftBack = function(table, itemID)
{
	FGS.database.db.transaction(function(tx)
	{
		var temp = {sent: true};
		var tempStr = JSON.stringify(temp);
		
		tx.executeSql('UPDATE '+table+' SET resend_gift = ? where id = "'+itemID+'"', [tempStr], FGS.database.onSuccess, FGS.database.onError);
	});
}

FGS.database.updateErrorItem = function(table, itemID, info)
{
	FGS.database.db.transaction(function(tx)
	{
		var arrQry = [info.error, info.time, info.image];
		
		var errorQry = '';

		if(typeof(info.error_text) !== 'undefined')
		{
			errorQry = ', error_text = ?';
			arrQry.push(info.error_text);
		}

		//have any room to store that bushel
		
		
		tx.executeSql('UPDATE '+table+' SET status = 1, error = ?, time = ?, image = ? '+errorQry+' where id = "'+itemID+'"', arrQry, FGS.database.onSuccess, FGS.database.onError);
	});
}


FGS.database.updateErrorText = function(table, itemID, text)
{
	FGS.database.db.transaction(function(tx)
	{
		tx.executeSql('UPDATE '+table+' SET error_text = ? where id = "'+itemID+'"', [text], FGS.database.onSuccess, FGS.database.onError);
	});
}

// BACKGROUND.HTML
FGS.database.addBonus = function(data2)
{
	FGS.database.db.transaction(function(tx)
	{
		var outArr = [];

		var total = data2.length;
		
		FGS.jQuery(data2).each(function(k, data)
		{
			tx.executeSql("INSERT OR IGNORE INTO bonuses VALUES (?,?,0,'',?,?,?,?,?,?,?,0,0,'','')", data,
			function(t,r)
			{
				total--;
				if(r.rowsAffected == 1)
				{
					outArr.push(data);
					if(FGS.giftlistFocus == false)
					{
						FGS.newElements++;
					}
				}
				if(total == 0)
				{
					if(outArr.length > 0)
					{
						FGS.sendView('addNewBonus', '', '', outArr);
					}
					FGS.updateIcon();
				}				
			}, FGS.database.onSuccess, FGS.database.onError);
		});
	});
}

FGS.database.addRequest = function(data2)
{
	FGS.database.db.transaction(function(tx)
	{
		var outArr = [];

		var total = data2.length;		
		
		FGS.jQuery(data2).each(function(k, data)
		{
			tx.executeSql("INSERT OR IGNORE INTO requests VALUES (?,?,0,'',?,?,?,?,?,'','')", data,
			function(t,r)
			{
				total--;
				if(r.rowsAffected == 1)
				{
					outArr.push(data);
					if(FGS.giftlistFocus == false)
					{
						FGS.newElements++;
					}
				}
				if(total == 0)
				{
					if(outArr.length > 0)
					{
						FGS.sendView('addNewRequest', '', '', outArr);
					}
					FGS.updateIcon();
				}		
			}, FGS.database.onSuccess, FGS.database.onError);
		});
	});
}