// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: renderer.js
// Desc: Contains the portion that handles rendering shapes and images to the canvas. Also loading of images.
// Author: mjensen
// Created: July 24, 2015
//
//**************************************************************************************************

// Closure that represents a loaded sprite sheet.
function SpriteSheet(n, imgref, f, fsize, forigin)
{
	// The name of the image.
	this.name = n;
	// The image that contains the spritesheet itself. Load it beforehand.
	this.image = imgref;
	// The number of frames the sheet has in it.
	this.frameCount = f;
	// The size of each frame.
	this.frameSize = fsize;
	// The origin of each frame.
	this.frameOrigin = forigin;
	
	var halfFrameSize = {x:fsize.x / 2, y:fsize.y / 2};
	
	var drawFramePos = {x:0 , y:0};
	
	// Method to draw a specified frame of the sheet.
	this.drawFrame = function(pPosition, pFrame, pAlpha, pCamera, pContext)
	{
		drawFramePos.x = Math.floor(pPosition.x - this.frameOrigin.x - pCamera.x);
		drawFramePos.y = Math.floor(pPosition.y - this.frameOrigin.y - pCamera.y);
		// If the frame is going to be off the screen, just don't draw it at all.
		if (drawFramePos.x + this.frameSize.x < 0 || drawFramePos.x - this.frameSize.x > pContext.canvas.clientWidth ||
			drawFramePos.y + this.frameSize.y < 0 || drawFramePos.y - this.frameSize.y > pContext.canvas.clientHeight)
			return;
		
		pFrame = Math.abs(Math.floor(pFrame));
		if (pFrame >= this.frameCount) pFrame = pFrame % this.frameCount;
		var prevAlpha = pContext.globalAlpha;
		pContext.globalAlpha = pAlpha;
		pContext.drawImage(this.image, Math.floor(pFrame * this.frameSize.x), 0, this.frameSize.x, this.frameSize.y,
							drawFramePos.x, drawFramePos.y,
							this.frameSize.x, this.frameSize.y);
		pContext.globalAlpha = prevAlpha;
	}
}

// Closure that handles loading of images.
function ImageLoader(pSpriteDirectory)
{
	var _this = this;
	// Array for storing loaded images.
	var spriteSheets = new Array();
	var spriteDir = pSpriteDirectory;
	
	var toLoad = 0;
	var loaded = 0;
	
	// Method for setting up an image to load.
	this.loadSpriteSheet = function(pFileName, pFrameCount, pFrameSize, pFrameOrigin)
	{
		// Ensure we can't add two sheets with the same name.
		if (_this.getSheet(pFileName) == null)
		{
			var sheet = new SpriteSheet(pFileName, null, pFrameCount, pFrameSize, pFrameOrigin);
			var tempimg = new Image();
			tempimg.src = spriteDir + "/" + pFileName;
			tempimg.onload = itemLoaded;
			sheet.image = tempimg;
			toLoad++;
			
			spriteSheets.push(sheet);
		}
	}
	
	// Method for checking to see if we're finished loading or not.
	this.isLoaded = function()
	{
		return toLoad == loaded;
	}
	
	// Method for getting a specific image by filename
	this.getSheet = function(pName)
	{
		var i = this.getSheetID(pName);
		if (i < spriteSheets.length) return spriteSheets[i];
		else return null;
	}
	
	// Method for getting a specific image's ID by filename
	this.getSheetID = function(pName)
	{
		for (var i = 0; i < spriteSheets.length; i++)
		{
			if (spriteSheets[i].name == pName) break;
		}
		return i;
	}
	
	// Method for getting a specific image by index
	this.getSheetWithID = function(pID)
	{
		if (pID < 0 || pID >= spriteSheets.length) return null;
		return spriteSheets[pID];
	}
	
	// Method for counting the total number of sheets.
	this.countSheets = function()
	{
		return spriteSheets.length;
	}
	
	// Method for checking load progress.
	this.loadProgress = function()
	{
		if (toLoad <= 0) return -1;
		return loaded / toLoad;
	}
	
	// Callback method for when images are finished loading.
	function itemLoaded()
	{
		loaded++;
	}
}

// Closure that handles rendering and loading of images.
function Renderer(pContext)
{
	var _this = this;
	var context = pContext;
	
	var drawQueue = new Array();
	
	this.cameraPosition = {x:0, y:0};
	var nonRelative = {x:0, y:0};
	
	// Called to add queue entries, sorted according to depth.
	function addToQueue(pDepth, pQueueEntry)
	{
		var i = 0;
		for (; i < drawQueue.length; i++)
		{
			if (drawQueue[i].depth > pDepth)
				break;
		}
		drawQueue.splice(i, 0, {depth: pDepth, entry:pQueueEntry});
		return i;
	}
	
	// Called to add a sprite to the queue.
	this.addSpriteToQueue = function(pSpriteID, pFrameID, pPosition, pDepth, pAlpha, pRelative)
	{
		var relaPos = (pRelative ? nonRelative : this.cameraPosition);
		return addToQueue(pDepth, new QueueSprite(pSpriteID, pFrameID, pPosition, pAlpha, relaPos));
	}
	
	this.addLineToQueue = function(pStartPos, pEndPos, pFill, pDepth, pAlpha, pLineWidth, pRelative)
	{
		var relaPos = (pRelative ? nonRelative : this.cameraPosition);
		return addToQueue(pDepth, new QueueLineRect(pStartPos, pEndPos, pFill, false, pAlpha, pLineWidth, relaPos));
	}
	this.addRectToQueue = function(pRect, pFill, pDepth, pAlpha, pLineWidth, pRelative)
	{
		var relaPos = (pRelative ? nonRelative : this.cameraPosition);
		return addToQueue(pDepth, new QueueLineRect({x:pRect.l, y:pRect.t}, {x:pRect.l + pRect.w, y:pRect.t + pRect.h}, pFill, true, pAlpha, pLineWidth, relaPos));
	}
	
	// Called to draw the full draw queue.
	this.drawFullQueue = function(pImageLoader)
	{
		if (drawQueue.length <= 0) return;
		
		for (var i = 0; i < drawQueue.length; i++)
		{
			drawQueue[i].entry.draw(pImageLoader, context);
		}
		
		drawQueue.length = 0;
		// Reset the camera shake.
		//g_spriteCameraShake.x = lerp(g_spriteCameraShake.x, 0, 0.1);
		//g_spriteCameraShake.y = lerp(g_spriteCameraShake.y, 0, 0.1);
	}
	
	// Called to find the number of elements on the draw queue.
	this.countDrawQueue = function()
	{
		return drawQueue.length;
	}
	
	// Closure that represents a queue entry for sprites.
	function QueueSprite(pSpriteID, pFrameID, pPosition, pAlpha, pCamera)
	{
		this.spriteIndex = pSpriteID;
		this.frame = pFrameID;
		this.position = {x:pPosition.x, y:pPosition.y};
		this.alpha = pAlpha;
		this.camera = pCamera;
		
		this.draw = function(pImageLoader, pContext)
		{
			var sheet = pImageLoader.getSheetWithID(this.spriteIndex);
			sheet.drawFrame(this.position, this.frame, this.alpha, this.camera, pContext);
		}
	}
	
	// Closure that represents a line or rectangle entry for sprites.
	function QueueLineRect(pStartPos, pEndPos, pFill, pIsRect, pAlpha, pLineWidth, pCamera)
	{
		this.startPos = {x:pStartPos.x, y:pStartPos.y};
		this.endPos = {x:pEndPos.x, y:pEndPos.y};
		this.fill = pFill;
		this.isRect = pIsRect;
		this.alpha = pAlpha;
		this.lineWidth = pLineWidth;
		this.camera = pCamera;
		
		this.draw = function(pImageLoader, pContext)
		{
			// Save and set the alpha.
			var prevAlpha = context.globalAlpha;
			pContext.globalAlpha = this.alpha;
			// Calculate relevant positions.
			var sp = vector2Floor(vector2Difference(this.startPos, this.camera));
			var ep = vector2Floor(vector2Difference(this.endPos, this.camera));
			// Set up the line drawing.
			pContext.fillStyle = this.fill;
			pContext.strokeStyle = this.fill;
			if (this.lineWidth > 0) pContext.lineWidth = this.lineWidth;
			else pContext.lineWidth = 1;
			// If it's not a rectangle, draw a line.
			if (!this.isRect)
			{
				pContext.beginPath();
				pContext.moveTo(sp.x, sp.y);
				pContext.lineTo(ep.x, ep.y);
				pContext.stroke();
			}
			// Otherwise, draw a rectangle.
			else
			{
				// If the line width is less than 1, draw a filled rectangle.
				if (this.lineWidth < 1) pContext.fillRect(sp.x, sp.y, ep.x - sp.x, ep.y - sp.y);
				// Otherwise, draw an unfilled one.
				else pContext.strokeRect(sp.x, sp.y, ep.x - sp.x, ep.y - sp.y);
			}
			// Reset the alpha.
			pContext.globalAlpha = prevAlpha;
		}
	}
}