// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: generatorHeavyTest.js
// Desc: Simply tests the dungeon generator a whole lotta times to ensure its mazes are always solvable.
// Author: mjensen
// Created: July 29, 2015
//
//**************************************************************************************************

QUnit.test("tilemap generate dungeon always solvable", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("tileMap", ModuleTileMap);
	var go = goh.create("tileMap", {x:0, y:0});
	
	var testCount = 1000;
	var rules =
	[
		function(pos) { return (!go.module.checkMapPosForValue(pos, "type", 1)); }
	];
	
	for (var i = 0; i < testCount; i++)
	{
		go.module.generateDungeon(32, 32, 1, 36, 20, 
								16, {x:5, y:5}, {x:5, y:5}, 5, 2);
		
		var path = go.module.generatePath(go.module.spawnLocation, go.module.exitLocation, -1, null, rules);
		assert.ok(path != null, "path exists");
	}
});