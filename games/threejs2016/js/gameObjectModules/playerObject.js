// Project: Kitsengine 2.0
// File: player.js
// Desc: Contains the module for the player object type. As of Kitsengine 2, we can put extra modules in the game objects.
// Author: Kitsu
// Created: September 23, 2014
//
//**************************************************************************************************

// Player constants:
var playerConstants =
{
	gravity: 0.8,
	
	walkSpeed: 6,
	runSpeed: 10,
	accel: 5,
	friction: 0.5,
	airMult: 0.15,
	waterFriction: 0.8,
	
	jumpSpeed: 14,
	cameraTurnSpeed: 7.5,
	shadowLightSize: 32,
	
	turnLerp: 0.2,
	
	yOffset: -0.4,
	yDirOffset: 180,
	
	jumpTime: 17,
	runTimeOffset: 10
};

function ModulePlayer(obj)
{
	var _this = this;
	var thisObject = obj;
	
	this.type = "player";
	
	var model;
	var direction = 0;
	var targetDir = 0;
	
	var inAir = false;
	var inWater = false;
	var inWaterPrev = false;
	this.velocity = {x:0, y:0, z:0};
	
	var jumpTimer = playerConstants.jumpTime;
	
	var prevDir = 0;
	var idleTimer = playerConstants.runTimeOffset;
	var running = false;
	
	var cameraAngle = 270;
	var cameraAngleTarget = 270;
	var cameraDistance = 4;
	var cameraHeight = 4;
	
	var three = thisObject.app.renderer3d;
	var keyboard = thisObject.app.inputKeyboard;
	var keyCodes = keyboard.keyCodes;
	var tileMap;
	if (thisObject.app.tilemapObject) tileMap = thisObject.app.tilemapObject.module.tilemap;
	
	var light;
	
	function modelInit(model)
	{
		
	}
	
	this.initialize = function()
	{
		thisObject.spriteIndex = -1;
		
		//model = new kitsuModel("models/kit2016_03.json", thisObject.app.modelLoader, three, false, modelInit);
		model = new kitsuModel("models/animtest2.json", thisObject.app.modelLoader, three, false, modelInit);
			
		three.camera.position.x = thisObject.position.x;
		three.camera.position.y = thisObject.position.y + playerConstants.yOffset + 4;
		three.camera.position.z = thisObject.position.z + 4;
		three.camera.lookAt( thisObject.position );
		
		thisObject.collisionRect.min.x = -0.32;
		thisObject.collisionRect.min.y = -0.38;
		thisObject.collisionRect.min.z = -0.32;
		thisObject.collisionRect.max.x = 0.32;
		thisObject.collisionRect.max.y = 0.38;
		thisObject.collisionRect.max.z = 0.32;
		
		_this.light = new THREE.DirectionalLight(0x000000);
		three.scene.add(_this.light);
		_this.light.position.set(0, 16, 0);
		_this.light.target.position.set(0,0,0);
		_this.light.castShadow = true;
		_this.light.shadowMapBias = -0.1;
		_this.light.shadowMapDarkness = 0.5;
		_this.light.shadowCameraNear = 3;
		_this.light.shadowCameraFar = 24;
		_this.light.shadowCameraFov = 90;
		_this.light.shadowCameraVisible = true;
		_this.light.shadowCameraLeft = -playerConstants.shadowLightSize / 2;
		_this.light.shadowCameraRight = playerConstants.shadowLightSize / 2;
		_this.light.shadowCameraTop = playerConstants.shadowLightSize / 2;
		_this.light.shadowCameraBottom = -playerConstants.shadowLightSize / 2;
		_this.light.shadowMapWidth = 1280;
		_this.light.shadowMapHeight = 1280;
	}
	
	this.update = function()
	{
		// Camera controls
		{
			// Going up and down.
			if (keyboard.isKeyDown(keyCodes.w) && keyboard.isKeyUp(keyCodes.s))
			{
				cameraHeight += 0.16;
			}
			else if (keyboard.isKeyDown(keyCodes.s) && keyboard.isKeyUp(keyCodes.w))
			{
				cameraHeight -= 0.16;
			}
			
			// Turning the camera.
			if (keyboard.isKeyPressed(keyCodes.a))
			{
				cameraAngleTarget -= 90;
			}
			if (keyboard.isKeyPressed(keyCodes.d))
			{
				cameraAngleTarget += 90;
			}
			var adiff = angleDiff(cameraAngleTarget, cameraAngle);
			if (adiff > 1)
			{
				cameraAngle = lerp(cameraAngle, cameraAngleTarget, 0.25);
			}
			else
			{
				cameraAngleTarget = cameraAngleTarget % 360;
				cameraAngle = cameraAngleTarget;
			}
		}
		
		// Find out if we're in the air or not.
		if (tileMap)
		{
			inAir = !tileMap.CollideAABBWithTilemap({min:{x:thisObject.collision.min.x,y:thisObject.collision.min.y - 0.1,z:thisObject.collision.min.z},
													max:{x:thisObject.collision.max.x,y:thisObject.collision.max.y - 0.6,z:thisObject.collision.max.z}});
			inWaterPrev = inWater;
			inWater = tileMap.CollidePointWithWater(thisObject.position);
			// Not in the water
			if (!inWater)
			{
				//if (inWaterPrev && this.velocity.y > 0) this.velocity.y = playerConstants.jumpSpeed;
				if (inAir)
				{
					jumpTimer++;
					// If the player releases the jump button or they've been in the air for a while, start falling.
					if (keyboard.isKeyUp(keyCodes.x)) jumpTimer = playerConstants.jumpTime
					if (jumpTimer >= playerConstants.jumpTime) _this.velocity.y -= playerConstants.gravity;
				}
				else
				{
					// Jumping.
					if (keyboard.isKeyPressed(keyCodes.x))
					{
						jumpTimer = 0;
						_this.velocity.y = playerConstants.jumpSpeed;
					}
				}
			}
			// In water
			else
			{
				if (keyboard.isKeyPressed(keyCodes.x))
				{
					_this.velocity.y = playerConstants.jumpSpeed;
				}
				if (inAir)
				{
					_this.velocity.y -= playerConstants.gravity / 2;
				}
				_this.velocity.y *= playerConstants.waterFriction;
			}
			// Spawn a splash effect when we go in or out of water.
			if (inWater != inWaterPrev)
			{
			
			}
			
			var dir = 0;
			var accel = playerConstants.accel;
			// Movement.
			{
				if (keyboard.isKeyDown(keyCodes.left) && keyboard.isKeyUp(keyCodes.right))
				{
					if (keyboard.isKeyDown(keyCodes.up) && keyboard.isKeyUp(keyCodes.down))
					{
						dir = 135;
					}
					else if (keyboard.isKeyDown(keyCodes.down) && keyboard.isKeyUp(keyCodes.up))
					{
						dir = 225;
					}
					else
					{
						dir = 180;
					}
				}
				else if (keyboard.isKeyDown(keyCodes.right) && keyboard.isKeyUp(keyCodes.left))
				{
					if (keyboard.isKeyDown(keyCodes.up) && keyboard.isKeyUp(keyCodes.down))
					{
						dir = 45;
					}
					else if (keyboard.isKeyDown(keyCodes.down) && keyboard.isKeyUp(keyCodes.up))
					{
						dir = 315;
					}
					else
					{
						dir = 0;
					}
				}
				else
				{
					if (keyboard.isKeyDown(keyCodes.up) && keyboard.isKeyUp(keyCodes.down))
					{
						dir = 90;
					}
					else if (keyboard.isKeyDown(keyCodes.down) && keyboard.isKeyUp(keyCodes.up))
					{
						dir = 270;
					}
					else
					{
						accel = 0;
					}
				}
				
				// If the player is moving, reset the idle timer to zero.
				if (accel > 0)
				{
					// Update the player's target direction
					targetDir = dir + cameraAngle + playerConstants.yDirOffset;
					targetDir = targetDir % 360;
					
					// If the player was idle just a few frames ago, the player should run instead of walk.
					if ((prevDir == targetDir && !inAir && (idleTimer > 0 && idleTimer < playerConstants.runTimeOffset)) || running)
					{
						running = true;
					}
					// Otherwise, just walk.
					idleTimer = 0;
				}
				// Otherwise, if the player is idle, count up.
				else
				{
					prevDir = targetDir;
					if (idleTimer < playerConstants.runTimeOffset) idleTimer++;
					else running = false;
				}
				
				
				
				var airMult = 1;
				if (inAir || inWater) airMult = playerConstants.airMult;
				// Apply the acceleration according to our movement above.
				_this.velocity.x += Math.cos(degToRad(dir + cameraAngle + 90)) * accel * airMult;
				_this.velocity.z -= Math.sin(degToRad(dir + cameraAngle + 90)) * accel * airMult;
				// Apply friction.
				if (!inAir && accel == 0)
				{
					_this.velocity.x *= playerConstants.friction;
					_this.velocity.z *= playerConstants.friction;
				}
				if (inWater)
				{
					_this.velocity.x *= playerConstants.waterFriction;
					_this.velocity.z *= playerConstants.waterFriction;
				}
				// If the player's horizontal speed gets close enough to zero, just set it to zero.
				if (Math.abs(_this.velocity.x) < 0.25) _this.velocity.x = 0;
				if (Math.abs(_this.velocity.z) < 0.25) _this.velocity.z = 0;
				
				// Find out what the player's maxspeed should be based on their state.
				var maxSpeed = updateMaxSpeed();
				
				// Limit the player's horizontal speed.
				if (vector2LengthSquared({x:_this.velocity.x, y:_this.velocity.z}) > maxSpeed * maxSpeed)
				{
					var temp = vector2Normalize({x:_this.velocity.x, y:_this.velocity.z});
					_this.velocity.x = temp.x * maxSpeed;
					_this.velocity.z = temp.y * maxSpeed;
				}
				
				// Find kirby's direction.
				if (direction != targetDir)
				{
					var localDir = targetDir;
					if (direction > 180 && localDir < direction - 180) localDir += 360;
					else if (direction < 180 && localDir > direction + 180) direction += 360;
					var adiff = angleDiff(localDir, direction);
					if (adiff > 1)
					{
						direction = lerp(direction, localDir, playerConstants.turnLerp);
					}
					else
					{
						direction = targetDir;
					}
				}
				direction = direction % 360;
			}
			
			// Physics.
			platformerMovement();
			
			// Change animations depending on state.
			//updateAnimation();
		}
		return true;
	}
	this.draw = function(spriteList, drawQueue)
	{
		drawQueue.addTextToQueue("Arrow keys to move", {x:20, y:20}, "#ffffff", "12pt Calibri", 101, 1, -1, "left", true);
		drawQueue.addTextToQueue("X to jump", {x:20, y:35}, "#ffffff", "12pt Calibri", 101, 1, -1, "left", true);
		drawQueue.addTextToQueue("WASD to control camera", {x:20, y:50}, "#ffffff", "12pt Calibri", 101, 1, -1, "left", true);
		drawQueue.addTextToQueue("R to reset level", {x:20, y:65}, "#ffffff", "12pt Calibri", 101, 1, -1, "left", true);
		
		if (model && model.model)
		{
			//this.light.position.x = thisObject.position.x;
			//this.light.position.z = thisObject.position.z;
			//this.light.target.position.x = thisObject.position.x;
			//this.light.target.position.z = thisObject.position.z;
		
			model.model.position.x = thisObject.position.x;
			model.model.position.y = thisObject.position.y + playerConstants.yOffset
			model.model.position.z = thisObject.position.z;
			model.model.rotation.y = degToRad(direction);
			model.model.scale.set(0.1, 0.1, 0.1);
			
			three.camera.position.y = model.model.position.y + cameraHeight;
			three.camera.position.x = thisObject.position.x + Math.cos(degToRad(cameraAngle)) * cameraDistance;
			three.camera.position.z = thisObject.position.z - Math.sin(degToRad(cameraAngle)) * cameraDistance;
			three.camera.lookAt( model.model.position );
		}
		return {x:0, y:0};
	}
	
	this.destroy = function()
	{
		if (model && model.model)
			three.scene.remove(model.model);
		model = null;
	}
	
	// Returns nothing.
	this.collide = function(other)
	{
	}
	
	function platformerMovement()
	{
		// X movement.
		for (var i = 0; i < Math.ceil(Math.abs(_this.velocity.x)); i++)
		{
			var sign = numberSign(_this.velocity.x) / 100;
			var aabb = {min:{x:thisObject.position.x + thisObject.collisionRect.min.x + sign, y:thisObject.position.y + thisObject.collisionRect.min.y, z:thisObject.position.z + thisObject.collisionRect.min.z},
						max:{x:thisObject.position.x + thisObject.collisionRect.max.x + sign, y:thisObject.position.y + thisObject.collisionRect.max.y, z:thisObject.position.z + thisObject.collisionRect.max.z}};
			if (tileMap.CollideAABBWithTilemap(aabb))
			{
				//_this.velocity.x = 0;
				break;
			}
			else
			{
				thisObject.position.x += sign;
			}
		}
		// Z movement.
		for (var i = 0; i < Math.ceil(Math.abs(_this.velocity.z)); i++)
		{
			var sign = numberSign(_this.velocity.z) / 100;
			var aabb = {min:{x:thisObject.position.x + thisObject.collisionRect.min.x, y:thisObject.position.y + thisObject.collisionRect.min.y, z:thisObject.position.z + thisObject.collisionRect.min.z + sign},
						max:{x:thisObject.position.x + thisObject.collisionRect.max.x, y:thisObject.position.y + thisObject.collisionRect.max.y, z:thisObject.position.z + thisObject.collisionRect.max.z + sign}};
			if (tileMap.CollideAABBWithTilemap(aabb))
			{
				//_this.velocity.z = 0;
				break;
			}
			else
			{
				thisObject.position.z += sign;
			}
		}
		// Y movement.
		for (var i = 0; i < Math.ceil(Math.abs(_this.velocity.y)); i++)
		{
			var sign = numberSign(_this.velocity.y) / 100;
			var aabb = {min:{x:thisObject.position.x + thisObject.collisionRect.min.x, y:thisObject.position.y + thisObject.collisionRect.min.y + sign, z:thisObject.position.z + thisObject.collisionRect.min.z},
						max:{x:thisObject.position.x + thisObject.collisionRect.max.x, y:thisObject.position.y + thisObject.collisionRect.max.y + sign, z:thisObject.position.z + thisObject.collisionRect.max.z}};
			// If the next space is solid, stop moving.
			if (tileMap.CollideAABBWithTilemap(aabb))
			{
				_this.velocity.y = 0;
				break;
			}
			// Otherwise, move.
			else
			{
				thisObject.position.y += sign;
			}
		}
	}
	
	function updateMaxSpeed()
	{
		if (!running) return playerConstants.walkSpeed;
		else return playerConstants.runSpeed;
	}
	
	// Handles changing animations based on state.
	function updateAnimation()
	{
		if (!inAir)
		{
			if (_this.velocity.x == 0 && _this.velocity.z == 0)
			{
				model.changeAnimation("Idle");
			}
			else
			{
				if (!running) model.changeAnimation("Walk");
				else model.changeAnimation("Run");
			}
		}
		else
		{
			if (_this.velocity.y > 01)
			{
				model.changeAnimation("JumpStart");
				model.setAnimationLooping(false);
				model.setAnimationSpeed(3);
			}
			else
			{
				model.changeAnimation("JumpFlip");
				model.setAnimationLooping(false);
				model.setAnimationSpeed(2);
			}
		}
	}
}