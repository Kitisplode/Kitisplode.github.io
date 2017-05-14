// Project: SoL 2014
// File: chunk.js
// Desc: Contains the definition of the chunk class and chunk storage, which represents the various
//			environmental features of the scrolling stage.
// Author: Kitsu
// Created: January 13, 2014
//
//**************************************************************************************************

// A list of the tile type indices.
var tileIndices =
{
	empty: 0,
	block: 1,
	enemy: 2,
	item: 3
};

// A list of chunk consts.
var chunkConstants =
{
	size: {x: 5, y:9},
	tileSize: {x:16, y:16},
	fullSize: {x:80, y:144},
	
	diffUp: 10,
	maxDiff: 5,
	
	chunkScore: 25
};

// Class that represents a chunk of the scrolling stage.
function chunk(t, p)
{
	var tile = t;
	
	// An array to store the chunk's data.
	this.chunkData = new Array();
	
	this.position = {x:p.x, y:p.y};
	
	// A function to draw the chunk.
	this.Draw = function(context)
	{
		// Draw the tiles from the chunk.
		for (var i = 0; i < chunkConstants.size.x; i++)
		{
			for (var j = 0; j < chunkConstants.size.y; j++)
			{
				var selectedTile = i + j * chunkConstants.size.x;
				if (this.chunkData[selectedTile] == "1")
				{
					g_SpriteSheetList[spriteIndices.spr_blocks].DrawFrame({x:Math.floor(this.position.x + i * chunkConstants.tileSize.x), y:Math.floor(this.position.y + j * chunkConstants.tileSize.y)}, tile, 1, context);
				}
				/*else if (this.chunkData[selectedTile] != "0")
				{
					g_SpriteSheetList[spriteIndices.spr_enemy_bulletRed].DrawFrame({x:Math.floor(this.position.x + i * chunkConstants.tileSize.x + 8),
																					y:Math.floor(this.position.y + j * chunkConstants.tileSize.y + 8)},
																					parseInt(this.chunkData[selectedTile]) - 1, 1, context);
				}//*/
			}
		}
	}
	
	// Checks to see if the given position collides with any solid tiles.
	// Any conversions from screen to world position must be done beforehand.
	this.pointCheckCollision = function(pos)
	{
		// Convert the position to a position on the chunk.
		var mapPos = {x:(pos.x - this.position.x) / chunkConstants.tileSize.x, y:(pos.y - this.position.y) / chunkConstants.tileSize.y};
		mapPos.x = Math.floor(mapPos.x);
		mapPos.y = Math.floor(mapPos.y);
		
		// If the position isn't even within this chunk, return false.
		if (mapPos.x < 0 || mapPos.x >= chunkConstants.size.x || mapPos.y < 0 || mapPos.y >= chunkConstants.size.y)
			return false;
			
		// Return true if the tile is solid.
		var tileIndex = mapPos.x + mapPos.y * chunkConstants.size.x;
		if (this.chunkData[tileIndex] == "1") return true;
		else return false;
	}
	
	// Checks to see if a given rectangle collides with any solid tiles.
	this.rectCheckCollision = function(l, t, w, h)
	{
		// Check each of the corners and return true immediately if any of them collide.
		if (this.pointCheckCollision({x:l, y:t})) return true;
		if (this.pointCheckCollision({x:l, y:t + h})) return true;
		if (this.pointCheckCollision({x:l + w, y:t})) return true;
		if (this.pointCheckCollision({x:l + w, y:t + h})) return true;
		
		// If none of the corners worked, then check the rectangle itself.
		var result = false;
		// Check each of the tiles the rectangle occupies (except the corners).
		{
			// Convert the topleft corner and the bottomright corner into mapcoords.
			var topleft = {x:Math.floor((l - this.position.x) / chunkConstants.tileSize.x), y:Math.floor((t - this.position.y) / chunkConstants.tileSize.y)};
			var bottomright = {x:Math.floor((l + w - this.position.x) / chunkConstants.tileSize.x), y:Math.floor((t + h - this.position.y) / chunkConstants.tileSize.y)};
			// Loop through the tiles between these two corners, checking each one.
			for (var i = topleft.x; i <= bottomright.x; i++)
			{
				// If we're out of bounds, skip.
				if (i < 0 || i >= chunkConstants.size.x) continue;
				for (var j = topleft.y; j <= bottomright.y; j++)
				{
					if (j < 0 || j >= chunkConstants.size.y) continue;
					// Skip corner positions.
					if (i == topleft.x && j == topleft.y) continue;
					if (i == topleft.x && j == bottomright.y) continue;
					if (i == bottomright.x && j == topleft.y) continue;
					if (i == bottomright.x && j == bottomright.y) continue;
					//AddSpriteToQueue(0, 0, {x:this.position.x + i * 16, y:this.position.y + j * 16}, 10, 0.25);
					var selectedTile = i + j * chunkConstants.size.x;
					// If the tile is solid, return true.
					if (this.chunkData[selectedTile] == "1")
					{
						result = true;
						break;
					}
				}
			}
		}//*/
		// Return our results now.
		return result;
	}
}

// A class that stores loaded chunks.
function LoadedChunkStorage()
{
	// There are several arrays of loaded chunks, one for each difficulty level.
	this.loadedChunks = new Array();
	for (var i = 0; i < 6; i++)
	{
		this.loadedChunks.push(new Array());
	}
	
	var tempFileNames = new Array();
	
	// A method to clear all the loaded chunks.
	this.ClearChunks = function()
	{
		for (var i = 0; i < this.loadedChunks.length; i++)
		{
			this.loadedChunks[i].length = 0;
		}
		g_chunkCount = 0;
		g_chunksLoaded = 0;
	}
	
	// Returns a chunk that
	
	// A method to load the chunk manifest.
	this.LoadChunkManifest = function()
	{
		this.ClearChunks();
		
		// Open the manifest first.
		tempFileNames.length = 0;
		try
		{
			var str_temp;
			var request = new XMLHttpRequest();
			request.open('GET', "levels/chunkManifest.txt", false);
			request.send(null);
			str_temp = request.responseText;
			
			var linestart = 0;
			
			// Step through each line and save each name.
			for (var i = 0; i < str_temp.length; i++)
			{
				if (str_temp.charAt(i) == '\n')
				{
					tempFileNames.push(str_temp.substring(linestart, i - 1));
					linestart = i + 1;
				}
			}
		}
		catch (e)
		{
			alert("Couldn't open chunk manifest! \n" + e );
		}
		
		g_chunkCount = tempFileNames.length;
		alert("opened chunk manifest. " + tempFileNames.length + " chunks to be loaded");
	}
	
	// A method to load the remaining chunks (one at a time).
	this.LoadChunks = function()
	{
		// If we have no more chunks to load, return false.
		/*if (tempFileNames.length <= 0) return false;
		
		// Otherwise, load the next one, then remove it from the toload list.
		try
		{
			var str_temp;
			var request = new XMLHttpRequest();
			request.open('GET', "levels/" + tempFileNames[0] + ".txt", false);
			request.send(null);
			str_temp = request.responseText;
			
			var linestart = 0;
			var linecount = 0;
			
			var diff;
			var type;
			var data = new Array();
			
			for (var j = 0; j < str_temp.length; j++)
			{
				if (linecount > 10) break;
				// At the end of each line, read in the data.
				if (str_temp.charAt(j) == '\n')
				{
					// First line, read the chunk's difficulty level.
					if (linecount == 0)
					{
						diff = parseInt(str_temp.substring(linestart, j - 1)) - 1;
					}
					// Second line, read the chunk's type.
					else if (linecount == 1)
					{
						type = parseInt(str_temp.substring(linestart, j - 1));
					}
					// Any line after, read the chunk data.
					else
					{
						for (var k = linestart; k < j; k++)
						{
							// If the character here is a space, skip it.
							if (str_temp.charAt(k) == ' ')
								continue
							if (str_temp.charAt(k) == '\r')
								continue;
							// Otherwise, just copy it over.
							data.push(str_temp.charAt(k));
						}
					}
					
					linestart = j + 1;
					linecount++;
				}
			}
			
			//alert(data.length);
			this.loadedChunks[diff].push(new chunk(0, {x:0, y:0}));
			for (var m = 0; m < chunkConstants.size.x * chunkConstants.size.y; m++)
			{
				this.loadedChunks[diff][this.loadedChunks[diff].length - 1].chunkData.push(data[m]);// = data[m];
			}
			
		}
		catch(e)
		{
			alert(e);
		}
		g_chunksLoaded++;
		tempFileNames.splice(0,1);//*/
		return true;
	}
}

// A class that stores and handles active chunks.
function ChunkHandler()
{
	// An array to store chunks in.
	var chunks = new Array();
	
	// Stores the current difficulty total of the previous chunks.
	var prevDiff = 1;
	
	this.chunkCount = 0;
	this.diffCount = 0;
	
	this.currentTile = 0;
	
	this.enemyCounter = 0;
	this.itemCounter = 0;
	
	var bosses = new Array();
	
	var spawnEnemies = true;
	
	// Method to clear the chunk array.
	this.ClearChunks = function()
	{
		spawnEnemies = true;
		chunks.length = 0;
		this.chunkCount = 0;
		this.diffCount = 0;
		this.enemyCounter = 3;//Math.round(Math.random() * 3) + g_difficulty + 2;
		this.itemCounter = 5;
		this.currentTile = 0;
		
		bosses.length = 0;
		if (currentGameState == GAME_STATE_GAME)
		{
			for (var i = 0; i < enemyTypes.bossCount; i++)
			{
				bosses.push(enemyTypes.dazz + i);
			}
		}
		else
		{
			for (var i = 0; i <= enemyTypes.iceman; i++)
			{
				bosses.push(i);
			}
		}
		
		// DEBUG:
		//g_difficulty = chunkConstants.maxDiff - 1;
		//this.diffCount = 10;
	}
	
	// Method to spawn a new chunk. The position is provided. If the index is -1, a chunk will spawned randomly within the given difficulty. Otherwise, the chunk with difficulty diff and index will be spawned specifically.
	this.SpawnChunk = function(p, index, diff)
	{
		if (g_difficulty != chunkConstants.maxDiff && currentGameState == GAME_STATE_GAME)
			g_playerScore += chunkConstants.chunkScore;
	
		var selectedChunk = index;
		// If the index is -1, select a random chunk from the given difficulty.
		if (index == -1)
		{
			selectedChunk = Math.round(Math.random() * (g_ChunkLoader.loadedChunks[diff].length - 1));
		}
		
		// Spawn the actual chunk.
		chunks.push(new chunk(this.currentTile, {x:p.x, y:p.y}));
		// Set its chunkdata.
		var i;
		for (i = 0; i < chunkConstants.size.x * chunkConstants.size.y; i++)
		{
			try
			{
				chunks[chunks.length - 1].chunkData.push(g_ChunkLoader.loadedChunks[diff][selectedChunk].chunkData[i]);// = g_ChunkLoader.loadedChunks[diff][selectedChunk].chunkData[i];//push((i < 40 ? "0" : "1"));
			}
			catch(e)
			{
				alert("SpawnChunk( {x:" + p.x + ", y:" + p.y + "}, " + index + ", " + diff + ") \nselectedChunk: " + selectedChunk);
			}
		}
		
		if (currentGameState == GAME_STATE_GAME)
		{
			// Loop through the chunk and count the enemy/item slots.
			for (i = 0; i < chunkConstants.size.x; i++)
			{
				for (var j = 0; j < chunkConstants.size.y; j++)
				{
					var selectedTile = i + j * chunkConstants.size.x;
					if (chunks[chunks.length - 1].chunkData[selectedTile] == "3" && g_difficulty < chunkConstants.maxDiff)
					{
						this.enemyCounter--;
						// If we are ready to spawn an enemy, spawn one.
						if (this.enemyCounter <= 0 && (CountObject(objectTypes.enemy) <= g_difficulty + 1))
						{
							this.enemyCounter = 1;//Math.round(Math.random() * 2) + g_difficulty + 1;
							var temp = CreateGameObject(objectTypes.enemy, {x:chunks[chunks.length - 1].position.x + i * chunkConstants.tileSize.x + 8, y:chunks[chunks.length - 1].position.y + j * chunkConstants.tileSize.y + 8});
							if (temp >= 0 && temp < g_maxobjects)
							{
								var enemyType = Math.round(Math.random() * (enemyTypes.dazz - 1));
								if (enemyType == enemyTypes.groove) enemyType = Math.round(Math.random() * (enemyTypes.dazz - 1));
								
								GameObjectArray[temp].ReInitEnemies(enemyType, Math.round(Math.random() * g_difficulty / (chunkConstants.maxDiff - 1) * 2) + 1);
							}
						}
					}
					// If the spot is an item spot, do the same as above, but with items. (Don't spawn items if the player isn't a normal player).
					if (chunks[chunks.length - 1].chunkData[selectedTile] == "2" && g_playerType == 0)
					{
						this.itemCounter--;
						if (this.itemCounter <= 0)
						{
							this.itemCounter = (g_difficulty != chunkConstants.maxDiff ? Math.round(Math.random() * 4) + 4 : 4);
							var temp = CreateGameObject(objectTypes.item, {x:chunks[chunks.length - 1].position.x + i * chunkConstants.tileSize.x + 8, y:chunks[chunks.length - 1].position.y + j * chunkConstants.tileSize.y + 8});
							if (temp >= 0 && temp < g_maxobjects)
							{
								var itemType = Math.round(Math.random() * 100);
								if (itemType >= 95 && g_cdsHad.length > 0) itemType = 1;
								else if (itemType >= 65) itemType = 2;
								else itemType = 0;
								var color = Math.round(Math.random() * 100);
								if (itemType == 0)
								{
									if (color >= 15) color = 0;
									else color = Math.round(Math.random() * 2) + 1;
								}
								else
								{
									color = Math.round(Math.random() * 4);
								}
								
								GameObjectArray[temp].ReInitItems(itemType, color);
							}
						}
					}
				}
			}
		}
		
		this.chunkCount++;
		if (g_difficulty < chunkConstants.maxDiff)
			this.diffCount++;
	}
	
	// Method to update all the chunks (moving them and removing them if they leave the screen and spawn new ones).
	this.UpdateChunks = function()
	{
		if (g_scrollSpeed != 0)
		{
			for (var i = 0; i < chunks.length; i++)
			{
				//chunks[i].position.x += g_scrollSpeed;
				// If this chunk leaves the screen, remove it and spawn a new one.
				if (chunks[i].position.x <= g_spriteCamera.x - 120)
				{
					chunks.splice(i, 1);
					i--;
					if (currentGameState == GAME_STATE_GAME)
					{
						this.SpawnChunk({x:Math.floor(g_spriteCamera.x + 200 + g_scrollSpeed), y:0}, -1, Math.round(Math.random() * g_difficulty));
						if (this.diffCount >= chunkConstants.diffUp)
						{
							this.diffCount = 0;
							g_difficulty++;
							// If we've reached a boss diff, spawn a boss.
							if (g_difficulty == chunkConstants.maxDiff) 
							{
								this.currentTile = 4;
								var temp = CreateGameObject(objectTypes.enemy, {x:g_spriteCamera.x + 420 + g_scrollSpeed, y:g_screensize.y / 2});
								if (temp >= 0 && temp < g_maxobjects)
								{
									var boss = Math.round(Math.random() * (bosses.length - 1));
									GameObjectArray[temp].ReInitEnemies(bosses[boss], 0);
									bosses.splice(boss, 1);
									if (bosses.length <= 0)
									{
										for (var i = 0; i < enemyTypes.bossCount; i++)
										{
											bosses.push(enemyTypes.dazz + i);
										}
									}
									SwitchMusic(musicIndices.mus_boss);
								}
							}
							// If we've passed the boss diff, increase the speed and return to zero diff.
							else if (g_difficulty > chunkConstants.maxDiff)
							{
								g_difficulty = 0;
								g_scrollSpeed += g_speedUp;
								this.currentTile = Math.round(Math.random() * 3);
								SwitchMusic(Math.round(Math.random() * 11));
							}
						}
					}
					else
					{
						this.SpawnChunk({x:Math.floor(g_spriteCamera.x + 200 + g_scrollSpeed), y:0}, 0, 0);
						if (spawnEnemies)
						{
							// Spawn a credits walker.
							var temp = CreateGameObject(objectTypes.enemyCredits, {x:g_spriteCamera.x + 200, y:g_screensize.y - 24});
							if (temp >= 0 && temp < g_maxobjects)
							{
								if (bosses.length > 0)
								{
									var boss = Math.round(Math.random() * (bosses.length - 1));
									GameObjectArray[temp].ReInitEnemies(bosses[boss], 0);
									if (bosses[boss] == 23)
									{
										temp = CreateGameObject(objectTypes.credits, {x:0, y:0});
										if (temp >= 0 && temp < g_maxobjects)
										{
											GameObjectArray[temp].ReInitCredits(-2);
											GameObjectArray[temp].extraString = "   Programming"
											GameObjectArray[temp].position.y = g_screensize.y + 64 + 12;
										}
										temp = CreateGameObject(objectTypes.credits, {x:0, y:0});
										if (temp >= 0 && temp < g_maxobjects)
										{
											GameObjectArray[temp].ReInitCredits(-2);
											GameObjectArray[temp].extraString = "   graphics"
											GameObjectArray[temp].position.y = g_screensize.y + 64 + 21;
										}
									}
									else if (bosses[boss] == 7)
									{
										temp = CreateGameObject(objectTypes.credits, {x:0, y:0});
										if (temp >= 0 && temp < g_maxobjects)
										{
											GameObjectArray[temp].ReInitCredits(-2);
											GameObjectArray[temp].extraString = "   Design"
											GameObjectArray[temp].position.y = g_screensize.y + 64 + 12;
										}
										temp = CreateGameObject(objectTypes.credits, {x:0, y:0});
										if (temp >= 0 && temp < g_maxobjects)
										{
											GameObjectArray[temp].ReInitCredits(-2);
											GameObjectArray[temp].extraString = "   graphics"
											GameObjectArray[temp].position.y = g_screensize.y + 64 + 21;
										}
										temp = CreateGameObject(objectTypes.credits, {x:0, y:0});
										if (temp >= 0 && temp < g_maxobjects)
										{
											GameObjectArray[temp].ReInitCredits(-2);
											GameObjectArray[temp].extraString = "   music"
											GameObjectArray[temp].position.y = g_screensize.y + 64 + 30;
										}
									}
									bosses.splice(boss, 1);
								}
								// If we're out of enemies, spawn a sol.
								else
								{
									GameObjectArray[temp].ReInitEnemies(-1, 0);
									GameObjectArray[temp].position.x += 200;
									
									temp = CreateGameObject(objectTypes.credits, {x:0, y:0});
									if (temp >= 0 && temp < g_maxobjects)
									{
										GameObjectArray[temp].ReInitCredits(-2);
										GameObjectArray[temp].extraString = "THANKS FOR";
										GameObjectArray[temp].position.y = g_screensize.y + 64 + 150;
										GameObjectArray[temp].extraInt = g_screensize.y / 2 - 1;
									}
									temp = CreateGameObject(objectTypes.credits, {x:0, y:0});
									if (temp >= 0 && temp < g_maxobjects)
									{
										GameObjectArray[temp].ReInitCredits(-2);
										GameObjectArray[temp].extraString = " PLAYING!";
										GameObjectArray[temp].position.y = g_screensize.y + 64 + 159;
										GameObjectArray[temp].extraInt = g_screensize.y / 2 + 8;
									}
									temp = CreateGameObject(objectTypes.credits, {x:0, y:0});
									if (temp >= 0 && temp < g_maxobjects)
									{
										GameObjectArray[temp].ReInitCredits(-2);
										GameObjectArray[temp].extraString = " Press " + KeyCodeToString(controls.jump);
										GameObjectArray[temp].position.y = g_screensize.y + 64 + 205;
										GameObjectArray[temp].extraInt = g_screensize.y / 2 + 9;
									}
									spawnEnemies = false;
								}
							}
						}
					}
				}
			}
		}
	}
	
	// Method to draw all the chunks.
	this.DrawChunks = function(context)
	{
		for (var i = 0; i < chunks.length; i++)
		{
			chunks[i].Draw(context);
		}
	}
	
	// Method to check a point for collision with any of the chunks in storage.
	this.pointCheckCollision = function(pos)
	{
		// If there are no chunks in storage, return false.
		if (chunks.length == 0) return false;
		
		var results = false;
		// Otherwise, loop through each one and check for collision with each.
		for (var i = 0; i < chunks.length; i++)
		{
			results = chunks[i].pointCheckCollision({x:pos.x, y:pos.y});
			if (results == true) break;
		}
		
		// Return our results.
		return results;
	}
	
	// Method to check a rectangle for collision with any of the chunks in storage.
	this.rectCheckCollision = function(l, t, w, h)
	{
		// If there are no chunks in storage, just return false.
		if (chunks.length == 0) return false;
		
		var results = false;
		// Otherwise, loop through each chunk and check for collision with each one.
		for (var i = 0; i < chunks.length; i++)
		{
			results = chunks[i].rectCheckCollision(l,t,w,h);
			if (results == true) break;
		}
		
		// Return our results.
		return results;
	}
}