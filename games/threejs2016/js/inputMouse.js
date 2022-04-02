// Project: Game Engine 2015
// File: inputMouse.js
// Desc: Contains the closure that handles mouse input.
// Author: mjensen
// Created: July 27, 2015
//
//**************************************************************************************************
var InputMouseConstants = 
{
	maxTouches: 50
};

//
function InputMouse (pEngine, pElement)
{
	var _this = this;
	var engine = pEngine;
	
	var mousePosition = {x:-1, y:-1};
	
	var mouseButton = false;
	var previousMouseButton = false;
	// Used to temporarily store the condition of the button upon event updates.
	var tempButton = false;
	
	// The DOM element this mouse tracker is tied to.
	var element = pElement;
	
	// Method to retrieve the mouse's current position.
	this.getPosition = function()
	{
		return {x:mousePosition.x, y:mousePosition.y};
	}
	
	// Methods to check the condition of the mouse button.
	this.isDown = function()
	{
		return mouseButton;
	}
	
	this.isUp = function()
	{
		return !mouseButton;
	}
	
	this.isPressed = function()
	{
		return (mouseButton && !previousMouseButton);
	}
	
	this.isReleased = function()
	{
		return (!mouseButton && previousMouseButton);
	}
	
	// Stores a list of current touches.
	var touchList = new Array();
	var currentTouchID = 0;
	function getTouchByID(index)
	{
		var i = 0;
		for (; i < touchList.length; i++)
		{
			if (touchList[i].id = index) break;
		}
		return i;
	}
	// Method to retrieve all current touches on the screen.
	this.getTouches = function()
	{
		return touchList;
	}
	this.getTouchCount = function()
	{
		return touchList.length;
	}
	
	// Called to hook up the mouse events to the connected DOM element.
	this.initialize = function()
	{
		// Hook up those events.
		element.addEventListener("mouseover", this.event_getMousePos, false);
		element.addEventListener("mousemove", this.event_getMousePos, false);
		element.addEventListener("mouseout", this.event_getMousePos, false);
		element.addEventListener("mousedown", this.event_getMousePos, false);
		element.addEventListener("mouseup", this.event_getMousePos, false);
		
		element.addEventListener("touchstart", this.event_getTouchPos, false);
		element.addEventListener("touchmove", this.event_getTouchPos, false);
		element.addEventListener("touchend", this.event_getTouchPos, false);
		
		// Hook another event in to keep the window from scrolling/zooming from touches.
		window.addEventListener("touchstart", this.event_touchRestrictScrolling, false);
		window.addEventListener("touchmove", this.event_touchRestrictScrolling, false);
		window.addEventListener("touchend", this.event_touchRestrictScrolling, false);
	}
	
	// Called to update the current status of the mouse.
	this.update = function()
	{
		previousMouseButton = mouseButton;
		mouseButton = tempButton;
		
		for (var i = 0; i < touchList.length; i++)
		{
			touchList.duration++;
		}
	}
	
	this.adjustVectorForFullScreen = function(pFullScreen, v)
	{
		if (!pFullScreen) return;
		v.x *= engine.screenSize.x / engine.windowSize.x;
		v.y *= engine.screenSize.y / engine.windowSize.y;
	}
	
	// Event to retrieve the mouse's position.
	this.event_getMousePos = function(event)
	{
		// If the mouse didn't just leave the element, capture the mouse's position.
		if (event.type != "mouseout")
		{
			var elementPosition = {x: element.offsetLeft, y: element.offsetTop};
			mousePosition.x = event.pageX - elementPosition.x;
			mousePosition.y = event.pageY - elementPosition.y;
			// If we're in full screen, adjust the mouse position to account for the difference in size.
			_this.adjustVectorForFullScreen(engine.fullScreen, mousePosition)
			// If it's a mouse button related event, set the mouse button status.
			if (event.type == "mousedown")
				tempButton = true;
			else if (event.type == "mouseup")
				tempButton = false;
		}
		// Otherwise, reset the mouse's status.
		else
		{
			mousePosition.x = -1; mousePosition.y = -1;
			tempButton = false;
		}
	}
	
	// Event to retrieve the latest touch position.
	this.event_getTouchPos = function(event)
	{
		// Prevent touch-based zooming.
		_this.event_touchRestrictScrolling(event);
		// If the touch didn't just leave the element, capture its position.
		if (event.type != "touchend")
		{
			var touch = event.touches[event.touches.length - 1];
			var elementPosition = {x: element.offsetLeft, y: element.offsetTop};
			mousePosition.x = touch.screenX - elementPosition.x;
			mousePosition.y = touch.screenY - elementPosition.y;
			_this.adjustVectorForFullScreen(engine.fullScreen, mousePosition);
			tempButton = true;
		}
		// Otherwise, reset the touch's status.
		else
		{
			mousePosition.x = -1; mousePosition.y = -1;
			tempButton = false;
		}
		
		switch (event.type)
		{
			case "touchstart":
				_this.event_touchStart(event);
				break;
			case "touchmove":
				_this.event_touchMove(event);
				break;
			case "touchend":
				_this.event_touchEnd(event);
				break;
			default:
				console.log("Unsupported touch event " + event.type + " lol");
				break;
		}
	}
	
	this.event_touchStart = function(event)
	{
		// Add the new touch to the touch list.
		var elementPosition = {x: element.offsetLeft, y: element.offsetTop};
		for (var i = 0; i < event.changedTouches.length; i++)
		{
			var touch = event.changedTouches[i];
			touchList.push({id:touch.identifier, position:{x:touch.screenX - elementPosition.x, y:touch.screenY - elementPosition.y}, duration:0});
			_this.adjustVectorForFullScreen(engine.fullScreen, touchList.position);
		}
	}
	
	this.event_touchMove = function(event)
	{
		// Update moved touches.
		var elementPosition = {x: element.offsetLeft, y: element.offsetTop};
		for (var i = 0; i < event.changedTouches.length; i++)
		{
			var touch = event.changedTouches[i];
			var index = getTouchByID(touch.identifier);
			touchList[index].position.x = touch.screenX - elementPosition.x;
			touchList[index].position.y = touch.screenY - elementPosition.y;
		}
	}
	
	this.event_touchEnd = function(event)
	{
		// Remove dead touches.
		for (var i = 0; i < event.changedTouches.length; i++)
		{
			var touch = event.changedTouches[i];
			var index = getTouchByID(touch.identifier);
			touchList.splice(index, 1);
		}
	}
	
	this.event_touchRestrictScrolling = function(event)
	{
		event.preventDefault();
	}
}