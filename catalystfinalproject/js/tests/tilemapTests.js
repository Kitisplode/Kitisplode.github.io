// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: tilemapTests.js
// Desc: Contains the tests for the tilemap object module
// Author: mjensen
// Created: July 27, 2015
//
//**************************************************************************************************

QUnit.test("tile map convert world pos to map pos", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("tileMap", ModuleTileMap);
	
	var go = goh.create("tileMap", {x:0, y:0});
	go.module.setUpMap(3, 3, 1, 10, 10, null);
	
	var worldPos = {x:0, y:0};
	var mapPos = go.module.convertWorldPosToMapPos(worldPos);
	mapPos.x = Math.floor(mapPos.x);
	mapPos.y = Math.floor(mapPos.y);
	assert.ok(vector2Equals(mapPos, {x:0, y:0}), "worldPos1 is 0,0");
	
	worldPos = {x:10, y:10};
	mapPos = go.module.convertWorldPosToMapPos(worldPos);
	mapPos.x = Math.floor(mapPos.x);
	mapPos.y = Math.floor(mapPos.y);
	assert.ok(vector2Equals(mapPos, {x:1, y:1}), "worldPos2 is 1,1");
	
	worldPos = {x:15, y:15};
	mapPos = go.module.convertWorldPosToMapPos(worldPos);
	mapPos.x = Math.floor(mapPos.x);
	mapPos.y = Math.floor(mapPos.y);
	assert.ok(vector2Equals(mapPos, {x:2, y:2}), "worldPos3 is 2,2");
});

QUnit.test("tile map convert map pos to world pos", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("tileMap", ModuleTileMap);
	
	var go = goh.create("tileMap", {x:0, y:0});
	go.module.setUpMap(3, 3, 1, 10, 10, null);
	
	var mapPos = {x:0, y:0};
	var worldPos = go.module.convertMapPosToWorldPos(mapPos);
	assert.ok(vector2Equals(worldPos, {x:0, y:0}), "mapPos1 is 0,0");
	
	mapPos = {x:1, y:1};
	worldPos = go.module.convertMapPosToWorldPos(mapPos);
	assert.ok(vector2Equals(worldPos, {x:10, y:10}), "mapPos2 is 10,10");
	
	mapPos = {x:45, y:-8};
	worldPos = go.module.convertMapPosToWorldPos(mapPos);
	assert.ok(vector2Equals(worldPos, {x:450, y:-80}), "mapPos3 is 450,-80");
});

QUnit.test("tile map set up map check, positive", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("tileMap", ModuleTileMap);
	
	var go = goh.create("tileMap", {x:0, y:0});
	go.module.setUpMap(3, 3, 1, 36, 20, null);
	
	assert.ok(go.module.getTileCount() == 9, "tilemap size correctly set up");
	assert.ok(vector2Equals(go.module.getMapDimensions(), {x:3, y:3}), "map dimensions are correct");
});

QUnit.test("tile map convert world pos to map pos when world pos is on map", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("tileMap", ModuleTileMap);
	
	var go = goh.create("tileMap", {x:0, y:0});
	go.module.setUpMap(3, 3, 1, 36, 20, null);
	
	var pos = go.module.convertWorldPosToMapPos({x: 2, y: 2});
	assert.ok(Math.floor(pos.x) == 0 && Math.floor(pos.y) == 0, "position successfully converted");
});

QUnit.test("tile map convert world pos to map pos when world pos is not on map", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("tileMap", ModuleTileMap);
	
	var go = goh.create("tileMap", {x:0, y:0});
	go.module.setUpMap(3, 3, 1, 36, 20, null);
	
	var pos = go.module.convertWorldPosToMapPos({x: -120, y: -120});
	assert.ok(Math.floor(pos.x) == -1 && Math.floor(pos.y) == -1, "position successfully converted, not on map");
});

QUnit.test("tile map convert map pos to map index", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("tileMap", ModuleTileMap);
	
	var go = goh.create("tileMap", {x:0, y:0});
	go.module.setUpMap(3, 3, 1, 36, 20, null);
	
	var pos = go.module.convertMapPosToMapIndex({x: 0, y: 0});
	assert.ok(pos == 0, "first position successfully converted to index");
	
	pos = go.module.convertMapPosToMapIndex({x: 1, y: 0});
	assert.ok(pos == 1, "second position successfully converted to index");
	
	pos = go.module.convertMapPosToMapIndex({x: 0, y: 1});
	assert.ok(pos == 3, "third position successfully converted to index");
	
	pos = go.module.convertMapPosToMapIndex({x: 1, y: 1});
	assert.ok(pos == 4, "fourth position successfully converted to index");
});

QUnit.test("tile map relative mapPos navigators work", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("tileMap", ModuleTileMap);
	
	var go = goh.create("tileMap", {x:0, y:0});
	go.module.setUpMap(3, 3, 1, 36, 20, null);
	
	var startPos = {x:1, y:1};
	
	var pos = go.module.tileRight(startPos);
	assert.ok(pos.x == 2 && pos.y == 1, "tileRight successfully navigated right");
	
	pos = go.module.tileUp(startPos);
	assert.ok(pos.x == 1 && pos.y == 0, "tileUp successfully navigated up");
	
	pos = go.module.tileLeft(startPos);
	assert.ok(pos.x == 0 && pos.y == 1, "tileLeft successfully navigated left");
	
	pos = go.module.tileDown(startPos);
	assert.ok(pos.x == 1 && pos.y == 2, "tileDown successfully navigated down");
});

QUnit.test("tilemap drawing attempted to draw itself", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("tileMap", ModuleTileMap);
	
	var loader = mock(ImageLoader);
	var renderer = mock(Renderer);
	
	var go = goh.create("tileMap", {x:0, y:0});
	go.module.setUpMap(3, 3, 1, 36, 20, null);
	
	go.module.draw(loader, renderer);
	assert.ok(!go.defaultDraw, "tilemap drawing turned off object defaultDraw");
	verify(renderer, times(18)).addSpriteToQueue(anything(), anything(), anything(), anything(), anything(), anything());
});

QUnit.test("tilemap check if adjacent", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("tileMap", ModuleTileMap);
	var go = goh.create("tileMap", {x:0, y:0});
	go.module.setUpMap(3, 3, 1, 36, 20, null);
	var tilePos = {x:1, y:1};
	assert.ok(go.module.checkTileIfAdjacent(tilePos, {x:2, y:1}, "right tile is adjacent"));
	assert.ok(!go.module.checkTileIfAdjacent(tilePos, {x:2, y:0}, "top right tile is not adjacent"));
	assert.ok(go.module.checkTileIfAdjacent(tilePos, {x:1, y:0}, "top tile is adjacent"));
	assert.ok(!go.module.checkTileIfAdjacent(tilePos, {x:0, y:0}, "top left tile is not adjacent"));
	assert.ok(go.module.checkTileIfAdjacent(tilePos, {x:0, y:1}, "left tile is adjacent"));
	assert.ok(!go.module.checkTileIfAdjacent(tilePos, {x:0, y:2}, "bottom left tile is not adjacent"));
	assert.ok(go.module.checkTileIfAdjacent(tilePos, {x:1, y:2}, "bottom tile is adjacent"));
	assert.ok(!go.module.checkTileIfAdjacent(tilePos, {x:2, y:2}, "bottom right tile is not adjacent"));
	assert.ok(!go.module.checkTileIfAdjacent(tilePos, tilePos, "tile is not adjacent with itself"));
	assert.ok(!go.module.checkTileIfAdjacent(tilePos, {x:3, y:3}, "tile is not adjacent with far tile"));
});

QUnit.test("tilemap convert world rect to map rect", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("tileMap", ModuleTileMap);
	var go = goh.create("tileMap", {x:0, y:0});
	go.module.setUpMap(3, 3, 1, 10, 10, null);
	var worldRect = {l:-5, t:-5, w:10, h:10};
	var mapRect = go.module.convertWorldRectToMapRect(worldRect);
	assert.ok(mapRect.l == 0 && mapRect.t == 0 && mapRect.w == 1 && mapRect.h == 1, "maprect1 has correct values");
	
	worldRect = {l:0, t:0, w:10, h:10};
	mapRect = go.module.convertWorldRectToMapRect(worldRect);
	assert.ok(mapRect.l == 0 && mapRect.t == 0 && mapRect.w == 2 && mapRect.h == 2, "maprect2 has correct values");
	
	worldRect = {l:0, t:0, w:5, h:5};
	mapRect = go.module.convertWorldRectToMapRect(worldRect);
	assert.ok(mapRect.l == 0 && mapRect.t == 0 && mapRect.w == 1 && mapRect.h == 1, "maprect3 has correct values");
	
	worldRect = {l:0, t:0, w:15, h:15};
	mapRect = go.module.convertWorldRectToMapRect(worldRect);
	assert.ok(mapRect.l == 0 && mapRect.t == 0 && mapRect.w == 2 && mapRect.h == 2, "maprect4 has correct values");
	
	worldRect = {l:0, t:0, w:20, h:20};
	mapRect = go.module.convertWorldRectToMapRect(worldRect);
	assert.ok(mapRect.l == 0 && mapRect.t == 0 && mapRect.w == 3 && mapRect.h == 3, "maprect5 has correct values");
	
	worldRect = {l:-10, t:-10, w:20, h:20};
	mapRect = go.module.convertWorldRectToMapRect(worldRect);
	assert.ok(mapRect.l == -1 && mapRect.t == -1 && mapRect.w == 3 && mapRect.h == 3, "maprect6 has correct values");
});

QUnit.test("tilemap check area for value", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("tileMap", ModuleTileMap);
	var go = goh.create("tileMap", {x:0, y:0});
	go.module.setUpMap(3, 3, 1, 10, 10, null);
	go.module.setMapPosValue({x:1, y:1}, "type", 1);
	
	assert.ok(go.module.checkMapPosForValue({x:1, y:1}, "type", 1) == true, "central pillar successfully placed");
	
	var worldRect = {l:-5, t:-5, w:10, h:10};
	var mapRect = go.module.convertWorldRectToMapRect(worldRect);
	assert.ok(go.module.checkMapRectForValue(mapRect, "type", 1) == false, "maprect1 does not collide with central pillar");
	
	worldRect = {l:0, t:0, w:10, h:10};
	mapRect = go.module.convertWorldRectToMapRect(worldRect);
	assert.ok(go.module.checkMapRectForValue(mapRect, "type", 1) == true, "maprect2 does collide with central pillar");
	
	worldRect = {l:0, t:0, w:10, h:10};
	assert.ok(go.module.checkWorldRectForValue(worldRect, "type", 1) == true, "worldRect from mapRect2 does collide with central pillar");
	
	mapRect = {l:-1, t:-1, w:3, h:3};
	assert.ok(go.module.checkMapRectForValue(mapRect, "type", 1) == true, "maprect3 does collide with central pillar");
	
	worldRect = {l:-10, t:-10, w:30, h:30};
	mapRect = go.module.convertWorldRectToMapRect(worldRect);
	assert.ok(go.module.checkMapRectForValue(mapRect, "type", 1) == true, "worldRect4 does collide with central pillar");
});

QUnit.test("tilemap check mapRect on map", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("tileMap", ModuleTileMap);
	var go = goh.create("tileMap", {x:0, y:0});
	go.module.setUpMap(3, 3, 1, 10, 10, null);
	
	var mapRect = {l:-1, t:-1, w:2, h:2};
	assert.ok(go.module.checkMapRect(mapRect) == false, "mapRect1 is not entirely on map");
	
	mapRect = {l:1, t:1, w:1, h:1};
	assert.ok(go.module.checkMapRect(mapRect) == true, "mapRect2 is entirely on map");
	
	mapRect = {l:2, t:2, w:2, h:2};
	assert.ok(go.module.checkMapRect(mapRect) == false, "mapRect3 is not entirely on map");
	
	mapRect = {l:0, t:0, w:3, h:3};
	assert.ok(go.module.checkMapRect(mapRect) == true, "mapRect4 is entirely on map");
});

QUnit.test("tilemap setMapRectValue filled", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("tileMap", ModuleTileMap);
	var go = goh.create("tileMap", {x:0, y:0});
	go.module.setUpMap(3, 3, 1, 10, 10, null);
	
	var mapRect = {l:0, t:0, w:3, h:3};
	go.module.setMapRectValue(mapRect, "type", 1, true);
	assert.ok(go.module.checkMapRectForValue(mapRect, "type", 1) == true, "filled rect was successfully placed");
});

QUnit.test("tilemap setMapRectValue unfilled", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("tileMap", ModuleTileMap);
	var go = goh.create("tileMap", {x:0, y:0});
	go.module.setUpMap(3, 3, 1, 10, 10, null);
	
	var mapRect = {l:0, t:0, w:3, h:3};
	go.module.setMapRectValue(mapRect, "type", 1, false);
	assert.ok(go.module.checkMapRectForValue(mapRect, "type", 1) == true, "unfilled rect was successfully placed");
	var mapPos = {x:0, y:0};
	assert.ok(go.module.checkMapPosForValue(mapPos, "type", 1) == true, "top left correctly filled");
	mapPos = {x:1, y:0};
	assert.ok(go.module.checkMapPosForValue(mapPos, "type", 1) == true, "top correctly filled");
	mapPos = {x:2, y:0};
	assert.ok(go.module.checkMapPosForValue(mapPos, "type", 1) == true, "top right correctly filled");
	mapPos = {x:2, y:1};
	assert.ok(go.module.checkMapPosForValue(mapPos, "type", 1) == true, "right correctly filled");
	mapPos = {x:2, y:2};
	assert.ok(go.module.checkMapPosForValue(mapPos, "type", 1) == true, "bottom right correctly filled");
	mapPos = {x:1, y:2};
	assert.ok(go.module.checkMapPosForValue(mapPos, "type", 1) == true, "bottom correctly filled");
	mapPos = {x:0, y:2};
	assert.ok(go.module.checkMapPosForValue(mapPos, "type", 1) == true, "bottom left correctly filled");
	mapPos = {x:0, y:1};
	assert.ok(go.module.checkMapPosForValue(mapPos, "type", 1) == true, "left correctly filled");
	mapPos = {x:1, y:1};
	assert.ok(go.module.checkMapPosForValue(mapPos, "type", 1) == false, "middle correctly unfilled");
});

QUnit.test("tilemap generate path tests", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("tileMap", ModuleTileMap);
	var go = goh.create("tileMap", {x:0, y:0});
	go.module.setUpMap(3, 3, 1, 10, 10, null);
	go.module.setMapPosValue({x:1, y:1}, "type", 1);
	
	var rules =
	[
		function(pos) { return (!go.module.checkMapPosForValue(pos, "type", 1)); }
	];
	
	var path = go.module.generatePath({x:0, y:0}, {x:2, y:1}, -1, null, rules);
	assert.ok(path.length == 4, "path1 is expected length");
	
	go.module.setMapPosValue({x:1, y:0}, "genVal", tileMapConstants.genValStone);
	go.module.setMapPosValue({x:2, y:0}, "genVal", tileMapConstants.genValStone);
	function costRule(pos)
	{
		return go.module.getMapPosValue(pos, "cost");
	}
	
	path = go.module.generatePath({x:0, y:0}, {x:2, y:1}, -1, costRule, rules);
	assert.ok(path.length == 6, "path1 (with costRule) is expected length");
	
	path = go.module.generatePath({x:0, y:0}, {x:2, y:1}, 2, null, rules);
	assert.ok(path == null, "max range is too short for path2");
	
	go.module.setMapPosValue({x:0, y:1}, "type", 1);
	path = go.module.generatePath({x:0, y:0}, {x:0, y:2}, -1, null, rules);
	assert.ok(path.length == 7, "path3 is expected length");
	
	go.module.setMapPosValue({x:1, y:2}, "type", 1);
	path = go.module.generatePath({x:0, y:0}, {x:0, y:2}, -1, null, rules);
	assert.ok(path == null, "path4 destination can't be reached");
});

QUnit.test("tilemap generate dungeon always solvable", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("tileMap", ModuleTileMap);
	var go = goh.create("tileMap", {x:0, y:0});
	
	var testCount = 1;
	var rules =
	[
		function(pos) { return (!go.module.checkMapPosForValue(pos, "type", 1)); }
	];
	
	for (var i = 0; i < testCount; i++)
	{
		go.module.generateDungeon(32, 32, 1, 36, 20, 
								16, {x:5, y:5}, {x:5, y:5}, 5, 2, null);
		
		var path = go.module.generatePath(go.module.spawnLocation, go.module.exitLocation, -1, null, rules);
		assert.ok(path != null, "path exists");
	}
});