FGS.submenuButtons =
{
	'FailedBonuses':	{	name: FGS.getMsg('FailedBonuses'),
							submenu: {
								'ClearAllFailedBonuses': { name: 				FGS.getMsg('ClearEverything') },
								'ClearCollectedBonusesLimitError': { name: 		FGS.getMsg('Clear')+' "Limit errors"' },
								'ClearCollectedBonusesReceivingError': { name: 	FGS.getMsg('Clear')+' "Receiving errors"' },
							}
	},
	
	'FailedGifts':	{	name: FGS.getMsg('FailedGifts'),
							submenu: {
								'ClearAllFailedRequests': { name: 				FGS.getMsg('ClearEverything') },
								'ClearCollectedRequestsLimitError': { name: 	FGS.getMsg('Clear')+' "Limit errors"' },
								'ClearCollectedRequestsReceivingError': { name: FGS.getMsg('Clear')+' "Receiving errors"' },
							}
	},
	
	'BonusesPending': 	{	name: FGS.getMsg('Bonuses')+' (<span>?</span>)',
							submenu: {
										'ReceivePendingBonuses': { name: 			FGS.getMsg('ReceiveAllItems') },
										'ClearPendingBonuses': 	{ name: 			FGS.getMsg('ClearEverything') },
										'ReceiveVisibleBonuses': { name: 			FGS.getMsg('ReceiveVisibleItems') },
										'ClearVisibleBonuses': 	{ name: 			FGS.getMsg('ClearVisibleItems') },
										'ClearPendingBonusesOtherError': { 	name: 	FGS.getMsg('Clear')+' "Other errors"' },
									}
						},
	'ManualBonuses':	{	name: FGS.getMsg('ItemsRequiringAction')+' (<span>?</span>)',
							submenu: {
										'ClearManualBonuses': { name: 				FGS.getMsg('ClearEverything') },
										'ClearVisibleManualBonuses': 	{ name: 	FGS.getMsg('ClearVisibleItems') },
									}
						},
	'BonusesHistory': 	{	name: FGS.getMsg('CollectedBonuses'),
							submenu: {
										'ClearCollectedBonuses': { name: 			FGS.getMsg('ClearHistory') },
									}
						},
	'RequestsPending':	{	name: FGS.getMsg('Gifts')+' (<span>?</span>)',
							submenu: {
										'ReceivePendingRequests': { name: 			FGS.getMsg('ReceiveAllItems') },
										'ClearPendingRequests': 	{ name: 		FGS.getMsg('ClearEverything') },
										'ReceiveVisibleGifts': { name: 				FGS.getMsg('ReceiveVisibleItems') },
										'ClearVisibleGifts': 	{ name: 			FGS.getMsg('ClearVisibleItems') },
									}
						}, 
	'RequestsHistory':	{	name: FGS.getMsg('CollectedGifts'),
							submenu: {
										'ClearCollectedRequests': { name: 			FGS.getMsg('ClearHistory') },
									}
						}, 
	'SendFreeGifts':	{	name: FGS.getMsg('SendGifts'),
							submenu: {
										'LoadNeighborsList': { name: 				FGS.getMsg('LoadList') },
										'SelectFavourites': { name: 				FGS.getMsg('SelectFavourites')+' (max 25)' },
										'SelectNonFavourites': { name: 				FGS.getMsg('SelectNotFavourites')+' (max 25)' },
										'ClearSelection': { name: 					FGS.getMsg('UncheckAll') },
										'SendGifts': { name: 						FGS.getMsg('Send') },
									}
						}, 
	'SendFreeGiftsHistory':	{	name: FGS.getMsg('SendingHistory'),
							submenu: {
										'ClearSentFreeGifts': { name: 				FGS.getMsg('ClearHistory') },
									}
						},
	'NeighborsSearch': {	name: FGS.getMsg('FindNewNeighbors'),
							submenu: {
										'CheckIfNeighborsAvailable': { name: 		FGS.getMsg('Search') },
									}
						},
	'GameOptionsTab':	{	name: FGS.getMsg('Filters'),
	},
};