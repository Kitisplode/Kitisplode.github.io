// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: gameObject.js
// Desc: Contains the closure represenging game objects, as well as the closure in charge of handling said game objects.
// Author: mjensen
// Created: July 23, 2015
//
//**************************************************************************************************

// Contains global variables for gameobject handler
var GameObjectHandlerConstants =
{
	maxObjects: 512
};
// Game object handler closure:
function GameObjectHandler ()
{
	var _this = this;
	this.objectTypes = new Array();
	
	var gameObjectsArray = new Array();
	for (var i = 0; i < GameObjectHandlerConstants.maxObjects; i++)
	{
		gameObjectsArray[i] = new GameObject(i, _this);
	}
	
	var objectCount = 0;
	var lastNewPosition = 0;	// Tracks where the last new object was created. Used to decrease time in finding an empty space.
	
	// Called to add a new object type.
	this.addType = function (pType, pModule)
	{
		_this.objectTypes.push({type: pType, module: pModule});
		return _this.objectTypes.length - 1;
	}
	
	// Called to retrieve an object type index.
	function getType(pType)
	{
		// Loops through the array until it finds a type that matches by name.
		for (var i = 0; i < _this.objectTypes.length; i++)
		{
			if (_this.objectTypes[i].type == pType) break;
		}
		if (i >= 0 && i < _this.objectTypes.length) return _this.objectTypes[i];
		return null;
	}
	
	// Called to instantiate a new object.
	this.create = function (pType, pPosition)
	{
		// Get the type.
		type = getType(pType);
		if (type == null) return;
		var index = lastNewPosition;
		// If the index is invalid, reset it.
		if (index < 0 || index >= GameObjectHandlerConstants.maxObjects || gameObjectsArray[index].active)
		{
			index = -1;
		}
		// If the index is -1, go ahead and find the first empty space after that.
		if (index <= -1)
		{
			for (index = 0; index < GameObjectHandlerConstants.maxObjects; index++)
			{
				if (!gameObjectsArray[index].active)
					break;
			}
		}
		// If we didn't find any empty spaces, return null.
		if (index >= GameObjectHandlerConstants.maxObjects) return null;
		// Otherwise, create and return the object.
		lastNewPosition = index + 1;
		var module = new type.module(gameObjectsArray[index]);
		gameObjectsArray[index].init(pType, module, pPosition);
		objectCount++;
		return gameObjectsArray[index];
	}
	
	// Called to destroy an object.
	this.destroy = function (pIndex)
	{
		if (pIndex < 0 || pIndex >= GameObjectHandlerConstants.maxObjects) return;
		if (!gameObjectsArray[pIndex].active) return;
		gameObjectsArray[pIndex].destroy(false);
		lastNewPosition = pIndex;
		objectCount--;
	}
	
	// Called to retrieve an object with a given index.
	this.get = function (pIndex)
	{
		if (pIndex < 0 || pIndex >= GameObjectHandlerConstants.maxObjects) return null;
		return gameObjectsArray[pIndex];
	}
	
	// Called to retrieve the number of active objects.
	this.countAll = function()
	{
		return objectCount;
	}
	
	// Called to update all objects.
	this.updateAll = function()
	{
		for (var i = 0; i < GameObjectHandlerConstants.maxObjects; i++)
		{
			gameObjectsArray[i].update();
		}
	}
	
	// Called to check collisions for all objects.
	this.collideAll = function()
	{
		for (var i = 0; i < GameObjectHandlerConstants.maxObjects; i++)
		{
			for (var j = 0; j < GameObjectHandlerConstants.maxObjects; j++)
			{
				// Don't collide an object with itself...
				if (i == j) continue;
				gameObjectsArray[i].collide(gameObjectsArray[j]);
			}
		}
	}
	
	// Called to draw all objects.
	this.drawAll = function(pPaused, spriteList, drawQueue, showHitBoxes)
	{
		for (var i = 0; i < GameObjectHandlerConstants.maxObjects; i++)
		{
			gameObjectsArray[i].draw(pPaused, spriteList, drawQueue, showHitBoxes);
		}
	}
	
	// Called to destroy all objects.
	this.destroyAll = function(pIsStarting)
	{
		for (var i = 0; i < GameObjectHandlerConstants.maxObjects; i++)
		{
			gameObjectsArray[i].destroy(pIsStarting);
		}
		objectCount = 0;
	}
	
	// Called to run a custom loop. If the rule executes to false on any object, the function returns false; true otherwise.
	this.customBooleanLoop = function(pRule)
	{
		for (var i = 0; i < GameObjectHandlerConstants.maxObjects; i++)
		{
			if (!pRule(gameObjectsArray[i])) return false;
		}
		return true;
	}
	
	// Called to run a custom loop. If the rule executes to true on an object, the function returns that object; null otherwise.
	this.customObjectLoop = function(pRule)
	{
		for (var i = 0; i < GameObjectHandlerConstants.maxObjects; i++)
		{
			if (pRule(gameObjectsArray[i])) return false;
		}
		return null;
	}
}

//**********************************************************************************************************************
// Game object closure:
function GameObject( pIndex, pHandler )
{
	// General variables:
	var index = pIndex;
	this.active = false;
	this.handler = pHandler;
	
	// Type variables:
	this.type;
	this.module = null;
	
	// Physics variables:
	this.position = {x:0, y:0, z:0};
	this.prevPos = {x:0, y:0, z:0};
	this.velocity = {x:0, y:0, z:0};
	
	this.collisionRect = {l:0, t:0, w:0, h:0};
	this.collision = {l:0, t:0, w:0, h:0};
	
	// Drawing variables:
	this.drawDepth = 0;
	this.alpha = 1.0;
	this.scale = 1.0;
	this.relative = false;
	
	// Sprite variables.
	this.spriteIndex = 0;
	this.frameIndex = 0.0;
	this.frameSpeed = 0.0;
	
	this.spriteLoop = true;
	this.defaultDraw = true;
	this.animationEnd = null;
	
	// Retrieve's the object's index.
	this.getIndex = function()
	{
		return index;
	}
	
	// Called to initialize new game objects.
	this.init = function(pType, pModule, pPosition)
	{
		// Initialize the starting variables first.
		this.type = pType;
		this.position.x = pPosition.x; this.position.y = pPosition.y; this.position.z = 0;
		this.velocity.x = 0; this.velocity.y = 0; this.velocity.z = 0;
		this.collisionRect.l = 0; this.collisionRect.t = 0; this.collisionRect.w = 0; this.collisionRect.h = 0;
		this.drawDepth = 0;
		this.alpha = 1.0;
		this.scale = 1.0;
		this.relative = false;
		
		this.spriteLoop = true;
		this.defaultDraw = true;
		this.animationEnd = null;
		
		this.spriteIndex = 0; this.frameIndex = 0; this.frameSpeed = 0.0; this.spriteLoop = true;

		// Create and initialize the module, if applicable.
		this.module = pModule;
		if (this.module != null)
		{
			this.module.initialize();
		}
		
		// Set up remaining variables.
		this.updateCollisionArea();
		this.prevPos.x = 0; this.prevPos.y = 0; this.prevPos.z = 0;
		
		// Activate the object.
		this.active = true;
	}
	
	// Called to update the game object.
	this.update = function()
	{
		// Skip inactive objects.
		if (!this.active) return;
		
		var collisionChanged = false;
		
		// Save the current position.
		this.prevPos.x = this.position.x;
		this.prevPos.y = this.position.y;
		this.prevPos.z = this.position.z;
		
		// Call the module's update method.
		if (this.module != null)
		{
			collisionChanged = this.module.update();
		}
		
		// Move the object according to its velocity.
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		this.position.z += this.velocity.z;
		
		// If the position changed, update our collision area.
		if (this.position.x != this.prevPos.x || this.position.y != this.prevPos.y || collisionChanged)
		{
			this.updateCollisionArea();
		}
	}
	
	this.updateCollisionArea = function()
	{
		this.collision.l = Math.round(this.position.x) + this.collisionRect.l;
		this.collision.t = Math.round(this.position.y) + this.collisionRect.t;
		this.collision.w = this.collisionRect.w;
		this.collision.h = this.collisionRect.h;
	}
	
	// Called to check for collisions between two objects.
	this.collide = function(pOther)
	{
		if (!this.active || !pOther.active) return;
		// If we're of a type that doesn't handle collisions, skip.
		if (this.collisionRect.w <= 0 || this.collisionRect.h <= 0) return;
		
		// Get the intersection depth of the objects' rectangles.
		//var depth = RectangleIntersectionDepth(this.collision, pOther.collision);
		
		// If we collided, call the module's collision event.
		//if (depth.x != 0 || depth.y != 0)
		if (collideRects(this.collision, pOther.collision))
		{
			if (this.module != null)
			{
				this.module.collide(pOther);
			}
		}
	}
	
	// Called to draw the object.
	this.draw = function(pPaused, spriteList, drawQueue, showHitBoxes)
	{
		if (!this.active) return;
		
		var shake = {x:0, y:0};
		
		// Call the module's draw event.
		if (this.module != null)
		{
			shake = this.module.draw(spriteList, drawQueue);
		}
		
		
		// Animate and draw the sprite, if we have one set.
		if (this.spriteIndex > -1 && this.defaultDraw)
		{
			// Animate the sprite.
			if (!pPaused) this.frameIndex += this.frameSpeed * 1 / GameEngineConstants.fps;
			
			var looped = false;
			// Handle the end of the animation (loop or stop animation)
			if (this.frameIndex >= spriteList.getSheetWithID(this.spriteIndex).frameCount)
			{
				if (!this.spriteLoop) this.frameIndex = spriteList.getSheetWithID(this.spriteIndex).frameCount - 1;
				else this.frameIndex = 0;
				looped = true;
			}
			else if (this.frameIndex < 0)
			{
				if (!this.spriteLoop) this.frameIndex = 0;
				else this.frameIndex += spriteList.getSheetWithID(this.spriteIndex).frameCount;
				looped = true;
			}
			if (looped)
			{
				// If sprite loop is turned off, stop the animation.
				if (!this.spriteLoop) this.frameSpeed = 0.0;
				// If we have an animation end event, fire that.
				if (this.animationEnd != null) this.animationEnd();
			}//*/
			
			// Add the sprite to the draw queue.
			drawQueue.addSpriteToQueue(this.spriteIndex, this.frameIndex, {x:Math.floor(this.position.x + shake.x), y:Math.floor(this.position.y + shake.y - this.position.z)}, this.drawDepth, this.alpha, this.relative);
		}
		
		// If the debug option to show hitboxes is true, draw the hitboxes.
		if (showHitBoxes)
		{
			drawQueue.addRectToQueue(this.collision, "#ff0000", 10000, 1, 1, false);
		}
	}
	
	// Used to change sprites, automatically resetting the frame index if needed.
	this.changeSprite = function(pNewSprite)
	{
		if (this.spriteIndex != pNewSprite)
		{
			this.frameIndex = 0.0;
			this.spriteIndex = pNewSprite;
		}
	}
	
	// Called to destroy an object.
	this.destroy = function(pIsStarting)
	{
		if (!this.active) return;
		// Call the module's destroy event.
		if (this.module != null && !pIsStarting)
		{
			this.module.destroy();
		}
		// Reset the module and deactivate the object.
		this.module = null;
		this.active = false;
	}
}

//**********************************************************************************************************************