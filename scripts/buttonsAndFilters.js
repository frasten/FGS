var gamesData = 
{
	201278444497: 	{ 	
						name: 'FrontierVille',	systemName: 'frontierville',
						filter:		
						{	
							bonuses: ['Go see my gift', 'Go Play FrontierVille', 'Go to FrontierVille', 'Send items'],		
							bonusesNewWindow: ['Send Free Sauce', 'Send Free Potatoes', 'Send Free Pie', 'Send Free Turkey', 'Send RSVP' ],
							requests: ['r4r'],
							requestsNewWindow: [],
						},
						buttons:
						{
							'BonusesPending': 	{	name: 'Show pending bonuses (<span>?</span>)',
													submenu: {
																'ReceivePendingBonuses': { name: 'Receive all bonuses' },
																'ClearPendingBonuses': 	{ name: 'Clear all bonuses' },
																'ClearPendingBonusesOtherError': { name: 'Clear bonuses with "Other error"' },
															}
												},
							'ManualBonuses':	{	name: 'Bonuses With Action Required (<span>?</span>)',
													submenu: {
																'ClearManualBonuses': { name: 'Clear all bonuses' },
															}
												},
							'BonusesHistory': 	{	name: 'Show collected bonuses',
													submenu: {
																'ClearCollectedBonuses': { name: 'Clear bonuses history' },
																'ClearCollectedBonusesLimitError': { name: 'Clear bonuses with "Limit error"' },
															}
												},
							'RequestsPending':	{	name: 'Show pending gifts (<span>?</span>)',
													submenu: {
																'ReceivePendingRequests': { name: 'Receive all gifts' },
																'ClearPendingRequests': 	{ name: 'Clear all requests' },
															}
												}, 
							'RequestsHistory':	{	name: 'Show collected gifts',
													submenu: {
																'ClearCollectedRequests': { name: 'Clear gifts history' },
															}
												}, 
							'SendFreeGifts':	{	name: 'Send free gifts',
													submenu: {
																'SelectFavourites': { name: 'Select favourites' },
																'SendGifts': { name: 'Send free gifts' },
															}
												}, 
							'SendFreeGiftsHistory':	{	name: 'Show free gifts history',
													submenu: {
																'ClearSentFreeGifts': { name: 'Clear send gifts history' },
															}
												},
							'GameOptionsTab':	{	name: 'Filters',
							},
						}
					},
	102452128776: 	{ 	
						name: 'FarmVille',		systemName: 'farmville',
						filter:
						{	
							bonuses: ['Fertilize their crops', 'Play Farmville Now'],
							bonusesNewWindow: ['Help them out','Send Watering Cans','Send Building Parts', 'Send a Bushel', 'Sent Doggie Treats', 'Send Materials', 'Send a Turkey', 'Send puppy kibble'],
							requests: ['Toolbar_Install', 'sendcredits'],
							requestsNewWindow: [],
						},
						buttons:	
						{
							'BonusesPending': 	{	name: 'Show pending bonuses (<span>?</span>)',
													submenu: {
																'ReceivePendingBonuses': { name: 'Receive all bonuses' },
																'ClearPendingBonuses': 	{ name: 'Clear all bonuses' },
																'ClearPendingBonusesOtherError': { name: 'Clear bonuses with "Other error"' },
															}
												},
							'ManualBonuses':	{	name: 'Bonuses With Action Required (<span>?</span>)',
													submenu: {
																'ClearManualBonuses': { name: 'Clear all bonuses' },
															}
												},
							'BonusesHistory': 	{	name: 'Show collected bonuses',
													submenu: {
																'ClearCollectedBonuses': { name: 'Clear bonuses history' },
																'ClearCollectedBonusesLimitError': { name: 'Clear bonuses with "Limit error"' },
															}
												},
							'RequestsPending':	{	name: 'Show pending gifts (<span>?</span>)',
													submenu: {
																'ReceivePendingRequests': { name: 'Receive all gifts' },
																'ClearPendingRequests': 	{ name: 'Clear all requests' },
															}
												}, 
							'RequestsHistory':	{	name: 'Show collected gifts',
													submenu: {
																'ClearCollectedRequests': { name: 'Clear gifts history' },
															}
												},
							'SendFreeGifts':	{	name: 'Send free gifts',
													submenu: {
																'SelectFavourites': { name: 'Select favourites' },
																'SendGifts': { name: 'Send free gifts' },
															}
												}, 
							'SendFreeGiftsHistory':	{	name: 'Show free gifts history',
													submenu: {
																'ClearSentFreeGifts': { name: 'Clear send gifts history' },
															}
												},
							'GameOptionsTab':	{	name: 'Filters',
							},
						}
					},
	10979261223: 	{ 	
						name: 'Mafia Wars',		systemName: 'mafiawars',
						filter:		
						{	
							bonuses: ['Play Mafia Wars'],		
							bonusesNewWindow: ['^Help','Play Slots', 'Send Mystery Bag', 'Send Satchel of Lira', 'Be all you can be', 'Get uniforms', 'Get a uniform', 'Send a uniform', 'Send Army uniform', 'Go sailing', 'Check your Respect Meter', 'Click image to win', 'Goooooooal', 'Send Mystery Shipment', 'Enter now', 'Claim Halloween Reward', 'Send Anvil'],
							requests: [],
							requestsNewWindow: [
								'Join me on a crime spree and find out what we loot',
								'needs your help to complete an important mission',
								'needs your skills as (.*) to complete an important mission',
							],
						},
						buttons:	
						{
							'BonusesPending': 	{	name: 'Show pending bonuses (<span>?</span>)',
													submenu: {
																'ReceivePendingBonuses': { name: 'Receive all bonuses' },
																'ClearPendingBonuses': 	{ name: 'Clear all bonuses' },
															}
												},
							'ManualBonuses':	{	name: 'Bonuses With Action Required (<span>?</span>)',
													submenu: {
																'ClearManualBonuses': { name: 'Clear all bonuses' },
															}
												},
							'BonusesHistory': 	{	name: 'Show collected bonuses',
													submenu: {
																'ClearCollectedBonuses': { name: 'Clear bonuses history' },
																'ClearCollectedBonusesLimitError': { name: 'Clear bonuses with "Limit error"' },
															}
												},
							'RequestsPending':	{	name: 'Show pending gifts (<span>?</span>)',
													submenu: {
																'ReceivePendingRequests': { name: 'Receive all gifts' },
																'ClearPendingRequests': 	{ name: 'Clear all requests' },
															}
												}, 
							'RequestsHistory':	{	name: 'Show collected gifts',
													submenu: {
																'ClearCollectedRequests': { name: 'Clear gifts history' },
															}
												},
							'SendFreeGifts':	{	name: 'Send free gifts',
													submenu: {
																'SelectFavourites': { name: 'Select favourites' },
																'SendGifts': { name: 'Send free gifts' },
															}
												}, 
							'SendFreeGiftsHistory':	{	name: 'Show free gifts history',
													submenu: {
																'ClearSentFreeGifts': { name: 'Clear send gifts history' },
															}
												},
							'GameOptionsTab':	{	name: 'Filters',
							},
						}
					},
	234860566661: 	{ 	
						name: 'Treasure Isle',		systemName: 'treasure',
						filter:		
						{	
							bonuses: ['Play Treasure Isle'],	
							bonusesNewWindow: [],							
							requests: [],
							requestsNewWindow: [],
						},
						buttons:	
						{
							'BonusesPending': 	{	name: 'Show pending bonuses (<span>?</span>)',
													submenu: {
																'ReceivePendingBonuses': { name: 'Receive all bonuses' },
																'ClearPendingBonuses': 	{ name: 'Clear all bonuses' },
															}
												},
							'ManualBonuses':	{	name: 'Bonuses With Action Required (<span>?</span>)',
													submenu: {
																'ClearManualBonuses': { name: 'Clear all bonuses' },
															}
												},
							'BonusesHistory': 	{	name: 'Show collected bonuses',
													submenu: {
																'ClearCollectedBonuses': { name: 'Clear bonuses history' },
																'ClearCollectedBonusesLimitError': { name: 'Clear bonuses with "Limit error"' },
															}
												},
							'RequestsPending':	{	name: 'Show pending gifts (<span>?</span>)',
													submenu: {
																'ReceivePendingRequests': { name: 'Receive all gifts' },
																'ClearPendingRequests': 	{ name: 'Clear all requests' },
															}
												}, 
							'RequestsHistory':	{	name: 'Show collected gifts',
													submenu: {
																'ClearCollectedRequests': { name: 'Clear gifts history' },
															}
												},
							'SendFreeGifts':	{	name: 'Send free gifts',
													submenu: {
																'SelectFavourites': { name: 'Select favourites' },
																'SendGifts': { name: 'Send free gifts' },
															}
												}, 
							'SendFreeGiftsHistory':	{	name: 'Show free gifts history',
													submenu: {
																'ClearSentFreeGifts': { name: 'Clear send gifts history' },
															}
												},
							'GameOptionsTab':	{	name: 'Filters',
							},
						}
					},
	101539264719: 	{ 
						name: 'Cafe World',		systemName: 'cafeworld',
						filter:		
						{
							bonuses: [],
							bonusesNewWindow: ['Send the missing parts', 'Get Lotto Ticket', '^Visit', '^Help ', 'Send Energy', 'Send Fairy Dust', 'Send Utensils', 'Send Wildflower Essence', 'Send Vials of Dewdrops', 'Send Mountain-Fresh Air', '^Send Spice to', 'Free Spice'],
							requests: [],
							requestsNewWindow: []
						},
						buttons:	
						{
							'BonusesPending': 	{	name: 'Show pending bonuses (<span>?</span>)',
													submenu: {
																'ReceivePendingBonuses': { name: 'Receive all bonuses' },
																'ClearPendingBonuses': 	{ name: 'Clear all bonuses' },
															}
												},
							'ManualBonuses':	{	name: 'Bonuses With Action Required (<span>?</span>)',
													submenu: {
																'ClearManualBonuses': { name: 'Clear all bonuses' },
															}
												},
							'BonusesHistory': 	{	name: 'Show collected bonuses',
													submenu: {
																'ClearCollectedBonuses': { name: 'Clear bonuses history' },
																'ClearCollectedBonusesLimitError': { name: 'Clear bonuses with "Limit error"' },
															}
												},
							'RequestsPending':	{	name: 'Show pending gifts (<span>?</span>)',
													submenu: {
																'ReceivePendingRequests': { name: 'Receive all gifts' },
																'ClearPendingRequests': 	{ name: 'Clear all requests' },
															}
												}, 
							'RequestsHistory':	{	name: 'Show collected gifts',
													submenu: {
																'ClearCollectedRequests': { name: 'Clear gifts history' },
															}
												},
							'SendFreeGifts':	{	name: 'Send free gifts',
													submenu: {
																'SelectFavourites': { name: 'Select favourites' },
																'SendGifts': { name: 'Send free gifts' },
															}
												}, 
							'SendFreeGiftsHistory':	{	name: 'Show free gifts history',
													submenu: {
																'ClearSentFreeGifts': { name: 'Clear send gifts history' },
															}
												},
							'GameOptionsTab':	{	name: 'Filters',
							},
						}
					},
	120563477996213: 	{ 
						name: 'Ravenwood Fair',		systemName: 'ravenwood',
						filter:		
						{
							bonuses: [],
							bonusesNewWindow: ['(.*)'],
							requests: [],
							requestsNewWindow: []
						},
						buttons:	
						{
							/*'BonusesPending': 	{	name: 'Show pending bonuses (<span>?</span>)',
													submenu: {
																'ReceivePendingBonuses': { name: 'Receive all bonuses' },
																'ClearPendingBonuses': 	{ name: 'Clear all bonuses' },
															}
												},
							*/
							'ManualBonuses':	{	name: 'Bonuses With Action Required (<span>?</span>)',
													submenu: {
																'ClearManualBonuses': { name: 'Clear all bonuses' },
															}
												},
							/*
							'BonusesHistory': 	{	name: 'Show collected bonuses',
													submenu: {
																'ClearCollectedBonuses': { name: 'Clear bonuses history' }
															}
												},
							*/
							'RequestsPending':	{	name: 'Show pending gifts (<span>?</span>)',
													submenu: {
																'ReceivePendingRequests': { name: 'Receive all gifts' },
																'ClearPendingRequests': 	{ name: 'Clear all requests' },
															}
												}, 
							'RequestsHistory':	{	name: 'Show collected gifts',
													submenu: {
																'ClearCollectedRequests': { name: 'Clear gifts history' },
															}
												},
							'GameOptionsTab':	{	name: 'Filters',
							},
						}
					},
	43016202276: 	{ 
						name: 'Restaurant City',		systemName: 'restaurant',
						filter:		
						{
							bonuses: [],
							bonusesNewWindow: ['(.*)'],
							requests: [],
							requestsNewWindow: []
						},
						buttons:	
						{
							/*'BonusesPending': 	{	name: 'Show pending bonuses (<span>?</span>)',
													submenu: {
																'ReceivePendingBonuses': { name: 'Receive all bonuses' },
																'ClearPendingBonuses': 	{ name: 'Clear all bonuses' },
															}
												},
							*/
							'ManualBonuses':	{	name: 'Bonuses With Action Required (<span>?</span>)',
													submenu: {
																'ClearManualBonuses': { name: 'Clear all bonuses' },
															}
												},
							/*
							'BonusesHistory': 	{	name: 'Show collected bonuses',
													submenu: {
																'ClearCollectedBonuses': { name: 'Clear bonuses history' }
															}
												},
							*/
							'RequestsPending':	{	name: 'Show pending gifts (<span>?</span>)',
													submenu: {
																'ReceivePendingRequests': { name: 'Receive all gifts' },
																'ClearPendingRequests': 	{ name: 'Clear all requests' },
															}
												}, 
							'RequestsHistory':	{	name: 'Show collected gifts',
													submenu: {
																'ClearCollectedRequests': { name: 'Clear gifts history' },
															}
												},
							'GameOptionsTab':	{	name: 'Filters',
							},
						}
					},
	151044809337: 	{ 
						name: 'Fishville',		systemName: 'fishville',
						filter:		
						{
							bonuses: [],
							bonusesNewWindow: ['(.*)'],
							requests: [],
							requestsNewWindow: []
						},
						buttons:	
						{
							/*'BonusesPending': 	{	name: 'Show pending bonuses (<span>?</span>)',
													submenu: {
																'ReceivePendingBonuses': { name: 'Receive all bonuses' },
																'ClearPendingBonuses': 	{ name: 'Clear all bonuses' },
															}
												},
							*/
							'ManualBonuses':	{	name: 'Bonuses With Action Required (<span>?</span>)',
													submenu: {
																'ClearManualBonuses': { name: 'Clear all bonuses' },
															}
												},
							/*
							'BonusesHistory': 	{	name: 'Show collected bonuses',
													submenu: {
																'ClearCollectedBonuses': { name: 'Clear bonuses history' }
															}
												},
							*/
							'RequestsPending':	{	name: 'Show pending gifts (<span>?</span>)',
													submenu: {
																'ReceivePendingRequests': { name: 'Receive all gifts' },
																'ClearPendingRequests': 	{ name: 'Clear all requests' },
															}
												}, 
							'RequestsHistory':	{	name: 'Show collected gifts',
													submenu: {
																'ClearCollectedRequests': { name: 'Clear gifts history' },
															}
												},
							'GameOptionsTab':	{	name: 'Filters',
							},
						}
					},
	21526880407: 	{ 
						name: 'Yoville',		systemName: 'yoville',
						filter:		
						{
							bonuses: [],
							bonusesNewWindow: ['(.*)'],
							requests: [],
							requestsNewWindow: []
						},
						buttons:	
						{
							/*'BonusesPending': 	{	name: 'Show pending bonuses (<span>?</span>)',
													submenu: {
																'ReceivePendingBonuses': { name: 'Receive all bonuses' },
																'ClearPendingBonuses': 	{ name: 'Clear all bonuses' },
															}
												},
							*/
							'ManualBonuses':	{	name: 'Bonuses With Action Required (<span>?</span>)',
													submenu: {
																'ClearManualBonuses': { name: 'Clear all bonuses' },
															}
												},
							/*
							'BonusesHistory': 	{	name: 'Show collected bonuses',
													submenu: {
																'ClearCollectedBonuses': { name: 'Clear bonuses history' }
															}
												},
							*/
							'RequestsPending':	{	name: 'Show pending gifts (<span>?</span>)',
													submenu: {
																'ReceivePendingRequests': { name: 'Receive all gifts' },
																'ClearPendingRequests': 	{ name: 'Clear all requests' },
															}
												}, 
							'RequestsHistory':	{	name: 'Show collected gifts',
													submenu: {
																'ClearCollectedRequests': { name: 'Clear gifts history' },
															}
												},
							'GameOptionsTab':	{	name: 'Filters',
							},
						}
					},
};