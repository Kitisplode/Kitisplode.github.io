// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: timerObject.js
// Desc: Contains the module for the timer object, which counts down then performs a defined action.
// Author: mjensen
// Created: August 06, 2015
//
//**************************************************************************************************

function ModuleTimer(obj)
{
	var _this = this;
	var thisObject = obj;
	
	this.type = "timer";
	
	this.time = 0;
	this.destroyFunc = null;
	
	// Returns nothing.
	this.initialize = function()
	{
		thisObject.spriteIndex = -1;
	}
	
	// Returns a boolean representing whether the collision changed or not.
	this.update = function()
	{
		this.time--;
		if (this.time <= 0)
		{
			if (this.destroyFunc != null) this.destroyFunc();
			thisObject.handler.destroy(thisObject.getIndex());
		}
		return false;
	}
	// Returns a 2d vector representing sprite shake amount.
	this.draw = function(spriteList, drawQueue)
	{
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