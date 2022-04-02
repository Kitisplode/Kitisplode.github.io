// Project: threejs2016
// File: tilemapObject.js
// Desc: Contains the module for the tilemap object type, which represents the environment in which
//			the game takes place.
// Author: Kitsu
// Created: July 01, 2016
//
//**************************************************************************************************


function ModuleTilemap(obj)
{
	var _this = this;
	var thisObject = obj;
	
	this.type = "tilemap";
	
	this.tilemap;
	
	// Returns nothing.
	this.initialize = function()
	{
		thisObject.spriteIndex = -1;
	}
	
	this.reinit = function(levelName)
	{
		_this.tilemap = new TilemapStorage(thisObject.app);
		_this.tilemap.Initialize(levelName);
	}
	
	// Returns a boolean representing whether the collision changed or not.
	this.update = function()
	{
		return false;
	}
	// Returns a 2d vector representing sprite shake amount.
	this.draw = function(spriteList, drawQueue)
	{
		if (_this.tilemap != null) _this.tilemap.Draw();
		return {x:0, y:0};
	}
	// Returns nothing.
	this.destroy = function()
	{
	}
	// Returns nothing.
	this.collide = function(other)
	{
	}
}