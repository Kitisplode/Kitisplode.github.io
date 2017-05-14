// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: enemyObject.js
// Desc: Contains the module for the enemy object type.
// Author: mjensen
// Created: July 30, 2015
//
//**************************************************************************************************
var enemyConstants =
{
	moveDiffDistance: 16,
	speed: 3,
	knockbackSpeed: 8,
	moveThreshold: 2,
	
	maxRange: 2,
	maxSightRange: 6,
	waitForObstructionTime: 10
};

function ModuleEnemy(obj)
{
	var _this = this;
	var thisObject = obj;
	var engine;
	
	this.type = "enemy";
	
	this.position = {x:-1, y:-1};
	this.prevPos = {x:-1, y:-1};
	
	this.moveTarget = {x:-1, y:-1};
	this.moving = false;
	this.speed = enemyConstants.speed;
	this.range = enemyConstants.maxSightRange;
	
	var shadowSpriteIndex = 2;
	
	var tilemap = null;
	
	this.hasOrders = false;
	this.path = null;
	
	var tried = 0;
	var direction = 180;
	
	var caged = false;
	var stepped = false;
	
	// Returns nothing.
	this.initialize = function()
	{
		thisObject.spriteIndex = 3;
		thisObject.frameSpeed = 0.0;
		thisObject.spriteLoop = true;
		thisObject.drawDepth = 10;
		
		thisObject.collisionRect.l = -4;
		thisObject.collisionRect.t = -4;
		thisObject.collisionRect.w = 8;
		thisObject.collisionRect.h = 8;
	}
	
	// Sets up the unit variables.
	this.setUpUnit = function(pPosition, pTilemap, pEngine)
	{
		tilemap = pTilemap;
		engine = pEngine;
		this.position.x = pPosition.x; this.position.y = pPosition.y;
		var worldPos = tilemap.module.convertMapPosToWorldPos(this.position);
		thisObject.position.x = worldPos.x; thisObject.position.y = worldPos.y;
		
		thisObject.updateCollisionArea();
	}
	
	// Returns a boolean representing whether the collision changed or not.
	this.update = function()
	{
		this.prevPos.x = this.position.x; this.prevPos.y = this.position.y;
		
		if (tilemap != null && tilemap.active && tilemap.type == "tileMap")
		{
			switch (engine.turnPhase)
			{
				case GamePlayConstants.phaseEnd:
				{
					// If we're not caged, but we are on screen, put the enemy in the cage.
					if (engine.chaseCount > 0 && !caged)
					{
						if (onScreen())
						{
							caged = true;
							thisObject.spriteIndex = engine.imageLoader.getSheetID("spr_enemy_cage.png");
							var effect = thisObject.handler.create("effect", thisObject.position);
							effect.spriteIndex = canvasApp.imageLoader.getSheetID("spr_eff_punch.png");
							effect.drawDepth = 9950;
							thisObject.drawDepth = 9000;
							engine.soundPlayer.playSound("snd_cage");
						}
					}
					break;
				}
				
				case GamePlayConstants.phasePlayer:
					tried = 0;
					this.speed = enemyConstants.speed;
					break;
				
				case GamePlayConstants.phaseEnemy:
				{
					// If the unit doesn't already have orders, generate some.
					if (!this.hasOrders)
					{
						var playerObj = engine.playerObj;
						if (playerObj != null && playerObj.active && playerObj.type == "player")
						{
							// Make the unit just go towards the the player.
							if (_this.goTo(playerObj.module.position, this.range, avoidAlliesCostRule, enemyConstants.maxRange))
								this.range = -1;
						}
						this.hasOrders = true;
					}
					break;
				}

				// If we're in the action phase, perform assigned actions.
				case GamePlayConstants.phaseAction:
				{
					// If we have a move target, go ahead and move towards it.
					if (this.moving)
					{
						var boardPos = tilemap.module.convertWorldPosToMapPos(thisObject.position);
						var nextPos = tilemap.module.convertMapPosToWorldPos(this.position);
						// Completing current goal.
						// If our current board position is incorrect, move towards the correct position.
						if (Math.floor(boardPos.x) != this.position.x || Math.floor(boardPos.y) != this.position.y)
						{
							var v = vector2Normalize(vector2Difference(nextPos, thisObject.position));
							thisObject.velocity.x = v.x * this.speed;
							thisObject.velocity.y = v.y * this.speed;
						}
						// Advancing goal.
						// Otherwise, if we are in the right position, check to see if we have a next step in the path. If so, move there next.
						else if (_this.path != null && _this.path.length > 0)
						{
							var blocked = false;
							if (tilemap.module.checkMapPosForEntity(_this.path[0].position, "enemy", thisObject)) blocked = true; 
							if (tilemap.module.checkMapPosForEntity(_this.path[0].position, "player", null)) blocked = true; 
							if (!blocked)
							{
								this.position.x = _this.path[0].position.x;
								this.position.y = _this.path[0].position.y;
								_this.path.shift();
								//this.position.x = this.moveTarget.x; this.position.y = this.moveTarget.y;
							}
							else
							{
								if (tried < enemyConstants.waitForObstructionTime)
									tried++;
								else
									_this.path.length = 0;
							}
						}
						// Meeting final goal.
						// Otherwise, if we are on the right tile, move towards the center of the current tile.
						else
						{
							var nextDiff = vector2Difference(nextPos, thisObject.position);
							var nextDiffDist = vector2LengthSquared(nextDiff);
							var nextDiffCutoff = this.speed * unitConstants.moveThreshold * this.speed * unitConstants.moveThreshold;
							// If we're near enough to the target position, stop moving and snap to the target position.
							if (nextDiffDist < nextDiffCutoff)
							{
								thisObject.position.x = nextPos.x; thisObject.position.y = nextPos.y;
								thisObject.velocity.x = 0; thisObject.velocity.y = 0;
								this.moveTarget.x = -1;
								this.moving = false;
								_this.path = null;
							}
							// Otherwise, if we're too far away, keep moving towards the target position.
							else
							{
								var v = vector2Normalize(nextDiff);
								thisObject.velocity.x = v.x * this.speed;
								thisObject.velocity.y = v.y * this.speed;
							}
						}
					}
					
					// If we're no longer moving or attacking, we no longer have orders.
					if (!this.moving)
					{
						this.hasOrders = false;
					}
					
					break;
				}
			}
		}
		
		return false;
	}
	// Returns a 2d vector representing sprite shake amount.
	this.draw = function(spriteList, drawQueue)
	{
		
		// Set the sprite according to the object's velocity.
		if (engine.turnPhase != GamePlayConstants.phaseEnd)
		{
			// Determine the unit's draw depth based upon their y position.
			thisObject.drawDepth = thisObject.position.y + 18;
			if (vector2LengthSquared(thisObject.velocity) > 0)
			{
				direction = radToDeg(vector2Angle(thisObject.velocity));
				thisObject.frameSpeed = 15;
				switch (Math.floor((direction + 22.5) / 90))
				{
					case 0:
						thisObject.changeSprite(spriteList.getSheetID("spr_enemy_orange_walk_e.png"));
						break;
					case 1:
						thisObject.changeSprite(spriteList.getSheetID("spr_enemy_orange_walk_n.png"));
						break;
					case 2:
						thisObject.changeSprite(spriteList.getSheetID("spr_enemy_orange_walk_w.png"));
						break;
					case 3:
						thisObject.changeSprite(spriteList.getSheetID("spr_enemy_orange_walk_s.png"));
						break;
				}
				// Play step sounds.
				if (Math.round(thisObject.frameIndex) % 2 == 0 && onScreen())
				{
					if (!stepped)
					{
						stepped = true;
						engine.soundPlayer.playSound("snd_step");
					}
				}
				else
				{
					stepped = false;
				}
			}
			// If the object isn't moving, return to the idle sprite.
			else
			{
				thisObject.spriteIndex = spriteList.getSheetID("spr_enemy_orange_idle.png");
				thisObject.frameIndex = (direction + 45) / 90;//(direction + 22.5) / 45;
				thisObject.frameSpeed = 0;
			}
		}
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
	}
	
	// Called to have the enemy move to a given position.
	this.goTo = function(pTargetPosition, pSightRange, pCostRule, pMaxRange)
	{
		_this.path = arrayReverse(tilemap.module.generatePath(this.position, pTargetPosition, pSightRange, pCostRule, [tilemap.module.definedRuleSkipType1]));
		arrayTruncate(_this.path, pMaxRange);
		if (_this.path != null)
		{
			this.moveTarget.x = pTargetPosition.x; this.moveTarget.y = pTargetPosition.y;
			this.moving = true;
			return true;
		}
		return false;
	}
	
	function avoidAlliesCostRule(pos)
	{
		if (tilemap.module.checkMapPosForEntity(pos, "enemy", thisObject)) return 1.5;
		return 1;
	}
	
	// Called to check if the enemy is actually on screen.
	function onScreen()
	{
		return (thisObject.position.x > engine.renderer.cameraPosition.x - 8 && thisObject.position.x < engine.renderer.cameraPosition.x + engine.screenSize.x + 8 &&
								thisObject.position.y > engine.renderer.cameraPosition.y - 8 && thisObject.position.y < engine.renderer.cameraPosition.y + engine.screenSize.y + 8);
	}
}