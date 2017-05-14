// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: gameobjectHandlerTests.js
// Desc: Contains the tests for the game object handler
// Author: mjensen
// Created: July 24, 2015
//
//**************************************************************************************************

QUnit.test( "gameObjectHandler create test, positive", function( assert )
{
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	var count = goh.countAll();
	assert.ok(count == 0, "goh should start at 0");
	goh.create("player", {x:0, y:0});
	assert.ok(goh.countAll() == count + 1, "active gameObject count successfully increased");
});

QUnit.test( "gameObjectHandler destroy test, positive", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	var count = goh.countAll();
	assert.ok(count == 0, "goh should start at 0");
	var go = goh.create("player", {x:0, y:0});
	assert.ok(go != null, "gameObject successfully created");
	assert.ok(goh.countAll() == count + 1, "active gameObject count successfully increased");
	goh.destroy(go.getIndex());
	assert.ok(goh.countAll() == count, "active gameObject count successfully decreased");
});

QUnit.test("gameObjectHandler create test, negative, list full", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	for (var i = 0; i < GameObjectHandlerConstants.maxObjects; i++)
	{
		goh.create("player", {x:0, y:0});
	}
	assert.ok(goh.countAll() == GameObjectHandlerConstants.maxObjects, "active gameObject count indicates it's full");
	var count = goh.countAll();
	var go = goh.create("player", {x:0, y:0});
	assert.ok(go == null, "gameObject not created successfully (since list is full)");
	assert.ok(goh.countAll() == count, "active gameObject count remained the same");
});

QUnit.test("gameObjectHandler create test, positive, filling list then removing one before adding one again", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	for (var i = 0; i < GameObjectHandlerConstants.maxObjects; i++)
	{
		goh.create("player", {x:0, y:0});
	}
	assert.ok(goh.countAll() == GameObjectHandlerConstants.maxObjects, "active gameObject count indicates it's full");
	goh.destroy(0);
	assert.ok(goh.countAll() == GameObjectHandlerConstants.maxObjects - 1, "active gameObject count successfully decreased");
	var go = goh.create("player", {x:0, y:0});
	assert.ok(go != null, "gameObject successfully created");
	assert.ok(go.getIndex() == 0, "gameObject's index matches expected value");
	assert.ok(goh.countAll() == GameObjectHandlerConstants.maxObjects, "active gameObject count indicates it's full again");
});

QUnit.test("gameObjectHandler create test, negative, invalid type", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	var count = goh.countAll();
	var go = goh.create("definitelyNotAnActualType", {x:0, y:0});
	assert.ok(go == null, "gameObject not created successfully (since type was invalid)");
	assert.ok(goh.countAll() == count, "active gameObject count remained the same");
});

QUnit.test("gameObjectHandler get test, positive", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	var go = goh.create("player", {x:0, y:0});
	assert.ok(go != null, "gameObject successfully created");
	var compare = goh.get(go.getIndex());
	assert.ok(compare != null, "gameObject successfully retrieved");
	assert.ok(compare === go, "retrieved gameObject matches original");
});

QUnit.test("gameObjectHandler destroyAll test, postive", function(assert)
{
	var goh = new GameObjectHandler();
	goh.addType("player", ModulePlayer);
	for (var i = 0; i < GameObjectHandlerConstants.maxObjects; i++)
	{
		goh.create("player", {x:0, y:0});
	}
	assert.ok(goh.countAll() == GameObjectHandlerConstants.maxObjects, "active gameObject count indicates it's full");
	goh.destroyAll(true);
	assert.ok(goh.countAll() == 0, "active gameObject count indicates it's empty now");
});