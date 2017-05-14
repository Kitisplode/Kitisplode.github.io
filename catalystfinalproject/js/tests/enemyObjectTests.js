// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: enemyObjectTests.js
// Desc: Contains the tests for the game object
// Author: mjensen
// Created: August 03, 2015
//
//**************************************************************************************************

QUnit.test("enemyObject setup test", function(assert)
{
	var mockEngine = {};
	
	var goh = new GameObjectHandler();
	goh.addType("enemy", ModuleEnemy);
	goh.addType("tileMap", ModuleTileMap);
	
	var tilemap = goh.create("tileMap", {x:0, y:0});
	tilemap.module.setUpMap(3, 3, 1, 10, 10, mockEngine);
	
	var go = goh.create("enemy", {x:0, y:0});
	go.module.setUpUnit({x:0, y:0}, tilemap, mockEngine);
	
	assert.ok(vector2Equals(go.module.position, {x:0, y:0}), "enemy1's module position is correct");
	assert.ok(vector2Equals(go.position, {x:0, y:0}), "enemy1's position is correct");
	
	go = goh.create("enemy", {x:0, y:0});
	go.module.setUpUnit({x:2, y:2}, tilemap, mockEngine);
	
	assert.ok(vector2Equals(go.module.position, {x:2, y:2}), "enemy2's module position is correct");
	assert.ok(vector2Equals(go.position, {x:20, y:20}), "enemy2's position is correct");
});

QUnit.test("enemyObject update test, player's turn", function(assert)
{
	var mockEngine = {};
	mockEngine.turnPhase = GamePlayConstants.phasePlayer;
	
	var goh = new GameObjectHandler();
	goh.addType("enemy", ModuleEnemy);
	goh.addType("tileMap", ModuleTileMap);
	
	var tilemap = goh.create("tileMap", {x:0, y:0});
	tilemap.module.setUpMap(3, 3, 1, 10, 10, mockEngine);
	
	var go = goh.create("enemy", {x:0, y:0});
	go.module.setUpUnit({x:0, y:0}, tilemap, mockEngine);
	
	go.update();
	assert.ok(go.module.moving == false, "enemy not moving");
});

QUnit.test("enemyObject update test, enemy's turn, no player present", function(assert)
{
	var mockEngine = {};
	mockEngine.turnPhase = GamePlayConstants.phaseEnemy;
	
	var goh = new GameObjectHandler();
	goh.addType("enemy", ModuleEnemy);
	goh.addType("tileMap", ModuleTileMap);
	
	var tilemap = goh.create("tileMap", {x:0, y:0});
	tilemap.module.setUpMap(3, 3, 1, 10, 10, mockEngine);
	
	var go = goh.create("enemy", {x:0, y:0});
	go.module.setUpUnit({x:0, y:0}, tilemap, mockEngine);
	
	go.update();
	assert.ok(go.module.moving == false, "enemy not moving");
});

QUnit.test("enemyObject update test, enemy's turn, player present", function(assert)
{
	var mockEngine = {};
	mockEngine.turnPhase = GamePlayConstants.phaseEnemy;
	
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	goh.addType("enemy", ModuleEnemy);
	goh.addType("tileMap", ModuleTileMap);
	
	var tilemap = goh.create("tileMap", {x:0, y:0});
	tilemap.module.setUpMap(3, 3, 1, 10, 10, mockEngine);
	
	mockEngine.playerObj = goh.create("player", {x:0, y:0});
	mockEngine.playerObj.module.setUpUnit({x:2, y:1}, tilemap, mockEngine);
	
	var go = goh.create("enemy", {x:0, y:0});
	go.module.setUpUnit({x:0, y:0}, tilemap, mockEngine);
	
	go.update();
	assert.ok(go.module.moving == true, "enemy will be moving");
	assert.ok(vector2Equals(go.module.moveTarget, mockEngine.playerObj.module.position), "enemy's target is player's location");
	
	mockEngine.turnPhase = GamePlayConstants.phaseAction;
	
	go.update();
	assert.ok(vector2Equals(go.module.position, {x:0, y:0}), "enemy spends first frame getting rid of first path spot");
	
	go.update();
	assert.ok(vector2Equals(go.module.position, {x:1, y:0}), "enemy now moving towards next tile");
	assert.ok(go.velocity.x == 0, "enemy hasn't really started moving just yet");
	
	go.update();
	assert.ok(go.velocity.x > 0, "enemy now actually moving");
	go.update();
	go.update();
	assert.ok(vector2Equals(go.velocity, {x:0, y:0}), "enemy has stopped moving");
	
	go.update();
	assert.ok(go.module.moving == false, "enemy has finished move order");
	
	go.update();
	assert.ok(go.module.hasOrders == false, "enemy no longer has any orders");
	
});

QUnit.test("enemyObject draw test", function(assert)
{
	var mockEngine = {};
	mockEngine.screenSize = {x:320, y:240};
	mockEngine.renderer = mock(Renderer);
	mockEngine.imageLoader = mock(ImageLoader);
	mockEngine.inputMouse = mock(InputMouse);
	mockEngine.soundPlayer = mock(SoundPlayer);
	
	when(mockEngine.inputMouse).getPosition().thenReturn({x:-1, y:-1});
	when(mockEngine.inputMouse).isPressed().thenReturn(false);
	mockEngine.renderer.cameraPosition = {x:0, y:0};
	
	var sheet = new SpriteSheet("spr_neox", null, 8, {x:64, y:64}, {x:32, y:32});
	when(mockEngine.imageLoader).getSheetWithID(anything()).thenReturn(sheet);
	when(mockEngine.imageLoader).getSheetID("spr_enemy_orange_walk_e.png").thenReturn(0);
	when(mockEngine.imageLoader).getSheetID("spr_enemy_orange_walk_n.png").thenReturn(1);
	when(mockEngine.imageLoader).getSheetID("spr_enemy_orange_walk_w.png").thenReturn(2);
	when(mockEngine.imageLoader).getSheetID("spr_enemy_orange_walk_s.png").thenReturn(3);
	when(mockEngine.imageLoader).getSheetID("spr_enemy_orange_idle.png").thenReturn(4);
	
	var goh = new GameObjectHandler();
	goh.addType("enemy", ModuleEnemy);
	goh.addType("tileMap", ModuleTileMap);
	
	var tilemap = goh.create("tileMap", {x:0, y:0});
	tilemap.module.setUpMap(3, 3, 1, 10, 10, mockEngine);
	tilemap.module.setMapPosValue({x:0, y:0}, "type", 2);
	
	var go = goh.create("enemy", {x:0, y:0});
	go.module.setUpUnit({x:0, y:0}, tilemap, mockEngine);
	
	go.velocity.x = 1;
	go.velocity.y = 0;
	go.draw(false, mockEngine.imageLoader, mockEngine.renderer, false);
	assert.ok(go.spriteIndex == 0, "enemy sprite correctly updated");
	
	go.velocity.x = 0;
	go.velocity.y = -1;
	go.draw(false, mockEngine.imageLoader, mockEngine.renderer, false);
	assert.ok(go.spriteIndex == 1, "enemy sprite correctly updated");
	
	go.velocity.x = -1;
	go.velocity.y = 0;
	go.draw(false, mockEngine.imageLoader, mockEngine.renderer, false);
	assert.ok(go.spriteIndex == 2, "enemy sprite correctly updated");
	
	go.velocity.x = 0;
	go.velocity.y = 1;
	go.draw(false, mockEngine.imageLoader, mockEngine.renderer, false);
	assert.ok(go.spriteIndex == 3, "enemy sprite correctly updated");
	
	go.velocity.x = 0;
	go.velocity.y = 0;
	go.draw(false, mockEngine.imageLoader, mockEngine.renderer, false);
	assert.ok(go.spriteIndex == 4, "enemy sprite correctly updated");
});