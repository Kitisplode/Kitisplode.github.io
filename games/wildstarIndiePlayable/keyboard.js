// Project: WildstarIndie
// File: keyboard.js
// Desc: Contains the necessary functions and such to use keyboard input.
// Author: Kitsu
// Created: February 22, 2013
//
//**************************************************************************************************

// Class that contains the keyboard information.
function Keyboard()
{
	// Array to store the keystates for later use.
	var keystates = new Array();
	for (var i = 0; i < 256; i++)
		keystates[i] = false;

	// Array to store the keystates.
	var pressed = new Array();
	for (var i = 0; i < 256; i++)
		pressed[i] = false;
		
	// Array to store the previous keystates.
	var prevPressed = new Array();
	for (var i = 0; i < 256; i++)
		prevPressed[i] = false;
		
	// Some common key codes.
	this.LEFT = 37;
	this.RIGHT = 39;
	this.UP = 38;
	this.DOWN = 40;
	
	// Method to update the previous keystates. Call every loop.
	this.Update = function()
	{
		for (var i = 0; i < 256; i++)
		{
			prevPressed[i] = pressed[i];
			pressed[i] = keystates[i];
		}
	}
	
	// Methods to check keystates.
	this.KeyPressed = function(keycode)
	{
		if (pressed[keycode] && !prevPressed[keycode]) return true;
		return false;
	}
	
	this.KeyReleased = function(keycode)
	{
		if (prevPressed[keycode] && !pressed[keycode]) return true;
		return false;
	}
	
	this.KeyUp = function(keycode)
	{
		return !pressed[keycode];
	}
	
	this.KeyDown = function(keycode)
	{
		return pressed[keycode];
	}
	
	// Methods to hook up to the keyboard events.
	this.OnKeyUp = function(event)
	{
		keystates[event.which] = false;
	}
	
	this.OnKeyDown = function(event)
	{
		keystates[event.which] = true;
	}
}

// Keyboard instance.
var g_keyboard = new Keyboard();

// Connect up some functions to the keyboard events.
window.addEventListener('keyup', function(event) {g_keyboard.OnKeyUp(event);}, false);
window.addEventListener('keydown', function(event) {g_keyboard.OnKeyDown(event);}, false);