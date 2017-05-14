// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: tileMapObject.js
// Desc: Contains the module for the tilemap object type.
// Author: mjensen
// Created: July 27, 2015
//
//**************************************************************************************************
var tileMapConstants =
{
	genValFloor:
	{
		cost: 1,
		passable: true
	},
	genValDirt:
	{
		cost: 4,
		passable: false
	}, 
	genValStone:
	{
		cost: 20,
		passable: true
	}
};

function ModuleTileMap(obj)
{
	var _this = this;
	var thisObject = obj;
	
	var engine;
	
	this.type = "tilemap";
	
	var tileSize = {x:16, y:16};
	var mapSize = {x:0, y:0};
	
	var roomsList = new Array();
	
	var tiles = new Array();
	
	this.spawnLocation = {x:0, y:0};
	this.exitLocation = {x:-1, y:-1};
	
	this.genValCostRule = function(pos){ return _this.getMapPosValue(pos, "cost"); }
	
	this.definedRuleSkipType1 = function(pos) { return (_this.checkMapPosForValue(pos, "passable", true)); }
	
	// Returns nothing.
	this.initialize = function()
	{
		thisObject.spriteIndex = 1;
		thisObject.frameSpeed = 0.0;
		thisObject.drawDepth = 0;
	}
	
	// Sets up the tilemap array.
	this.setUpMap = function (pSizeX, pSizeY, pTileSet, pTileSizeX, pTileSizeY, pEngine)
	{
		engine = pEngine;
		tiles.length = 0;
		mapSize.x = pSizeX;
		mapSize.y = pSizeY;
		tileSize.x = pTileSizeX;
		tileSize.y = pTileSizeY;
		thisObject.spriteIndex = pTileSet;
		// Set up the tile array.
		for (var i = 0; i < _this.getTileCount(); i++)
		{
			tiles.push({type: 0, genVal:tileMapConstants.genValFloor, distance:0, tile: 0});
		}
		// Set up the collision box for the tilemap as a whole.
	}
	
	// Returns a boolean representing whether the collision changed or not.
	this.update = function()
	{
		return false;
	}
	// Returns a 2d vector representing sprite shake amount.
	this.draw = function(spriteList, drawQueue)
	{
		thisObject.defaultDraw = false;
		var pos = {x:0, y:0};
		var drawPos = {x:0, y:0};
		// Draw each tile in the array.
		for (pos.y = 0; pos.y < mapSize.y; pos.y++)
		{
			for (pos.x = 0; pos.x < mapSize.x; pos.x++)
			{
				var tile = _this.getTileWithMapPos(pos);
				// If the tile's type is greater than -1, draw it (to prevent attempting to draw negative frames).
				if (tile.type > -1)
				{
					// If the spriteIndex is set, use that to draw the tile map.
					if (thisObject.spriteIndex > -1)
					{
						drawPos.x = Math.floor(thisObject.position.x + (pos.x * tileSize.x));
						drawPos.y = Math.floor(thisObject.position.y + (pos.y * tileSize.y));
						drawQueue.addSpriteToQueue(thisObject.spriteIndex, tile.type, drawPos, drawPos.y, thisObject.alpha, false);
						if (tile.distance > -1)
						{
							drawQueue.addSpriteToQueue(thisObject.spriteIndex, 3, drawPos, drawPos.y + 1, (1 - tile.distance / 16) * 0.75, false);
						}
					}
				}
			}
		}
		
		return {x:0, y:0};
	}
	// Returns nothing.
	this.destroy = function()
	{
		tiles.length = 0;
	}
	// Returns nothing.
	this.collide = function(other)
	{
	}
	
	// Converts a world position to a map position (unrounded).
	this.convertWorldPosToMapPos = function(pos)
	{
		var mapPos = {x:(pos.x - thisObject.position.x + tileSize.x / 2) / tileSize.x, y:(pos.y - thisObject.position.y + tileSize.y / 2) / tileSize.y};
		
		// If the position isn't even within this tilemap, return the error results.
		if (mapPos.x < 0 || mapPos.x >= mapSize.x || mapPos.y < 0 || mapPos.y >= mapSize.y)
		{
			mapPos.x = -1; mapPos.y = -1
		}
			
		// Otherwise, just return our results!
		return mapPos;
	}
	// Converts a map position to a world position.
	this.convertMapPosToWorldPos = function(pos)
	{
		return {x:(pos.x * tileSize.x) + thisObject.position.x, y:(pos.y * tileSize.y) + thisObject.position.y};
	}
	// Converts a map position to a map index.
	this.convertMapPosToMapIndex = function(pos)
	{
		return Math.floor(pos.x) + Math.floor(pos.y) * mapSize.x;
	}
	
	// Checks to see if a mapPos is valid.
	this.checkMapPos = function(pos)
	{
		return (pos != null && pos.x >= 0 && pos.x < mapSize.x && pos.y >= 0 && pos.y < mapSize.y);
	}
	
	// Checks if one given mapPos is adjacent to another given mapPos.
	this.checkTileIfAdjacent = function (tile1, tile2)
	{
		var posDiff = {x:Math.floor(tile1.x) - Math.floor(tile2.x), y:Math.floor(tile1.y) - Math.floor(tile2.y)};
		var coordSum = Math.abs(posDiff.x) + Math.abs(posDiff.y);
		return (coordSum > 0 && coordSum <= 1);
	}
	
	// Returns a mapPos relative to the given mapPos.
	this.tileUp = function(mapPos)
	{ return {x:mapPos.x, y:mapPos.y - 1}; }
	this.tileDown = function(mapPos)
	{ return {x:mapPos.x, y:mapPos.y + 1}; }
	this.tileLeft = function(mapPos)
	{ return {x:mapPos.x - 1, y:mapPos.y}; }
	this.tileRight = function(mapPos)
	{ return {x:mapPos.x + 1, y:mapPos.y}; }
	
	// Returns a tile, given just a map position.
	this.getTileWithMapPos = function(pos)
	{
		// Check that the map position is valid.
		if (_this.checkMapPos(pos))
		{
			return tiles[this.convertMapPosToMapIndex(pos)];
		}
		return null;
	}
	
	// Check if a tile has a particular value.
	this.checkMapPosForValue = function(pMapPos, pValueName, pValue)
	{
		var tile = _this.getTileWithMapPos(pMapPos);
		if (!tile) return false;
		if (!tile[pValueName]) return tile.genVal[pValueName] == pValue;
		return tile[pValueName] == pValue;
	}
	
	// Set's a particular value on a tile.
	this.setMapPosValue = function(pMapPos, pValueName, pValue)
	{
		var tile = _this.getTileWithMapPos(pMapPos);
		if (!tile) return;
		tile[pValueName] = pValue;
	}
	
	this.getMapPosValue = function(pMapPos, pValueName)
	{
		var tile = _this.getTileWithMapPos(pMapPos);
		if (!tile) return null;
		if (!tile[pValueName]) return tile.genVal[pValueName];
		return tile[pValueName];
	}
	
	// Check if a mapRect is entirely on the map.
	this.checkMapRect = function(pMapRect)
	{
		var pos = {x:0, y:0};
		var onMap = true;
		// Loop through each tile in the rectangle.
		for (pos.x = pMapRect.l; pos.x < pMapRect.l + pMapRect.w; pos.x++)
		{
			for (pos.y = pMapRect.t; pos.y < pMapRect.t + pMapRect.h; pos.y++)
			{
				// If this part of the rectangle is outside of the map, break out so we can return.
				if (!_this.checkMapPos(pos))
				{
					onMap = false;
					break;
				}
			}
		}
		return onMap;
	}
	
	// Set the values of the tiles contained in a mapRect.
	this.setMapRectValue = function(pMapRect, pValueName, pValue, pFilled)
	{
		var pos = {x:0, y:0};
		// Loop through each tile in the rectangle.
		for (pos.x = pMapRect.l; pos.x < pMapRect.l + pMapRect.w; pos.x++)
		{
			for (pos.y = pMapRect.t; pos.y < pMapRect.t + pMapRect.h; pos.y++)
			{
				// If this part of the rectangle is outside of the map, just skip it.
				if (!_this.checkMapPos(pos)) continue;
				// If pFilled is false, skip tiles that aren't along the edges.
				if (!pFilled)
				{
					if (pos.x > pMapRect.l && pos.x < pMapRect.l + pMapRect.w - 1 &&
						pos.y > pMapRect.t && pos.y < pMapRect.t + pMapRect.h - 1) continue;
				}
				// Otherwise, set the tile's variable.
				_this.setMapPosValue(pos, pValueName, pValue);
			}
		}
	}
	
	// Check if any tile in an area of a rectangle (of mapPos) has a particular value.
	this.checkMapRectForValue = function(pRect, pValueName, pValue)
	{
		var pos = {x:0, y:0};
		var hasValue = false;
		// Loop through each tile in the rectangle.
		for (pos.x = pRect.l; pos.x < pRect.l + pRect.w; pos.x++)
		{
			for (pos.y = pRect.t; pos.y < pRect.t + pRect.h; pos.y++)
			{
				// If this part of the rectangle is outside of the map, just skip it.
				if (!_this.checkMapPos(pos))
				{
					continue;
				}
				// Otherwise, if this tile has the value, break out.
				if (_this.checkMapPosForValue(pos, pValueName, pValue))
				{
					hasValue = true;
					break;
				}
			}
		}
		return hasValue;
	}
	
	// Checks a worldRect for a particular value.
	this.checkWorldRectForValue = function(pWorldRect, pValueName, pValue)
	{
		return _this.checkMapRectForValue(_this.convertWorldRectToMapRect(pWorldRect), pValueName, pValue);
	}
	
	// Converts a rectangle from world pos to map pos.
	this.convertWorldRectToMapRect = function(pWorldRect)
	{
		var topLeft = _this.convertWorldPosToMapPos({x:pWorldRect.l, y:pWorldRect.t});
		var bottomRight = _this.convertWorldPosToMapPos({x:pWorldRect.l + pWorldRect.w, y:pWorldRect.t + pWorldRect.h});
		return { l: Math.floor(topLeft.x), t: Math.floor(topLeft.y), w: Math.ceil(bottomRight.x) - Math.floor(topLeft.x), h: Math.ceil(bottomRight.y) - Math.floor(topLeft.y)};
	}//*/
	
	// Returns the total number of tiles that should be in the map.
	this.getTileCount = function()
	{
		return mapSize.x * mapSize.y;
	}
	
	// Returns the dimensions of the map.
	this.getMapDimensions = function()
	{
		return {x:mapSize.x, y:mapSize.y};
	}
	
	// Checks to see if a unit is present at the given location.
	this.checkMapPosForEntity = function(pMapPos, pType, pCaller)
	{
		if (!_this.checkMapPos(pMapPos)) return false;
		var pos = {x:Math.floor(pMapPos.x), y:Math.floor(pMapPos.y)};
		function unitAtPosCustomLoop(pObj)
		{
			if (!pObj.active) return true;
			if (pObj.module == null) return true;
			if (pObj.module.type != pType) return true;
			if (pCaller != null && pObj.getIndex() == pCaller.getIndex()) return true;
			return !vector2Equals(pObj.module.position, pos);
		}
		
		return !thisObject.handler.customBooleanLoop(unitAtPosCustomLoop);
	}
	
	// Generates a dungeon within the map using the given parameters.
	this.generateDungeon = function(pSizeX, pSizeY, pTileSet, pTileSizeX, pTileSizeY, pRoomCount, pMinRoomSize, pMaxRoomSize, pTryCount, pEngine)
	{
		_this.setUpMap(pSizeX, pSizeY, pTileSet, pTileSizeX, pTileSizeY, pEngine);
		roomsList.length = 0;
		var i = 0;
		// First, set up tiles array (ensure that everything starts as dirt).
		for (; i < tiles.length; i++)
		{
			tiles[i].type = 1;
			tiles[i].genVal = tileMapConstants.genValDirt;
		}
		
		// Next, generate rooms.
		var roomSizeDiff = vector2Difference(pMaxRoomSize, pMinRoomSize);
		for (i = 0; i < pRoomCount; i++)
		{
			var room = {l:0, t:0, w:0, h:0};
			var j = 0;
			// Attempt to make place a room a set number of times.
			for (; j < pTryCount; j++)
			{
				// Pick a random room size.
				room.w = pMinRoomSize.x + Math.floor(random.next() * (roomSizeDiff.x));
				room.h = pMinRoomSize.y + Math.floor(random.next() * (roomSizeDiff.y));
				// Pick a random place in the map to place said room.
				room.l = 1 + Math.floor(random.next() * (mapSize.x - 2 - room.w));
				room.t = 1 + Math.floor(random.next() * (mapSize.y - 2 - room.h));
				// Check that the room is fully on the map. If not, skip this try.
				if (!_this.checkMapRect(room)) continue;
				// Otherwise, check to see if this room is colliding with any other room.
				if (_this.checkMapRectForValue(room, "genVal", tileMapConstants.genValFloor)) continue;
				// Finally, actually place down the room.
				_this.setMapRectValue(room, "genVal", tileMapConstants.genValFloor, true);
				_this.setMapRectValue(room, "genVal", tileMapConstants.genValStone, false);
				_this.setMapRectValue(room, "type", 0, true);
				roomsList.push(room);
				break;
			}
			// If we've tried to place the room the number of times with no success, break out now.
			if (j == pTryCount) break;
		}
		
		// Generate tunnels.
		// Loop through each room and link each one to the next.
		for (i = 0; i < roomsList.length - 1; i++)
		{
			var room1 = roomsList[i];
			var room2 = roomsList[i + 1];
			// Calculate the center of this room and the next.
			var roomCenter1 = {x:Math.round(room1.l + room1.w / 2), y:Math.round(room1.t + room1.h / 2)};
			var roomCenter2 = {x:Math.round(room2.l + room2.w / 2), y:Math.round(room2.t + room2.h / 2)};
			
			var path = _this.generatePath(roomCenter1, roomCenter2, -1, _this.genValCostRule, null);
			// Loop through the path and make each tile a floor tile.
			var j = 0;
			for (; j < path.length; j++)
			{
				_this.setMapPosValue(path[j].position, "genVal", tileMapConstants.genValFloor);
				_this.setMapPosValue(path[j].position, "type", 0);
			}
		}
		
		// Generate spawn point.
		// Pick a random room, then pick a random location in that room and set it as the spawn location.
		var randomRoom = roomsList[Math.round(random.next() * (roomsList.length - 1))];
		_this.spawnLocation.x = randomRoom.l + Math.floor(random.next() * randomRoom.w);
		_this.spawnLocation.y = randomRoom.t + Math.floor(random.next() * randomRoom.h);
		
		// Generate exit point.
		// Fill out the tiles with their distances to the spawn location.
		_this.generatePath(_this.spawnLocation, null, -1, null, [_this.definedRuleSkipType1]);
		// Find the tile with longest distance and make that the exit location.
		var farthestTile = tiles[0];
		for (i = 0; i < mapSize.x; i++)
		{
			for (var j = 0; j < mapSize.y; j++)
			{
				if (_this.getMapPosValue({x:i, y:j}, "distance") > farthestTile.distance)
				{
					farthestTile = _this.getTileWithMapPos({x:i, y:j});
					_this.exitLocation.x = i; _this.exitLocation.y = j;
				}
			}
		}
		farthestTile.type = 2;
		
	}
	
	// Method called to create defined entities in the dungeon (e.g. enemies, items, etc.). Returns an array of references to those entities.
	this.generateEntities = function(pEntityCount, pEntityType, pMinDistance, pTryCount)
	{
		if (roomsList.length <= 0) return null;
		var results = new Array();
		// Loop through, creating each entity.
		for (var i = 0; i < pEntityCount; i++)
		{
			for (var j = 0; j < pTryCount; j++)
			{
				// Pick a random room.
				var randomRoom = roomsList[Math.round(random.next() * (roomsList.length - 1))];
				// Pick a random location in that room.
				var randomPos = {x: randomRoom.l + Math.floor(random.next() * randomRoom.w), y: randomRoom.t + Math.floor(random.next() * randomRoom.h)};
				// If the location is the spawn location, try again.
				if (vector2Equals(_this.spawnLocation, randomPos)) continue;
				// If the location is too near the spawn location, try again.
				if (_this.getMapPosValue(randomPos, "distance") < pMinDistance) continue;
				// If the location is already taken by an entity of the same type, try again.
				if (_this.checkMapPosForEntity(randomPos, pEntityType, null)) continue;
				// Place the entity there and add it to the results array.
				var entity = thisObject.handler.create(pEntityType, randomPos);
				entity.module.setUpUnit(randomPos, thisObject, canvasApp);
				break;
			}
		}
		return results;
	}
	
	this.clearDistances = function()
	{
		for (var i = 0; i < tiles.length; i++)
		{
			tiles[i].distance = -1;
		}
	}
	
	this.openList = new Array();
	this.closedList = new Array();
	// Finds a path from startPos to endPos.
	// If no end pos is defined, simply goes everywhere (useful for populating ranges).
	// If max length is -1, the maximum path length to search is infinite. Otherwise, if the path starts to exceed the max length, returns null.
	// pCostRule can be filled with a function that takes the current tile's position and returns its own cost.
	// pDefinedRules is an array of functions that take the current tile's position and if it returns false, the tile cannot be traversed.
	// If a path cannot be found to reach the destination, returns null.
	this.generatePath = function(pStartPos, pEndPos, pMaxLength, pCostRule, pDefinedRules)
	{
		// Closure to represent nodes in the lists.
		function listNode(pPosition, pParent, pF, pG, pH)
		{
			this.position = pPosition;
			this.parent = pParent;
			this.F = pF;
			this.G = pG;
			this.H = pH;
		}
		
		// If the start postion is invalid, return immediately.
		if (!_this.checkMapPos(pStartPos)) return null;
		
		// Set up.
		_this.openList.length = 0;
		_this.closedList.length = 0;
		var reachedTarget = false;
		
		// Add the starting position to the open list.
		_this.openList.push(new listNode(pStartPos, {x:-1, y:-1}, 0,0,0));
		
		// Loop through the open list as long as there are still nodes present.
		while (_this.openList.length > 0)
		{
			// Retrieve the node in the open list with the lowest F value.
			var currentNodeIndex = 0;
			for (var i = 1; i < _this.openList.length; i++)
			{
				if (_this.openList[i].F < _this.openList[currentNodeIndex].F)
					currentNodeIndex = i;
			}
			var currentNode = _this.openList[currentNodeIndex];
			// If the retrieved node's G value exceeds the maximum range (and the maximum range > 0), then drop out of the loop now.
			if (pMaxLength > 0 && currentNode.G > pMaxLength)
			{
				break;
			}
			// Add each of the adjacent valid tiles to the open list.
			for (var i = 0; i < 4; i++)
			{
				var p, f,g,h, j;
				// Get the new node's position.
				switch (i)
				{
					case 0:
						p = _this.tileRight(currentNode.position);
						break;
					case 1:
						p = _this.tileUp(currentNode.position);
						break;
					case 2:
						p = _this.tileLeft(currentNode.position);
						break;
					case 3:
						p = _this.tileDown(currentNode.position);
						break;
				}
				// Check that the position is valid.
				if (!_this.checkMapPos(p)) continue;
				// Check that the position doesn't break any defined rules.
				if (pDefinedRules != null)
				{
					for (j = 0; j < pDefinedRules.length; j++)
					{
						// If a defined rule returns false, skip this position.
						if (!pDefinedRules[j](p))
						{
							break;
						}
					}
					if (j < pDefinedRules.length) continue;
				}
				// If the node is already in the closed list, skip it.
				for (j = 0; j < _this.closedList.length; j++)
				{
					if (vector2Equals(p, _this.closedList[j].position)) break;
				}
				if (j < _this.closedList.length) continue;
				// Calculate the node's fitness scores.
				// Cost to travel here.
				if (pCostRule == null)
					g = currentNode.G + 1;
				else
					g = currentNode.G + pCostRule(p);
				// Heuristic (distance to destination)
				// If there is no destination, set it to 0.
				if (!_this.checkMapPos(pEndPos)) h = 0;
				// Otherwise, set it to the distance to the destination.
				else h = vector2Length(vector2Difference(p, pEndPos));
				// Fitness score.
				f = g + h;
				// If the node is already in the open list, compare its fitness with one already present, keeping the one that's better. Then skip to the next one.
				for (j = 0; j < _this.openList.length; j++)
				{
					if (vector2Equals(p, _this.openList[j].position)) break;
				}
				if (j < _this.openList.length)
				{
					if (_this.openList[j].F > f)
					{
						_this.openList[j].G = g;
						_this.openList[j].H = h;
						_this.openList[j].parent.x = currentNode.position.x;
						_this.openList[j].parent.y = currentNode.position.y;
					}
					continue;
				}
				// Otherwise, just add the node.
				_this.openList.push(new listNode(p, vector2Clone(currentNode.position), f,g,h));
			}
			// Add the current node to the closed list.
			_this.closedList.push(currentNode);
			// And remove it from the open list.
			_this.openList.splice(currentNodeIndex, 1);
			// If the destination is valid and we've reached it, break out of the loop.
			if (_this.checkMapPos(pEndPos) && vector2Equals(pEndPos, currentNode.position))
			{
				reachedTarget = true;
				break;
			}
		}
		// Run through the closed list and step back through it to create a path.
		if (_this.closedList.length > 0)
		{
			// If we didn't reach the target, return null.
			if (!reachedTarget)
			{
				// If we didn't have a destination to begin with, we should mark out the distance to each tile from this position.
				if (!_this.checkMapPos(pEndPos))
				{
					while (_this.closedList.length > 0)
					{
						_this.setMapPosValue(_this.closedList[0].position, "distance", _this.closedList[0].G);
						_this.closedList.shift();
					}
				}
				
				return null;
			}
			// Otherwise, trace back from the last entry and copy out the path.
			var path = new Array();
			var i = _this.closedList.length - 1;
			while (i >= 0)
			{
				// Add the node to the path.
				path.push(_this.closedList[i]);
				// If we just added the starting position to the path, then we can stop now.
				if (i == 0) break;
				// Follow the parent value to the next node.
				var j = 0;
				for (j = i; j >= 0; j--)
				{
					if (vector2Equals(_this.closedList[j].position, _this.closedList[i].parent))
					{
						i = j;
						break;
					}
				}
				// Just in case we somehow are unable to find the next parent node, break out.
				if (j < 0) break;
			}
			// Return the resulting path.
			return path;
		}
		// If we somehow didn't get a path at all, just return null.
		return null;
	}
}