// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: gameobjectTests.js
// Desc: Contains the tests for the game object
// Author: mjensen
// Created: July 24, 2015
//
//**************************************************************************************************

QUnit.test("gameObject changeSprite does change sprites, resets frame index to zero", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	var go = goh.create("player", {x:0, y:0});
	go.changeSprite(1);
	assert.ok(go.spriteIndex == 1, "sprite successfully changed");
	assert.ok(go.frameIndex == 0, "frame successfully reset");
});

QUnit.test("gameObject update successfully updates position based on velocity", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	var go = goh.create("player", {x:0, y:0});
	go.module = null;
	go.position.x = 0; go.position.y = 0; go.position.z = 0;
	go.velocity.x = 1; go.velocity.y = 1; go.velocity.z = 1;
	go.update();
	assert.ok(go.position.x == 1, "position.x successfully updated");
	assert.ok(go.position.y == 1, "position.y successfully updated");
	assert.ok(go.position.z == 1, "position.z successfully updated");
});

QUnit.test("gameObjectHandler updateAll successfully updates position based on velocity", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	var go = goh.create("player", {x:0, y:0});
	go.module = null;
	go.position.x = 0; go.position.y = 0; go.position.z = 0;
	go.velocity.x = 1; go.velocity.y = 1; go.velocity.z = 1;
	goh.updateAll();
	assert.ok(go.position.x == 1, "position.x successfully updated");
	assert.ok(go.position.y == 1, "position.y successfully updated");
	assert.ok(go.position.z == 1, "position.z successfully updated");
});

QUnit.test("gameObject draw successfully updates animation frame based on animation speed", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	
	var loader = mock(ImageLoader);
	var sheet = new SpriteSheet("spr_neox", null, 8, {x:64, y:64}, {x:32, y:32});
	var renderer = mock(Renderer);
	
	when(loader).getSheetWithID(0).thenReturn(sheet);
	
	var go = goh.create("player", {x:0, y:0});
	go.module = null;
	go.frameIndex = 0;
	go.frameSpeed = 30;
	go.draw(false, loader, renderer, false);
	assert.ok(Math.floor(go.frameIndex) == 1, "frameIndex successfully updated");
});

QUnit.test("gameObjectHandler drawAll successfully updates animation frame based on animation speed", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	
	var loader = mock(ImageLoader);
	var sheet = new SpriteSheet("spr_neox", null, 8, {x:64, y:64}, {x:32, y:32});
	var renderer = mock(Renderer);
	
	when(loader).getSheetWithID(0).thenReturn(sheet);
	
	var go = goh.create("player", {x:0, y:0});
	go.module = null;
	go.frameIndex = 0;
	go.frameSpeed = 30;
	goh.drawAll(false, loader, renderer, false);
	assert.ok(Math.floor(go.frameIndex) == 1, "frameIndex successfully updated");
});