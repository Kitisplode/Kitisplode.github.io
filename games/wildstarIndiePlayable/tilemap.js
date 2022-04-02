// Project: WildstarIndie
// File: tilemap.js
// Desc: Cont
// Author: Kitsu
// Created: April 24, 2013
//
//**************************************************************************************************

// Class to contain each tile.
function tile(t, sl, st, bt, sol)
{
	this.tile_index = t;
	this.top_slope = sl;
	this.top_start = st;
	this.top_bottom = bt;
	this.solid = sol;
}

// Class to contain tile entities.
function tileEntity(t, p, exs, exp, exi)
{
	this.type = t;
	this.position = p;
	this.extraString = exs;
	this.extraPosition = exp;
	this.extraInt = exi;
	this.extraTimer = 1;
}

// Class that contains the tile entity types.
var tileEntityTypes =
{
	warp: 0,
	warpDoor: 1,
	enemySpawn: 2,
	playerSpawn: 3,
	interactive: 4,
	trap: 5,
	switchblock: 6,
	breakable: 7,
	switchswitch: 8,
	enemyswitch: 9,
	scrollLock: 10
};

// Class to contain a map of tiles to represent the gameworld.
function tileMap()
{
	var initialized = false;

	var tileSheet = 0;
	this.tileSize = {x:0, y:0};
	
	var tileArray = new Array();
	var tileTypes = new Array();
	
	var tileEntities = new Array();
	
	this.size = {x:0, y:0};
	this.position = {x:0, y:0};
	
	this.fullSize = {x:0, y:0};
	
	this.bgback = -1;
	
	this.bgmid = -1;
	this.bgfront = -1;
	
	this.bgfrontfront = -1;
	
	this.loaded = 0;
	
	this.nextLevelText = "";
	
	// Initializes the tilemap to the given parameters.
	this.Initialize = function(sizex, sizey, sheet, tSizex, tSizey)
	{
		// Clear the tile array.
		tileArray.length = 0;
		tileEntities.length = 0;
		
		// Update the size.
		this.size.x = sizex;
		this.size.y = sizey;
		
		// Fill the tile array with default tiles.
		for (var i = 0; i < sizex * sizey; i++)
		{
			tileArray[i] = new tile(0, 0, 0, false, 0);
		}
		
		// Select the given tilesheet.
		tileSheet = sheet;
		this.tileSize.x = tSizex;
		this.tileSize.y = tSizey;
		
		// Calculate the tilemap's full size.
		this.fullSize.x = this.tileSize.x * this.size.x;
		this.fullSize.y = this.tileSize.y * this.size.y;
		
		// Reset the position.
		this.position.x = 0;
		this.position.y = 0;
		
		initialized = true;
	}
	
	// New method for loading a tilemap from a file.
	this.LoadMapFromFile = function(filename, sheet, tSizex, tSizey)
	{
		this.loaded = 0;
		var worked = false;

		// Select the given tilesheet.
		//tileSheet = sheet;
		this.tileSize.x = tSizex;
		this.tileSize.y = tSizey;
		
		// Start a request to open the file.
		try
		{
			var request = new XMLHttpRequest();
			request.open('GET', "levels/" + filename, true);
			
			request.onreadystatechange = function (event)
			{
				if (request.readyState == 4)
				{
					if (request.status == 0 || request.status == 200)
					{
						var notworked = false;
						// We've loaded up only if it's actually the right file.
						for (var i = 0; i < request.responseText.length; i++)
						{
							if (request.responseText.charAt(i) == '\r')
								break;
							if (request.responseText.charAt(i) != g_nextMap.charAt(i))
							{
								notworked = true;
								break;
							}
						}
						if (notworked == false)
						{
							mainTileMap.loaded = 1;
							mainTileMap.nextLevelText = request.responseText;
						}
					}
					
				}
			};
			
			request.send(null);
			worked = true;
		}
		catch(e)
		{
			alert(e);
			worked = false;
		}
		
		return worked;
	}
	
	// Tells the tilemap that we need the next map loaded before we can continue.
	this.NeedMap = function()
	{
		initialized = false;
	}
	
	// Returns whether the map is loaded. If it isn't loaded yet, but the request is in, load up then.
	this.IsLoaded = function()
	{
		if (initialized == true) return true;
		if (this.loaded == 0) return false;
		if (this.loaded == 1)
		{
			// Clear the tile array.
			tileArray.length = 0;
			tileEntities.length = 0;
		
			//debug.innerHTML += "<li>" + this.nextLevelText + "</li>";
			//var str_temp = this.nextLevelText;
			//infoBox.innerHTML = str_temp.length;
			var linestart = 0;
			var linecount = 0;
			var worked = true;
			var mode = 0;
			
			var tileenttype = 0;
			var tileentpos = {x:0, y:0};
			var tileentexstring;
			var tileentexpos = {x:0, y:0};
			var tileentexint = 0;
			
			// Step through each line and save each name.
			for (var i = 0; i < this.nextLevelText.length; i++)
			{
				if (this.nextLevelText.charAt(i) == '\n')
				{
					// First mode: read in the header and the tile map data.
					if (mode == 0)
					{
						// First, read in the 'header'
						if (linecount <= 9)
						{
							// For the first line, read in the index of the tilesheet.
							if (linecount == 1) tileSheet = parseInt(this.nextLevelText.substring(linestart, i - 1));
							// For the second and third lines, read in the tile map's dimensions.
							else if (linecount == 2) this.size.x = parseInt(this.nextLevelText.substring(linestart, i - 1));
							else if (linecount == 3) this.size.y = parseInt(this.nextLevelText.substring(linestart, i - 1));
							// For the fourth line, we need to read in the tile maps tiletypes.
							else if (linecount == 4) worked = this.LoadTiles(this.nextLevelText.substring(linestart, i - 1));
							else if (linecount == 5) this.bgback = parseInt(this.nextLevelText.substring(linestart, i - 1));
							else if (linecount == 6) this.bgmid = parseInt(this.nextLevelText.substring(linestart, i - 1));
							else if (linecount == 7) this.bgfront = parseInt(this.nextLevelText.substring(linestart, i - 1));
							else if (linecount == 8) this.bgfrontfront = parseInt(this.nextLevelText.substring(linestart, i - 1));
						}
						// Then, read in the tilemap itself.
						else if (linecount <= 9 + this.size.y)
						{
							var wordstart = linestart;
							// Read through the line again, reading a number each time we reach a space.
							for (var j = linestart; j <= i; j++)
							{
								if (this.nextLevelText.charAt(j) == ' ')
								{
									var index = parseInt(this.nextLevelText.substring(wordstart, j));
									wordstart = j + 1;
									tileArray.push(new tile(index, tileTypes[index].top_slope,tileTypes[index].top_start, tileTypes[index].top_bottom, tileTypes[index].solid));
								}
							}
						}
						// After reading that, switch modes.
						else
						{
							linecount = -1;
							mode = 1;
						}
					}
					// Second mode: read in the tile entities.
					else
					{
						// If the tile map has any tile entities, go ahead and grab 'em.
						if (linecount == 0) tileenttype = parseInt(this.nextLevelText.substring(linestart, i - 1));
						else if (linecount == 1) tileentpos.x = parseInt(this.nextLevelText.substring(linestart, i - 1));
						else if (linecount == 2) tileentpos.y = parseInt(this.nextLevelText.substring(linestart, i - 1));
						else if (linecount == 3) tileentexstring = this.nextLevelText.substring(linestart, i - 1);
						else if (linecount == 4) tileentexpos.x = parseInt(this.nextLevelText.substring(linestart, i - 1));
						else if (linecount == 5) tileentexpos.y = parseInt(this.nextLevelText.substring(linestart, i - 1));
						else if (linecount == 6)
						{
							tileentexint = parseInt(this.nextLevelText.substring(linestart, i - 1));
							tileEntities.push(new tileEntity(tileenttype, {x:tileentpos.x, y:tileentpos.y}, tileentexstring, {x:tileentexpos.x, y:tileentexpos.y}, tileentexint));
							if (tileenttype == 3)
							{
								if (g_warpPos == null) g_warpPos = {x:tileentpos.x * mainTileMap.tileSize.x + 6, y:tileentpos.y * mainTileMap.tileSize.y + 6};
								/*if (!g_warpPosSet)
								{
									g_warpPos = {x:tileentpos.x * mainTileMap.tileSize.x + 14, y:tileentpos.y * mainTileMap.tileSize.y + 14};
									g_warpPosSet = true;
								}//*/
							}
						}
						else linecount = -1;
					}
					
					// Move onto the next line
					linestart = i + 1;
					linecount++;
				}
			}
		
			// Reset the position.
			this.position.x = 0;
			this.position.y = 0;
			
			// Clear the tiletypes.
			tileTypes.length = 0;
			
			// Calculate the tilemap's full size.
			this.fullSize.x = this.tileSize.x * this.size.x;
			this.fullSize.y = this.tileSize.y * this.size.y;
			
			this.loaded = 2;
			
			initialized = true;
			this.nextLevelText = "";
			
			// Initialize the gamestate objects and such.
			var tempplayer = g_playerIndex = CreateGameObject(objectTypes.player, g_warpPos);
			// Orient the player object according to the direction he came in from.
			if (tempplayer < g_maxobjects)
			{
				if (g_warpDirection == 0)
				{
					GameObjectArray[tempplayer].scale = -1;
					//GameObjectArray[tempplayer].velocity.x = -playerConstants.runSpeed;
				}
				else if (g_warpDirection == 2)
				{
					GameObjectArray[tempplayer].scale = 1;
					//GameObjectArray[tempplayer].velocity.x = playerConstants.runSpeed;
				}
				g_spriteCamera.x = g_warpPos.x - g_screensize.x / 2;
				g_spriteCamera.y = g_warpPos.y - g_screensize.y / 2;
				g_spriteCameraGoTo.x = g_warpPos.x - g_screensize.x / 2;
				g_spriteCameraGoTo.y = g_warpPos.y - g_screensize.y / 2;
			}
			
			this.UpdateTileEntities();
		}
		return true;
	}
	
	// Clears the current tilemap.
	this.ClearMap = function()
	{
		tileArray.length = 0;
		tileEntities.length = 0;
		//this.tileSize.x = 0;
		//this.tileSize.y = 0;
	}
	
	// Loads a tilemap from a file.
	this.LoadMap = function(filename, sheet, tSizex, tSizey)
	{
		// Clear the tile array.
		tileArray.length = 0;
		tileEntities.length = 0;
		
		// Select the given tilesheet.
		//tileSheet = sheet;
		this.tileSize.x = tSizex;
		this.tileSize.y = tSizey;
		
		// Open the file.
		try
		{
			var str_temp;
			var request = new XMLHttpRequest();
			request.open('GET', "levels/" + filename, false);
			request.send(null);
			str_temp = request.responseText;
			
			var linestart = 0;
			var linecount = 0;
			var worked = true;
			var mode = 0;
			
			var tileenttype = 0;
			var tileentpos = {x:0, y:0};
			var tileentexstring;
			var tileentexpos = {x:0, y:0};
			var tileentexint = 0;
			
			// Step through each line and save each name.
			for (var i = 0; i < str_temp.length; i++)
			{
				if (!worked) break;
				if (str_temp.charAt(i) == '\n')
				{
					// First mode: read in the header and the tile map data.
					if (mode == 0)
					{
						// First, read in the 'header'
						if (linecount <= 9)
						{
							// For the first line, read in the index of the tilesheet.
							if (linecount == 1) tileSheet = parseInt(str_temp.substring(linestart, i - 1));
							// For the second and third lines, read in the tile map's dimensions.
							else if (linecount == 2) this.size.x = parseInt(str_temp.substring(linestart, i - 1));
							else if (linecount == 3) this.size.y = parseInt(str_temp.substring(linestart, i - 1));
							// For the fourth line, we need to read in the tile maps tiletypes.
							else if (linecount == 4) worked = this.LoadTiles(str_temp.substring(linestart, i - 1));
							else if (linecount == 5) this.bgback = parseInt(str_temp.substring(linestart, i - 1));
							else if (linecount == 6) this.bgmid = parseInt(str_temp.substring(linestart, i - 1));
							else if (linecount == 7) this.bgfront = parseInt(str_temp.substring(linestart, i - 1));
							else if (linecount == 8) this.bgfrontfront = parseInt(str_temp.substring(linestart, i - 1));
						}
						// Then, read in the tilemap itself.
						else if (linecount <= 9 + this.size.y)
						{
							var wordstart = linestart;
							// Read through the line again, reading a number each time we reach a space.
							for (var j = linestart; j <= i; j++)
							{
								if (str_temp.charAt(j) == ' ')
								{
									var index = parseInt(str_temp.substring(wordstart, j));
									wordstart = j + 1;
									tileArray.push(new tile(index, tileTypes[index].top_slope,tileTypes[index].top_start, tileTypes[index].top_bottom, tileTypes[index].solid));
								}
							}
						}
						// After reading that, switch modes.
						else
						{
							linecount = -1;
							mode = 1;
						}
					}
					// Second mode: read in the tile entities.
					else
					{
						// If the tile map has any tile entities, go ahead and grab 'em.
						if (linecount == 0) tileenttype = parseInt(str_temp.substring(linestart, i - 1));
						else if (linecount == 1) tileentpos.x = parseInt(str_temp.substring(linestart, i - 1));
						else if (linecount == 2) tileentpos.y = parseInt(str_temp.substring(linestart, i - 1));
						else if (linecount == 3) tileentexstring = str_temp.substring(linestart, i - 1);
						else if (linecount == 4) tileentexpos.x = parseInt(str_temp.substring(linestart, i - 1));
						else if (linecount == 5) tileentexpos.y = parseInt(str_temp.substring(linestart, i - 1));
						else if (linecount == 6)
						{
							tileentexint = parseInt(str_temp.substring(linestart, i - 1));
							tileEntities.push(new tileEntity(tileenttype, {x:tileentpos.x, y:tileentpos.y}, tileentexstring, {x:tileentexpos.x, y:tileentexpos.y}, tileentexint));
							if (tileenttype == 3)
							{
								if (g_warpPos == null) g_warpPos = {x:tileentpos.x * mainTileMap.tileSize.x + 6, y:tileentpos.y * mainTileMap.tileSize.y + 6};
								/*if (!g_warpPosSet)
								{
									g_warpPos = {x:tileentpos.x * mainTileMap.tileSize.x + 14, y:tileentpos.y * mainTileMap.tileSize.y + 14};
									g_warpPosSet = true;
								}//*/
							}
						}
						else linecount = -1;
					}
					
					// Move onto the next line
					//debug.innerHTML += "<li> " + str_temp.substring(linestart, i - 1) + "</li>";
					linestart = i + 1;
					linecount++;
				}
			}
		}
		catch(e)
		{
			alert(e);
			worked = false;
		}
		
		// Calculate the tilemap's full size.
		this.fullSize.x = this.tileSize.x * this.size.x;
		this.fullSize.y = this.tileSize.y * this.size.y;
		
		// Reset the position.
		this.position.x = 0;
		this.position.y = 0;
		
		// Clear the tiletypes.
		tileTypes.length = 0;
		
		initialized = true;
		
		return worked;
	}
	
	// Loads the different tile types.
	this.LoadTiles = function(filename)
	{
		var worked = false;
	
		// Clear out the tile types.
		tileTypes.length = 0;
		
		// Read in the file and each of the tile types.
		try
		{
			var str_temp;
			var request = new XMLHttpRequest();
			request.open('GET', "levels/" + filename, false);
			request.send(null);
			str_temp = request.responseText;
			
			var linestart = 0;
			var linecount = -1;
			
			for (var i = 0; i < str_temp.length; i++)
			{
				var slope, yint, topbottom, solid;
				if (str_temp.charAt(i) == '\n')
				{
					// Read the slope.
					if (linecount == 0) slope = parseFloat(str_temp.substring(linestart, i - 1));
					// Read the y-intercept.
					else if (linecount == 1) yint = parseInt(str_temp.substring(linestart, i - 1));
					// Read the top-bottom.
					else if (linecount == 2)
					{
						var temp = parseInt(str_temp.substring(linestart, i - 1));
						if (temp == 0) topbottom = false;
						else topbottom = true;
					}
					// Read the solidity.
					else if (linecount == 3) solid = parseInt(str_temp.substring(linestart, i - 1));
					// Read the associated indices and then create copies in the tileTypes.
					else if (linecount == 4)
					{
						// Read through the line again for space-separated ints.
						var wordstart = linestart;
						// Read through the line again, reading a number each time we reach a space.
						for (var j = linestart; j <= i; j++)
						{
							if (str_temp.charAt(j) == ' ')
							{
								var temp = parseInt(str_temp.substring(wordstart, j));
								wordstart = j + 1;
								tileTypes[temp] = new tile(temp, slope, yint, topbottom, solid);
							}
						}
					}
					else linecount = -1;
					
					// Move onto the next line.
					linestart = i + 1;
					linecount++;
				}
			}
			worked = true;
		}
		catch(e)
		{
			alert(e);
		}
		
		return worked;
	}
	
	// Handle scrolllock entities.
	this.HandleScrollLocks = function()
	{
		// If a scrolllock entity is active, limit the camera to its position.
		for (var k = 0; k < tileEntities.length; k++)
		{
			// If it's not a scrolllock, skip it.
			if (tileEntities[k].type != tileEntityTypes.scrollLock) continue;
			// If it is, and its switch is active, tie the camera to it.
			if (tileEntities[k].extraPosition.y >= 0)
			{
				if (g_switches[tileEntities[k].extraPosition.y] == true)
				{
					g_spriteCameraGoTo.x = tileEntities[k].position.x * this.tileSize.x;
					g_spriteCameraGoTo.y = tileEntities[k].position.y * this.tileSize.y;
					break;
				}
			}
		}
	}
	
	// Draws the tilemap to the screen in its position.
	this.Draw = function(context)
	{
		if (!initialized) return;
		if (!this.IsLoaded()) return;
		

		
		// Limit the camera to be within the bounds of the tilemap.
		/*if (g_spriteCamera.x < 0)
			g_spriteCamera.x = 0;
		else if (g_spriteCamera.x > mainTileMap.fullSize.x - g_screensize.x)
			g_spriteCamera.x = mainTileMap.fullSize.x - g_screensize.x;
		if (g_spriteCamera.y < 0)
			g_spriteCamera.y = 0;
		else if (g_spriteCamera.y > mainTileMap.fullSize.y - g_screensize.y)
			g_spriteCamera.y = mainTileMap.fullSize.y - g_screensize.y;//*/
		
		// Draw the background.
		if (this.bgback > 0)
		{
			g_SpriteSheetList[this.bgback].DrawFrame({x:g_spriteCamera.x, y:g_spriteCamera.y}, 0, context);
		}
		
		// Draw the paralaxed backgrounds, too.
		if (this.bgmid > 0)
		{
			g_SpriteSheetList[this.bgmid].DrawFrame({x:g_spriteCamera.x / 1.10, y:g_spriteCamera.y - 40}, 0, context);
		}
		if (this.bgfront > 0)
		{
			g_SpriteSheetList[this.bgfront].DrawFrame({x:g_spriteCamera.x / 1.25, y:g_spriteCamera.y - 55}, 0, context);
		}
		
		// Draw the tiles.
		for (var i = 0; i < this.size.x; i++)
		{
			for (var j = 0; j < this.size.y; j++)
			{
				var selectedTile = i + j * this.size.x;
				// If the tile's a zero, don't draw anything!
				if (tileArray[selectedTile].tile_index == 0) continue;
				// Draw each tile's frame.
				g_SpriteSheetList[tileSheet].DrawFrame({x:this.position.x + i * this.tileSize.x, y:this.position.y + j * this.tileSize.y}, tileArray[selectedTile].tile_index, context);
			}
		}
		
		// Draw any tile entities that supposed to be drawn.
		for (var k = 0; k < tileEntities.length; k++)
		{
			// If it's not a trap type, skip it.
			if (tileEntities[k].type != tileEntityTypes.trap && tileEntities[k].type != tileEntityTypes.switchblock && tileEntities[k].type != tileEntityTypes.breakable) continue;
			// Otherwise, if it has a tile to draw and its switch isn't true, draw it.
			if (tileEntities[k].type == tileEntityTypes.trap)
			{
				if (tileEntities[k].extraPosition.x >= 0 && (tileEntities[k].extraPosition.y < 0 || (tileEntities[k].extraPosition.y >= 0 && g_switches[tileEntities[k].extraPosition.y] == false)))
				{
					g_SpriteSheetList[tileSheet].DrawFrame({x:this.position.x + tileEntities[k].position.x * this.tileSize.x, y:this.position.y + tileEntities[k].position.y * this.tileSize.y}, tileEntities[k].extraPosition.x, context);
				}
			}
			// Draw switchblocks.
			else if (tileEntities[k].type == tileEntityTypes.switchblock)
			{
				if (tileEntities[k].extraPosition.y >= 0)
				{
					// Draw inactive switch blocks.
					if (parseInt(tileEntities[k].extraString) >= 0 && ((tileEntities[k].extraInt == -1 && g_switches[tileEntities[k].extraPosition.y] == false) || (tileEntities[k].extraInt != -1 && g_switches[tileEntities[k].extraPosition.y] == true)))
						g_SpriteSheetList[tileSheet].DrawFrame({x:this.position.x + tileEntities[k].position.x * this.tileSize.x, y:this.position.y + tileEntities[k].position.y * this.tileSize.y}, parseInt(tileEntities[k].extraString), context);
					// Draw active switch blocks.
					else if (tileEntities[k].extraPosition.x >= 0 && ((tileEntities[k].extraInt == -1 && g_switches[tileEntities[k].extraPosition.y] == true) || (tileEntities[k].extraInt != -1 && g_switches[tileEntities[k].extraPosition.y] == false)))
						g_SpriteSheetList[tileSheet].DrawFrame({x:this.position.x + tileEntities[k].position.x * this.tileSize.x, y:this.position.y + tileEntities[k].position.y * this.tileSize.y}, tileEntities[k].extraPosition.x, context);
				}
			}
			// Draw breakable tiles.
			else if (tileEntities[k].type == tileEntityTypes.breakable)
			{
				if (tileEntities[k].extraPosition.x >= 0)
				{
					g_SpriteSheetList[tileSheet].DrawFrame({x:this.position.x + tileEntities[k].position.x * this.tileSize.x, y:this.position.y + tileEntities[k].position.y * this.tileSize.y}, tileEntities[k].extraPosition.x, context);
				}
			}
		}
	}
	
	// Checks to see if the given position collides with any solid tiles, accounting for topslopes.
	// Translating from screenpos to worldpos must be done beforehand.
	this.pointCheckCollision = function(pos)
	{
		if (!initialized) return false;
	
		// Convert the position to a position on the tilemap.
		var mapPos = {x:pos.x / this.tileSize.x, y:pos.y / this.tileSize.y};
		var tilePos = {x:(mapPos.x - Math.floor(mapPos.x)) * this.tileSize.x, y:(mapPos.y - Math.floor(mapPos.y)) * this.tileSize.y};
		tilePos.x = Math.floor(tilePos.x);
		tilePos.y = Math.floor(tilePos.y);
		mapPos.x = Math.floor(mapPos.x);
		mapPos.y = Math.floor(mapPos.y);
		var tileIndex = mapPos.x + mapPos.y * this.size.x;
		// If the position isn't even within the tilemap, return false.
		if (mapPos.x < 0 || mapPos.x >= this.size.x || mapPos.y < 0 || mapPos.y >= this.size.y)
			return false;
		// Check to see if the position collides with a solid tile.
		if (tileArray[tileIndex].solid > 0)
		{
			// If it does and that tile has a slope, check to see if the position is on the right side of the slope (depends on whether the slope is a top or bottom).
			if (tileArray[tileIndex].top_slope != 0 || tileArray[tileIndex].top_start != 0)
			{
				// Calculate the y position of the top line at the x tilePos.
				var topYatX = tileArray[tileIndex].top_slope * tilePos.x + tileArray[tileIndex].top_start;
				// If it does, return true.
				if ((!tileArray[tileIndex].top_bottom && topYatX < tilePos.y) || (tileArray[tileIndex].top_bottom && topYatX > tilePos.y))
				{
					return true;
				}
				// Otherwise, return false.
				else
					return false;
			}
			// If the the tile doesn't have a slope (slope and start are both zero), just return true.
			else
				return true;
		}
		// If the position isn't colliding with a solid tile, return false.
		else
			return false;
	}
	
	// Checks to see if a given rectangle collides with any solid tiles, accounting for topslopes.
	this.rectCheckCollision = function(l, t, w, h)
	{
		if (!initialized) return false;
	
		// Check each of the corners and return true immediately if any of them collide.
		if (this.pointCheckCollision({x:l,y:t})) return true;
		if (this.pointCheckCollision({x:l,y:t + h})) return true;
		if (this.pointCheckCollision({x:l + w,y:t})) return true;
		if (this.pointCheckCollision({x:l + w,y:t + h})) return true;
		
		// If none of the corners worked, then check the rectangle itself.
		var result = false;
		// Check each of the rectangle occupies.
		{
			// Convert the topleft corner and the bottomright corner into mapcoords.
			var topleft = {x:Math.floor(l / this.tileSize.x), y:Math.floor(t / this.tileSize.y)};
			var bottomright = {x:Math.floor((l + w) / this.tileSize.x), y:Math.floor((t + h) / this.tileSize.y)};
			// Loop through the tiles, checking each one.
			for (var i = topleft.x; i <= bottomright.x; i++)
			{
				// If we're out of bounds, skip it.
				if (i < 0 || i > this.size.x) continue;
				for (var j = topleft.y; j <= bottomright.y; j++)
				{
					// Skip out of bounds positions.
					if (j < 0 || j > this.size.y) continue;
					// Skip corner positions.
					if (i == topleft.x && j == topleft.y) continue;
					if (i == topleft.x && j == bottomright.y) continue;
					if (i == bottomright.x && j == topleft.y) continue;
					if (i == bottomright.x && j == bottomright.y) continue;
					var selectedTile = i + j * this.size.x;
					// If we're along one of the edges, do corner checks for each end of the edge within the tile.
					if (i == topleft.x || i == bottomright.x || j == topleft.y || j == bottomright.y)
					{
						if (i == topleft.x)
						{
							// Check the position at the top of the left edge and the bottom of the left edge within this tile.
							if (this.pointCheckCollision({x:l, y:j * this.tileSize.y})) result = true;
							else if (this.pointCheckCollision({x:l, y:(j + 1) * this.tileSize.y})) result = true;
						}
						else if (i == bottomright.x)
						{
							// Check along the right edge.
							if (this.pointCheckCollision({x:l + w, y:j * this.tileSize.y})) result = true;
							else if (this.pointCheckCollision({x:l + w, y:(j + 1) * this.tileSize.y})) result = true;
						}
						else if (j == topleft.y)
						{
							// Check along the top edge.
							if (this.pointCheckCollision({x:i * this.tileSize.x, y:t})) result = true;
							else if (this.pointCheckCollision({x:(i + 1) * this.tileSize.x, y:t})) result = true;
						}
						else
						{
							// Check along the bottom edge.
							if (this.pointCheckCollision({x:i * this.tileSize.x, y:t + h})) result = true;
							else if (this.pointCheckCollision({x:(i + 1) * this.tileSize.x, y:t + h})) result = true;
						}
						if (result) break;
					}
					// If we're a middle tile, just return true if there's a solid anywhere.
					else if (tileArray[selectedTile].solid > 0)
					{
						result = true;
						break;
					}
				}
			}
		}
		return result;
	}
	
	// Returns whether the specified line collides with any tiles. (Returns the position that the line collides at, or -1,-1 if no collision).
	// Based on a line/tile collision algorithm found at http://playtechs.blogspot.com/2007/03/raytracing-on-grid.html
	this.lineCheckCollision = function(startPos, endPos)
	{
		// Get the local positions of the line.
		var tileStart = {x:startPos.x / this.tileSize.x, y:startPos.y / this.tileSize.y};
		var tileEnd = {x:endPos.x / this.tileSize.x, y:endPos.y / this.tileSize.y};
	
		var tiles = new Array();
	
		var dx = Math.abs(tileEnd.x - tileStart.x);
		var dy = Math.abs(tileEnd.y - tileStart.y);
		
		var currentX = Math.floor(tileStart.x);
		var currentY = Math.floor(tileStart.y);
		
		// Set up the variables.
		var n = 1;
		var x_inc, y_inc, error;
		
		// For vertical lines, set the x_inc to zero.
		if (dx == 0)
		{
			x_inc = 0;
			error = 1.7976931348623157E+10308;
		}
		// Otherwise, if the end position is to the right, set the x_inc to go right.
		else if (endPos.x > startPos.x)
		{
			x_inc = 1;
			n += Math.floor(tileEnd.x) - currentX;
			error = (Math.floor(tileStart.x) + 1 - tileStart.x) * dy;
		}
		// Otherwise, set the x_inc to go left.
		else
		{
			x_inc = -1;
			n += currentX - Math.floor(tileEnd.x);
			error = (tileStart.x - Math.floor(tileStart.x)) * dy;
		}
		
		// Set the y_inc now. If we're a horizontal line, it'll be nonexistent here.
		if (dy == 0)
		{
			y_inc = 0;
			error -= 1.7976931348623157E+10308;
		}
		else if (tileEnd.y > tileStart.y)
		{
			y_inc = 1;
			n += Math.floor(tileEnd.y) - currentY;
			error -= (Math.floor(tileStart.y) + 1 - tileStart.y) * dx;
		}
		else
		{
			y_inc = -1;
			n += currentY - Math.floor(tileEnd.y);
			error -= (tileStart.y - Math.floor(tileStart.y)) * dx;
		}
		
		for (; n > 0; n--)
		{
			// If this tile is solid, return true.
			if (currentX >= 0 && currentX < this.size.x && currentY >= 0 && currentY < this.size.y)
			{
				if (tileArray[currentX + currentY * this.size.x].solid == 1) return {x:currentX, y:currentY, e:error};
			}
			
			if (error > 0)
			{
				currentY += y_inc;
				error -= dx;
			}
			else
			{
				currentX += x_inc;
				error += dy;
			}
		}
		return null;
	}
	
	// Returns whether the tilemap has been initialized yet or not.
	this.CheckInit = function()
	{
		return initialized;
	}
	
	// Returns a number indicating what direction the player should press to warp, if at all (for warp tile entities).
	// If it returns -1, there's no warp tile entity there.
	this.GetWarpTile = function(pos)
	{
		// Convert the position to tile map position.
		var mapPos = {x:Math.floor(pos.x / this.tileSize.x), y:Math.floor(pos.y / this.tileSize.y)};
		// If the position isn't even within the tilemap, return -1.
		if (mapPos.x < 0 || mapPos.x >= this.size.x || mapPos.y < 0 || mapPos.y >= this.size.y)
			return -1;
		// Otherwise, check through the tile entities array for warp tile entities.
		for (var i = 0; i < tileEntities.length; i++)
		{
			// If the entity isn't a warp, skip it.
			if (tileEntities[i].type != tileEntityTypes.warp) continue;
			// Then, make sure that the entity's position matches the position we're checking.
			if (mapPos.x != tileEntities[i].position.x || mapPos.y != tileEntities[i].position.y) continue;
			// Otherwise, return the extra int to represent a direction.
			return tileEntities[i].extraInt;
		}
		return -2;
	}
	
	// Sets the player warp position depending on the tile entity at the position.
	this.SetWarp = function(pos)
	{
		// Convert the position to tile map position.
		var mapPos = {x:Math.floor(pos.x / this.tileSize.x), y:Math.floor(pos.y / this.tileSize.y)};
		// If the position isn't even within the tilemap, return -1.
		if (mapPos.x < 0 || mapPos.x >= this.size.x || mapPos.y < 0 || mapPos.y >= this.size.y)
			return;
		// Otherwise, check through the tile entities array for warp tile entities.
		for (var i = 0; i < tileEntities.length; i++)
		{
			// If the entity isn't a warp, skip it.
			if (tileEntities[i].type != tileEntityTypes.warp) continue;
			// Then, make sure that the entity's position matches the position we're checking.
			if (mapPos.x != tileEntities[i].position.x || mapPos.y != tileEntities[i].position.y) continue;
			// Otherwise, return the extra int to represent a direction.
			g_warpPos.x = tileEntities[i].extraPosition.x * this.tileSize.x + 6;
			g_warpPos.y = tileEntities[i].extraPosition.y * this.tileSize.y + 6;
			var prevNextMap = g_nextMap;
			g_nextMap = tileEntities[i].extraString;
			g_warpDirection = tileEntities[i].extraInt;
			if (g_nextMap == "room10.txt")
			{
				if (g_playerType == 0) g_nextMap = "room10a.txt";
				else if (g_playerType == 1) g_nextMap = "room10b.txt";
				else g_nextMap = "room10c.txt";
			}
			if (g_nextMap != g_currentMap && g_nextMap != prevNextMap)
			{
				mainTileMap.LoadMapFromFile(g_nextMap, 0, 16, 16);
			}
		}
	}
	
	// Interacts with the interactive tile at the position (if there is one there).
	this.InteractTile = function(pos, textyes)
	{
		// Convert the position to tile map position.
		var mapPos = {x:Math.floor(pos.x / this.tileSize.x), y:Math.floor(pos.y / this.tileSize.y)};
		// If the position isn't even within the tilemap, return -1.
		if (mapPos.x < 0 || mapPos.x >= this.size.x || mapPos.y < 0 || mapPos.y >= this.size.y)
			return;
		// Otherwise, check through the tile entities array.
		for (var i = 0; i < tileEntities.length; i++)
		{
			// If the entity isn't an interactive, skip it.
			if (tileEntities[i].type != tileEntityTypes.interactive && tileEntities[i].type != tileEntityTypes.trap) continue;
			// Then, make sure that the entity's position matches the position we're checking.
			if (mapPos.x != tileEntities[i].position.x || mapPos.y != tileEntities[i].position.y) continue;
			
			// If we're a trap and we have no switch, don't trigger.
			if (tileEntities[i].type == tileEntityTypes.trap && tileEntities[i].extraPosition.y < 0) continue;
			
			if (tileEntities[i].type != tileEntityTypes.trap || (tileEntities[i].type == tileEntityTypes.trap &&
				(tileEntities[i].extraPosition.y < 0 || (tileEntities[i].extraPosition.y >= 0 &&
				((tileEntities[i].extraInt == -1 && g_switches[tileEntities[i].extraPosition.y] == false) || (tileEntities[i].extraInt != -1 && g_switches[tileEntities[i].extraPosition.y] == true)) ))))
			{
				//infoBox.innerHTML = tileEntities[i].extraInt;
				// Put its text up on the screen, if we allow that to happen here.
				if (textyes == true)
				{
					g_text = tileEntities[i].extraString;
					g_textPos = 0;
					// Split the text into lines according to # characters.
					var linestart = 0;
					for (var j = 0; j < g_text.length; j++)
					{
						// If we've come to a # character, cut the string out and put it in a line.
						if (g_text.charCodeAt(j) == 35 || j == g_text.length - 1)
						{
							g_textLines.push(g_text.substring(linestart, j));
							linestart = j + 1;
						}
					}
				}
				// If it's tied to a switch, flip the switch.
				if (tileEntities[i].extraPosition.y >= 0)
				{
					if (tileEntities[i].type != tileEntityTypes.interactive || (tileEntities[i].type == tileEntityTypes.interactive && g_playerType == 0))
					g_switches[tileEntities[i].extraPosition.y] = !g_switches[tileEntities[i].extraPosition.y];
				}
			}
		}
	}
	
	// Function that triggers a switchswitch at the specified location.
	this.SwitchSwitchTile = function(pos)
	{
		// Convert the position to tile map position.
		var mapPos = {x:Math.floor(pos.x / this.tileSize.x), y:Math.floor(pos.y / this.tileSize.y)};
		// If the position isn't even within the tilemap, return -1.
		if (mapPos.x < 0 || mapPos.x >= this.size.x || mapPos.y < 0 || mapPos.y >= this.size.y)
			return false;
		// Otherwise, check through the tile entities array.
		for (var i = 0; i < tileEntities.length; i++)
		{
			// If the entity isn't a switchswitch, skip it.
			if (tileEntities[i].type != tileEntityTypes.switchswitch) continue;
			// Then, make sure that the entity's position matches the position we're checking.
			if (mapPos.x != tileEntities[i].position.x || mapPos.y != tileEntities[i].position.y) continue;
			// Switch the switch.
			g_switches[tileEntities[i].extraPosition.y] = true;
			return true;
		}
		return false;
	}
	
	// Function that breaks a breakable tile at the specified location, if there is one.
	this.BreakTile = function(pos)
	{
		// Convert the position to tile map position.
		var mapPos = {x:Math.floor(pos.x / this.tileSize.x), y:Math.floor(pos.y / this.tileSize.y)};
		// If the position isn't even within the tilemap, return -1.
		if (mapPos.x < 0 || mapPos.x >= this.size.x || mapPos.y < 0 || mapPos.y >= this.size.y)
			return false;
		// Otherwise, check through the tile entities array.
		for (var i = 0; i < tileEntities.length; i++)
		{
			// If the entity isn't a breakable, skip it.
			if (tileEntities[i].type != tileEntityTypes.breakable) continue;
			// Then, make sure that the entity's position matches the position we're checking.
			if (mapPos.x != tileEntities[i].position.x || mapPos.y != tileEntities[i].position.y) continue;
			// Break the tile, delete it, and create a break effect.
			var temp = CreateGameObject(objectTypes.effect, {x:tileEntities[i].position.x * this.tileSize.x, y:tileEntities[i].position.y * this.tileSize.y});
			if (temp >= 0 && temp < g_maxobjects)
			{
				GameObjectArray[temp].spriteIndex = spriteIndices.spr_tileBreak;
				GameObjectArray[temp].frameSpeed = 16;
			}
			tileArray[tileEntities[i].position.x + tileEntities[i].position.y * this.size.x].solid = 0;
			tileEntities.splice(i, 1);
			return true;
		}
		return false;
	}
	
	// Returns the tile entity type for the tile we're on. -1 means no tile entity here. Skips warps and spawns.
	this.GetTileType = function(pos)
	{
		// Convert the position to tile map position.
		var mapPos = {x:Math.floor(pos.x / this.tileSize.x), y:Math.floor(pos.y / this.tileSize.y)};
		// If the position isn't even within the tilemap, return -1.
		if (mapPos.x < 0 || mapPos.x >= this.size.x || mapPos.y < 0 || mapPos.y >= this.size.y)
			return -1;
		// Otherwise, check through the tile entities array.
		for (var i = 0; i < tileEntities.length; i++)
		{
			// If the entity is a warp or a spawn, skip it.
			if (tileEntities[i].type == tileEntityTypes.warp || tileEntities[i].type == tileEntityTypes.enemySpawn || tileEntities[i].type == tileEntityTypes.playerSpawn) continue;
			// Then, make sure that the entity's position matches the position we're checking.
			if (mapPos.x != tileEntities[i].position.x || mapPos.y != tileEntities[i].position.y) continue;
			// Otherwise, return the type.
			return tileEntities[i].type;
		}
		return -2;
	}
	
	// Returns the string for the tile we're on. "" means no tile entity here. Skips warps and spawns.
	this.GetTileString = function(pos)
	{
		// Convert the position to tile map position.
		var mapPos = {x:Math.floor(pos.x / this.tileSize.x), y:Math.floor(pos.y / this.tileSize.y)};
		// If the position isn't even within the tilemap, return -1.
		if (mapPos.x < 0 || mapPos.x >= this.size.x || mapPos.y < 0 || mapPos.y >= this.size.y)
			return "";
		// Otherwise, check through the tile entities array.
		for (var i = 0; i < tileEntities.length; i++)
		{
			// If the entity is a warp or a spawn, skip it.
			if (tileEntities[i].type == tileEntityTypes.warp || tileEntities[i].type == tileEntityTypes.enemySpawn || tileEntities[i].type == tileEntityTypes.playerSpawn) continue;
			// Then, make sure that the entity's position matches the position we're checking.
			if (mapPos.x != tileEntities[i].position.x || mapPos.y != tileEntities[i].position.y) continue;
			// Otherwise, return the type.
			return tileEntities[i].extraString;
		}
		return "";
	}
	
	// Updates entity tiles that might need updating, such as enemy spawn tiles.
	this.UpdateTileEntities = function()
	{
		// Step through the array of tile entities.
		for (var i = 0; i < tileEntities.length; i++)
		{
			// Update depending on the type.
			switch (tileEntities[i].type)
			{
				// Enemy switch tiles.
				case tileEntityTypes.enemyswitch:
					// Get the number of enemies in the room.
					var enemyCount = CountObject(objectTypes.crab);
					var activateSwitch = parseInt(tileEntities[i].extraString)
					// Activate only if the other switch we're tied to is currently active.
					if (activateSwitch == -1 || (activateSwitch != -1 && g_switches[activateSwitch] == true))
					// If the enemy count is zero and the previously saved enemy count is greater than zero, trigger!
					if (enemyCount <= 0 && tileEntities[i].extraPosition.x > 0)
					{
						if (tileEntities[i].extraInt != -1) g_switches[tileEntities[i].extraPosition.y] = false;
						else g_switches[tileEntities[i].extraPosition.y] = true;
						tileEntities.splice(i, 1);
						i--;
					}
					// Save the enemy count.
					else tileEntities[i].extraPosition.x = enemyCount;
					break;
				// Switch tiles.
				case tileEntityTypes.switchswitch:
					// If the switch it's tied to is on and there isn't a breakable block over this tile, trigger.
					if (tileEntities[i].extraPosition.x >= 0)
					{
						if (g_switches[tileEntities[i].extraPosition.x] == null)
							g_switches[tileEntities[i].extraPosition.x] = false;
						else if (g_switches[tileEntities[i].extraPosition.x] == true)
						{
							var foundone = false;
							for (var j = 0; j < tileEntities.length; j++)
							{
								if (tileEntities[i].position.x == tileEntities[j].position.x && tileEntities[i].position.y == tileEntities[j].position.y && tileEntities[j].type == tileEntityTypes.breakable)
								{
									foundone = true;
									break;
								}
							}
							if (!foundone)
							{
								g_switches[tileEntities[i].extraPosition.y] = true;
								tileEntities.splice(i, 1);
								i--;
							}
						}
					}
					break;
				// Breakable tiles.
				case tileEntityTypes.breakable:
					// Make the tile solid.
					tileArray[tileEntities[i].position.x + tileEntities[i].position.y * this.size.x].solid = 1;
					break;
				// Switch block tiles.
				case tileEntityTypes.switchblock:
					// If the switch we're tied to is what we need it to be, turn the underlying tile into the tile specified.
					if (tileEntities[i].extraPosition.y >= 0)
					{
						// If the switch doesn't exist, create it.
						if (g_switches[tileEntities[i].extraPosition.y] == null)
							g_switches[tileEntities[i].extraPosition.y] = false;
						else
						{
							// If the switch is what we need it to be, make the block under it solid.
							if ((tileEntities[i].extraInt == -1 && g_switches[tileEntities[i].extraPosition.y] == true) || (tileEntities[i].extraInt != -1 && g_switches[tileEntities[i].extraPosition.y] == false))
							{
								// If the player is inside the tile when it turns solid, don't turn solid 'til he leaves.
								if (g_playerIndex > -1)
								{
									var playerPosTopLeft = {x:Math.floor(GameObjectArray[g_playerIndex].collision.l / this.tileSize.x), y:Math.floor(GameObjectArray[g_playerIndex].collision.t / this.tileSize.y)};
									var playerPosBottomRight = {x:Math.floor((GameObjectArray[g_playerIndex].collision.l + GameObjectArray[g_playerIndex].collision.w) / this.tileSize.x),
																y:Math.floor((GameObjectArray[g_playerIndex].collision.t + GameObjectArray[g_playerIndex].collision.h) / this.tileSize.y)};
									if (playerPosTopLeft.x == tileEntities[i].position.x && playerPosTopLeft.y == tileEntities[i].position.y ||
										playerPosTopLeft.x == tileEntities[i].position.x && playerPosBottomRight.y == tileEntities[i].position.y ||
										playerPosBottomRight.x == tileEntities[i].position.x && playerPosTopLeft.y == tileEntities[i].position.y ||
										playerPosBottomRight.x == tileEntities[i].position.x && playerPosBottomRight.y == tileEntities[i].position.y)
									{
										// Don't do anything!
									}
									// Otherwise, go solid.
									else tileArray[tileEntities[i].position.x + tileEntities[i].position.y * this.size.x].solid = 1;
								}
								else tileArray[tileEntities[i].position.x + tileEntities[i].position.y * this.size.x].solid = 1;
							}
							// Otherwise, make it unsolid.
							else if ((tileEntities[i].extraInt == -1 && g_switches[tileEntities[i].extraPosition.y] == false) || (tileEntities[i].extraInt != -1 && g_switches[tileEntities[i].extraPosition.y] == true))
								tileArray[tileEntities[i].position.x + tileEntities[i].position.y * this.size.x].solid = 0;
						}
					}
					break;
				// Interactive tiles.
				case tileEntityTypes.interactive:
				case tileEntityTypes.trap:
					//var tilePos = {x:tileEntities[i].position.x * this.tileSize.x, y:tileEntities[i].position.y * this.tileSize.y};
					// If we're tied to a switch and it doesn't exist yet, create it.
					if (tileEntities[i].extraPosition.y >= 0)
					{
						if (g_switches[tileEntities[i].extraPosition.y] == null)
							g_switches[tileEntities[i].extraPosition.y] = false;
						// Otherwise, if the switch is what the entity switches to, remove it.
						else if ((tileEntities[i].extraInt == -1 && g_switches[tileEntities[i].extraPosition.y] == true) || (tileEntities[i].extraInt != -1 && g_switches[tileEntities[i].extraPosition.y] == false))
						{
							tileEntities.splice(i, 1);
							i--;
							continue;
						}
					}
					break;
				// Enemy/door spawn tiles.
				case tileEntityTypes.enemySpawn:
					// Calculate the tile's actual position.
					var tilePos = {x:tileEntities[i].position.x * this.tileSize.x, y:tileEntities[i].position.y * this.tileSize.y};
					// If the tile isn't on the screen and it doesn't have any enemies right now, spawn one.
					/*if (tilePos.x < g_spriteCamera.x - this.tileSize.x - tileEntities[i].extraPosition.x ||
						tilePos.x > g_spriteCamera.x + g_screensize.x + tileEntities[i].extraPosition.x ||
						tilePos.y < g_spriteCamera.y - this.tileSize.y - tileEntities[i].extraPosition.y ||
						tilePos.y > g_spriteCamera.y + g_screensize.y + tileEntities[i].extraPosition.y)//*/
					// If we're an enemy type, we're tied to a switch, and that switch is still false, skip this entity.
					if (tileEntities[i].extraString != "2" && tileEntities[i].extraPosition.y >= 0)
					{
						// If the switch doesn't already exist, create it.
						if (g_switches[tileEntities[i].extraPosition.y] == null)
							g_switches[tileEntities[i].extraPosition.y] = false;
						// If the switch is false, skip.
						if (g_switches[tileEntities[i].extraPosition.y] == false) continue;
					}
					
					// If the spawner doesn't currently have any enemies out yet, or the object it has isn't an enemy, spawn a new enemy.
					if (tileEntities[i].extraInt < 0 || tileEntities[i].extraInt >= g_maxobjects ||
						!GameObjectArray[tileEntities[i].extraInt].active ||
						GameObjectArray[tileEntities[i].extraInt].type != objectTypes.crab)
					{
						if (tileEntities[i].extraTimer > 0)
						{
							tileEntities[i].extraTimer--;
							if (tileEntities[i].extraTimer <= 0)
							{
								tileEntities[i].extraTimer = tileEntities[i].extraPosition.x;
								if (tileEntities[i].extraString != "2" || (tileEntities[i].extraString == "2" && tileEntities[i].extraInt < 0))
								{
									// If we're a door and our global switch is true, don't make a door and delete the tiles already.
									if (tileEntities[i].extraString == "2" && tileEntities[i].extraPosition.y >= 0)
									{
										// If the switch doesn't already exist, create it.
										if (g_switches[tileEntities[i].extraPosition.y] == null)
											g_switches[tileEntities[i].extraPosition.y] = false;
										// If the switch is true, turn off the entity's timer and skip to the next one.
										if (g_switches[tileEntities[i].extraPosition.y] == true)
										{
											tileEntities[i].extraTimer = 0;
											tileArray[tileEntities[i].position.x + tileEntities[i].position.y * this.size.x].solid = 0;
											tileArray[tileEntities[i].position.x + (tileEntities[i].position.y - 1) * this.size.x].solid = 0;
											continue;
										}
									}
									
									// If it's a bee and our timer isn't 0, play a bzz sound.
									if (tileEntities[i].extraString == "11" && tileEntities[i].extraPosition.x > 0 && tileEntities[i].extraInt != -1) PlaySound(16, 1.0);
									
									// Spawn the enemy/door.
									var temp = tileEntities[i].extraInt = CreateGameObject(objectTypes.crab, {x:tilePos.x + this.tileSize.x / 2, y:tilePos.y + this.tileSize.y / 2});
									GameObjectArray[temp].ReInitEnemies(parseInt(tileEntities[i].extraString));
									
									if (g_playerIndex != -1)
									{
										if (GameObjectArray[g_playerIndex].position.x < GameObjectArray[temp].position.x) GameObjectArray[temp].scale = -1;
										else GameObjectArray[temp].scale = 1;
									}
								}
								
								else if (tileEntities[i].extraString == "2" && tileEntities[i].extraInt >= 0 )
								{
									// If we have a switch, switch it to true.
									if (tileEntities[i].extraPosition.y >= 0)
									{
										g_switches[tileEntities[i].extraPosition.y] = true;
									}
									tileEntities[i].extraTimer = 0;
									// Delete the tiles at the tile entity and above it.
									tileArray[tileEntities[i].position.x + tileEntities[i].position.y * this.size.x].solid = 0;
									tileArray[tileEntities[i].position.x + (tileEntities[i].position.y - 1) * this.size.x].solid = 0;
								}
							}
						}
					}
					// If we do have a valid enemy/door active, we're a door tile, and our switch is true, open the door.
					if (tileEntities[i].extraInt >= 0 && tileEntities[i].extraInt < g_maxobjects && GameObjectArray[tileEntities[i].extraInt].type == objectTypes.crab &&
						tileEntities[i].extraString == "2" && tileEntities[i].extraPosition.y >= 0 && g_switches[tileEntities[i].extraPosition.y] != null)
					{
						if (g_switches[tileEntities[i].extraPosition.y] == true)
						{
							DestroyGameObject(tileEntities[i].extraInt);
						}
					}
					break;
			}
		}
	}
}