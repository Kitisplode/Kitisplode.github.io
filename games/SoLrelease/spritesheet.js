// Project: WildstarIndie
// File: spritesheet.js
// Desc: Contains the classes used for animated sprites.
// Author: Kitsu
// Created: November 21, 2012
//
//**************************************************************************************************

// An array to store the spritesheets we have so they're easily accessible.
var g_SpriteSheetList = new Array();

// An array to store the sprites to be drawn as like a depth-sorted queue.
var g_SpriteDrawQueue = new Array();

// Class to contain information on the sprite to be drawn in the queue.
function SpriteQueueEntry(si, f, p, d, r)
{
	this.spriteIndex = si;
	this.frame = f;
	this.position = {x:p.x, y:p.y};
	this.depth = d;
	this.rotation = r;
}

g_LineDrawQueue = new Array();

// Class to contain information on the lines to be drawn in the line queue.
function LineQueueEntry(s, e, c, r, d, lw)
{
	this.startPos = {x:s.x, y:s.y};
	this.endPos = {x:e.x, y:e.y};
	this.color = c;
	this.rect = r;
	this.depth = d;
	this.lineWidth = lw;
}

// Variable to act as the position of the camera.
var g_spriteCamera = {x:0, y:0};
var g_spriteCameraGoTo = {x:0, y:0};
var g_spriteCameraShake = {x:0, y:0};

// Class that represents a spritesheet.
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
	
	// Method to draw a specified frame of the sheet.
	this.DrawFrame = function(p, fr, alpha, context)
	{
		var pos = {x:Math.floor(p.x), y:Math.floor(p.y)}
		fr = Math.floor(fr);
		if (fr >= this.frameCount) fr = fr % this.frameCount;
		var prevAlpha = context.globalAlpha;
		context.globalAlpha = alpha;
		context.drawImage(this.image, Math.floor(fr * this.frameSize.x), 0, this.frameSize.x, this.frameSize.y, Math.floor(pos.x - this.frameOrigin.x - g_spriteCamera.x), Math.floor(pos.y - this.frameOrigin.y - g_spriteCamera.y), this.frameSize.x, this.frameSize.y);
		context.globalAlpha = prevAlpha;
	}
}

// Function to add a sprite to the sprite queue.
function AddSpriteToQueue(si, f, p, d, r)
{
	// Step through the queue to find the position we should insert this entry to.
	var i = 0;
	for (;i < g_SpriteDrawQueue.length; i++)
	{
		if (g_SpriteDrawQueue[i].depth >= d)
			break;
	}
	// Put the entry in that position.
	g_SpriteDrawQueue.splice(i, 0, new SpriteQueueEntry(si, f, p, d, r));
}

// Function to clear the sprite queue.
function ClearSpriteQueue()
{
	g_SpriteDrawQueue.length = 0;
}

// Function to draw the sprite queue.
function DrawSpriteQueue(context)
{
	if (g_SpriteDrawQueue.length <= 0)
		return;

	// Step through the queue and draw each sprite.
	for (var i = 0; i < g_SpriteDrawQueue.length; i++)
	{
		g_SpriteSheetList[g_SpriteDrawQueue[i].spriteIndex].DrawFrame(g_SpriteDrawQueue[i].position, g_SpriteDrawQueue[i].frame, g_SpriteDrawQueue[i].rotation, context);
	}
	// Clear the queue.
	ClearSpriteQueue();
	// Reset the camera shake.
	g_spriteCameraShake.x = 0;
	g_spriteCameraShake.y = 0;
}

function AddLineToQueue(sp, ep, c, r, d, lw)
{
	var i = 0;
	for (; i < g_LineDrawQueue.length; i++)
	{
		if (g_LineDrawQueue[i].depth >= d)
			break;
	}
	g_LineDrawQueue.splice(i, 0, new LineQueueEntry(sp, ep, c, r, d, lw));
}

function DrawLineQueue(context)
{
	if (g_LineDrawQueue.length <= 0)
		return;
		
	for (var i = 0; i < g_LineDrawQueue.length; i++)
	{
		var sp = {x:Math.floor(g_LineDrawQueue[i].startPos.x), y:Math.floor(g_LineDrawQueue[i].startPos.y)};
		var ep = {x:Math.floor(g_LineDrawQueue[i].endPos.x), y:Math.floor(g_LineDrawQueue[i].endPos.y)};
	
		context.fillStyle = g_LineDrawQueue[i].color;
		context.strokeStyle = g_LineDrawQueue[i].color;
		if (g_LineDrawQueue[i].lineWidth > 0) context.lineWidth = g_LineDrawQueue[i].lineWidth;
		else context.lineWidth = 1;
		
		// If it's not a rectangle, draw a line.
		if (!g_LineDrawQueue[i].rect)
		{
			context.beginPath();
			context.moveTo(sp.x - g_spriteCamera.x, sp.y - g_spriteCamera.y);
			context.lineTo(ep.x - g_spriteCamera.x, ep.y - g_spriteCamera.y);
			context.stroke();
		}
		// Otherwise, draw a rectangle.
		else
		{
			if (g_LineDrawQueue[i].lineWidth > 0) context.fillRect(g_LineDrawQueue[i].startPos.x - g_spriteCamera.x, g_LineDrawQueue[i].startPos.y - g_spriteCamera.y, g_LineDrawQueue[i].endPos.x - g_LineDrawQueue[i].startPos.x, g_LineDrawQueue[i].endPos.y - g_LineDrawQueue[i].startPos.y);
			else context.strokeRect(g_LineDrawQueue[i].startPos.x - g_spriteCamera.x, g_LineDrawQueue[i].startPos.y - g_spriteCamera.y, g_LineDrawQueue[i].endPos.x - g_LineDrawQueue[i].startPos.x, g_LineDrawQueue[i].endPos.y - g_LineDrawQueue[i].startPos.y);
		}
	}
	g_LineDrawQueue.length = 0;
}