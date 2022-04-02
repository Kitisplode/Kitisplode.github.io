// Project: Game Engine 2015
// File: effectObject.js
// Desc: Contains the module for the effect object type, which simply shows a visual effect and is
//		is destroyed once the animation is completed.
// Author: mjensen
// Created: July 31, 2015
//
//**************************************************************************************************


function ModuleEffect(obj)
{
	var _this = this;
	var thisObject = obj;
	
	this.type = "effect";
	
	this.owner = null;
	this.effect = null;
	
	this.target = {x:0, y:0};
	
	this.destroyFunc = null;
	
	// Returns nothing.
	this.initialize = function()
	{
		thisObject.spriteIndex = -1;
		thisObject.frameSpeed = 10.0;
		thisObject.spriteLoop = false;
		thisObject.animationEnd = function() { thisObject.handler.destroy(thisObject.getIndex()); };
	}
	
	// Returns a boolean representing whether the collision changed or not.
	this.update = function()
	{
		if (thisObject.spriteIndex < 0) thisObject.handler.destroy(thisObject.getIndex());
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
		if (this.destroyFunc != null) this.destroyFunc();
	}
	// Returns nothing.
	this.collide = function(other)
	{
	}
}