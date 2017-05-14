// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: attackObject.js
// Desc: Contains the module for the attack object type.
// Author: mjensen
// Created: July 31, 2015
//
//**************************************************************************************************


function ModuleAttack(obj)
{
	var _this = this;
	var thisObject = obj;
	var engine;
	
	this.type = "attack";
	
	this.owner = null;
	this.effect = null;
	
	this.target = {x:0, y:0};
	
	// Returns nothing.
	this.initialize = function()
	{
		thisObject.spriteIndex = 2;
		thisObject.frameSpeed = 0.0;
		thisObject.spriteLoop = true;
		
		thisObject.collisionRect.l = -8;
		thisObject.collisionRect.t = -8;
		thisObject.collisionRect.w = 16;
		thisObject.collisionRect.h = 16;
	}
	
	// Sets up the attack variables.
	this.setUpAttack = function(pPosition, pOwner, pTilemap, pEngine, pEffect)
	{
		var worldPos = pTilemap.module.convertMapPosToWorldPos(pPosition);
		thisObject.position.x = worldPos.x; thisObject.position.y = worldPos.y;
		
		this.owner = pOwner;
		engine = pEngine;
		this.effect = pEffect;
		
		thisObject.updateCollisionArea();
	}
	
	// Returns a boolean representing whether the collision changed or not.
	this.update = function()
	{
		// If the turn phase isn't in the action phase, just destroy this object.
		if (engine.turnPhase != GamePlayConstants.phaseAction)
		{
			thisObject.handler.destroy(thisObject.getIndex());
		}
		return false;
	}
	// Returns a 2d vector representing sprite shake amount.
	this.draw = function(spriteList, drawQueue)
	{
		// Determine the unit's draw depth based upon their y position.
		thisObject.drawDepth = thisObject.position.y + 8;
		
		return {x:0, y:0};
	}
	// Returns nothing.
	this.destroy = function()
	{
	}
	// Returns nothing.
	this.collide = function(other)
	{
		// If the type of the other object we collided with doesn't match the type of our owner, deal our effect to them.
		if (other.type != this.owner.type)
		{
			if (this.effect != null) this.effect(thisObject, other);
		}
	}
}