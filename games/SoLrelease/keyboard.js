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
		g_lastKeyPressed = this.FirstKeyPressed();
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
	
	// Method that returns the first key on the stack that was just pressed. Returns 256 if none of them have just been pressed.
	this.FirstKeyPressed = function()
	{
		var i = 0;
		for (; i < 256; i++)
		{
			// Skip function keys and other special keys.
			if (i <= 13) continue;
			if (i > 13 && i < 16) continue;
			if (i > 19 && i < 37) continue;
			if (i > 40 && i < 48) continue;
			if (i > 90 && i < 96) continue;
			if (i > 110 && i < 187) continue;
			if (i > 190 && i < 222) continue;
			if (i > 222) continue;
			if (i >= 112 && i <= 123) continue;
			if (i == 144 || i == 145) continue;
			if (i == 19 || i == 27) continue;
			if (i >= 33 && i <= 36) continue;
			if (i == 45 || i == 46) continue;
			if (i == 91 || i == 92) continue;
			if (i == 93) continue;
			
			// If this key is pressed, break out.
			if (this.KeyPressed(i)) break;
		}
		return i;
	}
	
	// Method that clears all the input arrays.
	this.ClearInput = function()
	{
		for (var i = 0; i < 256; i++)
			pressed[i] = false;
		for (var i = 0; i < 256; i++)
			prevPressed[i] = false;
	}
}

// A function that converts a keycode into a short string.
function KeyCodeToString(keycode)
{
	var result = "";
	
	if (keycode == 8) result = "bkspc";
	else if (keycode == 9) result = "tab";
	else if (keycode == 13) result = "enter";
	else if (keycode == 16) result = "shift";
	else if (keycode == 17) result = "ctrl";
	else if (keycode == 18) result = "alt";
	else if (keycode == 20) result = "caps";
	else if (keycode == 37) result = "left";
	else if (keycode == 38) result = "up";
	else if (keycode == 39) result = "right";
	else if (keycode == 40) result = "down";
	else if (keycode >= 48 && keycode <= 90) result = String.fromCharCode(keycode);
	else if (keycode >= 96 && keycode <= 105) result = "num " + (keycode - 96).toString();
	else if (keycode == 106) result = "nmult";
	else if (keycode == 107) result = "nplus";
	else if (keycode == 108) result = "nmins";
	else if (keycode == 109) result = "num .";
	else if (keycode == 110) result = "ndiv";
	else if (keycode == 187) result = "equal";
	else if (keycode == 188) result = ",";
	else if (keycode == 189) result = "-";
	else if (keycode == 190) result = ".";
	else if (keycode == 222) result = "'";
	else result = "?????";
	
	return result;
}

var g_lastKeyPressed = 256;

// Keyboard instance.
var g_keyboard = new Keyboard();

// Connect up some functions to the keyboard events.
window.addEventListener('keyup', function(event) {g_keyboard.OnKeyUp(event);}, false);
window.addEventListener('keydown', function(event) {g_keyboard.OnKeyDown(event);}, false);