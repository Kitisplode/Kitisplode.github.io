// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: playerObjectTests.js
// Desc: Contains the tests for the game object
// Author: mjensen
// Created: July 30, 2015
//
//**************************************************************************************************

QUnit.test("playerObject setup test", function(assert)
{
	var mockEngine = {};
	
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	goh.addType("tileMap", ModuleTileMap);
	
	var tilemap = goh.create("tileMap", {x:0, y:0});
	tilemap.module.setUpMap(3, 3, 1, 10, 10, mockEngine);
	
	var go = goh.create("player", {x:0, y:0});
	go.module.setUpUnit({x:0, y:0}, tilemap, mockEngine);
	
	assert.ok(vector2Equals(go.module.position, {x:0, y:0}), "player1's module position is correct");
	assert.ok(vector2Equals(go.position, {x:0, y:0}), "player1's position is correct");
	
	go = goh.create("player", {x:0, y:0});
	go.module.setUpUnit({x:2, y:2}, tilemap, mockEngine);
	
	assert.ok(vector2Equals(go.module.position, {x:2, y:2}), "player2's module position is correct");
	assert.ok(vector2Equals(go.position, {x:20, y:20}), "player2's position is correct");
});

QUnit.test("playerObject update test, mouse not pressed", function(assert)
{
	var mockEngine = {};
	mockEngine.turnCount = 0;
	mockEngine.renderer = mock(Renderer);
	mockEngine.inputMouse = mock(InputMouse);
	mockEngine.nextGameState = GameEngineConstants.stateGame;
	mockEngine.turnPhase = GamePlayConstants.phasePlayer;
	
	when(mockEngine.inputMouse).getPosition().thenReturn({x:10, y:10});
	when(mockEngine.inputMouse).isPressed().thenReturn(false);
	mockEngine.renderer.cameraPosition = {x:0, y:0};
	
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	goh.addType("tileMap", ModuleTileMap);
	
	var tilemap = goh.create("tileMap", {x:0, y:0});
	tilemap.module.setUpMap(3, 3, 1, 10, 10, mockEngine);
	
	var go = goh.create("player", {x:0, y:0});
	go.module.setUpUnit({x:0, y:0}, tilemap, mockEngine);
	var startPos = {x:go.module.position.x, y:go.module.position.y};
	go.update();
	
	assert.ok(vector2Equals(go.module.position, startPos), "player1 didn't start move");
	assert.ok(go.module.moveTarget.x == -1, "player1 didn't set move target");
	assert.ok(mockEngine.turnCount == 0, "turn count did not increase");
});

QUnit.test("playerObject update test, mouse not onscreen", function(assert)
{
	var mockEngine = {};
	mockEngine.turnCount = 0;
	mockEngine.renderer = mock(Renderer);
	mockEngine.inputMouse = mock(InputMouse);
	mockEngine.nextGameState = GameEngineConstants.stateGame;
	mockEngine.turnPhase = GamePlayConstants.phasePlayer;
	
	when(mockEngine.inputMouse).getPosition().thenReturn({x:-1, y:-1});
	when(mockEngine.inputMouse).isPressed().thenReturn(true);
	mockEngine.renderer.cameraPosition = {x:0, y:0};
	
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	goh.addType("tileMap", ModuleTileMap);
	
	var tilemap = goh.create("tileMap", {x:0, y:0});
	tilemap.module.setUpMap(3, 3, 1, 10, 10, mockEngine);
	
	var go = goh.create("player", {x:0, y:0});
	go.module.setUpUnit({x:0, y:0}, tilemap, mockEngine);
	var startPos = {x:go.module.position.x, y:go.module.position.y};
	go.update();
	
	assert.ok(vector2Equals(go.module.position, startPos), "player1 didn't start move");
	assert.ok(go.module.moveTarget.x == -1, "player1 didn't set move target");
	assert.ok(mockEngine.turnCount == 0, "turn count did not increase");
});

QUnit.test("playerObject update test, mouse pressed", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	goh.addType("tileMap", ModuleTileMap);
	goh.addType("effect", ModuleEffect);
	
	var mockEngine = {};
	mockEngine.turnCount = 0;
	mockEngine.renderer = mock(Renderer);
	mockEngine.inputMouse = mock(InputMouse);
	mockEngine.gameObjectHandler = goh;
	mockEngine.nextGameState = GameEngineConstants.stateGame;
	mockEngine.turnPhase = GamePlayConstants.phasePlayer;
	mockEngine.fullScreen = false;
	mockEngine.soundPlayer = mock(SoundPlayer);
	
	when(mockEngine.inputMouse).getPosition().thenReturn({x:10, y:0});
	when(mockEngine.inputMouse).isDown().thenReturn(true);
	mockEngine.renderer.cameraPosition = {x:0, y:0};
	
	var tilemap = goh.create("tileMap", {x:0, y:0});
	tilemap.module.setUpMap(3, 3, 1, 10, 10, mockEngine);
	
	var go = goh.create("player", {x:0, y:0});
	go.module.setUpUnit({x:0, y:0}, tilemap, mockEngine);
	
	var mousePos = tilemap.module.convertWorldPosToMapPos(mockEngine.inputMouse.getPosition());
	
	go.update();
	assert.ok(vector2Equals(go.module.moveTarget, {x:1, y:0}), "player1 did set move target");
	assert.ok(mockEngine.turnCount == 1, "turn count did increase");
	assert.ok(mockEngine.turnPhase != GamePlayConstants.playerPhase, "phase changed to enemy");
	
	mockEngine.turnPhase = GamePlayConstants.phaseAction;
	
	go.update();
	assert.ok(vector2Equals(go.module.position, {x:1, y:0}), "player position updated");
	
	go.update();
	assert.ok(go.velocity.x > 0, "player1 velocity moving to the right");
	
	go.update();
	go.update();
	assert.ok(go.velocity.x == 0, "player1 stopped moving");
	
	go.update();
	assert.ok(go.module.moving == false, "player1 no longer moving");
});

QUnit.test("playerObject update test, player on exit", function(assert)
{
	var mockEngine = {};
	mockEngine.turnCount = 0;
	mockEngine.renderer = mock(Renderer);
	mockEngine.inputMouse = mock(InputMouse);
	mockEngine.nextGameState = GameEngineConstants.stateGame;
	mockEngine.turnPhase = GamePlayConstants.phasePrePlayer;
	mockEngine.soundPlayer = mock(SoundPlayer);
	
	when(mockEngine.inputMouse).getPosition().thenReturn({x:-1, y:-1});
	when(mockEngine.inputMouse).isPressed().thenReturn(false);
	mockEngine.renderer.cameraPosition = {x:0, y:0};
	
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	goh.addType("tileMap", ModuleTileMap);
	goh.addType("timer", ModuleTimer);
	goh.addType("effect", ModuleEffect);
	
	var tilemap = goh.create("tileMap", {x:0, y:0});
	tilemap.module.setUpMap(3, 3, 1, 10, 10, mockEngine);
	tilemap.module.setMapPosValue({x:0, y:0}, "type", 2);
	
	GamePlayConstants.gameEndTime = 0;
	
	var go = goh.create("player", {x:0, y:0});
	go.module.setUpUnit({x:0, y:0}, tilemap, mockEngine);
	goh.updateAll();
	goh.updateAll();
	
	
	assert.ok(mockEngine.nextGameState == GameEngineConstants.stateEnd, "game won");
});

QUnit.test("playerObject draw test", function(assert)
{
	var mockEngine = new GameEngine(false);
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
	when(mockEngine.imageLoader).getSheetID("spr_player_walk_e.png").thenReturn(0);
	when(mockEngine.imageLoader).getSheetID("spr_player_walk_n.png").thenReturn(1);
	when(mockEngine.imageLoader).getSheetID("spr_player_walk_w.png").thenReturn(2);
	when(mockEngine.imageLoader).getSheetID("spr_player_walk_s.png").thenReturn(3);
	when(mockEngine.imageLoader).getSheetID("spr_player_idle.png").thenReturn(4);
	when(mockEngine.imageLoader).getSheetID("spr_player_win.png").thenReturn(5);
	
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	goh.addType("tileMap", ModuleTileMap);
	goh.addType("effect", ModuleEffect);
	
	var tilemap = goh.create("tileMap", {x:0, y:0});
	tilemap.module.setUpMap(3, 3, 1, 10, 10, mockEngine);
	tilemap.module.setMapPosValue({x:0, y:0}, "type", 2);
	
	var go = goh.create("player", {x:0, y:0});
	go.module.setUpUnit({x:0, y:0}, tilemap, mockEngine);
	
	go.velocity.x = 1;
	go.velocity.y = 0;
	go.draw(false, mockEngine.imageLoader, mockEngine.renderer, false);
	assert.ok(go.spriteIndex == 0, "player sprite correctly updated");
	
	go.velocity.x = 0;
	go.velocity.y = -1;
	go.draw(false, mockEngine.imageLoader, mockEngine.renderer, false);
	assert.ok(go.spriteIndex == 1, "player sprite correctly updated");
	
	go.velocity.x = -1;
	go.velocity.y = 0;
	go.draw(false, mockEngine.imageLoader, mockEngine.renderer, false);
	assert.ok(go.spriteIndex == 2, "player sprite correctly updated");
	
	go.velocity.x = 0;
	go.velocity.y = 1;
	go.draw(false, mockEngine.imageLoader, mockEngine.renderer, false);
	assert.ok(go.spriteIndex == 3, "player sprite correctly updated");
	
	go.velocity.x = 0;
	go.velocity.y = 0;
	go.draw(false, mockEngine.imageLoader, mockEngine.renderer, false);
	assert.ok(go.spriteIndex == 4, "player sprite correctly updated");
	
	mockEngine.turnPhase = GamePlayConstants.phaseEnd;
	mockEngine.won = true;
	go.draw(false, mockEngine.imageLoader, mockEngine.renderer, false);
	assert.ok(go.spriteIndex == 5, "player sprite correctly updated");
});

QUnit.test("playerObject spawnAttack works", function(assert)
{
	var mockEngine = {};
	mockEngine.turnCount = 0;
	mockEngine.renderer = mock(Renderer);
	mockEngine.inputMouse = mock(InputMouse);
	mockEngine.nextGameState = GameEngineConstants.stateGame;
	mockEngine.turnPhase = GamePlayConstants.phasePlayer;
	mockEngine.soundPlayer = mock(SoundPlayer);
	
	when(mockEngine.inputMouse).getPosition().thenReturn({x:-1, y:-1});
	when(mockEngine.inputMouse).isPressed().thenReturn(false);
	mockEngine.renderer.cameraPosition = {x:0, y:0};
	
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	goh.addType("tileMap", ModuleTileMap);
	goh.addType("attack", ModuleAttack);
	
	var tilemap = goh.create("tileMap", {x:0, y:0});
	tilemap.module.setUpMap(3, 3, 1, 10, 10, mockEngine);
	
	var go = goh.create("player", {x:0, y:0});
	go.module.setUpUnit({x:0, y:0}, tilemap, mockEngine);
	var gohCount = goh.countAll();
	
	go.module.spawnAttack({x:1, y:1}, {x:0, y:1});
	assert.ok(goh.countAll() == gohCount + 1, "gohCount successfully incremented");
});

QUnit.test("playerObject spawnAttack attack hits and knocks enemies back", function(assert)
{
	var mockEngine = {};
	mockEngine.turnCount = 0;
	mockEngine.imageLoader = mock(ImageLoader);
	mockEngine.renderer = mock(Renderer);
	mockEngine.inputMouse = mock(InputMouse);
	mockEngine.nextGameState = GameEngineConstants.stateGame;
	mockEngine.turnPhase = GamePlayConstants.phasePlayer;
	mockEngine.soundPlayer = mock(SoundPlayer);
	
	when(mockEngine.inputMouse).getPosition().thenReturn({x:-1, y:-1});
	when(mockEngine.inputMouse).isPressed().thenReturn(false);
	mockEngine.renderer.cameraPosition = {x:0, y:0};
	
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	goh.addType("tileMap", ModuleTileMap);
	goh.addType("enemy", ModuleEnemy);
	goh.addType("attack", ModuleAttack);
	goh.addType("effect", ModuleEffect);
	
	var tilemap = goh.create("tileMap", {x:0, y:0});
	tilemap.module.setUpMap(3, 3, 1, 10, 10, mockEngine);
	
	var go = goh.create("player", {x:0, y:0});
	go.module.setUpUnit({x:0, y:0}, tilemap, mockEngine);
	var enm = goh.create("enemy", {x:0, y:0});
	enm.module.setUpUnit({x:1, y:0}, tilemap, mockEngine);
	var gohCount = goh.countAll();
	
	go.module.spawnAttack({x:1, y:0}, {x:1, y:0});
	assert.ok(goh.countAll() == gohCount + 1, "gohCount successfully incremented");
	
	goh.collideAll();
	
	assert.ok(goh.countAll() == gohCount + 1, "gohCount still the same since attack destroyed & effect created");
	assert.ok(enm.module.moving == true, "enemy is going to move");
	assert.ok(vector2Equals(enm.module.moveTarget, {x:2, y:0}), "enemy's move target is consistent with knockback");
});

QUnit.test("playerObject player collides with item", function(assert)
{
	var mockEngine = {};
	mockEngine.turnCount = 0;
	mockEngine.itemCount = 0;
	mockEngine.screenSize = {x:320, y:240};
	mockEngine.imageLoader = mock(ImageLoader);
	mockEngine.renderer = mock(Renderer);
	mockEngine.inputMouse = mock(InputMouse);
	mockEngine.nextGameState = GameEngineConstants.stateGame;
	mockEngine.turnPhase = GamePlayConstants.phasePlayer;
	mockEngine.soundPlayer = mock(SoundPlayer);
	
	when(mockEngine.inputMouse).getPosition().thenReturn({x:-1, y:-1});
	when(mockEngine.inputMouse).isPressed().thenReturn(false);
	mockEngine.renderer.cameraPosition = {x:0, y:0};
	
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	goh.addType("tileMap", ModuleTileMap);
	goh.addType("effect", ModuleEffect);
	goh.addType("item", ModuleItem);
	
	var tilemap = goh.create("tileMap", {x:0, y:0});
	tilemap.module.setUpMap(3, 3, 1, 10, 10, mockEngine);
	
	var go = goh.create("player", {x:0, y:0});
	go.module.setUpUnit({x:0, y:0}, tilemap, mockEngine);
	var item = goh.create("item", {x:0, y:0});
	item.module.setUpUnit({x:0, y:0}, tilemap, mockEngine);
	var gohCount = goh.countAll();
	
	goh.collideAll();
	
	assert.ok(item.active == false, "item was destroyed");
	assert.ok(mockEngine.itemCount == 1, "itemCount successfully incremented");
});

QUnit.test("playerObject surrounded test", function(assert)
{
	var mockEngine = {};
	
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	goh.addType("tileMap", ModuleTileMap);
	goh.addType("enemy", ModuleEnemy);
	
	var tilemap = goh.create("tileMap", {x:0, y:0});
	tilemap.module.setUpMap(5, 5, 1, 10, 10, mockEngine);
	
	var go = goh.create("player", {x:0, y:0});
	go.module.setUpUnit({x:2, y:2}, tilemap, mockEngine);
	
	assert.ok(go.module.checkIfSurrounded() == 0, "player not surrounded");
	
	tilemap.module.setMapPosValue({x:1, y:2}, "genVal", tileMapConstants.genValDirt);
	assert.ok(go.module.checkIfSurrounded() == 0, "player not surrounded");
	
	tilemap.module.setMapPosValue({x:3, y:2}, "genVal", tileMapConstants.genValDirt);
	tilemap.module.setMapPosValue({x:2, y:1}, "genVal", tileMapConstants.genValDirt);
	var enm = goh.create("enemy", {x:0, y:0});
	enm.module.setUpUnit({x:2, y:3}, tilemap, mockEngine);
	assert.ok(go.module.checkIfSurrounded() == 1, "player semi surrounded");
	
	tilemap.module.setMapPosValue({x:0, y:2}, "genVal", tileMapConstants.genValDirt);
	tilemap.module.setMapPosValue({x:4, y:2}, "genVal", tileMapConstants.genValDirt);
	tilemap.module.setMapPosValue({x:2, y:0}, "genVal", tileMapConstants.genValDirt);
	tilemap.module.setMapPosValue({x:2, y:4}, "genVal", tileMapConstants.genValDirt);
	assert.ok(go.module.checkIfSurrounded() == 2, "player fully surrounded");
});