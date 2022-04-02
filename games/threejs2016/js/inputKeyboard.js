// Project: Game Engine 2015
// File: inputKeyboard.js
// Desc: Contains the closure that handles keyboard input.
// Author: mjensen
// Created: March 06, 2016
//
//**************************************************************************************************

function InputKeyboard(pEngine)
{
	var _this = this;
	var engine = pEngine;
	
	var keyCount = 256;
	// Array to store the keystates for later use.
	var keystates = new Array();
	for (var i = 0; i < keyCount; i++)
		keystates[i] = false;

	// Array to store the keystates.
	var pressed = new Array();
	for (var i = 0; i < keyCount; i++)
		pressed[i] = false;
		
	// Array to store the previous keystates.
	var prevPressed = new Array();
	for (var i = 0; i < keyCount; i++)
		prevPressed[i] = false;
	
	this.latestKeyPressed = -1;
	
	// Method to initialize the keyboard events.
	this.initialize = function()
	{
		// Connect up some functions to the keyboard events.
		window.addEventListener('keyup', _this.onKeyUp, false);
		window.addEventListener('keydown', _this.onKeyDown, false);
	}
	
	// Method to update the previous keystates. Call every loop.
	this.update = function()
	{
		for (var i = 0; i < keyCount; i++)
		{
			prevPressed[i] = pressed[i];
			pressed[i] = keystates[i];
		}
	}
	
	// Methods to check keystates.
	this.isKeyPressed = function(keycode)
	{
		if (pressed[keycode] && !prevPressed[keycode]) return true;
		return false;
	}
	
	this.isKeyReleased = function(keycode)
	{
		if (prevPressed[keycode] && !pressed[keycode]) return true;
		return false;
	}
	
	this.isKeyUp = function(keycode)
	{
		return !pressed[keycode];
	}
	
	this.isKeyDown = function(keycode)
	{
		return pressed[keycode];
	}
	
	this.isAnyKeyDown = function()
	{
		for (var i = 0; i < keyCount; i++)
		{
			if (pressed[i]) return true;
		}
		return false;
	}
	
	// Methods to hook up to the keyboard events.
	this.onKeyUp = function(event)
	{
		keystates[event.which] = false;
	}
	
	this.onKeyDown = function(event)
	{
		keystates[event.which] = true;
		_this.latestKeyPressed = event.which;
	}
	
	// Method that clears all the input arrays.
	this.clearInput = function()
	{
		for (var i = 0; i < keyCount; i++)
			pressed[i] = false;
		for (var i = 0; i < keyCount; i++)
			prevPressed[i] = false;
	}
	
	// Several commonly used keycodes.
	this.keyCodes = {
		left: 37,
		right: 39,
		up: 38,
		down: 40,
		n0:	48,
		n1:	49,
		n2:	50,
		n3:	51,
		n4:	52,
		n5:	53,
		n6:	54,
		n7:	55,
		n8:	56,
		n9:	57,
		a:	65,
		b:	66,
		c:	67,
		d:	68,
		e:	69,
		f:	70,
		g:	71,
		h:	72,
		i:	73,
		j:	74,
		k:	75,
		l:	76,
		m:	77,
		n:	78,
		o:	79,
		p:	80,
		q:	81,
		r:	82,
		s:	83,
		t:	84,
		u:	85,
		v:	86,
		w:	87,
		x:	88,
		y:	89,
		z:	90,
		num0:	96,
		num1:	97,
		num2:	98,
		num3:	99,
		num4:	100,
		num5:	101,
		num6:	102,
		num7:	103,
		num8:	104,
		num9:	105,
		bkspc:8,
		tab:9,
		enter:13,
		shift:16,
		ctrl:17,
		alt:18,
		caps:20
	};
}

// A function that converts a keycode into a short string.
/*
function keyCodeToString(keycode)
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
}//*/
