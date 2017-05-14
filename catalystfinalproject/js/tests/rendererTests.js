// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: rendererTests.js
// Desc: Contains the tests for the renderer
// Author: mjensen
// Created: July 24, 2015
//
//**************************************************************************************************

// adding elements to drawQueue sorted by depth
QUnit.test( "adding elements to drawQueue sorted by depth", function( assert )
{
	var render = new Renderer(null);
	var sprite1 = render.addSpriteToQueue(0, 0, {x:0, y:0}, 1, 0);
	assert.ok(render.countDrawQueue() == 1, "draw queue count successfully incremented");
	var sprite2 = render.addRectToQueue({l:0, t:0, w:2, h:2}, "#ff0000", 2, 1, 1, false);
	assert.ok(sprite2 == 1, "second sprite inserted to correct position");
	var sprite3 = render.addLineToQueue({x:0, y:0}, {x:16, y:16}, "#ff0000", 0, 1, 1, false);
	assert.ok(sprite3 == 0, "third sprite inserted to correct position");
});

QUnit.test("drawing elements covered", function(assert)
{
	var render = new Renderer(document.getElementById("theCanvas").getContext("2d"));
	var sprite1 = render.addSpriteToQueue(0, 0, {x:0, y:0}, 1, 0);
	assert.ok(render.countDrawQueue() == 1, "draw queue count successfully incremented");
	var sprite2 = render.addRectToQueue({l:0, t:0, w:2, h:2}, "#ff0000", 2, 1, 1, false);
	assert.ok(sprite2 == 1, "second sprite inserted to correct position");
	var sprite3 = render.addLineToQueue({x:0, y:0}, {x:16, y:16}, "#ff0000", 0, 1, 1, false);
	assert.ok(sprite3 == 0, "third sprite inserted to correct position");
	var exception = null;
	try
	{
		render.drawFullQueue();
	}
	catch (e)
	{
		exception = e;
	}
	assert.ok(exception != null, "expecting an exception since the sprite wasn't actually loaded");
});

// image loader doesn't break when checking for progress with nothing to load
QUnit.test("image loader doesn't break when checking for progress with nothing to load", function(assert)
{
	var loader = new ImageLoader("images/");
	assert.ok(loader.loadProgress() == -1, "load progress at -1 (because there's nothing to load)");
});

// image loader can return accurate loading progress
QUnit.test("image loader can return accurate loading progress", function(assert)
{
	var loader = new ImageLoader("images/");
	loader.loadSpriteSheet("spr_neox.png", 8, {x:64, y:64}, {x:32, y:32});
	assert.ok(loader.loadProgress() == 0, "load progress is 0 (because there are things to load, but it hasn't had time to load)");
	assert.ok(!loader.isLoaded(), "not loaded (since it still hasn't had the time)");
});

// image loader increases number of elements
QUnit.test("image loader increases number of elements", function(assert)
{
	var loader = new ImageLoader("images/");
	assert.ok(loader.countSheets() == 0, "image loader starts with no images");
	loader.loadSpriteSheet("spr_neox.png", 8, {x:64, y:64}, {x:32, y:32});
	assert.ok(loader.countSheets() == 1, "sheet count successfully incremented");
});

// image loader get sheet returns correct sheet
QUnit.test("image loader get sheet returns correct sheet", function(assert)
{
	var loader = new ImageLoader("images/");
	loader.loadSpriteSheet("spr_neox.png", 8, {x:64, y:64}, {x:32, y:32});
	var sheet = loader.getSheet("spr_neox.png");
	assert.ok(sheet != null, "successfully retrieved a sheet");
	assert.ok(sheet.name == "spr_neox.png", "retrieved sheet's name matches input");
	assert.ok(sheet.frameCount == 8, "retrieved sheet's frameCount matches input");
	assert.ok(sheet.frameSize.x == 64 && sheet.frameSize.y == 64, "retrieved sheet's frameSize matches input");
	assert.ok(sheet.frameOrigin.x == 32 && sheet.frameOrigin.y == 32, "retrieved sheet's frameSize matches input");
});

// image loader get sheet with ID returns correct sheet
QUnit.test("image loader get sheet with ID returns correct sheet", function(assert)
{
	var loader = new ImageLoader("images/");
	loader.loadSpriteSheet("spr_neox.png", 8, {x:64, y:64}, {x:32, y:32});
	loader.loadSpriteSheet("spr_neox.png", 4, {x:32, y:32}, {x:16, y:16});
	var sheet = loader.getSheetWithID(0);
	assert.ok(sheet != null, "successfully retrieved a sheet");
	assert.ok(sheet.name == "spr_neox.png", "retrieved sheet's name matches input");
	assert.ok(sheet.frameCount == 8, "retrieved sheet's frameCount matches input");
	assert.ok(sheet.frameSize.x == 64 && sheet.frameSize.y == 64, "retrieved sheet's frameSize matches input");
	assert.ok(sheet.frameOrigin.x == 32 && sheet.frameOrigin.y == 32, "retrieved sheet's frameSize matches input");
});
