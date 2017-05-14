// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: itemObject.js
// Desc: Contains the module for the item object type.
// Author: mjensen
// Created: August 03, 2015
//
//**************************************************************************************************


function ModuleItem(obj)
{
	var _this = this;
	var thisObject = obj;
	var engine;
	
	this.type = "item";
	
	this.position = {x:0, y:0};
	
	var shadowSpriteIndex = 2;
	
	this.collectFunc = null;
	var counter = 0;
	
	
	// Returns nothing.
	this.initialize = function()
	{
		thisObject.spriteIndex = canvasApp.imageLoader.getSheetID("spr_item_cheese.png");
		thisObject.frameSpeed = 10;
		thisObject.spriteLoop = true;
		
		thisObject.collisionRect.l = -5;
		thisObject.collisionRect.t = -5;
		thisObject.collisionRect.w = 10;
		thisObject.collisionRect.h = 10;
	}
	
	// Sets up the unit variables.
	this.setUpUnit = function(pPosition, pTilemap, pEngine)
	{
		engine = pEngine;
		this.position.x = pPosition.x; this.position.y = pPosition.y;
		var worldPos = pTilemap.module.convertMapPosToWorldPos(this.position);
		thisObject.position.x = worldPos.x; thisObject.position.y = worldPos.y;
		
		thisObject.updateCollisionArea();
	}
	
	// Returns a boolean representing whether the collision changed or not.
	this.update = function()
	{
		thisObject.velocity.y = Math.sin(degToRad(counter)) * 0.5;
		counter += 15;
		if (counter >= 360) counter -= 360;
		return false;
	}
	// Returns a 2d vector representing sprite shake amount.
	this.draw = function(spriteList, drawQueue)
	{
		// Determine the unit's draw depth based upon their y position.
		thisObject.drawDepth = thisObject.position.y + 8;
		// Draw the unit's shadow.
		drawQueue.addSpriteToQueue(shadowSpriteIndex, 0, thisObject.position, thisObject.drawDepth - 1, thisObject.alpha / 2, false);
		
		return {x:0, y:0};
	}
	// Returns nothing.
	this.destroy = function()
	{
	}
	// Returns nothing.
	this.collide = function(other)
	{
		// If the other entity we're colliding with is the player, get destroyed.
		if (other.type == "player")
		{
			engine.itemCount++;
			engine.soundPlayer.playSound("snd_collect_0" + engine.itemCount);
			if (this.collectFunc != null) this.collectFunc();
			other.module.range--;
			var effect = thisObject.handler.create("effect", thisObject.position);
				effect.position.y -= 5;
				effect.spriteIndex = engine.imageLoader.getSheetID("spr_eff_collect.png");
				effect.drawDepth = 9999;
				effect.velocity.y = -2;
			effect = thisObject.handler.create("effect", {x:18, y:engine.screenSize.y / 2 - ((engine.itemCount - GamePlayConstants.itemCount / 2) / GamePlayConstants.itemCount * 120)});
				effect.spriteIndex = engine.imageLoader.getSheetID("spr_eff_ring.png");
				effect.drawDepth = 19999;
				effect.relative = true;
			thisObject.handler.destroy(thisObject.getIndex());
		}
	}
}