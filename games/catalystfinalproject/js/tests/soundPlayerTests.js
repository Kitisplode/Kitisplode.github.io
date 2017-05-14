// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: soundPlayerTests.js
// Desc: Contains the tests for the soundPlayer
// Author: mjensen
// Created: August 05, 2015
//
//**************************************************************************************************


// sound loader doesn't break when checking for progress with nothing to load
QUnit.test("sound loader doesn't break when checking for progress with nothing to load", function(assert)
{
	canvasApp.soundPlayer.toggleMute();
	var loader = new SoundPlayer("sounds", "music");
	assert.ok(loader.loadProgress() == -1, "load progress at -1 (because there's nothing to load)");
});

// sound loader can return accurate loading progress
QUnit.test("sound loader can return accurate loading progress", function(assert)
{
	var loader = new SoundPlayer("sounds", "music");
	loader.loadSound("snd_slash2");
	loader.loadMusic("mus_neoMagiko2");
	assert.ok(loader.loadProgress() == 0, "load progress is 0 (because there are things to load, but it hasn't had time to load)");
	assert.ok(!loader.isLoaded(), "not loaded (since it still hasn't had the time)");
});

// sound loader increases number of elements
QUnit.test("sound loader increases number of elements", function(assert)
{
	var loader = new SoundPlayer("sounds", "music");
	assert.ok(loader.countSounds() == 0, "sound loader starts with no sounds");
	assert.ok(loader.countMusics() == 0, "sound loader starts with no musics");
	loader.loadSound("snd_slash2");
	assert.ok(loader.countSounds() == 1, "sound count successfully incremented");
	assert.ok(loader.countMusics() == 0, "music count remains the same");
	loader.loadMusic("mus_neoMagiko2");
	assert.ok(loader.countSounds() == 1, "sound count remains the same");
	assert.ok(loader.countMusics() == 1, "music count successfully incremented");
});

// sound loader doesn't break when trying to play nonexistent sounds/music
QUnit.test("sound loader doesn't break when trying to play nonexistent sounds/music", function(assert)
{
	var loader = new SoundPlayer("sounds", "music");
	assert.ok(loader.playSound("tamamo") == false, "can't play a nonexistent sound");
	assert.ok(loader.switchMusic("nero") == false, "can't play nonexistent music");
});

// image loader get sheet returns correct sheet
/*QUnit.test("image loader get sheet returns correct sheet", function(assert)
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
//*/