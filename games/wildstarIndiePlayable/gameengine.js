// Project: WildstarIndie
// File: gameengine.js
// Desc: Contains the primary game logic for the game engine. Object interactions are
//			handled in another file containing the object classes.
// Author: Kitsu
// Created: March 14, 2013
//
//**************************************************************************************************

/* -- Important References -- */

/* -- Static Assets -- */

// Fonts

// Images
var imagenamelist = new Array();
var imagelist = new Array();

// Sounds
var audiotype;

var soundnamelist = new Array();
var soundlist = new Array();

var tempExSounds = new Array();

// Called to play a specified sound at the specified volume.
function PlaySound(n, vol, firsttime)
{
	if (n < 0 || n >= soundlist.length) return;
	
	// If the sound is currently playing, create a temp copy to play instead.
	if (!soundlist[n].ended && !firsttime)
	{
		var tempsound = document.createElement("audio");
		document.body.appendChild(tempsound);
		tempsound.setAttribute("src", soundlist[n].src);
		tempsound.play();
		tempsound.volume = vol * g_globalvolume;
		tempExSounds.push(tempsound);
	}
	else//*/
	{
		soundlist[n].pause();
		soundlist[n].currentTime = 0;
		soundlist[n].play();
		soundlist[n].volume = vol * g_globalvolume;
	}
}

// Music
var songnamelist = new Array();
var songlist = new Array();

var g_currentbgm;

function SongElement(s, v)
{
	this.song = s;
	this.volume = v;
}

function SwitchMusic(index)
{
	// Stop the current music.
	if (g_currentbgm >= 0 && g_currentbgm < songlist.length)
		songlist[g_currentbgm].stop();
	// Start the new music.
	g_currentbgm = index;
	if (g_currentbgm >= 0 && g_currentbgm < songlist.length)
	{
		songlist[g_currentbgm].play();
		songlist[g_currentbgm].volume(g_globalvolume * 0.5);
	}
}

// SpriteSheet Array
//var SpriteSheetList = new Array();

var mainTileMap = new tileMap();


/* -- Game/service related variables -- */

// Loading trackers.
var toload = 0;
var loaded = 0;

// Other global variables.
var g_fps = 30;
var g_maxobjects = 512;

// Directories for 
var dir_sprites =	"Sprites/";
var dir_scripts =	"Scripts/";
var dir_songs =		"Songs/";
var dir_sounds =	"Sounds/";

// Input variables.
var mousePos =
{
	x: -1,
	y: -1
}
var mouseInput = true;
var mouseClick = true;
var prevMouse = mouseClick;

// Functions for checking the mouse state.
function MouseClicked()
{
	if (mouseClick && !prevMouse) return true;
	return false;
}

function MouseReleased()
{
	if (!mouseClick && prevMouse) return true;
	return false;
}

// Gameobject array. Fill it with default, inactive objects first.
var GameObjectArray = new Array();
for (var i = 0; i < g_maxobjects; i++)
{
	GameObjectArray[i] = new GameObject(i);
}

// Function to create a new object in the array.
function CreateGameObject(t, p)
{
	// Find the first empty space in the array.
	var i = 0;
	for (; i < g_maxobjects; i++)
	{
		if (!GameObjectArray[i].active)
			break;
	}
	// If we didn't find any empty spaces, return the size (indicating such).
	if (i >= g_maxobjects) return i;
	// Otherwise, create the object.
	GameObjectArray[i].Initialize(t, p);
	return i;
}

// Function to destroy a specified object in the array.
function DestroyGameObject(i)
{
	// If the specified object isn't even active, skip this.
	if (!GameObjectArray[i].active) return;
	// Otherwise, destroy it.
	GameObjectArray[i].Destroy();
}

// Return the ID of the object of the specified type that collides with the object with the given id.
function GetObjectAtPointRects(pos, type, id)
{
	var i = 0;
	for (; i < g_maxobjects; i++)
	{
		if (i == id || !GameObjectArray[i].active || GameObjectArray[i].type != type) continue;
		if (GameObjectArray[id].CollideObjects(GameObjectArray[i], pos)) break;
	}
	if (i >= g_maxobjects) return -1;
	return i;
}
function GetObjectAtPointNoRects(pos, type, id)
{
	var i = 0;
	for (; i < g_maxobjects; i++)
	{
		if (i == id || !GameObjectArray[i].active || (type == -1 || (type != -1 && GameObjectArray[i].type != type))) continue;
		if (GameObjectArray[id].CollidePoint(GameObjectArray[i], pos)) break;
	}
	if (i >= g_maxobjects) return -1;
	return i;
}
// Return the ID of the object of the specified type that collides with the given rectangle.
function GetObjectAtRect(rect, type, id)
{
	var i = 0;
	for (; i < g_maxobjects; i++)
	{
		if (i == id || !GameObjectArray[i].active || (type == -1 || (type != -1 && GameObjectArray[i].type != type))) continue;
		var temp = RectangleIntersectionDepth(rect, GameObjectArray[i].collision);
		if (temp.x != 0 || temp.y != 0) break;
	}
	if (i >= g_maxobjects) return -1;
	return i;
}
// Returns the number of objects with the specified type.
function CountObject(type)
{
	var count = 0;
	for (var i = 0; i < g_maxobjects; i++)
	{
		if (type == -1 && !GameObjectArray[i].active)
		{
			count++;
			continue;
		}
		if (!GameObjectArray[i].active || GameObjectArray[i].type != type) continue;
		count++;
	}
	return count;
}

/* -- Class Definitions -- */

function imagenamelistEntry(n, fc, s, c)
{
	this.name = n;
	this.frameCount = fc;
	this.size = {x:s.x, y:s.y};
	this.center = {x:c.x, y:c.y};
}


/* -- Global Constants -- */

/* -- Global Methods -- */

// Create a window loaded event that will start the Canvas application after the page loads.
window.addEventListener('load', eventWindowLoaded, false);
function eventWindowLoaded()
{
	infoBox = document.getElementById("infobox");
	debug = document.getElementById("debugger");
	canvasApplication = new canvasApp();
}

// A function to make sure that we even have canvas support. Make sure the webpage loads the modernizr script before this script.
function canvasSupport ()
{
	return Modernizr.canvas;
}

// Function that returns the most supported audio format.
function supportedAudioFormat(audio)
{
	var returnExtension = "";
	if (audio.canPlayType("audio/ogg") =="probably" || audio.canPlayType("audio/ogg") == "maybe")
	{
		returnExtension = "ogg";
	}
	else if(audio.canPlayType("audio/wav") == "probably" || audio.canPlayType("audio/wav") == "maybe")
	{
		returnExtension = "mp3";
	}
	else if(audio.canPlayType("audio/wav") =="probably" || audio.canPlayType("audio/wav") == "maybe")
	{
		returnExtension = "wav";
	}
	return returnExtension;
	
}

// Gets the position of the given object.
function findPos(obj)
{
    var curleft = 0, curtop = 0;
    if (obj.offsetParent)
	{
        do
		{
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

// A list of the sprite indices.
var spriteIndices =
{
	spr_bunnyIdle_L: 1,
	spr_bunnyIdle_R: 2,
	spr_bunnyRun_L: 3,
	spr_bunnyRun_R: 4,
	spr_bunnyJump_L: 5,
	spr_bunnyJump_R: 6,
	spr_bunnyThrow_L: 7,
	spr_bunnyThrow_R: 8,
	
	bg_outside:9,
	bg_cliffsback: 10,
	bg_cliffsback2: 11,
	
	spr_bladeAppear: 12,
	spr_blade: 13,
	spr_hudStuff: 14,
	
	spr_crabIdle_L: 15,
	spr_crabIdle_R: 16,
	spr_crabHurt_L: 17,
	spr_crabHurt_R: 18,
	
	spr_bladeTrail: 19,
	spr_bap: 20,
	
	spr_bunnyHurt_L: 21,
	spr_bunnyHurt_R: 22,
	
	bg_title: 23,
	spr_menustuff: 24,
	
	spr_rockIdle_L: 25,
	spr_rockIdle_R: 26,
	spr_rockRun_L: 27,
	spr_rockRun_R: 28,
	spr_rockJump_L: 29,
	spr_rockJump_R: 30,
	spr_rockSword_L: 31,
	spr_rockSword_R: 32,
	spr_swordFlame_L: 33,
	spr_swordFlame_R: 34,
	spr_rockHurt_L: 35,
	spr_rockHurt_R: 36,
	spr_rockSpin_L: 37,
	spr_rockSpin_R: 38,
	spr_spinFlame_L: 39,
	spr_spinFlame_R: 40,
	
	spr_guyIdle_L: 41,
	spr_guyIdle_R: 42,
	spr_guyIdle_LU: 43,
	spr_guyIdle_RU: 44,
	spr_guyRun_L: 45,
	spr_guyRun_R: 46,
	spr_guyRun_LU: 47,
	spr_guyRun_RU: 48,
	spr_guyJump_L: 49,
	spr_guyJump_R: 50,
	spr_guyJump_LU: 51,
	spr_guyJump_RU: 52,
	spr_guyJump_LD: 53,
	spr_guyJump_RD: 54,
	spr_guyFlip_L: 55,
	spr_guyFlip_R: 56,
	spr_guyHurt_L: 57,
	spr_guyHurt_R: 58,
	spr_guyShots: 59,
	spr_shotPiff: 60,
	
	spr_dustDash_L: 62,
	spr_dustDash_R: 63,
	spr_rabbit_L: 64,
	spr_rabbit_R: 65,
	spr_rabbitHurt_L: 66,
	spr_rabbitHurt_R: 67,
	
	bg_inside_01: 68,
	bg_in_arms: 69,
	
	spr_doorCracked: 70,
	bg_out_cliff_bot: 71,
	spr_textbg: 72,
	
	spr_hermit_LD: 73,
	spr_hermit_RD: 74,
	spr_hermit_LU: 75,
	spr_hermit_RU: 76,
	spr_hermit_DL: 77,
	spr_hermit_DR: 78,
	spr_hermit_UL: 79,
	spr_hermit_UR: 80,
	
	spr_charSelect: 81,
	bg_in_tanks: 82,
	spr_turret: 83,
	spr_turretShot: 84,
	bg_inside_02: 85,
	spr_explosion_small: 86,
	spr_minicrab_L: 87,
	spr_minicrab_R: 88, 
	spr_ring: 89,
	
	spr_probeOff: 90,
	spr_probeOn: 91,
	spr_probeFx: 92,
	spr_tileBreak: 93,
	spr_bulb: 94,
	
	spr_bug_LD: 95,
	spr_bug_RD: 96,
	spr_bug_LU: 97,
	spr_bug_RU: 98,
	spr_bug_DL: 99,
	spr_bug_DR: 100,
	spr_bug_UL: 101,
	spr_bug_UR: 102,
	spr_wingbug_L: 103,
	spr_wingbug_R: 104,
	spr_wingbug_ab: 105,
	
	bg_greenglow: 106,
	spr_trouncerWalk_L: 107,
	spr_trouncerWalk_R: 108,
	spr_trouncerFlap_L: 109,
	spr_trouncerFlap_R: 110,
	spr_trouncerMeleeCharge_L: 111,
	spr_trouncerMeleeCharge_R: 112,
	spr_trouncerPunch_L: 113,
	spr_trouncerPunch_R: 114,
	spr_trouncerRangeCharge_L: 115,
	spr_trouncerRangeCharge_R: 116,
	spr_trouncerWake: 117,
	spr_explosion_2x: 118,
	bg_menu: 119,
	
	spr_HPbarbase: 120,
	spr_HPblip: 121,
	bg_gameover: 122,
	spr_chargeup: 123,
	spr_HPunblip: 124,
	spr_chargedone: 125,
	
	bg_endofdemo: 126
};

// Function that representst and runs the actual canvas program.
function canvasApp()
{
	// Initialize the canvas application.
	// Check to make sure we have canvas support.
	if (!canvasSupport())
	{
		infoBox.innerHTML = "Your browser doesn't support HTML5 Canvas.";
		return;
	}
	debug.innerHTML = "<h1>Canvas application started.</h1><ol>";
	
	// Canvas variables:
	canvas = document.getElementById("theCanvas");
	context = canvas.getContext("2d");
	
	//canvas.width = 640;
	//canvas.height = 480;
	
	// Get the screen size.
	g_screensize.x = canvas.width;
	g_screensize.y = canvas.height;
	
	// Set the canvas to take up the whole window.
	function FitToWindow()
	{
		if (!g_fullScreen) return;
		var widthToHeight = g_screensize.x / g_screensize.y;
		var newWidth = window.innerWidth;
		var newHeight = window.innerHeight;
		var newWidthToHeight = newWidth / newHeight;
		
		if (newWidthToHeight > widthToHeight)
		{
			newWidth = newHeight * widthToHeight;
			canvas.style.width = newWidth + 'px';
			canvas.style.height = newHeight + 'px';
		}
		else
		{
			newHeight = newWidth / widthToHeight;
			canvas.style.width = newWidth + 'px';
			canvas.style.height = newHeight + 'px';
		}
		
		canvas.style.top = ((window.innerHeight - newHeight) / 2) + 'px';
		canvas.style.left = ((window.innerWidth - newWidth) / 2) + 'px';
		
		g_windowSize.x = window.innerWidth;
		g_windowSize.y = window.innerHeight;//*/
	}
	
	FitToWindow();
	
	// Gamestate variables.
	var currentGameState = 0;
	var currentGameStateFunction = null;
	
	// Initialize the game.
	var g_stage = 1;
	var g_stagecount = 1;
	
	debug.innerHTML += "<li>Variables created.</li>";
	
	// Canvas events:
	canvas.addEventListener("mouseover", canvasGetMousePos, false);
	canvas.addEventListener("mousemove", canvasGetMousePos, false);
	canvas.addEventListener("mouseout", canvasGetMousePos, false);
	canvas.addEventListener("mousedown", canvasMouseClick, false);
	canvas.addEventListener("mouseup", canvasMouseUnclick, false);
	
	// Called to calculate the mouse position within the canvas.
	function getMousePos(event)
	{
		var pos = findPos(canvas);
		var mx = event.pageX - pos.x;
		var my = event.pageY - pos.y;
		return {
			x: mx,
			y: my
		};
	}
	
	// Function called when the mouse is within the canvas to find the mouse's position.
	function canvasGetMousePos(event)
	{
		// If we're a mouse move event, get the position of the mouse inside the canvas.
		if (event.type == "mousemove" || event.type == "mouseover")
		{
			mousePos = getMousePos(event);
		}
		// Otherwise, set the position of the mouse to -1.
		else
		{
			mousePos = 
			{
				x: -1,
				y: -1
			};
			// Also set the mouse input to false.
			mouseInput = false;
		}
		// Write the current mouse position to the mouse text box.
		//document.getElementById("mousepos").innerHTML = mousePos.x + ", " + mousePos.y;
	}
	
	// The function called when the player clicks in the app.
	function canvasMouseClick(event)
	{
		//debug.innerHTML += "<li>User clicked at " + mousePos.x + ", " + mousePos.y + "</li>";
		// If we're on the title screen, go to the menu.
		if (currentGameState == GAME_STATE_TITLE)
		{
			//switchGameState(GAME_STATE_MENU);
		}
		// If we're on the menu, allow the player to go into the game.
		else if (currentGameState == GAME_STATE_MENU)
		{
			//switchGameState(g_start);
		}
		// If we're in the gameplay state, allow the mouse to interact with the gameobjects.
		else if (currentGameState == GAME_STATE_GAME)
		{
		}//*/
		
		mouseInput = true;
	}
	
	// The function called when the player releases the mouse in the app.
	function canvasMouseUnclick(event)
	{
		mouseInput = false;
	}
	
	function gameLoop()
	{
		if (currentGameState < 2) return;
		
		// Update objects.
		for (var i = 0; i < g_maxobjects; i++)
		{
			if (!GameObjectArray[i].active) continue;
			GameObjectArray[i].Update();
		}
		
		// Handle object collisions.
		for (var i = 0; i < g_maxobjects; i++)
		{
			if (!GameObjectArray[i].active) continue;
			for (var j = 0; j < g_maxobjects; j++)
			{
				if (!GameObjectArray[j].active || i == j) continue;
				GameObjectArray[i].Collide(GameObjectArray[j]);
			}
		}
		
		// Handle endupdate methods.
		for (var i = 0; i < g_maxobjects; i++)
		{
			if (!GameObjectArray[i].active) continue;
			GameObjectArray[i].EndUpdate();
		}
		
		// Update tile entities.
		mainTileMap.UpdateTileEntities();
		
		// Temp; if the player dies, go to the gameover screen immediately.
		if (currentGameState == GAME_STATE_GAME && g_playerHP <= 0)
		{
			g_gameStateToUpdate = GAME_STATE_RESET;
			g_playerDied = true;
			g_playerDeaths++;
		}
		
		// If we're on the title screen, go to the next menu if the player presses X.
		if (currentGameState == GAME_STATE_TITLE && g_keyboard.KeyPressed(controls.jump)) g_gameStateToUpdate = GAME_STATE_MENU;
		
		// Handle the menu.
		if (currentGameState == GAME_STATE_MENU)
		{
			// If the player presses X or C, go to the main game.
			if (g_keyboard.KeyPressed(controls.jump) || g_keyboard.KeyPressed(controls.attack))
			{
				g_gameStateToUpdate = GAME_STATE_GAME;
			}
			// If the player presses left or right, allow him to change his character.
			if (g_keyboard.KeyPressed(controls.left))
			{
				g_playerType--;
				if (g_playerType < 0) g_playerType = g_playerCount - 1;
			}
			else if (g_keyboard.KeyPressed(controls.right))
			{
				g_playerType++;
				if (g_playerType >= g_playerCount) g_playerType = 0;
			}
			if (g_keyboard.KeyPressed(controls.left) || g_keyboard.KeyPressed(controls.right) || g_text == "")
			{
				g_text = g_playerText[g_playerType];
				g_textPos = 0;
				g_textLines.length = 0;
				// Split the text into lines according to # characters.
				var linestart = 0;
				for (var j = 0; j < g_text.length; j++)
				{
					// If we've come to a # character, cut the string out and put it in a line.
					if (g_text.charCodeAt(j) == 35 || j == g_text.length - 1)
					{
						g_textLines.push(g_text.substring(linestart, j));
						linestart = j + 1;
					}
				}
			}
		}
		// Handle the gameover screen.
		else if (currentGameState == GAME_STATE_GAMEOVER)
		{
			if (g_keyboard.KeyPressed(controls.jump) || g_keyboard.KeyPressed(controls.attack))
			{
				g_gameStateToUpdate = GAME_STATE_MENU;
			}
		}
	}
	
	function drawObjects()
	{
		// Get the objects to prepare for drawing.
		for (var i = 0; i < g_maxobjects; i++)
		{
			if (!GameObjectArray[i].active) continue;
			GameObjectArray[i].Draw(g_transition != 1);
		}
		
		// If we have a camerascrolllock tile entity active in the tile map, handle that.
		if (currentGameState == GAME_STATE_GAME)
		{
			mainTileMap.HandleScrollLocks();
		}
		
		// Move the camera towards the goto position.
		g_spriteCamera.x = Math.round(lerp(g_spriteCamera.x, g_spriteCameraGoTo.x, 0.1));
		g_spriteCamera.y = Math.round(lerp(g_spriteCamera.y, g_spriteCameraGoTo.y, 0.1));
		
		// Limit the camera to be within the bounds of the tilemap.
		if (g_spriteCamera.x < 0)
			g_spriteCamera.x = 0;
		else if (g_spriteCamera.x > mainTileMap.fullSize.x - g_screensize.x)
			g_spriteCamera.x = mainTileMap.fullSize.x - g_screensize.x;
		if (g_spriteCamera.y < 0)
			g_spriteCamera.y = 0;
		else if (g_spriteCamera.y > mainTileMap.fullSize.y - g_screensize.y)
			g_spriteCamera.y = mainTileMap.fullSize.y - g_screensize.y;
			
		currentGameStateFunction();
		if (currentGameState == GAME_STATE_GAME)
			mainTileMap.Draw(context);
		
		// Draw the sprites in the sprite queue.
		DrawSpriteQueue(context);
		DrawLineQueue(context);
		
		// Draw the foreground, if there is one.
		if (currentGameState == GAME_STATE_GAME && mainTileMap.bgfrontfront >= 0)
		{
			context.globalAlpha = 0.5;
			g_SpriteSheetList[mainTileMap.bgfrontfront].DrawFrame({x:g_spriteCamera.x, y:g_spriteCamera.y}, 0, context);
			context.globalAlpha = 1;
		}
		
		// Draw the hud.
		if (currentGameState == GAME_STATE_GAME)
		{
			g_SpriteSheetList[spriteIndices.spr_HPbarbase].DrawFrame({x:g_spriteCamera.x, y:g_spriteCamera.y}, g_playerType, context);
			for (var i = g_playerHP; i < g_playerMaxHP; i++)
			{
				g_SpriteSheetList[spriteIndices.spr_HPunblip].DrawFrame({x:g_spriteCamera.x + 14 + i * 9, y:g_spriteCamera.y + 33}, 0, context);
			}
			for (var i = 0; i < g_playerHP; i++)
			{
				g_SpriteSheetList[spriteIndices.spr_HPblip].DrawFrame({x:g_spriteCamera.x + 14 + i * 9, y:g_spriteCamera.y + 33}, 0, context);
			}
		}
	}
	
	// Main game loop method.
	function appRun()
	{
		// Resize the canvas whenever the screen changes size.
		if (window.innerWidth != g_windowSize.x || window.innerHeight != g_windowSize.y)
			FitToWindow();
			
		// Update input.
		g_keyboard.Update();
		
		mouseClick = mouseInput;
		
		// If the player presses R, restart the level.
		//if (g_keyboard.KeyPressed(82)) switchGameState(currentGameState);
		
		if (currentGameState == GAME_STATE_GAME && g_keyboard.KeyPressed(controls.pause) && g_transition == 1) g_pause = !g_pause;
		
		if (!g_pause)
		{
			if (g_transition != 2) g_gameStateToUpdate = currentGameState;
			
			if (g_transition == 0)
			{
				if (currentGameState != GAME_STATE_LOAD)
				{
					// Fade in only if the current level is loaded.
					if (currentGameState != GAME_STATE_GAME || (currentGameState == GAME_STATE_GAME && mainTileMap.IsLoaded()))
					{
						g_fade -= g_fadeRate;
						if (g_fade <= 0)
						{
							g_fade = 0;
							g_transition = 1;
						}
					}
				}
			}
			else if (g_transition == 1)
			{
				// If we don't have any text to display, go ahead and run the gameloop.
				if ((currentGameState == GAME_STATE_GAME && g_text == "") || currentGameState != GAME_STATE_GAME)
				{
					gameLoop();
					
					if (g_keyboard.KeyPressed(82)) g_gameStateToUpdate = GAME_STATE_MENU;
					
					if (g_gameStateToUpdate != currentGameState)
					{
						if (g_gameStateToUpdate == GAME_STATE_RESET)
							g_gameStateToUpdate = currentGameState;
						g_transition = 2;
					}
				}
				// If we have text to display, advance into the text and allow the player to remove the text from the screen/advance farther.
				if (g_text != "")
				{
					if (g_textPos < g_text.length) g_textPos++;
					if (g_keyboard.KeyPressed(controls.jump) || g_keyboard.KeyPressed(controls.attack))
					{
						if (g_textPos < g_text.length) g_textPos = g_text.length;
						else 
						{
							g_text = "";
							g_textLines.length = 0;
						}
					}
				}
			}
			else
			{
				g_fade += g_fadeRate;
				if (g_fade > 1)
				{
					g_fade = 1.0;
					g_transition = 0;
					switchGameState(g_gameStateToUpdate);
				}
			}
			
			// Clear the screen.
			ClearScreen(g_backgroundColor);
			
			//if (g_pause) AddSpriteToQueue(spriteIndices.spr_menustuff, 0, {x:g_spriteCamera.x + this.g_screensize.x / 2, y:g_spriteCamera.y + this.g_screensize.y / 2}, 100, 0);
			//if (g_pause) g_SpriteSheetList[spriteIndices.spr_menustuff].DrawFrame({x:g_spriteCamera.x + this.g_screensize.x / 2, y:g_spriteCamera.y + this.g_screensize.y / 2}, 1, context);
			
			// Draw things
			drawObjects();
			
			// If we have text to display, display it.
			if ((currentGameState == GAME_STATE_GAME || currentGameState == GAME_STATE_MENU) && g_text != "")
			{
				g_SpriteSheetList[spriteIndices.spr_textbg].DrawFrame({x:g_spriteCamera.x + 160, y:g_spriteCamera.y + 130}, 0, context);
				context.textAlign = "start";
				context.font = fnt_textbox;
				context.fillStyle = "#ffffff";
				for (var j = 0; j < g_textLines.length; j++)
				{
					var lengthupto = 0;
					for (var k = j - 1; k >= 0; k--)
					{
						lengthupto += g_textLines[k].length - 1;
					}
					if (g_textPos > lengthupto)
						context.fillText(g_textLines[j].substring(0, g_textPos - lengthupto), 15, 160 + j * 16);
				}
				//context.fillText(g_text.substring(0, g_textPos), 20, 155);
			}
			
			if (currentGameState != GAME_STATE_LOAD)
			{
				context.globalAlpha = g_fade;
				ClearScreen("rgb(0,0,0)");
				context.globalAlpha = 1;
			}
		}
		
		if (g_pause) g_SpriteSheetList[spriteIndices.spr_menustuff].DrawFrame({x:g_spriteCamera.x + this.g_screensize.x / 2, y:g_spriteCamera.y + this.g_screensize.y / 2}, 1, context);
		
		prevMouse = mouseInput;
		
		// Check to see if any of the sounds in the extra sounds array are done playing, and if so, remove them.
		for (var i = 0; i < tempExSounds.length; i++)
		{
			if (tempExSounds[i].ended)
			{
				tempExSounds[i].parentNode.removeChild(tempExSounds[i]);
				tempExSounds.splice(i, 1);
			}
		}//*/
	}
	
	// Gamestate change handler method.
	// Called to switch the current gamestate and accompanying function pointer.
	function switchGameState(gs)
	{
		currentGameState = gs;
		
		// Clear the game object list.
		for (var i = 0; i < g_maxobjects; i++)
		{
			// If the specified object isn't even active, skip this.
			if (!GameObjectArray[i].active) continue;
			// Otherwise, destroy it.
			GameObjectArray[i].Destroy();
		}
		
		g_pause = false;
		
		g_text = "";
		g_textLines.length = 0;
		g_textPos = 0;
		
		// Initialize the game state.
		switch (gs)
		{
			case GAME_STATE_INIT:
				debug.innerHTML += "<li>GSMInit started.</li>";
				currentGameStateFunction = gsmInit;
				g_currentbgm = -1;
				break;
				
			case GAME_STATE_LOAD:
				debug.innerHTML += "<li>GSMLoad started.</li>";
				currentGameStateFunction = gsmLoad;
				break;
				
			case GAME_STATE_TITLE:
				debug.innerHTML += "<li>GSMTitle started.</li>";
				g_fadeRate = 0.02;
				currentGameStateFunction = gsmTitle;
				
				// Create the title screen objects.
				menuState = 0;
				
				break;
				
			case GAME_STATE_MENU:
				debug.innerHTML += "<li>GSMMenu started.</li>";
				g_fadeRate = 0.15;
				currentGameStateFunction = gsmMenu;
				g_switches.length = 0;
				
				SwitchMusic(-1);
				
				g_nextMap = "room1.txt";
				g_currentMap = "";
				g_warpPos = null;
				g_warpPosSet = false;
				g_playerHP = g_playerMaxHP;
				g_playerDeaths = 0;
				
				mainTileMap.ClearMap();
				
				break;
				
			case GAME_STATE_GAME:
				debug.innerHTML += "<li>GSMGame started.</li>";
				g_fadeRate = 0.15;
				g_transition = 0;
				g_fade = 1.0;
				
				if (g_currentbgm != 0)
					SwitchMusic(0);
				
				if (g_playerDied == true)
				{
					g_playerDied = false;
					g_playerHP = g_playerMaxHP;
				}
				
				mainTileMap.ClearMap();
				
				// Handle split routes.
				if (g_nextMap == "room10.txt")
				{
					if (g_playerType == 0) g_nextMap = "room10a.txt";
					else if (g_playerType == 1) g_nextMap = "room10b.txt";
					else g_nextMap = "room10c.txt";
				}
				
				// Load the next map.
				if (g_currentMap == "")
				{
					mainTileMap.LoadMapFromFile(g_nextMap, 0, 16, 16);
				}
				mainTileMap.NeedMap();
				g_currentMap = g_nextMap;
				currentGameStateFunction = gsmGame;
				
				//SwitchMusic(0);
				
				mainTileMap.UpdateTileEntities();//*/
				
				break;
			case GAME_STATE_GAMEOVER:
				debug.innerHTML += "<li>GSMGameOver started.</li>";
				
				mainTileMap.ClearMap();
				
				currentGameStateFunction = gsmGameOver;
				break;
		}
	}
	
	// Called when the game first begins to load everything up.
	function gsmInit()
	{
		ClearScreen("#000000");
	
		// Fill the imagename list.
		{
			imagenamelist.push(new imagenamelistEntry("tilesheet_outside_01.png", 174, {x:16, y:16}, {x:0, y:0}));			// 0
			
			imagenamelist.push(new imagenamelistEntry("spr_bunnyIdle_L.png", 10, {x:28, y:28}, {x:12, y:14}));
			imagenamelist.push(new imagenamelistEntry("spr_bunnyIdle_R.png", 10, {x:28, y:28}, {x:16, y:14}));
			imagenamelist.push(new imagenamelistEntry("spr_bunnyRun_L.png", 14, {x:32, y:29}, {x:16, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_bunnyRun_R.png", 14, {x:32, y:29}, {x:16, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_bunnyJump_L.png", 7, {x:24, y:28}, {x:12, y:14}));
			imagenamelist.push(new imagenamelistEntry("spr_bunnyJump_R.png", 7, {x:24, y:28}, {x:12, y:14}));
			imagenamelist.push(new imagenamelistEntry("spr_bunnyThrow_L.png", 9, {x:24, y:28}, {x:12, y:14}));
			imagenamelist.push(new imagenamelistEntry("spr_bunnyThrow_R.png", 9, {x:24, y:28}, {x:12, y:14}));
			
			imagenamelist.push(new imagenamelistEntry("bg_outside2.png", 1, {x:320, y:240}, {x:0, y:0}));
			imagenamelist.push(new imagenamelistEntry("bg_out_cliffs.png", 1, {x:430, y:160}, {x:40, y:-128}));
			imagenamelist.push(new imagenamelistEntry("bg_out_cliffs_frontish.png", 1, {x:500, y:170}, {x:40, y:-128}));
			
			imagenamelist.push(new imagenamelistEntry("spr_bladeAppear.png", 5, {x:15, y:7}, {x:7, y:3}));
			imagenamelist.push(new imagenamelistEntry("spr_blade.png", 16, {x:15, y:15}, {x:7, y:7}));
			imagenamelist.push(new imagenamelistEntry("spr_hudstuff1.png", 8, {x:16, y:16}, {x:8, y:8}));
			
			imagenamelist.push(new imagenamelistEntry("spr_crab_L.png", 8, {x:28, y:16}, {x:14, y:4}));
			imagenamelist.push(new imagenamelistEntry("spr_crab_R.png", 8, {x:28, y:16}, {x:14, y:4}));
			imagenamelist.push(new imagenamelistEntry("spr_crabHurt_L.png", 1, {x:28, y:16}, {x:14, y:4}));
			imagenamelist.push(new imagenamelistEntry("spr_crabHurt_R.png", 1, {x:28, y:16}, {x:14, y:4}));
			imagenamelist.push(new imagenamelistEntry("spr_bladeTrail.png", 5, {x:3, y:3}, {x:1, y:1}));
			imagenamelist.push(new imagenamelistEntry("spr_bap.png", 3, {x:31, y:31}, {x:15, y:19}));
			
			imagenamelist.push(new imagenamelistEntry("spr_bunnyHurt_L.png", 1, {x:24, y:28}, {x:12, y:14}));
			imagenamelist.push(new imagenamelistEntry("spr_bunnyHurt_R.png", 1, {x:24, y:28}, {x:12, y:14}));
			
			imagenamelist.push(new imagenamelistEntry("bg_title.png", 1, {x:320, y:240}, {x:0, y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_menustuff.png", 2, {x:72, y:9}, {x:36, y:4}));
			
			imagenamelist.push(new imagenamelistEntry("spr_rockIdle_L.png", 10, {x:25, y:37}, {x:12, y:23}));
			imagenamelist.push(new imagenamelistEntry("spr_rockIdle_R.png", 10, {x:25, y:37}, {x:12, y:23}));
			imagenamelist.push(new imagenamelistEntry("spr_rockRun_L.png", 12, {x:23, y:36}, {x:11, y:22}));
			imagenamelist.push(new imagenamelistEntry("spr_rockRun_R.png", 12, {x:23, y:36}, {x:11, y:22}));
			imagenamelist.push(new imagenamelistEntry("spr_rockJump_L.png", 4, {x:28, y:34}, {x:14, y:20}));
			imagenamelist.push(new imagenamelistEntry("spr_rockJump_R.png", 4, {x:28, y:34}, {x:14, y:20}));
			imagenamelist.push(new imagenamelistEntry("spr_rockSword_L.png", 4, {x:45, y:45}, {x:28, y:23}));
			imagenamelist.push(new imagenamelistEntry("spr_rockSword_R.png", 4, {x:45, y:45}, {x:17, y:23}));
			imagenamelist.push(new imagenamelistEntry("spr_swordFlame_L.png", 5, {x:39, y:69}, {x:39, y:34}));
			imagenamelist.push(new imagenamelistEntry("spr_swordFlame_R.png", 5, {x:39, y:69}, {x:0, y:34}));
			imagenamelist.push(new imagenamelistEntry("spr_rockHurt_L.png", 1, {x:25, y:37}, {x:12, y:23}));
			imagenamelist.push(new imagenamelistEntry("spr_rockHurt_R.png", 1, {x:25, y:37}, {x:12, y:23}));
			imagenamelist.push(new imagenamelistEntry("spr_rockSpin_L.png", 4, {x:64, y:26}, {x:32, y:13}));
			imagenamelist.push(new imagenamelistEntry("spr_rockSpin_R.png", 4, {x:64, y:26}, {x:32, y:13}));
			imagenamelist.push(new imagenamelistEntry("spr_spinFlame_L.png", 4, {x:64, y:26}, {x:32, y:13}));
			imagenamelist.push(new imagenamelistEntry("spr_spinFlame_R.png", 4, {x:64, y:26}, {x:32, y:13}));
			
			imagenamelist.push(new imagenamelistEntry("spr_guyIdle_L.png", 1, {x:26, y:24}, {x:13, y:10}));
			imagenamelist.push(new imagenamelistEntry("spr_guyIdle_R.png", 1, {x:26, y:24}, {x:13, y:10}));
			imagenamelist.push(new imagenamelistEntry("spr_guyIdle_LU.png", 1, {x:26, y:30}, {x:13, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_guyIdle_RU.png", 1, {x:26, y:30}, {x:13, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_guyRun_L.png", 12, {x:32, y:28}, {x:16, y:14}));
			imagenamelist.push(new imagenamelistEntry("spr_guyRun_R.png", 12, {x:32, y:28}, {x:16, y:14}));
			imagenamelist.push(new imagenamelistEntry("spr_guyRun_LU.png", 12, {x:32, y:32}, {x:16, y:18}));
			imagenamelist.push(new imagenamelistEntry("spr_guyRun_RU.png", 12, {x:32, y:32}, {x:16, y:18}));
			imagenamelist.push(new imagenamelistEntry("spr_guyJump_L.png", 5, {x:32, y:28}, {x:16, y:14}));
			imagenamelist.push(new imagenamelistEntry("spr_guyJump_R.png", 5, {x:32, y:28}, {x:16, y:14}));
			imagenamelist.push(new imagenamelistEntry("spr_guyJump_LU.png", 5, {x:32, y:32}, {x:16, y:18}));
			imagenamelist.push(new imagenamelistEntry("spr_guyJump_RU.png", 5, {x:32, y:32}, {x:16, y:18}));
			imagenamelist.push(new imagenamelistEntry("spr_guyJump_LD.png", 5, {x:32, y:32}, {x:16, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_guyJump_RD.png", 5, {x:32, y:32}, {x:16, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_guyFlip_L.png", 5, {x:21, y:24}, {x:10, y:12}));
			imagenamelist.push(new imagenamelistEntry("spr_guyFlip_R.png", 5, {x:21, y:24}, {x:11, y:12}));
			imagenamelist.push(new imagenamelistEntry("spr_guyHurt_L.png", 1, {x:26, y:24}, {x:13, y:10}));
			imagenamelist.push(new imagenamelistEntry("spr_guyHurt_R.png", 1, {x:26, y:24}, {x:13, y:10}));
			imagenamelist.push(new imagenamelistEntry("spr_guyShot.png", 4, {x:16, y:16}, {x:8, y:8}));
			imagenamelist.push(new imagenamelistEntry("spr_shotPiff.png", 1, {x:12, y:12}, {x:6, y:6}));
			
			imagenamelist.push(new imagenamelistEntry("tilesheet_vines.png", 159, {x:16, y:16}, {x:0, y:0}));			// 61
			
			imagenamelist.push(new imagenamelistEntry("spr_dustDash_L.png", 4, {x:40, y:12}, {x:35, y:12}));
			imagenamelist.push(new imagenamelistEntry("spr_dustDash_R.png", 4, {x:40, y:12}, {x:5, y:12}));
			
			imagenamelist.push(new imagenamelistEntry("spr_rabbit_L.png", 4, {x:34, y:28}, {x:17, y:14}));
			imagenamelist.push(new imagenamelistEntry("spr_rabbit_R.png", 4, {x:34, y:28}, {x:17, y:14}));
			imagenamelist.push(new imagenamelistEntry("spr_rabbitHurt_L.png", 1, {x:34, y:28}, {x:17, y:14}));
			imagenamelist.push(new imagenamelistEntry("spr_rabbitHurt_R.png", 1, {x:34, y:28}, {x:17, y:14}));
			
			imagenamelist.push(new imagenamelistEntry("bg_inside_01.png", 1, {x:320, y:240}, {x:0, y:0}));
			imagenamelist.push(new imagenamelistEntry("bg_in_arms.png", 1, {x:225, y:105}, {x:-6, y:-65}));
			
			imagenamelist.push(new imagenamelistEntry("spr_doorCracked.png", 1, {x:32, y:32}, {x:8, y:24}));
			imagenamelist.push(new imagenamelistEntry("bg_out_cliffs_frontish_bot.png", 1, {x:400, y:170}, {x:20, y:-100}));
			
			imagenamelist.push(new imagenamelistEntry("spr_textbg.png", 1, {x:310, y:100}, {x:155, y:0}));
			
			imagenamelist.push(new imagenamelistEntry("spr_hermit_LD.png", 8, {x:23, y:18}, {x:12, y:6}));
			imagenamelist.push(new imagenamelistEntry("spr_hermit_RD.png", 8, {x:23, y:18}, {x:11, y:6}));
			imagenamelist.push(new imagenamelistEntry("spr_hermit_LU.png", 8, {x:23, y:18}, {x:12, y:6}));
			imagenamelist.push(new imagenamelistEntry("spr_hermit_RU.png", 8, {x:23, y:18}, {x:11, y:6}));
			imagenamelist.push(new imagenamelistEntry("spr_hermit_DL.png", 8, {x:23, y:18}, {x:12, y:6}));
			imagenamelist.push(new imagenamelistEntry("spr_hermit_DR.png", 8, {x:23, y:18}, {x:11, y:6}));
			imagenamelist.push(new imagenamelistEntry("spr_hermit_UL.png", 8, {x:23, y:18}, {x:12, y:6}));
			imagenamelist.push(new imagenamelistEntry("spr_hermit_UR.png", 8, {x:23, y:18}, {x:11, y:6}));
			
			imagenamelist.push(new imagenamelistEntry("spr_charSelect.png", 4, {x:131, y:144}, {x:84, y:132}));
			imagenamelist.push(new imagenamelistEntry("bg_in_tanks.png", 1, {x:297, y:124}, {x:-30, y:-128}));
			imagenamelist.push(new imagenamelistEntry("spr_turret.png", 3, {x:28, y:23}, {x:14, y:15}));
			imagenamelist.push(new imagenamelistEntry("spr_turretShot.png", 4, {x:10, y:10}, {x:5, y:5}));
			imagenamelist.push(new imagenamelistEntry("bg_inside_02.png", 1, {x:320, y:240}, {x:-20, y:-80}));
			
			imagenamelist.push(new imagenamelistEntry("spr_explosion_small.png", 6, {x:37, y:30}, {x:18, y:15}));
			
			imagenamelist.push(new imagenamelistEntry("spr_minicrab_L.png", 4, {x:12, y:6}, {x:6, y:-6}));
			imagenamelist.push(new imagenamelistEntry("spr_minicrab_R.png", 4, {x:12, y:6}, {x:6, y:-6}));
			imagenamelist.push(new imagenamelistEntry("spr_ring.png", 6, {x:23, y:23}, {x:12, y:12}));
			
			imagenamelist.push(new imagenamelistEntry("spr_probeOff.png", 3, {x:20, y:25}, {x:10, y:13}));
			imagenamelist.push(new imagenamelistEntry("spr_probeOn.png", 3, {x:20, y:25}, {x:10, y:13}));
			imagenamelist.push(new imagenamelistEntry("spr_probeFx.png", 3, {x:22, y:27}, {x:11, y:14}));
			imagenamelist.push(new imagenamelistEntry("spr_tileBreak.png", 4, {x:16, y:16}, {x:0, y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_bulb.png", 8, {x:26, y:26}, {x:13, y:13}));
			
			imagenamelist.push(new imagenamelistEntry("spr_bug_LD.png", 4, {x:28, y:28}, {x:14, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_bug_RD.png", 4, {x:28, y:28}, {x:14, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_bug_LU.png", 4, {x:28, y:28}, {x:14, y:12}));
			imagenamelist.push(new imagenamelistEntry("spr_bug_RU.png", 4, {x:28, y:28}, {x:14, y:12}));
			imagenamelist.push(new imagenamelistEntry("spr_bug_DL.png", 4, {x:28, y:28}, {x:12, y:14}));
			imagenamelist.push(new imagenamelistEntry("spr_bug_DR.png", 4, {x:28, y:28}, {x:16, y:14}));
			imagenamelist.push(new imagenamelistEntry("spr_bug_UL.png", 4, {x:28, y:28}, {x:12, y:14}));
			imagenamelist.push(new imagenamelistEntry("spr_bug_UR.png", 4, {x:28, y:28}, {x:16, y:14}));
			
			imagenamelist.push(new imagenamelistEntry("spr_wingbug_L.png", 3, {x:34, y:41}, {x:17, y:20}));
			imagenamelist.push(new imagenamelistEntry("spr_wingbug_R.png", 3, {x:34, y:41}, {x:17, y:20}));
			imagenamelist.push(new imagenamelistEntry("spr_wingbug_ab.png", 1, {x:13, y:16}, {x:6, y:8}));

			imagenamelist.push(new imagenamelistEntry("bg_greenglow.png", 1, {x:320, y:240}, {x:0, y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_trouncerWalk_L.png", 14, {x:64, y:36}, {x:32, y:26}));
			imagenamelist.push(new imagenamelistEntry("spr_trouncerWalk_R.png", 14, {x:64, y:36}, {x:32, y:26}));
			imagenamelist.push(new imagenamelistEntry("spr_trouncerFlap_L.png", 6, {x:70, y:64}, {x:35, y:54}));
			imagenamelist.push(new imagenamelistEntry("spr_trouncerFlap_R.png", 6, {x:70, y:64}, {x:35, y:54}));
			imagenamelist.push(new imagenamelistEntry("spr_trouncerMeleeCharge_L.png", 2, {x:61, y:42}, {x:30, y:32}));
			imagenamelist.push(new imagenamelistEntry("spr_trouncerMeleeCharge_R.png", 2, {x:61, y:42}, {x:30, y:32}));
			imagenamelist.push(new imagenamelistEntry("spr_trouncerPunch_L.png", 10, {x:96, y:44}, {x:65, y:34}));
			imagenamelist.push(new imagenamelistEntry("spr_trouncerPunch_R.png", 10, {x:96, y:44}, {x:31, y:32}));
			imagenamelist.push(new imagenamelistEntry("spr_trouncerRangeCharge_L.png", 2, {x:58, y:34}, {x:29, y:24}));
			imagenamelist.push(new imagenamelistEntry("spr_trouncerRangeCharge_R.png", 2, {x:58, y:34}, {x:29, y:24}));
			imagenamelist.push(new imagenamelistEntry("spr_trouncerWake.png", 14, {x:60, y:32}, {x:30, y:22}));
			
			imagenamelist.push(new imagenamelistEntry("spr_explosion_2x.png", 6, {x:74, y:60}, {x:37, y:45}));
			
			imagenamelist.push(new imagenamelistEntry("bg_menu.png", 1, {x:320, y:240}, {x:0, y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_HPbarbase.png", 3, {x:66, y:41}, {x:0, y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_HPblip.png", 1, {x:16, y:8}, {x:0, y:0}));
			imagenamelist.push(new imagenamelistEntry("bg_gameover.png", 1, {x:320, y:240}, {x:0, y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_chargeup.png", 4, {x:32, y:32}, {x:16, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_HPunblip.png", 1, {x:16, y:8}, {x:0, y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_chargedone.png", 4, {x:32, y:32}, {x:16, y:16}));
			
			imagenamelist.push(new imagenamelistEntry("bg_endofdemo.png", 1, {x:320, y:240}, {x:0, y:-60}));
		}
	
		// Load each of the images within the imagename list.
		for (var i = 0; i < imagenamelist.length; i++)
		{
			var tempimg = new Image();
			tempimg.src = dir_sprites + imagenamelist[i].name;
			tempimg.onload = itemLoaded;
			imagelist.push( tempimg );
			toload++;
		}
		
		// Load static images.
		
		// List the sounds to be loaded.
		if (navigator.appName != "Opera")
		{
			soundnamelist.push("snd_jump_light");	//0
			soundnamelist.push("snd_charge_start");
			soundnamelist.push("snd_charge_end");
			soundnamelist.push("snd_blade_throw");
			soundnamelist.push("snd_step");
			
			soundnamelist.push("snd_blade_hit");	// 5
			soundnamelist.push("snd_hurt");
			soundnamelist.push("snd_sword_swing");
			soundnamelist.push("snd_spin");
			soundnamelist.push("snd_jump_2nd");
			
			soundnamelist.push("snd_shoot");		// 10
			soundnamelist.push("snd_badhit");
			soundnamelist.push("snd_alert");
			soundnamelist.push("snd_turretShot");
			soundnamelist.push("snd_exp_01");
			
			soundnamelist.push("snd_break");		// 15
			soundnamelist.push("snd_bzz");
			soundnamelist.push("snd_bigstep");
			soundnamelist.push("snd_uppercut");
			soundnamelist.push("snd_startup");
			
			soundnamelist.push("snd_boomBig");		// 20
		}
		
		//*/
		
		// Load the sounds listed.
		for (var i = 0; i < soundnamelist.length; i++)
		{
			var tempsound = document.createElement("audio");
			document.body.appendChild(tempsound);
			if (audiotype == null) audiotype = supportedAudioFormat(tempsound);
			tempsound.setAttribute("src", dir_sounds + soundnamelist[i] + "." + audiotype);
			tempsound.load();
			tempsound.addEventListener("canplaythrough", itemLoaded, false);
			soundlist.push(tempsound);
			toload++;
		}
		//infoBox.innerHTML = audiotype;
		//infoBox.innerHTML = navigator.appName;
		
		// List the songs to be loaded.
		if (navigator.appName != "Opera")
		{
			songnamelist.push("mus_stage01");
		}
		
		// Load the songs listed.
		for (var i = 0; i < songnamelist.length; i++)
		{
			var dirString = dir_songs + songnamelist[i];
			var tempSong = new Howl(
				{
					urls: [dirString + ".ogg", dirString + ".mp3", dirString + ".wav"],
					loop: true,
					onload: function() {itemLoaded();}
				});
			songlist.push(tempSong);
			toload++;
		}//*/
		
		//songlist.push(new SongElement(document.getElementById("sng_01"), 0.25));
		
		// Switch to the loading state.
		switchGameState(GAME_STATE_LOAD);
		
		debug.innerHTML += "<li>GSMInitEnded</li>";
	}
	
	// Called while the game is loading assets.
	function gsmLoad()
	{
		// Clear the screen.
		ClearScreen("#000000");
		
		// Show how much has been loaded in a bar.
		context.fillStyle = "rgb(32,85,32)";
		context.fillRect(g_screensize.x / 6, g_screensize.y *4/9, g_screensize.x * 2/3, g_screensize.y / 9);
		context.fillStyle = "rgb(56,185,38)";
		context.fillRect(g_screensize.x / 6, g_screensize.y *4/9, g_screensize.x * 2/3 * loaded / toload, g_screensize.y / 9);
		
		if (loaded >= toload)
		{
			switchGameState(g_start);
			// Add the loaded images to the spritesheet list, too.
			for (var i = 0; i < imagenamelist.length; i++)
			{
				g_SpriteSheetList.push( new SpriteSheet(imagenamelist[i].name, imagelist[i], imagenamelist[i].frameCount, imagenamelist[i].size, imagenamelist[i].center));
			}
			
			// Play each of the sounds loaded quietly so they're ready to be played later.
			for (var i = 0; i < soundlist.length; i++)
			{
				PlaySound(i, 0.0, true);
			}
		}
	}
	
	// Called during the titlescreen state.
	function gsmTitle()
	{
		g_SpriteSheetList[spriteIndices.bg_title].DrawFrame({x:g_spriteCamera.x, y:g_spriteCamera.y}, 0, context);
		g_SpriteSheetList[spriteIndices.spr_menustuff].DrawFrame({x:g_spriteCamera.x + this.g_screensize.x / 2, y:g_spriteCamera.y + this.g_screensize.y * 0.75}, 0, context);
	}
	
	// Called during the menu state.
	function gsmMenu()
	{
		g_SpriteSheetList[spriteIndices.bg_menu].DrawFrame({x:g_spriteCamera.x, y:g_spriteCamera.y}, 0, context);
	
		// Draw the currently selected character.
		g_SpriteSheetList[spriteIndices.spr_charSelect].DrawFrame({x:g_spriteCamera.x + 160, y:g_spriteCamera.y + 150}, g_playerType, context);
		
		// Draw the arrows.
		var tempAdd = 0;
		if (g_keyboard.KeyPressed(controls.left)) tempAdd = -5;
		g_SpriteSheetList[spriteIndices.spr_hudStuff].DrawFrame({x:g_spriteCamera.x + 80 + tempAdd, y:g_spriteCamera.y + 120}, 7, context);
		if (g_keyboard.KeyPressed(controls.right)) tempAdd = 5;
		else tempAdd = 0;
		g_SpriteSheetList[spriteIndices.spr_hudStuff].DrawFrame({x:g_spriteCamera.x + 240 + tempAdd, y:g_spriteCamera.y + 120}, 6, context);
	}
	
	// Called during the game state.
	function gsmGame()
	{
		//infoBox.innerHTML = mainTileMap.pointCheckCollision(mousePos);
		
		//infoBox.innerHTML = g_textLines.length;
		//if (tempExSounds.length > 0) infoBox.innerHTML = tempExSounds[0].src + " " + tempExSounds[0].ended + " " + tempExSounds[0].readyState;
		/*infoBox.innerHTML = g_switches.length + ": ";
		for (var i = 0; i < g_switches.length; i++)
		{
			infoBox.innerHTML += g_switches[i] + ", ";
		}//*/
		infoBox.innerHTML = g_currentbgm;
	}
	
	function gsmGameOver()
	{
		g_SpriteSheetList[spriteIndices.bg_gameover].DrawFrame({x:g_spriteCamera.x, y:g_spriteCamera.y}, 0, context);
		g_SpriteSheetList[spriteIndices.spr_menustuff].DrawFrame({x:g_spriteCamera.x + this.g_screensize.x / 2, y:g_spriteCamera.y + this.g_screensize.y * 0.75}, 0, context);
	}
	
	// Called when an asset finishes loading.
	function itemLoaded()
	{
		//debug.innerHTML += "<li>Asset #" + String(loaded + 1) + " loaded.</li>";
		loaded++;
	}
	
	// Called to clear the screen to the given color.
	function ClearScreen(color)
	{
		context.fillStyle = color;
		context.fillRect(0,0, g_screensize.x, g_screensize.y);
	}
	
	// Set up and start the game loop.
	switchGameState(GAME_STATE_INIT);
	const FRAME_RATE=g_fps;
	var intervalTime=1000/FRAME_RATE;
	setInterval(appRun, intervalTime );
	debug.innerHTML += "<li>Setting up canvas app interval.</li>";
	
	debug.innerHTML += "</ol>";
}