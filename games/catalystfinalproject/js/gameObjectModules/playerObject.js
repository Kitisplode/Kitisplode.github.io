// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: playerObject.js
// Desc: Contains the module for the player object type.
// Author: mjensen
// Created: July 23, 2015
//
//**************************************************************************************************
var unitConstants =
{
	moveDiffDistance: 16,
	speed: 4,
	moveThreshold: 2,
	
	maxRange: 6
};

function ModulePlayer(obj)
{
	var _this = this;
	var thisObject = obj;
	var engine;
	
	this.type = "player";
	
	this.position = {x:-1, y:-1};
	this.prevPos = {x:-1, y:-1};
	
	this.moveTarget = {x:-1, y:-1};
	this.moving = false;
	
	var shadowSpriteIndex = 2;
	
	var tilemap = null;
	var path = null;
	
	var attacks = 0;
	
	var direction = 270;
	
	this.range = unitConstants.maxRange;
	
	var phaseEnd = false;
	
	var stepped = false;
	
	// Returns nothing.
	this.initialize = function()
	{
		thisObject.spriteIndex = 0;
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
		
		var adjustedMouse = vector2Difference(engine.inputMouse.getPosition(), {x:-engine.renderer.cameraPosition.x, y:-engine.renderer.cameraPosition.y});
		
		
		if (tilemap != null && tilemap.active && tilemap.type == "tileMap")
		{
			switch (engine.turnPhase)
			{
				case GamePlayConstants.phaseBetween:
				{
					tilemap.module.clearDistances();
					engine.turnPhase = GamePlayConstants.phasePrePlayer;
					break;
				}
				
				case GamePlayConstants.phasePrePlayer:
				{
					// If we're not moving and we're on the exit location, we won the game.
					if (tilemap.module.checkMapPosForValue(this.position, "type", 2))
					{
						var captureCount = 0;
						// Count the number of enemies on screen.
						thisObject.handler.customBooleanLoop(function(pObj)
						{
							if (!pObj.active) return true;
							if (pObj.module == null) return true;
							if (pObj.module.type != "enemy") return true;
							if (pObj.position.x < engine.renderer.cameraPosition.x - 8 || pObj.position.x > engine.renderer.cameraPosition.x + engine.screenSize.x + 8 ||
								pObj.position.y < engine.renderer.cameraPosition.y - 8 || pObj.position.y > engine.renderer.cameraPosition.y + engine.screenSize.y + 8) return true;
							captureCount++;
							return true;
						});
						engine.chaseCount = captureCount;
						
						// Create a timer event to send the player to the ending screen.
						createEndGameTimer(GamePlayConstants.gameEndTime);
						engine.turnPhase = GamePlayConstants.phaseEnd;
						engine.won = true;
						tilemap.module.clearDistances();
						engine.soundPlayer.playSound("snd_bonus");
						
						//engine.nextGameState = GameEngineConstants.stateEnd;
					}
					// If the player is surrounded, end the game here, too.
					else if (this.checkIfSurrounded() == 2)
					{
						createEndGameTimer(GamePlayConstants.gameEndTime);
						engine.turnPhase = GamePlayConstants.phaseEnd;
						tilemap.module.clearDistances();
						engine.soundPlayer.playSound("snd_lose");
					}
					// Otherwise, populate the player's movement area.
					else
					{
						tilemap.module.generatePath(this.position, null, _this.range, null, [tilemap.module.definedRuleSkipType1, avoidEnemiesDefinedRule]);
						engine.turnPhase = GamePlayConstants.phasePlayer;
					}
					break;
				}
				
				// If we're in the player's turn phase, allow them to choose an action.
				case GamePlayConstants.phasePlayer:
				{
					// Allow the player to give their unit orders by clicking on the map.
					if (!vector2Equals(engine.inputMouse.getPosition(), {x:-1, y:-1}) && engine.inputMouse.isDown())
					{
						var mousePos = vector2Floor(tilemap.module.convertWorldPosToMapPos(adjustedMouse));
						// Ensure that the input is valid.
						if (tilemap.module.checkMapPos(mousePos))
						{
							// If the clicked tile can be moved to, move to it.
							if (tilemap.module.checkMapPosForValue(mousePos, "passable", true))// && tilemap.module.checkTileIfAdjacent(mousePos, this.position))
							{
								// If the tile is unoccupied, move there.
								if (!tilemap.module.checkMapPosForEntity(mousePos, "enemy", null))
								{
									path = arrayReverse(tilemap.module.generatePath(this.position, mousePos, _this.range, null, [tilemap.module.definedRuleSkipType1, avoidEnemiesDefinedRule]));
									arrayTruncate(path, _this.range + 1);
									if (path != null)
									{
										path.shift();
										this.moving = true;
										engine.turnCount++;
										var effect = thisObject.handler.create("effect", tilemap.module.convertMapPosToWorldPos(mousePos));
										effect.spriteIndex = canvasApp.imageLoader.getSheetID("spr_eff_ring.png");
										effect.drawDepth = 9950;
										effect.alpha = 0.5;
									}
								}
								// Otherwise, prepare to attack.
								else
								{
									engine.turnCount++;
									attacks = 1;
									direction = radToDeg(vector2Angle(vector2Difference(mousePos, this.position)));
								}
								// If we did end up actually moving or attacking, commit to the order and change turn phase.
								if (this.moving || attacks > 0)
								{
									this.moveTarget.x = mousePos.x;
									this.moveTarget.y = mousePos.y;
									engine.turnPhase = GamePlayConstants.phasePostPlayer;
									engine.soundPlayer.playSound("snd_clink");
								}
							}
						}
					}
					break;
				}
				
				case GamePlayConstants.phasePostPlayer:
				{
					var effect = thisObject.handler.create("effect", {x:16, y:16});
					effect.spriteIndex = canvasApp.imageLoader.getSheetID("spr_eff_miniring.png");
					effect.drawDepth = 10050;
					effect.relative = true;
					tilemap.module.clearDistances();
					engine.turnPhase = GamePlayConstants.phaseEnemy;
				}
				
				case GamePlayConstants.phaseEnemy:
					// If all the enemies are done moving, change to the action phase.
					if (engine.gameObjectHandler.customBooleanLoop(enemiesHaveOrdersCustomLoop))
						engine.turnPhase = GamePlayConstants.phaseAction;
					break;

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
							thisObject.velocity.x = v.x * unitConstants.speed;
							thisObject.velocity.y = v.y * unitConstants.speed;
						}
						// Advancing goal.
						// Otherwise, if we are in the right position, check to see if we have a next step in the path. If so, move there next.
						else if (path != null && path.length > 0)
						{
							//var ocuUnit = GameObjectArray[g_tilemapId].module.GetUnitAtPos(this.path[0].pos);
							var blocked = false;
							if (tilemap.module.checkMapPosForEntity(path[0].position, "enemy", null)) blocked = true; 
							if (tilemap.module.checkMapPosForEntity(path[0].position, "player", thisObject)) blocked = true; 
							if (!blocked)
							{
								this.position.x = path[0].position.x;
								this.position.y = path[0].position.y;
								path.shift();
								//this.position.x = this.moveTarget.x; this.position.y = this.moveTarget.y;
							}
							else
							{
								path.length = 0;
							}
						}
						// Meeting final goal.
						// Otherwise, if we are on the right tile, move towards the center of the current tile.
						else
						{
							var nextDiff = vector2Difference(nextPos, thisObject.position);
							var nextDiffDist = vector2LengthSquared(nextDiff);
							var nextDiffCutoff = unitConstants.speed * unitConstants.moveThreshold * unitConstants.speed * unitConstants.moveThreshold;
							// If we're near enough to the target position, stop moving and snap to the target position.
							if (nextDiffDist < nextDiffCutoff)
							{
								thisObject.position.x = nextPos.x; thisObject.position.y = nextPos.y;
								thisObject.velocity.x = 0; thisObject.velocity.y = 0;
								this.moveTarget.x = -1;
								this.moving = false;
								path = null;
							}
							// Otherwise, if we're too far away, keep moving towards the target position.
							else
							{
								var v = vector2Normalize(nextDiff);
								thisObject.velocity.x = v.x * unitConstants.speed;
								thisObject.velocity.y = v.y * unitConstants.speed;
							}
						}
					}
					// If we have any attacks to fire off, do so.
					if (attacks > 0)
					{
						this.spawnAttack(this.moveTarget ,_this.facingDirection());
						attacks = 0;
					}
					
					// If we've stopped moving, return to the player phase (after checking that no other units are moving either)
					if (!this.moving && attacks == 0)
					{
						if (engine.gameObjectHandler.customBooleanLoop(enemiesDontHaveOrdersCustomLoop))
							engine.turnPhase = GamePlayConstants.phaseBetween;
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
		var shake = {x:0, y:0};
		
		if (engine.turnPhase != GamePlayConstants.phaseEnd)
		{
			// Determine the unit's draw depth based upon their y position.
			thisObject.drawDepth = thisObject.position.y + 18;
			// Set the sprite according to the object's velocity.
			if (vector2LengthSquared(thisObject.velocity) > 0)
			{
				direction = radToDeg(vector2Angle(thisObject.velocity));
				thisObject.frameSpeed = 10;
				switch (Math.round((direction - 0) / 90))
				{
					default:
						thisObject.spriteIndex = spriteList.getSheetID("spr_player_walk_e.png");
						break;
					case 1:
						thisObject.spriteIndex = spriteList.getSheetID("spr_player_walk_n.png");
						break;
					case 2:
						thisObject.spriteIndex = spriteList.getSheetID("spr_player_walk_w.png");
						break;
					case 3:
						thisObject.spriteIndex = spriteList.getSheetID("spr_player_walk_s.png");
						break;
				}
				// Play step sounds.
				if (Math.round(thisObject.frameIndex) % 2 == 0)
				{
					if (!stepped)
					{
						stepped = true;
						engine.soundPlayer.playSound("snd_step02");
					}
				}
				else
				{
					stepped = false;
				}
			}
			// If the player isn't moving, just use the idle sprite.
			else
			{
				thisObject.spriteIndex = spriteList.getSheetID("spr_player_idle.png");
				thisObject.frameIndex = (direction + 45) / 90;//(direction + 22.5) / 45;
				thisObject.frameSpeed = 0;
			}
		}
		// If the game is ending, switch to a win or loss sprite.
		else
		{
			// Draw a rectangle to cover everything else.
			drawQueue.addRectToQueue({l:0, t:0, w:engine.screenSize.x, h:engine.screenSize.y}, "#000000", 8999, 0.5, -1, true);
			if (phaseEnd == false)
			{
				thisObject.drawDepth = 9001;
				thisObject.changeSprite(spriteList.getSheetID("spr_player_win.png"));
				// If the player's won, switch to the win sprite!
				if (engine.won)
				{
					thisObject.frameSpeed = 20;
					thisObject.spriteLoop = false;
					engine.fadeFill = "#ffffff";
				}
				else
				{
					thisObject.frameSpeed = 0;
				}
				phaseEnd = true;
			}
			if (engine.won)
			{
				engine.drawText(spriteList.getSheetID("spr_font7x7.png"), "You won!", {x:engine.screenSize.x / 2, y:engine.screenSize.y / 5}, -1,-1, 9001, 1, 2);
			}
			else
			{
				engine.drawText(spriteList.getSheetID("spr_font7x7.png"), "You lost...", {x:engine.screenSize.x / 2, y:engine.screenSize.y / 5}, -1,-1, 9001, 1, 2);
				shake.x = 1 - (random.next() * 2);
				shake.y = 1 - (random.next() * 2);
			}
		}
		// Draw the unit's shadow.
		drawQueue.addSpriteToQueue(shadowSpriteIndex, 0, thisObject.position, thisObject.drawDepth - 2, thisObject.alpha / 2, false);
		
		// Draw the HUD.
		drawQueue.addSpriteToQueue(spriteList.getSheetID("spr_hud_watch.png"),0, {x:16, y:16}, 10000, 1, true);
		engine.drawText(spriteList.getSheetID("spr_font7x7.png"), engine.turnCount.toString(), {x:19, y:16}, 3, 26, 10001, 1, 2);
		for (var i = 1; i <= GamePlayConstants.itemCount; i++)
		{
			var frame = 0;
			if (i <= engine.itemCount) frame = 1;
			drawQueue.addSpriteToQueue(spriteList.getSheetID("spr_hud_cheese.png"), frame, {x:18, y:engine.screenSize.y / 2 - ((i - GamePlayConstants.itemCount / 2) / GamePlayConstants.itemCount * 120)}, 11000 - i, 1, true);
		}
		
		// Make the camera follow the player around.
		drawQueue.cameraPosition.x = thisObject.position.x - engine.screenSize.x / 2;
		drawQueue.cameraPosition.y = thisObject.position.y - engine.screenSize.y / 2;
		
		return shake;
	}
	// Returns nothing.
	this.destroy = function()
	{
	}
	// Returns nothing.
	this.collide = function(other)
	{
	}
	
	// Spawns an attack object at the given position with the given push force.
	this.spawnAttack = function(pPosition, pPushDirection)
	{
		var attackObj = thisObject.handler.create("attack", {x:0, y:0});
		attackObj.module.target = pPushDirection;
		attackObj.module.setUpAttack(pPosition, thisObject, tilemap, engine, 
			function(self, enemy){
				enemy.module.position = vector2Floor(tilemap.module.convertWorldPosToMapPos(enemy.position));
				var targetPos = vector2Sum(enemy.module.position, self.module.target);
				if (enemy.module.goTo(targetPos, 2, null, 2))
				{
					enemy.module.speed = enemyConstants.knockbackSpeed;
				}
				var effect = self.handler.create("effect", self.position);
				effect.spriteIndex = engine.imageLoader.getSheetID("spr_eff_punch.png");
				effect.drawDepth = 9999;
				engine.soundPlayer.playSound("snd_hitEnemy");
				self.handler.destroy(self.getIndex());
		});
	}
	
	// Called to check to see if we're surrounded by enemies or blocks.
	this.checkIfSurrounded = function()
	{
		// First, check to see if all adjacent positions are blocked.
		var blocked = true;
		var i = 0;
		var pos;
		for (; i < 4; i++)
		{
			switch (i)
			{
				case 0:
					pos = tilemap.module.tileRight(this.position);
					break;
				case 1:
					pos = tilemap.module.tileUp(this.position);
					break;
				case 2:
					pos = tilemap.module.tileLeft(this.position);
					break;
				case 3:
					pos = tilemap.module.tileDown(this.position);
					break;
			}
			if (!tilemap.module.checkMapPosForEntity(pos, "enemy", null) && tilemap.module.checkMapPosForValue(pos, "passable", true))
			{
				blocked = 0;
				break;
			}
		}
		if (blocked == 1)
		{
			var posAfter;
			blocked = 2;
			// Then check the tiles after those adjacent ones.
			for (i = 0; i < 4; i++)
			{
				switch (i)
				{
					case 0:
						pos = tilemap.module.tileRight(this.position);
						posAfter = tilemap.module.tileRight(pos);
						break;
					case 1:
						pos = tilemap.module.tileUp(this.position);
						posAfter = tilemap.module.tileUp(pos);
						break;
					case 2:
						pos = tilemap.module.tileLeft(this.position);
						posAfter = tilemap.module.tileLeft(pos);
						break;
					case 3:
						pos = tilemap.module.tileDown(this.position);
						posAfter = tilemap.module.tileDown(pos);
						break;
				}
				// If the first position is a block, we don't need to check the position beyond that.
				if (tilemap.module.checkMapPosForValue(pos, "passable", false)) continue;
				// Otherwise, if the second position is still passable, we're not really completely surrounded.
				if (!tilemap.module.checkMapPosForEntity(posAfter, "enemy", null) && tilemap.module.checkMapPosForValue(posAfter, "passable", true))
				{
					blocked = 1;
					break;
				}
			}
		}
		return blocked;
	}
	
	// Calculates a push force based on the object's current direction.
	this.facingDirection = function()
	{
		return {x:numberSign(Math.round(Math.cos(degToRad(direction)))), y:-numberSign(Math.round(Math.sin(degToRad(direction))))};
	}
	
	function enemiesHaveOrdersCustomLoop(pObj)
	{
		if (!pObj.active) return true;
		if (pObj.module == null) return true;
		if (pObj.module.type != "enemy") return true;
		return pObj.module.hasOrders;
	}
	
	function enemiesDontHaveOrdersCustomLoop(pObj)
	{
		if (!pObj.active) return true;
		if (pObj.module == null) return true;
		if (pObj.module.type != "enemy") return true;
		return !pObj.module.hasOrders;
	}
	
	function avoidEnemiesDefinedRule(pos)
	{
		return !(tilemap.module.checkMapPosForEntity(pos, "enemy", thisObject));
	}
	
	function createEndGameTimer(pTime)
	{
		var timer = thisObject.handler.create("timer", {x:0,y:0});
		timer.module.time = pTime;
		timer.module.destroyFunc = function() { engine.nextGameState = GameEngineConstants.stateEnd };
	}
}