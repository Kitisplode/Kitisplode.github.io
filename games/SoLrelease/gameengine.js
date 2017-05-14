// Project: SoL 2014
// File: gameengine.js
// Desc: Contains the primary game logic for the game engine. Object interactions are
//			handled in another file containing the object classes.
// Author: Kitsu
// Created: January 13, 2013
//
//**************************************************************************************************

/* -- Important References -- */
var currentGameState = 0;
var currentGameStateFunction = null;

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

// A list of the sprite indices.
var spriteIndices =
{
	spr_blocks: 0,
	
	spr_playerIdle_right:		1,
	spr_playerIdle_left:		2,
	spr_playerRun_right:		3,
	spr_playerRun_left:			4,
	spr_playerJump_right:		5,
	spr_playerJump_left:		6,
	spr_playerClimb_right:		7,
	spr_playerClimb_left:		8,
	spr_playerDuck_right:		9,
	spr_playerDuck_left:		10,
	
	spr_enemy_bulletRed:		11,
	spr_splash_cp:				12,
	spr_splash_logo:			13,
	
	spr_playerSwing1_right:		14,
	spr_playerSwing1_left:		15,
	spr_playerSwingJ1_right:	16,
	spr_playerSwingJ1_left:		17,
	spr_playerSwingD1_right:	18,
	spr_playerSwingD1_left:		19,
	spr_playerSwingBlob_right:	20,
	spr_playerSwingBlob_left:	21,
	spr_playerSwing2_right:		22,
	spr_playerSwing2_left:		23,
	
	spr_playerCharge_right:		24,
	spr_playerCharge_left:		25,
	spr_playerSpinJ_right:		26,
	spr_playerSpinJ_left:		27,
	spr_playerSpin_right:		28,
	spr_playerSpin_left:		29,
	
	spr_paintBlob:				30,
	spr_paintSplashIn:			31,
	spr_paintSplashOut:			32,
	spr_paintPlat:				33,
	
	spr_enemyGreen_right:		34,
	spr_enemyGreen_left:		35,
	spr_enemyBlue_right:		36,
	spr_enemyBlue_left:			37,
	spr_enemyYellow_right:		38,
	spr_enemyYellow_left:		39,
	spr_enemyRed_right:			40,
	spr_enemyRed_left:			41,
	
	spr_jackal:					42,
	spr_items:					43,
	
	spr_playerHurt_right:		44,
	spr_playerHurt_left:		45,
	
	spr_hudBar:					46,
	spr_font:					47,
	
	spr_gameover:				48,
	spr_playerDeath:			49,
	spr_void:					50,
	
	spr_dazz:					51,
	spr_masq:					52,
	spr_vic:					53,
	spr_bab:					54,
	spr_iceman:					55,
	spr_masqBlob:				56,
	spr_masqSplash:				57,
	spr_vicShot:				58,
	spr_icemanFood:				59,
	spr_dazzHat:				60,
	
	spr_scFont:					61,
	spr_avys:					62,
	spr_cds:					63,
	spr_full:					64,
	
	spr_bgControls:				65,
	spr_controlsLines:			66,
	spr_controlsScreen_up:		67,
	spr_controlsScreen_right:	68,
	spr_controlsScreen_duck:	69,
	spr_controlsScreen_left:	70,
	spr_controlsScreen_jump:	71,
	spr_controlsScreen_attack:	72,
	spr_controlsScreen_pause:	73,
	
	spr_controlsScreens_blur01:	74,
	spr_controlsScreens_blur02:	75,
	spr_controlsScreens_blur03:	76,
	spr_controlsScreens_blur04:	77,
	spr_controlsScreens_blur05:	78,
	spr_controlsScreens_blur06:	79,
	spr_controlsScreens_blur07: 80,
	
	spr_controlsPressKey:		81,
	
	spr_soundTestCursor:		82,
	spr_soundTest:				83,
	
	spr_splash_tsr:				84,
	spr_bossBar:				85
};

var soundIndices = 
{
	snd_cancel:					0,
	snd_cursor:					1,
	snd_explosion:				2,
	snd_fanfare:				3,
	snd_hit:					4,
	snd_jump:					5,
	snd_paint:					6,
	snd_point:					7,
	snd_slash:					8,
	snd_step:					9,
	snd_death:					10,
	snd_pause:					11
};

var musicIndices =
{
	mus_infiniteJourney:		0,
	mus_gors:					1,
	mus_rob:					2,
	mus_exit:					3,
	mus_autumnForest:			4,
	mus_certainlyMaybe:			5,
	mus_plaidBagel:				6,
	mus_psg:					7,
	mus_love:					8,
	mus_shark:					9,
	mus_socks:					10,
	mus_melhor:					11,
	mus_neoMagiko:				12,
	mus_beta:					13,
	mus_boss:					14,
	mus_credits:				15
};

// Called to play a specified sound at the specified volume.
function PlaySound(n, vol, firsttime)
{
	if (n < 0 || n >= soundlist.length) return;
	
	soundlist[n].play();
	soundlist[n].volume(vol * g_globalvolume * g_soundvolume);
}
// Music
var songnamelist = new Array();
var songlist = new Array();

var g_currentbgm = -1;

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
		songlist[g_currentbgm].volume(g_globalvolume * g_musicvolume);
	}
}

/* -- Game/service related variables -- */

// Chunkhandler.
var g_ChunkHandler = new ChunkHandler();
var g_ChunkLoader = new LoadedChunkStorage();

// Loading trackers.
var toload = 0;
var loaded = 0;

// Other global variables.
var g_fps = 30;
var g_maxobjects = 512;

// Directories for 
var dir_sprites =	"Sprites/";
var dir_scripts =	"Scripts/";
var dir_songs =		"sounds/";
var dir_sounds =	"sounds/";

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
		// don't count inactive enemies.
		if (type == objectTypes.enemy && (GameObjectArray[i].extraFloat2 > 0 || GameObjectArray[i].extraInt2 == enemyTypes.bullet)) count--;
	}
	return count;
}
// Returns the index of the first object with the given type.
function FindFirstObject(type, extraType)
{
	var i = 0;
	for (; i < g_maxobjects; i++)
	{
		if (GameObjectArray[i].active && GameObjectArray[i].type == type)
		{
			// If we're an enemy or item, check the extraType, too.
			if (type == objectTypes.enemy || type == objectTypes.item)
			{
				if (extraType > -1 && GameObjectArray[i].extraInt2 == extraType)
					break;
				else if (extraType == -1 && GameObjectArray[i].extraInt2 >= enemyTypes.dazz && GameObjectArray[i].extraInt2 < enemyTypes.dazz + enemyTypes.bossCount)
					break;
				else if (extraType < -1) break;
			}
			else
				break;
		}
	}
	return i;
}
//*/

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
	//debug = document.getElementById("debugger");
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
	else if(audio.canPlayType("audio/wav") =="probably" || audio.canPlayType("audio/wav") == "maybe")
	{
		returnExtension = "wav";
	}//*/
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

var g_pickingKey = -1;
var g_pickingKeyTimer = -1;
var g_pickingKeyTime = 150;

// Function that represents and runs the actual canvas program.
function canvasApp()
{
	// Initialize the canvas application.
	// Check to make sure we have canvas support.
	if (!canvasSupport())
	{
		infoBox.innerHTML = "Your browser doesn't support HTML5 Canvas.";
		return;
	}
	//debug.innerHTML = "<h1>Canvas application started.</h1><ol>";
	
	// Canvas variables:
	canvas = document.getElementById("theCanvas");
	context = canvas.getContext("2d");
	
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
	
	var g_currentbgm = "0";
	
	//debug.innerHTML += "<li>Variables created.</li>";
	
	//infoBox.innerHTML = g_storage;
	
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
	
	var voidDark = 0;
	var voidLight = 0;
	
	var subMenuOption = 0;
	var menuLength = 2;
	var controlsScreen = -1;
	
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
		////debug.innerHTML += "<li>User clicked at " + mousePos.x + ", " + mousePos.y + "</li>";
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
		}//*/
		
		// Scroll the chunks.
		g_ChunkHandler.UpdateChunks();
		
		// Handle endupdate methods. (This is when all the objects are scrolled).
		for (var i = 0; i < g_maxobjects; i++)
		{
			if (!GameObjectArray[i].active) continue;
			GameObjectArray[i].EndUpdate();
		}//*/
		
		
		// If we're on the title screen, go to the next menu if the player presses X.
		if (currentGameState == GAME_STATE_TITLE)
		{
			if (g_keyboard.KeyPressed(controls.jump) || g_keyboard.KeyPressed(controls.attack) || g_keyboard.KeyPressed(13))
			{
				g_fadeRate = 0.15;
				g_gameStateToUpdate = GAME_STATE_MENU;
			}
		}
		
		// Handle the highscore set menu.
		else if (currentGameState == GAME_STATE_SETHISCORE)
		{
			// Allow the player to move around the letterboard.
			if (g_keyboard.KeyPressed(controls.up))
			{
				subMenuOption -= 11;
				if (subMenuOption < 0) subMenuOption += menuLength;
				PlaySound(soundIndices.snd_cursor, g_soundvolume, false);
			}
			if (g_keyboard.KeyPressed(controls.duck))
			{
				subMenuOption += 11;
				if (subMenuOption >= menuLength) subMenuOption -= menuLength;
				PlaySound(soundIndices.snd_cursor, g_soundvolume, false);
			}
			if (g_keyboard.KeyPressed(controls.left))
			{
				subMenuOption--;
				if (subMenuOption == -1 || subMenuOption == 10 || subMenuOption == 21 || subMenuOption == 32 || subMenuOption == 43) subMenuOption += 11;
				PlaySound(soundIndices.snd_cursor, g_soundvolume, false);
			}
			if (g_keyboard.KeyPressed(controls.right))
			{
				subMenuOption++;
				if (subMenuOption == 11 || subMenuOption == 22 || subMenuOption == 33 || subMenuOption == 44 || subMenuOption == 55) subMenuOption -= 11;
				PlaySound(soundIndices.snd_cursor, g_soundvolume, false);
			}
			
			// If the player presses attack, backspace.
			if (g_keyboard.KeyPressed(controls.attack))
			{
				g_name[g_highScorePos] = 66;
				if (g_highScorePos > 0) g_highScorePos--;
				PlaySound(soundIndices.snd_cancel, g_soundvolume, false);
			}
			
			// If the player presses jump, place the highlighted character in the current spot and move to the next spot.
			if (g_keyboard.KeyPressed(controls.jump) || g_keyboard.KeyPressed(13))
			{
				if ((subMenuOption >= 0 && subMenuOption <= 42) || (subMenuOption >= 44 && subMenuOption <= 47))
				{
					g_name[g_highScorePos] = subMenuOption;
					if (g_highScorePos < g_name.length - 1) g_highScorePos++;
					PlaySound(soundIndices.snd_jump, g_soundvolume, false);
				}
				else if (subMenuOption == 43)
				{
					g_name[g_highScorePos] = 54;
					if (g_highScorePos < g_name.length - 1) g_highScorePos++;
					PlaySound(soundIndices.snd_jump, g_soundvolume, false);
				}
				else if (subMenuOption >= 48 && subMenuOption <= 51)
				{
					g_name[g_highScorePos] = subMenuOption + 7;
					if (g_highScorePos < g_name.length - 1) g_highScorePos++;
					PlaySound(soundIndices.snd_jump, g_soundvolume, false);
				}
				else if (subMenuOption == 52)
				{
					g_name[g_highScorePos] = 66;
					if (g_highScorePos < g_name.length - 1) g_highScorePos++;
					PlaySound(soundIndices.snd_jump, g_soundvolume, false);
				}
				else if (subMenuOption == 53)
				{
					g_name[g_highScorePos] = 66;
					if (g_highScorePos > 0) g_highScorePos--;
					PlaySound(soundIndices.snd_cancel, g_soundvolume, false);
				}
				else
				{
					// Convert the name we have into a string.
					var str = "";
					for (var i = 0; i < g_name.length; i++)
					{
						var val = "";
						if (g_name[i] == 66) val = " ";
						else if (g_name[i] >= 0 && g_name[i] <= 25) val = String.fromCharCode(65 + g_name[i]);
						else if (g_name[i] == 26) val = ".";
						else if (g_name[i] == 27) val = ",";
						else if (g_name[i] == 28) val = "'";
						else if (g_name[i] == 29) val = "\"";
						else if (g_name[i] == 30) val = "-";
						else if (g_name[i] == 31) val = "?";
						else if (g_name[i] == 32) val = "!";
						else if (g_name[i] >= 33 && g_name <= 42) val = String.fromCharCode(48 + g_name[i] - 33);
						else if (g_name[i] == 43) val = "&";
						else if (g_name[i] == 44) val = "@";
						else if (g_name[i] == 45) val = "#";
						else if (g_name[i] == 46) val = "$";
						else if (g_name[i] == 47) val = "%";
						else if (g_name[i] == 48) val = "^";
						else if (g_name[i] == 49) val = ">";
						else if (g_name[i] == 50) val = "/";
						else if (g_name[i] == 51) val = "<";
						str = str.concat(val);
					}
					str = str.trim();
					
					// Place this name and score into the highscores table, then dump the last one, and go to the highscores screen.
					g_highScores.splice(g_highScore, 0, {name:str, score:g_playerScore});
					g_highScores.pop();
					g_gameStateToUpdate = GAME_STATE_HIGHSCORES;
					subMenuOption = 0;
					SaveHighScores();
					PlaySound(soundIndices.snd_point, g_soundvolume, false);
				}
			}
		}
		
		// Handle the menus.
		else if (currentGameState == GAME_STATE_MENU || currentGameState == GAME_STATE_OPTIONS || currentGameState == GAME_STATE_CONTROLS || currentGameState == GAME_STATE_SOUNDS || currentGameState == GAME_STATE_CREDITS || currentGameState == GAME_STATE_HIGHSCORES)
		{
			if (g_pickingKeyTimer == -1)
			{
				// If the player presses up or down, change options.
				if (g_keyboard.KeyPressed(controls.up))
				{
					subMenuOption--;
					if (subMenuOption < 0) subMenuOption = menuLength - 1;
					PlaySound(soundIndices.snd_cursor, g_soundvolume, false);
				}
				if (g_keyboard.KeyPressed(controls.duck))
				{
					subMenuOption++;
					if (subMenuOption >= menuLength) subMenuOption = 0;
					PlaySound(soundIndices.snd_cursor, g_soundvolume, false);
				}
				
				if (currentGameState == GAME_STATE_CONTROLS)
				{
					if (g_keyboard.KeyPressed(controls.up) || g_keyboard.KeyPressed(controls.duck))
					{
						// Destroy any existing effect objects first.
						for (var i = 0; i < g_maxobjects; i++)
						{
							if (GameObjectArray[i].active && GameObjectArray[i].type == objectTypes.effect) DestroyGameObject(i);
						}
						var temp = CreateGameObject(objectTypes.effect, {x:85, y:8});
						GameObjectArray[temp].spriteIndex = spriteIndices.spr_controlsScreens_blur01 + Math.round(Math.random() * 6);
						GameObjectArray[temp].drawDepth = 21;
					}
				}
				
				// If we're in the main menu, allow the player to adjust the starting speed.
				if (currentGameState == GAME_STATE_MENU)
				{
					if (subMenuOption == 0)
					{
						if (g_keyboard.KeyPressed(controls.left))
						{
							g_diffStart--; if (g_diffStart < 0) g_diffStart = 0;
							PlaySound(soundIndices.snd_step, g_soundvolume, false);
						}
						if (g_keyboard.KeyPressed(controls.right))
						{
							g_diffStart++; if (g_diffStart >= 5) g_diffStart = 4;
							PlaySound(soundIndices.snd_step, g_soundvolume, false);
						}
					}
				}
				
				// If we're in the sound menu and the player presses the side arrows, change the associated amount.
				if (currentGameState == GAME_STATE_SOUNDS)
				{
					if (g_keyboard.KeyPressed(controls.left))
					{
						if (subMenuOption == 0)
						{
							g_globalvolume -= 0.10;
							if (g_globalvolume < 0.0) g_globalvolume = 0.0;
							for (var i = 0; i < songlist.length; i++)
							{
								songlist[i].volume(g_globalvolume * g_musicvolume);
							}
						}
						else if (subMenuOption == 1)
						{
							g_soundvolume -= 0.10;
							if (g_soundvolume < 0.0) g_soundvolume = 0.0;
						}
						else if (subMenuOption == 2)
						{
							g_musicvolume -= 0.10;
							if (g_musicvolume < 0.0) g_musicvolume = 0.0;
							for (var i = 0; i < songlist.length; i++)
							{
								songlist[i].volume(g_globalvolume * g_musicvolume);
							}
						}
						PlaySound(soundIndices.snd_step, g_soundvolume, false);
					}
					if (g_keyboard.KeyPressed(controls.right))
					{
						if (subMenuOption == 0)
						{
							g_globalvolume += 0.10;
							if (g_globalvolume > 1.0) g_globalvolume = 1.0;
							for (var i = 0; i < songlist.length; i++)
							{
								songlist[i].volume(g_globalvolume * g_musicvolume);
							}
						}
						else if (subMenuOption == 1)
						{
							g_soundvolume += 0.10;
							if (g_soundvolume > 1.0) g_soundvolume = 1.0;
						}
						else if (subMenuOption == 2)
						{
							g_musicvolume += 0.10;
							if (g_musicvolume > 1.0) g_musicvolume = 1.0;
							for (var i = 0; i < songlist.length; i++)
							{
								songlist[i].volume(g_globalvolume * g_musicvolume);
							}
						}
						PlaySound(soundIndices.snd_step, g_soundvolume, false);
					}
				}
				
				// If the player presses C on a submenu, return to the previous menu.
				if (g_keyboard.KeyPressed(controls.attack))
				{
					// DEBUG: Pressing B on the menu screen goes to shmup mode.
					if (currentGameState == GAME_STATE_MENU)
					{
						//g_gameStateToUpdate = GAME_STATE_GAME;
						//g_playerType = 1;
					}
					else if (currentGameState == GAME_STATE_OPTIONS)
					{
						g_gameStateToUpdate = GAME_STATE_MENU;
						subMenuOption = 0;
					}
					else
					{
						g_gameStateToUpdate = GAME_STATE_OPTIONS;
						subMenuOption = 0;
					}
					PlaySound(soundIndices.snd_cancel, g_soundvolume, false);
				}
				
				// If the player presses X (or ENTER), select the current option.
				if (g_keyboard.KeyPressed(controls.jump) || g_keyboard.KeyPressed(13))
				{
					if (currentGameState == GAME_STATE_MENU)
					{
						if (subMenuOption == 0)
						{
							g_gameStateToUpdate = GAME_STATE_GAME;
							g_playerType = 0;
						}
						else
						{
							g_gameStateToUpdate = GAME_STATE_OPTIONS;
							subMenuOption = 0;
						}
					}
					else if (currentGameState == GAME_STATE_OPTIONS)
					{
						if (subMenuOption == 0)
						{
							g_gameStateToUpdate = GAME_STATE_HIGHSCORES;
							subMenuOption = 0;
						}
						else if (subMenuOption == 1)
						{
							g_gameStateToUpdate = GAME_STATE_CONTROLS;
							subMenuOption = 0;
						}
						else if (subMenuOption == 2)
						{
							g_gameStateToUpdate = GAME_STATE_SOUNDS;
							subMenuOption = 0;
						}
						else if (subMenuOption == 3)
						{
							g_gameStateToUpdate = GAME_STATE_CREDITS;
							subMenuOption = 0;
						}
						else if (subMenuOption == 4)
						{
							DefaultData();
						}
						else
						{
							g_gameStateToUpdate = GAME_STATE_MENU;
							subMenuOption = 1;
						}
					}
					else if (currentGameState == GAME_STATE_CONTROLS)
					{
						// Allow the player to set their controls.
						if (subMenuOption < 7)
						{
							g_pickingKeyTimer = g_pickingKeyTime;
							g_pickingKey = subMenuOption;
						}
						// Return to the options menu.
						else
						{
							g_gameStateToUpdate = GAME_STATE_OPTIONS;
							subMenuOption = 1;
						}
					}
					else if (currentGameState == GAME_STATE_SOUNDS)
					{
						if (subMenuOption == 3)
						{
							// Bring up the music menu.
							g_pause = true;
							g_soundTest = true;
							
							// Move the cursor to the currently playing music.
							subMenuOption = 0;
						}
						else if (subMenuOption == 4)
						{
							g_gameStateToUpdate = GAME_STATE_OPTIONS;
							subMenuOption = 2;
						}
					}
					else if (currentGameState == GAME_STATE_CREDITS)
					{
						g_gameStateToUpdate = GAME_STATE_OPTIONS;
						subMenuOption = 3;
					}
					else if (currentGameState == GAME_STATE_HIGHSCORES)
					{
						g_gameStateToUpdate = GAME_STATE_OPTIONS;
						subMenuOption = 0;
					}
					PlaySound(soundIndices.snd_jump, g_soundvolume, false);
				}
			}
		}
		
		// Handle the gameover screen.
		else if (currentGameState == GAME_STATE_GAMEOVER)
		{
			if (g_keyboard.KeyPressed(controls.jump) || g_keyboard.KeyPressed(controls.attack))
			{
				g_gameStateToUpdate = GAME_STATE_MENU;
				
				PlaySound(soundIndices.snd_cancel, g_soundvolume, false);
			}
		}
		
		// Handle the main game stuff.
		if (currentGameState == GAME_STATE_GAME || currentGameState == GAME_STATE_CREDITS)
		{
			// Scroll the camera.
			g_spriteCamera.x -= g_scrollSpeed;
			
			if (currentGameState == GAME_STATE_GAME)
			{
				// If we're invincible, always refill our stats.
				if (g_playerKonami)
				{
					g_playerHP = g_playerMaxHP;
					g_playerPaint = g_playerMaxPaint;
				}
				// If our HP is less than zero, increment it as a timer, and when it reaches zero, go to the gameover state.
				if (g_playerHP < 0)
				{
					SwitchMusic(-1);
					g_scrollSpeed = 0;
					g_playerHP++;
					if (g_playerHP == playerConstants.playerDeathTimer + 30) PlaySound(soundIndices.snd_death, g_soundvolume, false);
					if (g_playerHP >= 0)
					{
						/*if (g_playerScore < 57300)
							g_gameStateToUpdate = GAME_STATE_GAMEOVER;
						else
							g_gameStateToUpdate = GAME_STATE_CREDITS;
							//*/
						var i = 0;
						for (; i < g_highScores.length; i++)
						{
							if (g_playerScore > g_highScores[i].score)
							{
								break;
							}
						}
						g_highScore = i;
						if (g_highScore < g_highScores.length)
						{
							g_gameStateToUpdate = GAME_STATE_SETHISCORE;
							subMenuOption = 0;
						}
						else
						{
							g_gameStateToUpdate = GAME_STATE_GAMEOVER;
							subMenuOption = 0;
						}
					}
				}
				else
				{
					if (g_playerScore > g_highScores[g_highScore].score || g_highScores[g_highScore].score == 0)
					{
						g_highScore--;
						if (g_highScore < 0) g_highScore = 0;
					}//*/
				}
			}
			
			// Debug controls:
			//if (g_keyboard.KeyPressed(81)) g_scrollSpeed -= g_speedUp;
			//if (g_keyboard.KeyPressed(87)) g_scrollSpeed += g_speedUp;
			//if (g_keyboard.KeyPressed(69)) g_playerKonami = !g_playerKonami;
			//if (g_keyboard.KeyPressed(84)) g_jumpType = !g_jumpType;
		}
	}
	
	function drawObjects()
	{
		// Get the objects to prepare for drawing.
		for (var i = 0; i < g_maxobjects; i++)
		{
			if (!GameObjectArray[i].active) continue;
			GameObjectArray[i].Draw(g_transition != 1);
		}//*/
		
		currentGameStateFunction();
		
		// Draw the chunks.
		if (currentGameState == GAME_STATE_GAME || currentGameState == GAME_STATE_CREDITS)
			g_ChunkHandler.DrawChunks(context);
		
		// Draw the sprites in the sprite queue.
		DrawSpriteQueue(context);
		DrawLineQueue(context);
		
		if (currentGameState == GAME_STATE_GAME)
		{
			var t = g_spriteCamera.x;
			g_spriteCamera.x = 0;
			// If there's a boss, draw it's health meter.
			var boss = FindFirstObject(objectTypes.enemy, -1);
			if (boss < g_maxobjects)
			{
				for (var i = 0; i < GameObjectArray[boss].extraInt; i++)
				{
					g_SpriteSheetList[spriteIndices.spr_bossBar].DrawFrame({x:g_screensize.x / 2 - enemyConstants.bossHP / 2 * 9 + i * 9, y:g_screensize.y - 3}, 0, 1, context);
				}
			}
			g_spriteCamera.x = t;
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
		
		//infoBox.innerHTML = ""; for (var i = 0; i < g_cds.length; i++) infoBox.innerHTML += g_cds[i].toString();
		//infoBox.innerHTML = toload;
		
		// If the keypicker timer is active, intercept and handle input.
		if (g_pickingKeyTimer > -1)
		{
			g_pickingKeyTimer--;
			// If the player has pressed something this frame, set the key we're picking to it.
			if (g_lastKeyPressed < 256 && g_pickingKeyTimer > -1)
			{
				g_pickingKeyTimer = 0;
				if (g_pickingKey == 0)
				{
					// If any other keys are the same as the one we have set, don't do it.
					if (controls.left == g_lastKeyPressed)
					{ controls.left = controls.up; controls.up = g_lastKeyPressed; }
					else if (controls.right == g_lastKeyPressed)
					{ controls.right = controls.up; controls.up = g_lastKeyPressed; }
					else if (controls.duck == g_lastKeyPressed)
					{ controls.duck = controls.up; controls.up = g_lastKeyPressed; }
					else if (controls.jump == g_lastKeyPressed)
					{ controls.jump = controls.up; controls.up = g_lastKeyPressed; }
					else if (controls.attack == g_lastKeyPressed)
					{ controls.attack = controls.up; controls.up = g_lastKeyPressed; }
					else if (controls.pause == g_lastKeyPressed)
					{ controls.pause = controls.up; controls.up = g_lastKeyPressed; }
					// Otherwise, go ahead and set the key.
					else
						controls.up = g_lastKeyPressed;
				}
				else if (g_pickingKey == 1)
				{
					// If any other keys are the same as the one we have set, don't do it.
					if (controls.left == g_lastKeyPressed)
					{ controls.left = controls.right; controls.right = g_lastKeyPressed; }
					else if (controls.up == g_lastKeyPressed)
					{ controls.up = controls.right; controls.right = g_lastKeyPressed; }
					else if (controls.duck == g_lastKeyPressed)
					{ controls.duck = controls.right; controls.right = g_lastKeyPressed; }
					else if (controls.jump == g_lastKeyPressed)
					{ controls.jump = controls.right; controls.right = g_lastKeyPressed; }
					else if (controls.attack == g_lastKeyPressed)
					{ controls.attack = controls.right; controls.right = g_lastKeyPressed; }
					else if (controls.pause == g_lastKeyPressed)
					{ controls.pause = controls.right; controls.right = g_lastKeyPressed; }
					// Otherwise, go ahead and set the key.
					else
						controls.right = g_lastKeyPressed;
				}
				else if (g_pickingKey == 2)
				{
					// If any other keys are the same as the one we have set, don't do it.
					if (controls.left == g_lastKeyPressed)
					{ controls.left = controls.duck; controls.duck = g_lastKeyPressed; }
					else if (controls.up == g_lastKeyPressed)
					{ controls.up = controls.duck; controls.duck = g_lastKeyPressed; }
					else if (controls.right == g_lastKeyPressed)
					{ controls.right = controls.duck; controls.duck = g_lastKeyPressed; }
					else if (controls.jump == g_lastKeyPressed)
					{ controls.jump = controls.duck; controls.duck = g_lastKeyPressed; }
					else if (controls.attack == g_lastKeyPressed)
					{ controls.attack = controls.duck; controls.duck = g_lastKeyPressed; }
					else if (controls.pause == g_lastKeyPressed)
					{ controls.pause = controls.duck; controls.duck = g_lastKeyPressed; }
					// Otherwise, go ahead and set the key.
					else
						controls.duck = g_lastKeyPressed;
				}
				else if (g_pickingKey == 3)
				{
					// If any other keys are the same as the one we have set, don't do it.
					if (controls.duck == g_lastKeyPressed)
					{ controls.duck = controls.left; controls.left = g_lastKeyPressed; }
					else if (controls.up == g_lastKeyPressed)
					{ controls.up = controls.left; controls.left = g_lastKeyPressed; }
					else if (controls.right == g_lastKeyPressed)
					{ controls.right = controls.left; controls.left = g_lastKeyPressed; }
					else if (controls.jump == g_lastKeyPressed)
					{ controls.jump = controls.left; controls.left = g_lastKeyPressed; }
					else if (controls.attack == g_lastKeyPressed)
					{ controls.attack = controls.left; controls.left = g_lastKeyPressed; }
					else if (controls.pause == g_lastKeyPressed)
					{ controls.pause = controls.left; controls.left = g_lastKeyPressed; }
					// Otherwise, go ahead and set the key.
					else
						controls.left = g_lastKeyPressed;
				}
				else if (g_pickingKey == 4)
				{
					// If any other keys are the same as the one we have set, don't do it.
					if (controls.duck == g_lastKeyPressed)
					{ controls.duck = controls.jump; controls.jump = g_lastKeyPressed; }
					else if (controls.up == g_lastKeyPressed)
					{ controls.up = controls.jump; controls.jump = g_lastKeyPressed; }
					else if (controls.right == g_lastKeyPressed)
					{ controls.right = controls.jump; controls.jump = g_lastKeyPressed; }
					else if (controls.left == g_lastKeyPressed)
					{ controls.left = controls.jump; controls.jump = g_lastKeyPressed; }
					else if (controls.attack == g_lastKeyPressed)
					{ controls.attack = controls.jump; controls.jump = g_lastKeyPressed; }
					else if (controls.pause == g_lastKeyPressed)
					{ controls.pause = controls.jump; controls.jump = g_lastKeyPressed; }
					// Otherwise, go ahead and set the key.
					else
						controls.jump = g_lastKeyPressed;
				}
				else if (g_pickingKey == 5)
				{
					// If any other keys are the same as the one we have set, don't do it.
					if (controls.duck == g_lastKeyPressed)
					{ controls.duck = controls.attack; controls.attack = g_lastKeyPressed; }
					else if (controls.up == g_lastKeyPressed)
					{ controls.up = controls.attack; controls.attack = g_lastKeyPressed; }
					else if (controls.right == g_lastKeyPressed)
					{ controls.right = controls.attack; controls.attack = g_lastKeyPressed; }
					else if (controls.left == g_lastKeyPressed)
					{ controls.left = controls.attack; controls.attack = g_lastKeyPressed; }
					else if (controls.jump == g_lastKeyPressed)
					{ controls.jump = controls.attack; controls.attack = g_lastKeyPressed; }
					else if (controls.pause == g_lastKeyPressed)
					{ controls.pause = controls.attack; controls.attack = g_lastKeyPressed; }
					// Otherwise, go ahead and set the key.
					else
						controls.attack = lastKey;
				}
				else
				{
					// If any other keys are the same as the one we have set, don't do it.
					if (controls.duck == g_lastKeyPressed)
					{ controls.duck = controls.pause; controls.pause = g_lastKeyPressed; }
					else if (controls.up == g_lastKeyPressed)
					{ controls.up = controls.pause; controls.pause = g_lastKeyPressed; }
					else if (controls.right == g_lastKeyPressed)
					{ controls.right = controls.pause; controls.pause = g_lastKeyPressed; }
					else if (controls.left == g_lastKeyPressed)
					{ controls.left = controls.pause; controls.pause = g_lastKeyPressed; }
					else if (controls.jump == g_lastKeyPressed)
					{ controls.jump = controls.pause; controls.pause = g_lastKeyPressed; }
					else if (controls.attack == g_lastKeyPressed)
					{ controls.attack = controls.pause; controls.pause = g_lastKeyPressed; }
					// Otherwise, go ahead and set the key.
					else
						controls.pause = g_lastKeyPressed;
				}
			}
		}
		
		mouseClick = mouseInput;
		
		if (currentGameState == GAME_STATE_GAME && g_keyboard.KeyPressed(controls.pause) && g_transition == 1 && g_playerHP > 0)
		{
			g_pause = !g_pause;
			g_soundTest = !g_soundTest;
			PlaySound(soundIndices.snd_pause, g_soundvolume, false);
			// If soundtest is open now, set the cursor to the currently playing song.
			if (g_soundTest)
			{
				subMenuOption = 0;
			}
		}
		
		if (!g_pause)
		{
			if (g_transition != 2) g_gameStateToUpdate = currentGameState;
			
			if (g_transition == 0)
			{
				if (currentGameState != GAME_STATE_LOAD)
				{
					g_fade -= g_fadeRate;
					if (g_fade <= 0)
					{
						g_fade = 0;
						g_transition = 1;
					}
				}
			}
			else if (g_transition == 1)
			{
				gameLoop();
				
				//if (g_keyboard.KeyPressed(82)) g_gameStateToUpdate = GAME_STATE_RESET;
				
				if (g_gameStateToUpdate != currentGameState)
				{
					if (g_gameStateToUpdate == GAME_STATE_RESET)
						g_gameStateToUpdate = currentGameState;
					g_transition = 2;
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
			
			// Draw things
			drawObjects();
			
			if (currentGameState != GAME_STATE_LOAD)
			{
				context.globalAlpha = g_fade;
				ClearScreen("rgb(0,0,0)");
				context.globalAlpha = 1;
			}
		}
		
		// If we have soundtest open, draw the soundtest.
		if (g_soundTest)
		{
			// Allow the player to move around in this menu.
			if (g_keyboard.KeyPressed(controls.up))
			{
				if (subMenuOption < 15)
				{
					if (subMenuOption < 12)
					{
						subMenuOption -= 3;
						if (subMenuOption < 0) subMenuOption += 3;
					}
					else
					{
						subMenuOption -= 3;
					}
				}
				else
				{
					// Go to the last cd we have.
					var i = g_cds.length - 1;
					for (; i >= 0; i--)
					{
						if (g_cds[i] == 1) break;
					}
					if (i > -1 && i > 11) subMenuOption = i;
					else subMenuOption = 11;
				}
				PlaySound(soundIndices.snd_cursor, g_soundvolume, false);
			}
			if (g_keyboard.KeyPressed(controls.duck))
			{
				if (subMenuOption < 15)
				{
					if (subMenuOption < 12)
					{
						subMenuOption += 3;
						while (subMenuOption < 15 && subMenuOption >= 12 && g_cds[subMenuOption] == 0)
						{
							subMenuOption--;
							if (subMenuOption == 11)
							{
								subMenuOption += 3;
								if (g_cds[subMenuOption] == 0) subMenuOption = 15;
							}
						}
					}
					else
						subMenuOption = 15;
					if (subMenuOption > 15) subMenuOption = 15;
				}
				PlaySound(soundIndices.snd_cursor, g_soundvolume, false);
			}
			if (g_keyboard.KeyPressed(controls.left))
			{
				if (subMenuOption < 15)
				{
					if (subMenuOption < 12)
					{
						subMenuOption--;
						if (subMenuOption == -1 || subMenuOption == 2 || subMenuOption == 5 || subMenuOption == 8) subMenuOption += 3;
					}
					else
					{
						subMenuOption--;
						if (subMenuOption == 11) subMenuOption += 3;
						while (subMenuOption < 15 && subMenuOption >= 12 && g_cds[subMenuOption] == 0)
						{
							subMenuOption--;
							if (subMenuOption == 11)
							{
								subMenuOption += 3;
								if (g_cds[subMenuOption] == 0) subMenuOption = 15;
							}
						}
					}
				}
				else
				{
					// Go to the last cd we have.
					var i = g_cds.length - 1;
					for (; i >= 0; i--)
					{
						if (g_cds[i] == 1) break;
					}
					if (i > -1 && i > 11) subMenuOption = i;
					else subMenuOption = 11;
				}
				PlaySound(soundIndices.snd_cursor, g_soundvolume, false);
			}
			if (g_keyboard.KeyPressed(controls.right))
			{
				if (subMenuOption < 15)
				{
					if (subMenuOption < 12)
					{
						subMenuOption++;
						if (subMenuOption == 3 || subMenuOption == 6 || subMenuOption == 9 || subMenuOption == 12) subMenuOption -= 3;
					}
					else
					{
						subMenuOption++;
						if (subMenuOption == 15) subMenuOption -= 3;
						while (subMenuOption < 15 && g_cds[subMenuOption] == 0)
						{
							subMenuOption++;
							if (subMenuOption == 15)
							{
								subMenuOption -= 3;
								if (g_cds[subMenuOption] == 0) subMenuOption = 15;
							}
						}
					}
				}
				PlaySound(soundIndices.snd_cursor, g_soundvolume, false);
			}
			// If the player presses jump (or enter), play the highlighted music (or just return to the game).
			if (g_keyboard.KeyPressed(controls.jump) || g_keyboard.KeyPressed(13))
			{
				if (subMenuOption < 15)
				{
					if (g_cds[subMenuOption] == 1)SwitchMusic(subMenuOption);
				}
				else
				{
					g_pause = false;
					g_soundTest = false;
					subMenuOption = 3;
				}
				PlaySound(soundIndices.snd_jump, g_soundvolume, false);
			}
			// If the player presses attack, just exit out.
			if (g_keyboard.KeyPressed(controls.attack))
			{
				g_pause = false;
				g_soundTest = false;
				subMenuOption = 3;
				PlaySound(soundIndices.snd_cancel, g_soundvolume, false);
			}
			
			if (g_soundTest) DrawSoundTest();
		}
		
		prevMouse = mouseInput;
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
		}//*/
		
		g_pause = false;
		
		g_spriteCamera.x = 0;
		
		// Initialize the game state.
		switch (gs)
		{
			case GAME_STATE_INIT:
				//debug.innerHTML += "<li>GSMInit started.</li>";
				currentGameStateFunction = gsmInit;
				break;
				
			case GAME_STATE_LOAD:
				//debug.innerHTML += "<li>GSMLoad started.</li>";
				currentGameStateFunction = gsmLoad;
				break;
				
			case GAME_STATE_TITLE:
				//debug.innerHTML += "<li>GSMTitle started.</li>";
				g_fadeRate = 0.15;
				currentGameStateFunction = gsmTitle;
				CreateGameObject(objectTypes.splashTsr, {x:g_screensize.x / 2, y:-13});
				break;
				
			case GAME_STATE_MENU:
				//debug.innerHTML += "<li>GSMMenu started.</li>";
				g_fadeRate = 0.15;
				currentGameStateFunction = gsmMenu;
				menuLength = 2;
				if (g_currentbgm == -1)
					SwitchMusic(musicIndices.mus_infiniteJourney);
				
				break;
				
			case GAME_STATE_OPTIONS:
				//debug.innerHTML += "<li>GSMOptions started.</li>";
				currentGameStateFunction = gsmOptions;
				menuLength = 6;
				break;
				
			case GAME_STATE_CONTROLS:
				//debug.innerHTML += "<li>GSMControls started.</li>";
				currentGameStateFunction = gsmControls;
				menuLength = 8;
				
				controlsScreen = CreateGameObject(objectTypes.controlsScreen, {x:112, y:28});
				GameObjectArray[controlsScreen].spriteIndex = spriteIndices.spr_controlsScreen_up;
				GameObjectArray[controlsScreen].frameSpeed = 2;
				break;
				
			case GAME_STATE_SOUNDS:
				//debug.innerHTML += "<li>GSMSounds started.</li>";
				currentGameStateFunction = gsmSounds;
				menuLength = 5;
				break;
				
			case GAME_STATE_CREDITS:
				//debug.innerHTML += "<li>GSMCredits started.</li>";
				currentGameStateFunction = gsmCredits;
				menuLength = 0;
				
				g_playerHP = g_playerMaxHP;
				g_playerPaint = g_playerStartingPaint;
				
				g_scrollSpeed = -1;
				g_speedUp = -1;
				g_difficulty = 0;
				
				g_ChunkHandler.ClearChunks();
				g_ChunkHandler.SpawnChunk({x:0, y:0}, 0, 0);
				g_ChunkHandler.SpawnChunk({x:80, y:0}, 0, 0);
				g_ChunkHandler.SpawnChunk({x:160, y:0}, 0, 0);
				g_ChunkHandler.SpawnChunk({x:240, y:0}, 0, 0);
				
				SwitchMusic(musicIndices.mus_credits);
				
				break;
				
			case GAME_STATE_HIGHSCORES:
				//debug.innerHTML += "<li>GSMHighscores started.</li>";
				currentGameStateFunction = gsmHighscores;
				menuLength = 0;
				break;
				
			case GAME_STATE_SETHISCORE:
				//debug.innerHTML += "<li>GSMHighscores started.</li>";
				currentGameStateFunction = gsmSetHighscores;
				menuLength = 55;
				PlaySound(soundIndices.snd_fanfare, g_soundvolume, false);
				SwitchMusic(-1);
				break;
				
			case GAME_STATE_GAME:
				//debug.innerHTML += "<li>GSMGame started.</li>";
				g_fadeRate = 0.15;
				g_transition = 0;
				g_fade = 1.0;
				
				currentGameStateFunction = gsmGame;
				
				g_playerHP = g_playerMaxHP;
				g_playerPaint = g_playerStartingPaint;
				
				g_speedUp = g_normalSpeedUp;
				g_scrollSpeed = g_startingSpeed + g_diffStart * g_speedUp;
				g_difficulty = 0;
				
				if (g_playerType == 1)
				{
					g_scrollSpeed = -1;
					g_speedUp = -1;
				}
				
				g_ChunkHandler.ClearChunks();
				g_ChunkHandler.SpawnChunk({x:0, y:0}, 0, 0);
				g_ChunkHandler.SpawnChunk({x:80, y:0}, -1, 0);
				g_ChunkHandler.SpawnChunk({x:160, y:0}, -1, 0);
				g_ChunkHandler.SpawnChunk({x:240, y:0}, -1, 0);
				
				g_playerScore = 0;
				g_highScore = 7;
				
				if (g_playerType == 0)
					g_playerId = CreateGameObject(objectTypes.player, {x:24, y:120});
				else if (g_playerType == 1)
					g_playerId = CreateGameObject(objectTypes.jackal, {x:24, y:72});
				SwitchMusic(musicIndices.mus_infiniteJourney);
				break;
			case GAME_STATE_GAMEOVER:
				//debug.innerHTML += "<li>GSMGameOver started.</li>";
				
				currentGameStateFunction = gsmGameOver;
				
				for (var i = 0; i < 4; i++)
				{
					var temp = CreateGameObject(objectTypes.item, {x:g_screensize.x / 2 - 40 + i * 20, y: g_screensize.y * 0.15});
					GameObjectArray[temp].ReInitItems(3, i);
					GameObjectArray[temp].extraFloat3 = i / 4 * 360;
				}
				for (var i = 0; i < 4; i++)
				{
					var temp = CreateGameObject(objectTypes.item, {x:g_screensize.x / 2 - 40 + i * 20, y: g_screensize.y * 0.30});
					GameObjectArray[temp].ReInitItems(3, i + 4);
					GameObjectArray[temp].extraFloat3 = i / 4 * 360;
				}
				SwitchMusic(-1);
				break;
		}
	}
	
	// Called when the game first begins to load everything up.
	function gsmInit()
	{
		ClearScreen("#000000");
	
		// Fill the imagename list.
		{
			imagenamelist.push(new imagenamelistEntry("spr_blocks.png", 5, {x:16, y:16}, {x:0, y:0}));
			
			imagenamelist.push(new imagenamelistEntry("spr_playerIdle_right.png", 1, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_playerIdle_left.png", 1, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_playerRun_right.png", 2, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_playerRun_left.png", 2, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_playerJump_right.png", 1, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_playerJump_left.png", 1, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_playerClimb_right.png", 2, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_playerClimb_left.png", 2, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_playerDuck_right.png", 1, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_playerDuck_left.png", 1, {x:16, y:24}, {x:8, y:16}));
			
			imagenamelist.push(new imagenamelistEntry("spr_enemy_bulletRed.png", 3, {x:16, y:16}, {x:8, y:8}));
			imagenamelist.push(new imagenamelistEntry("spr_splash_cp.png", 1, {x:42, y:15}, {x:21, y:8}));
			imagenamelist.push(new imagenamelistEntry("spr_splash_logo.png", 1, {x:85, y:42}, {x:42, y:21}));
			
			imagenamelist.push(new imagenamelistEntry("spr_playerSwing1_right.png", 3, {x:100, y:64}, {x:32, y:41}));
			imagenamelist.push(new imagenamelistEntry("spr_playerSwing1_left.png", 3, {x:100, y:64}, {x:68, y:41}));
			imagenamelist.push(new imagenamelistEntry("spr_playerSwingJ1_right.png", 3, {x:100, y:64}, {x:32, y:41}));
			imagenamelist.push(new imagenamelistEntry("spr_playerSwingJ1_left.png", 3, {x:100, y:64}, {x:68, y:41}));
			imagenamelist.push(new imagenamelistEntry("spr_playerSwingD1_right.png", 3, {x:100, y:64}, {x:32, y:41}));
			imagenamelist.push(new imagenamelistEntry("spr_playerSwingD1_left.png", 3, {x:100, y:64}, {x:68, y:41}));
			imagenamelist.push(new imagenamelistEntry("spr_playerSwingBlob_right.png", 3, {x:100, y:64}, {x:32, y:41}));
			imagenamelist.push(new imagenamelistEntry("spr_playerSwingBlob_left.png", 3, {x:100, y:64}, {x:68, y:41}));
			imagenamelist.push(new imagenamelistEntry("spr_playerSwing2_right.png", 8, {x:100, y:64}, {x:32, y:41}));
			imagenamelist.push(new imagenamelistEntry("spr_playerSwing2_left.png", 8, {x:100, y:64}, {x:68, y:41}));
			
			imagenamelist.push(new imagenamelistEntry("spr_playerCharge_right.png", 2, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_playerCharge_left.png", 2, {x:16, y:24}, {x:8, y:16}));
			
			imagenamelist.push(new imagenamelistEntry("spr_playerSpinJ_right.png", 12, {x:64, y:64}, {x:32, y:41}));
			imagenamelist.push(new imagenamelistEntry("spr_playerSpinJ_left.png", 12, {x:64, y:64}, {x:33, y:41}));
			
			imagenamelist.push(new imagenamelistEntry("spr_playerSpin_right.png", 12, {x:64, y:64}, {x:32, y:41}));
			imagenamelist.push(new imagenamelistEntry("spr_playerSpin_left.png", 12, {x:64, y:64}, {x:33, y:41}));
			
			imagenamelist.push(new imagenamelistEntry("spr_paintBlob.png", 2, {x:16, y:16}, {x:8, y:8}));
			imagenamelist.push(new imagenamelistEntry("spr_paintSplashIn.png", 2, {x:16, y:16}, {x:8, y:8}));
			imagenamelist.push(new imagenamelistEntry("spr_paintSplashOut.png", 2, {x:16, y:16}, {x:8, y:8}));
			imagenamelist.push(new imagenamelistEntry("spr_paintPlat.png", 3, {x:16, y:16}, {x:8, y:8}));
			
			imagenamelist.push(new imagenamelistEntry("spr_enemyGreen_right.png", 64, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_enemyGreen_left.png", 64, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_enemyBlue_right.png", 64, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_enemyBlue_left.png", 64, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_enemyYellow_right.png", 64, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_enemyYellow_left.png", 64, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_enemyRed_right.png", 64, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_enemyRed_left.png", 64, {x:16, y:24}, {x:8, y:16}));
			
			imagenamelist.push(new imagenamelistEntry("spr_jackal.png", 1, {x:24, y:16}, {x:12, y:8}));
			imagenamelist.push(new imagenamelistEntry("spr_items.png", 10, {x:16, y:16}, {x:8, y:8}));
			
			imagenamelist.push(new imagenamelistEntry("spr_playerHurt_right.png", 1, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_playerHurt_left.png", 1, {x:16, y:24}, {x:8, y:16}));
			
			imagenamelist.push(new imagenamelistEntry("spr_hudBar.png", 1, {x:8, y:8}, {x:0, y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_font.png", 73, {x:8, y:8}, {x:0, y:0}));
			
			imagenamelist.push(new imagenamelistEntry("spr_gameover.png", 8, {x:16, y:16}, {x:0, y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_playerDeath.png", 13, {x:16, y:24}, {x:8, y:16}));
			imagenamelist.push(new imagenamelistEntry("spr_void.png", 10, {x:4, y:8}, {x:0, y:0}));
			
			imagenamelist.push(new imagenamelistEntry("spr_dazz.png", 4, {x:32, y:24}, {x:16, y:12}));
			imagenamelist.push(new imagenamelistEntry("spr_masq.png", 3, {x:32, y:24}, {x:16, y:12}));
			imagenamelist.push(new imagenamelistEntry("spr_vic.png", 5, {x:32, y:24}, {x:16, y:12}));
			imagenamelist.push(new imagenamelistEntry("spr_bab.png", 2, {x:32, y:24}, {x:16, y:12}));
			imagenamelist.push(new imagenamelistEntry("spr_iceman.png", 3, {x:32, y:24}, {x:16, y:12}));
			
			imagenamelist.push(new imagenamelistEntry("spr_masqBlob.png", 2, {x:16, y:16}, {x:8, y:8}));
			imagenamelist.push(new imagenamelistEntry("spr_masqSplash.png", 4, {x:16, y:16}, {x:8, y:8}));
			imagenamelist.push(new imagenamelistEntry("spr_vicShot.png", 2, {x:16, y:8}, {x:8, y:4}));
			imagenamelist.push(new imagenamelistEntry("spr_icemanFood.png", 3, {x:16, y:16}, {x:8, y:8}));
			imagenamelist.push(new imagenamelistEntry("spr_dazzHat.png", 2, {x:24, y:16}, {x:12, y:8}));
			
			imagenamelist.push(new imagenamelistEntry("spr_scFont.png", 10, {x:6, y:6}, {x:0, y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_avys.png", 38, {x:31, y:31}, {x:15, y:15}));
			imagenamelist.push(new imagenamelistEntry("spr_cds.png", 15, {x:64, y:64}, {x:1, y:1}));
			imagenamelist.push(new imagenamelistEntry("spr_full.png", 1, {x:161, y:35}, {x:0, y:17}));
			
			imagenamelist.push(new imagenamelistEntry("spr_bgControls.png", 1, {x:160, y:144}, {x:0, y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_controlsLines.png", 10, {x:8, y:8}, {x:0, y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_controlsScreen_up.png", 2, {x:28, y:17}, {x:0, y:5}));
			imagenamelist.push(new imagenamelistEntry("spr_controlsScreen_right.png", 2, {x:8, y:12}, {x:0,y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_controlsScreen_duck.png", 2, {x:8, y:12}, {x:0,y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_controlsScreen_left.png", 2, {x:8, y:12}, {x:0,y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_controlsScreen_jump.png", 2, {x:8, y:20}, {x:0,y:8}));
			imagenamelist.push(new imagenamelistEntry("spr_controlsScreen_attack.png", 2, {x:20, y:17}, {x:0,y:5}));
			imagenamelist.push(new imagenamelistEntry("spr_controlsScreen_pause.png", 1, {x:8, y:12}, {x:0,y:0}));
			
			imagenamelist.push(new imagenamelistEntry("spr_controlsScreen_blur01.png", 1, {x:61, y:48}, {x:0,y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_controlsScreen_blur02.png", 1, {x:61, y:48}, {x:0,y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_controlsScreen_blur03.png", 1, {x:61, y:48}, {x:0,y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_controlsScreen_blur04.png", 1, {x:61, y:48}, {x:0,y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_controlsScreen_blur05.png", 1, {x:61, y:48}, {x:0,y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_controlsScreen_blur06.png", 1, {x:61, y:48}, {x:0,y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_controlsScreen_blur07.png", 1, {x:61, y:48}, {x:0,y:0}));
			
			imagenamelist.push(new imagenamelistEntry("spr_controlsPressKey.png", 1, {x:104, y:72}, {x:52, y:36}));
			imagenamelist.push(new imagenamelistEntry("spr_soundTestCursor.png", 1, {x:16, y:16}, {x:0, y:0}));
			imagenamelist.push(new imagenamelistEntry("spr_soundTest.png", 1, {x:160, y:144}, {x:0, y:0}));
			
			imagenamelist.push(new imagenamelistEntry("spr_splash_tsr.png", 6, {x:48, y:24}, {x:24, y:12}));
			imagenamelist.push(new imagenamelistEntry("spr_bossBar.png", 1, {x:8, y:8}, {x:0, y:0, y:12}));
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
			soundnamelist.push("snd_cancel");
			soundnamelist.push("snd_cursor");
			soundnamelist.push("snd_explosion");
			soundnamelist.push("snd_fanfare");
			soundnamelist.push("snd_hit");
			soundnamelist.push("snd_jump");
			soundnamelist.push("snd_paint");
			soundnamelist.push("snd_point");
			soundnamelist.push("snd_slash");
			soundnamelist.push("snd_step");
			soundnamelist.push("snd_death");
			soundnamelist.push("snd_pause");//*/
		}
		
		//*/
		
		// Load the sounds listed.
		for (var i = 0; i < soundnamelist.length; i++)
		{
			var dirString = dir_sounds + soundnamelist[i];
			var tempSound = new Howl(
				{
					urls: [dirString + ".ogg", dirString + ".mp3", dirString + ".wav"],
					onload: function() {itemLoaded();}
				});
			for (var j = 0; j < tempSound.urls.length; j++)
			{
				console.log(tempSound.urls[j]);
			}
			soundlist.push(tempSound);
			toload++;
		}
		//infoBox.innerHTML = audiotype;
		//infoBox.innerHTML = navigator.appName;
		
		// List the songs to be loaded.
		if (navigator.appName != "Opera")
		{
			songnamelist.push("mus_infiniteJourney");
			songnamelist.push("mus_gors");
			songnamelist.push("mus_rob");
			songnamelist.push("mus_exit");
			songnamelist.push("mus_autumnForest");
			songnamelist.push("mus_certainlyMaybe");
			songnamelist.push("mus_plaidBagel");
			songnamelist.push("mus_psg");
			songnamelist.push("mus_love");
			songnamelist.push("mus_shark");
			songnamelist.push("mus_socks");
			songnamelist.push("mus_melhor");
			songnamelist.push("mus_neoMagiko");
			songnamelist.push("mus_beta");
			songnamelist.push("mus_boss");
			songnamelist.push("mus_credits");//*/
		}
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
		
		// Load chunks.
		g_ChunkLoader.LoadChunkManifest();
		
		// Switch to the loading state.
		switchGameState(GAME_STATE_LOAD);
		
		g_currentbgm = -1;
		
		//debug.innerHTML += "<li>GSMInitEnded</li>";
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
		context.fillRect(g_screensize.x / 6, g_screensize.y *4/9, g_screensize.x * 2/3 * (loaded + g_chunksLoaded) / (toload + g_chunkCount), g_screensize.y / 9);
		
		g_ChunkLoader.LoadChunks();
		
		if (loaded >= toload && g_chunksLoaded >= g_chunkCount)
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
			
			LoadHighScores();
			
			// Make an array to reflect which cds have not been collected.
			g_cdsHad = new Array();
			for (var i = 0; i < g_cds.length; i++)
			{
				if (g_cds[i] == 0) g_cdsHad.push(i);
			}
		}
	}
	
	// Called during the titlescreen state.
	function gsmTitle()
	{
		ClearScreen(g_backgroundColor);
	}
	
	// Called during the menu state.
	function gsmMenu()
	{
		ClearScreen(g_backgroundColor);
		
		AddSpriteToQueue(spriteIndices.spr_splash_logo, 0, {x:g_screensize.x / 2, y:g_screensize.y * 0.15}, 10, 1);
		AddSpriteToQueue(spriteIndices.spr_splash_cp, 0, {x:g_screensize.x / 2, y:g_screensize.y * 0.90}, 10, 1);
		
		var str = "start game";
		var len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2, y:g_screensize.y * 0.50}, 0, -1);
		
		str = (g_diffStart + 1).toString();
		len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x * 0.8 - len / 2, y:g_screensize.y * 0.50}, 0, -1);
		
		str = "options";
		len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2, y:g_screensize.y * 0.60}, 0, -1);
		
		if (g_transition == 1 && !g_soundTest)
		{
			if (subMenuOption == 0) SpriteDrawText(">", {x:24, y:g_screensize.y * 0.50}, 0, -1);
			else SpriteDrawText(">", {x:24, y:g_screensize.y * 0.60}, 0, -1);
		}
	}
	
	function gsmOptions()
	{
		var str = "options";
		var len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2, y:g_screensize.y * 0.05}, 0, -1);
		
		str = "high scores";
		len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2, y:g_screensize.y * 0.20}, 0, -1);
		
		str = "controls";
		len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2, y:g_screensize.y * 0.30}, 0, -1);
		
		str = "sounds";
		len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2, y:g_screensize.y * 0.40}, 0, -1);
		
		str = "credits";
		len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2, y:g_screensize.y * 0.50}, 0, -1);
		
		str = "clear data";
		len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2, y:g_screensize.y * 0.60}, 0, -1);
		
		str = "back";
		len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2, y:g_screensize.y * 0.80}, 0, -1);
		
		if (g_transition == 1 && !g_soundTest)
		{
			if (subMenuOption == 0) SpriteDrawText(">", {x:16, y:g_screensize.y * 0.20}, 0, -1);
			else if (subMenuOption == 1) SpriteDrawText(">", {x:16, y:g_screensize.y * 0.30}, 0, -1);
			else if (subMenuOption == 2) SpriteDrawText(">", {x:16, y:g_screensize.y * 0.40}, 0, -1);
			else if (subMenuOption == 3) SpriteDrawText(">", {x:16, y:g_screensize.y * 0.50}, 0, -1);
			else if (subMenuOption == 4) SpriteDrawText(">", {x:16, y:g_screensize.y * 0.60}, 0, -1);
			else SpriteDrawText(">", {x:16, y:g_screensize.y * 0.80}, 0, -1);
		}
	}
	
	function gsmControls()
	{
		g_SpriteSheetList[spriteIndices.spr_bgControls].DrawFrame({x:0, y:0}, 0, 1, context);
		SpriteDrawText(KeyCodeToString(controls.up), {x:14, y:25}, 0, -1);
		SpriteDrawText(KeyCodeToString(controls.right), {x:14, y:38}, 0, -1);
		SpriteDrawText(KeyCodeToString(controls.duck), {x:14, y:51}, 0, -1);
		SpriteDrawText(KeyCodeToString(controls.left), {x:14, y:64}, 0, -1);
		SpriteDrawText(KeyCodeToString(controls.jump), {x:14, y:77}, 0, -1);
		SpriteDrawText(KeyCodeToString(controls.attack), {x:14, y:90}, 0, -1);
		SpriteDrawText(KeyCodeToString(controls.pause), {x:14, y:103}, 0, -1);
		
		
		if (controlsScreen > -1)
		{
			if (subMenuOption < menuLength - 1)
				GameObjectArray[controlsScreen].ChangeSprite(spriteIndices.spr_controlsScreen_up + subMenuOption);
			else
				GameObjectArray[controlsScreen].spriteIndex = -1;
		}
		
		if (g_transition == 1 && !g_soundTest)
		{
			if (subMenuOption == 0)
			{
				SpriteDrawText(">", {x:4, y:25}, 0, -1);
				
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 2, {x:67, y:25}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 3, {x:82, y:25}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 2, {x:74, y:25}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 0, {x:82, y:33}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 0, {x:82, y:41}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 0, {x:82, y:49}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 0, {x:82, y:57}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 6, {x:82, y:65}, 23, 1);
				
				var str = "block";
				var len = str.length * 8;
				g_layered = true;
				SpriteDrawText(str, {x:115 - len / 2, y:10}, 0, -1);
				g_layered = false;
			}
			else if (subMenuOption == 1)
			{
				SpriteDrawText(">", {x:4, y:38}, 0, -1);
				
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 2, {x:67, y:38}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 2, {x:75, y:38}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 2, {x:83, y:38}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 3, {x:91, y:38}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 0, {x:91, y:46}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 0, {x:91, y:54}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 0, {x:91, y:62}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 6, {x:91, y:70}, 23, 1);
				
				var str = "right";
				var len = str.length * 8;
				g_layered = true;
				SpriteDrawText(str, {x:115 - len / 2, y:10}, 0, -1);
				g_layered = false;
			}
			else if (subMenuOption == 2)
			{
				SpriteDrawText(">", {x:4, y:51}, 0, -1);
				
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 2, {x:67, y:51}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 3, {x:82, y:51}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 2, {x:74, y:51}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 0, {x:82, y:59}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 0, {x:82, y:67}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 0, {x:82, y:75}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 6, {x:82, y:80}, 23, 1);
				
				var str = "duck";
				var len = str.length * 8;
				g_layered = true;
				SpriteDrawText(str, {x:115 - len / 2, y:10}, 0, -1);
				g_layered = false;
			}
			else if (subMenuOption == 3)
			{
				SpriteDrawText(">", {x:4, y:64}, 0, -1);
				
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 2, {x:67, y:64}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 3, {x:73, y:64}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 6, {x:73, y:70}, 23, 1);
				
				var str = "left";
				var len = str.length * 8;
				g_layered = true;
				SpriteDrawText(str, {x:115 - len / 2, y:10}, 0, -1);
				g_layered = false;
			}
			else if (subMenuOption == 4)
			{
				SpriteDrawText(">", {x:4, y:77}, 0, -1);
				
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 5, {x:67, y:77}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 0, {x:67, y:69}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 0, {x:67, y:68}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 1, {x:67, y:60}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 2, {x:75, y:60}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 2, {x:83, y:60}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 2, {x:91, y:60}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 2, {x:99, y:60}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 2, {x:107, y:60}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 2, {x:115, y:60}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 2, {x:123, y:60}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 2, {x:131, y:60}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 2, {x:139, y:60}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 3, {x:146, y:60}, 23, 1);
				AddSpriteToQueue(spriteIndices.spr_controlsLines, 6, {x:146, y:68}, 23, 1);
				
				var str = "jump";
				var len = str.length * 8;
				g_layered = true;
				SpriteDrawText(str, {x:115 - len / 2, y:10}, 0, -1);
				g_layered = false;
			}
			else if (subMenuOption == 5)
			{
				SpriteDrawText(">", {x:4, y:90}, 0, -1);
			
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:67, y:90}, 5, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:67, y:82}, 0, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:67, y:74}, 0, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:67, y:66}, 1, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:75, y:66}, 2, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:83, y:66}, 2, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:91, y:66}, 2, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:99, y:66}, 2, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:107, y:66}, 2, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:115, y:66}, 2, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:123, y:66}, 2, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:131, y:66}, 3, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:131, y:74}, 0, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:131, y:77}, 6, 1, context);
				
				var str = "paint";
				var len = str.length * 8;
				g_layered = true;
				SpriteDrawText(str, {x:114 - len / 2, y:10}, 0, -1);
				g_layered = false;
			}
			else if (subMenuOption == 6)
			{
				SpriteDrawText(">", {x:4, y:103}, 0, -1);
			
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:67, y:103}, 2, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:73, y:103}, 2, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:81, y:103}, 2, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:88, y:103}, 5, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:88, y:95}, 0, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:88, y:87}, 1, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:96, y:87}, 2, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:104, y:87}, 2, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:112, y:87}, 2, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:119, y:87}, 3, 1, context);
				g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:119, y:95}, 6, 1, context);
				
				var str = "pause";
				var len = str.length * 8;
				g_layered = true;
				SpriteDrawText(str, {x:115 - len / 2, y:10}, 0, -1);
				g_layered = false;
			}
			else SpriteDrawText(">", {x:11, y:130}, 0, -1);
		}
		
		if (g_pickingKeyTimer > -1)
		{
			AddSpriteToQueue(spriteIndices.spr_controlsPressKey, 0, {x:g_screensize.x / 2, y:g_screensize.y / 2}, 25, 1);
		}
	}
	
	function gsmSounds()
	{
		var str = "master volume";
		var len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2, y:g_screensize.y * 0.15}, 0, -1);
		for (var i = 0; i < 11; i++)
		{
			var sprInd = 70;
			if (i == 0) sprInd = 69
			else if (i == 11 - 1) sprInd = 71;
			g_SpriteSheetList[spriteIndices.spr_font].DrawFrame({x:g_screensize.x / 2 - 44 + i * 8, y:g_screensize.y * 0.20 + 1}, sprInd, 1, context);
		}
		g_SpriteSheetList[spriteIndices.spr_font].DrawFrame({x:g_screensize.x / 2 - 44 + g_globalvolume * 80, y:g_screensize.y * 0.20 + 1}, 72, 1, context);
		
		str = "sound volume";
		len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2, y:g_screensize.y * 0.30}, 0, -1);
		for (var i = 0; i < 11; i++)
		{
			var sprInd = 70;
			if (i == 0) sprInd = 69
			else if (i == 11 - 1) sprInd = 71;
			g_SpriteSheetList[spriteIndices.spr_font].DrawFrame({x:g_screensize.x / 2 - 44 + i * 8, y:g_screensize.y * 0.35 + 1}, sprInd, 1, context);
		}
		g_SpriteSheetList[spriteIndices.spr_font].DrawFrame({x:g_screensize.x / 2 - 44 + g_soundvolume * 80, y:g_screensize.y * 0.35 + 1}, 72, 1, context);
		
		str = "music volume";
		len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2, y:g_screensize.y * 0.45}, 0, -1);
		for (var i = 0; i < 11; i++)
		{
			var sprInd = 70;
			if (i == 0) sprInd = 69
			else if (i == 11 - 1) sprInd = 71;
			g_SpriteSheetList[spriteIndices.spr_font].DrawFrame({x:g_screensize.x / 2 - 44 + i * 8, y:g_screensize.y * 0.50 + 1}, sprInd, 1, context);
		}
		g_SpriteSheetList[spriteIndices.spr_font].DrawFrame({x:g_screensize.x / 2 - 44 + g_musicvolume * 80, y:g_screensize.y * 0.50 + 1}, 72, 1, context);
		
		str = "soundtest";
		len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2, y:g_screensize.y * 0.65}, 0, -1);
		
		str = "back";
		len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2, y:g_screensize.y * 0.80}, 0, -1);
		
		if (g_transition == 1 && !g_soundTest)
		{
			if (subMenuOption == 0) SpriteDrawText(">", {x:16, y:g_screensize.y * 0.17}, 0, -1);
			else if (subMenuOption == 1) SpriteDrawText(">", {x:16, y:g_screensize.y * 0.32}, 0, -1);
			else if (subMenuOption == 2) SpriteDrawText(">", {x:16, y:g_screensize.y * 0.47}, 0, -1);
			else if (subMenuOption == 3) SpriteDrawText(">", {x:16, y:g_screensize.y * 0.65}, 0, -1);
			else SpriteDrawText(">", {x:16, y:g_screensize.y * 0.80}, 0, -1);
		}
	}
	
	function gsmCredits()
	{
		//var tempX = g_spriteCamera.x;
		//g_spriteCamera.x = 0;
		g_SpriteSheetList[spriteIndices.spr_splash_logo].DrawFrame({x:g_screensize.x / 2, y:g_screensize.y * 0.15}, 0, 1, context);
		
		var str = "credits";
		var len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2, y:g_screensize.y * 0.30}, 0, -1);
		//g_spriteCamera.x = tempX;
	}
	
	function gsmHighscores()
	{
		var str = "highscores";
		var len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2, y:g_screensize.y * 0.10}, 0, -1);
		
		for (var i = 0; i < g_highScores.length; i++)
		{
			str = g_highScores[i].name;
			len = str.length * 8;
			SpriteDrawText(str, {x:g_screensize.x * 0.33 - len / 2, y:g_screensize.y * 0.2 + i * 13}, 0, -1);
			
			SpriteDrawText(g_highScores[i].score.toString(), {x:g_screensize.x * 0.67 - 24, y:g_screensize.y * 0.2 + i * 13}, 6, 33);
		}
	}
	
	function gsmSetHighscores()
	{
		var str = "new highscore!";
		var len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2, y:g_screensize.y * 0.10}, 0, -1);
		
		for (var i = 0; i < g_name.length; i++)
		{
			g_SpriteSheetList[spriteIndices.spr_font].DrawFrame({x:g_screensize.x / 2 - 27 + i * 9, y:g_screensize.y * 0.25}, 70, 1, context);
			if (g_name[i] < 66)
				SpriteDrawText("", {x:g_screensize.x / 2 - 27 + i * 9, y:g_screensize.y * 0.22}, 1, g_name[i]);
		}
		
		SpriteDrawText(g_playerScore.toString(), {x:g_screensize.x / 2 - 24, y:g_screensize.y * 0.35}, 6, 33);
		
		SpriteDrawText("abcdefghijk", {x:36, y:72}, 0, -1);
		SpriteDrawText("lmnopqrstuv", {x:36, y:80}, 0, -1);
		SpriteDrawText("wxyz.,'\"-?!", {x:36, y:88}, 0, -1);
		SpriteDrawText("0123456789&", {x:36, y:96}, 0, -1);
		SpriteDrawText("@#$%^>/< *)", {x:36, y:104}, 0, -1);
		
		if (g_transition == 1 && !g_soundTest)
		{
			g_SpriteSheetList[spriteIndices.spr_font].DrawFrame({x:36 + (subMenuOption % 11) * 8, y:72 + Math.floor(subMenuOption / 11) * 8}, 67, 1, context);
			g_SpriteSheetList[spriteIndices.spr_controlsLines].DrawFrame({x:g_screensize.x / 2 - 27 + g_highScorePos * 9, y:g_screensize.y * 0.28}, 9, 1, context);
		}
	}
	
	// Called during the game state.
	function gsmGame()
	{
		
		//infoBox.innerHTML = "tl: " + g_ChunkHandler.pointCheckCollision({x:mousePos.x + playerConstants.idleCollision.l, y:mousePos.y + playerConstants.idleCollision.t}) + " ";
		//infoBox.innerHTML += "tr: " + g_ChunkHandler.pointCheckCollision({x:mousePos.x + playerConstants.idleCollision.l + playerConstants.idleCollision.w, y:mousePos.y + playerConstants.idleCollision.t}) + " ";
		//infoBox.innerHTML += "bl: " + g_ChunkHandler.pointCheckCollision({x:mousePos.x + playerConstants.idleCollision.l, y:mousePos.y + playerConstants.idleCollision.t + playerConstants.idleCollision.h}) + " ";
		//infoBox.innerHTML += "br: " + g_ChunkHandler.pointCheckCollision({x:mousePos.x + playerConstants.idleCollision.l + playerConstants.idleCollision.w, y:mousePos.y + playerConstants.idleCollision.t + playerConstants.idleCollision.h}) + " ";
		
		//AddLineToQueue({x:mousePos.x + playerConstants.idleCollision.l, y:mousePos.y + playerConstants.idleCollision.t}, {x:mousePos.x + playerConstants.idleCollision.l + playerConstants.idleCollision.w, y:mousePos.y + playerConstants.idleCollision.t + playerConstants.idleCollision.h}, "#ff0000", true, 10, -1);
		//infoBox.innerHTML = g_ChunkHandler.rectCheckCollision(mousePos.x + playerConstants.idleCollision.l, mousePos.y + playerConstants.idleCollision.t, playerConstants.idleCollision.w, playerConstants.idleCollision.h);
		//infoBox.innerHTML = g_ChunkHandler.pointCheckCollision({x:mousePos.x, y:mousePos.y}) + " at " + mousePos.x + ", " + mousePos.y;
		
		// Draw the hud.
		var tempX = g_spriteCamera.x;
		g_spriteCamera.x = 0;
		
		// Draw the void.
		voidDark += 1;
		if (voidDark >= 8) voidDark -= 8;
		voidLight -= 1;
		if (voidLight <= -8) voidLight += 8;
		for (var i = 0; i < 16; i++)
		{
			g_SpriteSheetList[spriteIndices.spr_void].DrawFrame({x:1, y:voidDark + i * 8 + 20}, g_ChunkHandler.currentTile * 2 + 1, 1, context);
		}
		for (var i = 0; i < 16; i++)
		{
			g_SpriteSheetList[spriteIndices.spr_void].DrawFrame({x:0, y:voidLight + i * 8 + 20 + 4}, g_ChunkHandler.currentTile * 2, 1, context);
		}
		
		// Draw the hud frame.
		for (var i = 0; i < 20; i++)
		{
			g_SpriteSheetList[spriteIndices.spr_hudBar].DrawFrame({x:i * 8, y:16}, 0, 1, context);
		}
		
		// Draw the hud.
		SpriteDrawText(";", {x:3, y:2}, 0, -1);
		SpriteDrawText("", {x:13, y:2}, g_playerHP, 46);
		SpriteDrawText("(", {x:41, y:2}, 0, -1);
		for (var i = 0; i < Math.floor(g_playerPaint / 2); i++)
		{
			g_SpriteSheetList[spriteIndices.spr_font].DrawFrame({x:51 + i * 8, y:2}, 44, 1, context);
		}
		if (g_playerPaint % 2 != 0)
		{
			g_SpriteSheetList[spriteIndices.spr_font].DrawFrame({x:51 + Math.floor(g_playerPaint / 2) * 8, y:2}, 66, 1, context);
		}
		//SpriteDrawText("", {x:51, y:2}, g_playerPaint, 44);
		SpriteDrawText("_", {x:104,y:1}, 0, -1);
		SpriteDrawText("+", {x:104,y:9}, 0, -1);
		SpriteScDrawText(g_playerScore.toString(), {x:112,y:2}, 6, 0);
		if (g_highScore < g_highScores.length)
			SpriteScDrawText(g_highScores[g_highScore].score.toString(), {x:112,y:9}, 6, 0);
		
		g_spriteCamera.x = tempX;
	}
	
	function gsmGameOver()
	{
		var str = "press " + KeyCodeToString(controls.jump);
		var len = str.length * 8;
		SpriteDrawText(str, {x:g_screensize.x / 2 - len / 2,y:g_screensize.y * 0.6}, 0, -1);
	}
	
	// Called when an asset finishes loading.
	function itemLoaded()
	{
		////debug.innerHTML += "<li>Asset #" + String(loaded + 1) + " loaded.</li>";
		loaded++;
	}
	
	// Called to clear the screen to the given color.
	function ClearScreen(color)
	{
		context.fillStyle = color;
		context.fillRect(0,0, g_screensize.x, g_screensize.y);
	}
	
	// Called to draw the sound test menu.
	function DrawSoundTest()
	{
		var tempX = g_spriteCamera.x;
		g_spriteCamera.x = 0;
		
		// Draw the bg.
		g_SpriteSheetList[spriteIndices.spr_soundTest].DrawFrame({x:0, y:0}, 0, 1, context);
		
		// Draw the cds we have.
		for (var i = 0; i < g_cds.length; i++)
		{
			if (g_cds[i] == 1)
				g_SpriteSheetList[spriteIndices.spr_items].DrawFrame({x:16 + (i % 3) * 21 + 8, y:23 + (Math.floor(i / 3)) * 21 + 8}, Math.floor(i / 3) + 4, 1, context);
		}
		
		if (g_transition == 1)
		{
			if (subMenuOption < 15)
			{
				g_SpriteSheetList[spriteIndices.spr_soundTestCursor].DrawFrame({x:16 + (subMenuOption % 3) * 21, y:23 + (Math.floor(subMenuOption / 3)) * 21}, 0, 1, context);
				if (g_cds[subMenuOption] == 1) g_SpriteSheetList[spriteIndices.spr_cds].DrawFrame({x:83, y:33}, subMenuOption, 1, context);
			}
			else if (subMenuOption == 15)
				g_SpriteSheetList[spriteIndices.spr_font].DrawFrame({x:55, y:124}, 56, 1, context);
		}
		
		g_spriteCamera.x = tempX;
	}
	
	// Set up and start the game loop.
	switchGameState(GAME_STATE_INIT);
	const FRAME_RATE=g_fps;
	var intervalTime=1000/FRAME_RATE;
	setInterval(appRun, intervalTime );
	//debug.innerHTML += "<li>Setting up canvas app interval.</li>";
	
	//debug.innerHTML += "</ol>";
}


var g_layered = false;
// Function called to draw text using the sprite font.
function SpriteDrawText(str, pos, fullLen, filler)
{
	var offset = 0;
	if (fullLen > 0 && str.length < fullLen)
	{
		offset = (fullLen - str.length) * 8;
		if (filler >= 0 && filler <= 65) 
		{
			for (var i = 0; i < fullLen - str.length; i++)
			{
				g_SpriteSheetList[spriteIndices.spr_font].DrawFrame({x:pos.x + i * 8, y:pos.y}, filler, 1, context);
			}
		}
	}
	for (var i = 0; i < str.length; i++)
	{
		var cAt = str.charAt(i).toLowerCase();
		var finalcAt = 0;
		switch (cAt)
		{
			case 'a': finalcAt = 0; break;
			case 'b': finalcAt = 1; break;
			case 'c': finalcAt = 2; break;
			case 'd': finalcAt = 3; break;
			case 'e': finalcAt = 4; break;
			case 'f': finalcAt = 5; break;
			case 'g': finalcAt = 6; break;
			case 'h': finalcAt = 7; break;
			case 'i': finalcAt = 8; break;
			case 'j': finalcAt = 9; break;
			case 'k': finalcAt = 10; break;
			
			case 'l': finalcAt = 11; break;
			case 'm': finalcAt = 12; break;
			case 'n': finalcAt = 13; break;
			case 'o': finalcAt = 14; break;
			case 'p': finalcAt = 15; break;
			case 'q': finalcAt = 16; break;
			case 'r': finalcAt = 17; break;
			case 's': finalcAt = 18; break;
			case 't': finalcAt = 19; break;
			case 'u': finalcAt = 20; break;
			case 'v': finalcAt = 21; break;
			
			case 'w': finalcAt = 22; break;
			case 'x': finalcAt = 23; break;
			case 'y': finalcAt = 24; break;
			case 'z': finalcAt = 25; break;
			case '.': finalcAt = 26; break;
			case ',': finalcAt = 27; break;
			case '\'': finalcAt = 28; break;
			case '\"': finalcAt = 29; break;
			case '-': finalcAt = 30; break;
			case '?': finalcAt = 31; break;
			case '!': finalcAt = 32; break;
			
			case '0': finalcAt = 33; break;
			case '1': finalcAt = 34; break;
			case '2': finalcAt = 35; break;
			case '3': finalcAt = 36; break;
			case '4': finalcAt = 37; break;
			case '5': finalcAt = 38; break;
			case '6': finalcAt = 39; break;
			case '7': finalcAt = 40; break;
			case '8': finalcAt = 41; break;
			case '9': finalcAt = 42; break;
			case '*': finalcAt = 43; break;
			
			case '@': finalcAt = 44; break;
			case '#': finalcAt = 45; break;
			case '$': finalcAt = 46; break;
			case '%': finalcAt = 47; break;
			case ';': finalcAt = 48; break;
			case '(': finalcAt = 49; break;
			case ')': finalcAt = 50; break;
			case '_': finalcAt = 51; break;
			case '+': finalcAt = 52; break;
			case '=': finalcAt = 53; break;
			case '&': finalcAt = 54; break;
			
			case '^': finalcAt = 55; break;
			case '>': finalcAt = 56; break;
			case '/': finalcAt = 57; break;
			case '<': finalcAt = 58; break;
			case '[': finalcAt = 59; break;
			case ']': finalcAt = 60; break;
			case '|': finalcAt = 61; break;
			case '{': finalcAt = 62; break;
			case '}': finalcAt = 63; break;
			case '~': finalcAt = 64; break;
			case '`': finalcAt = 65; break;
			default: finalcAt = -1; break;
		}
		if (finalcAt != -1)
		{
			if (g_layered) AddSpriteToQueue(spriteIndices.spr_font, finalcAt, {x:pos.x + i * 8 + offset, y:pos.y}, 20, 1);
			else g_SpriteSheetList[spriteIndices.spr_font].DrawFrame({x:pos.x + i * 8 + offset, y:pos.y}, finalcAt, 1, context);
		}
	}
}

// Does the same as above, but with a smaller more limited font (numbers only)
function SpriteScDrawText(str, pos, fullLen, filler)
{
	var offset = 0;
	if (fullLen > 0 && str.length < fullLen)
	{
		offset = (fullLen - str.length) * 8;
		if (filler >= 0 && filler <= 65) 
		{
			for (var i = 0; i < fullLen - str.length; i++)
			{
				g_SpriteSheetList[spriteIndices.spr_scFont].DrawFrame({x:pos.x + i * 8, y:pos.y}, filler, 1, context);
			}
		}
	}

	for (var i = 0; i < str.length; i++)
	{
		g_SpriteSheetList[spriteIndices.spr_scFont].DrawFrame({x:pos.x + i * 8 + offset, y:pos.y}, parseInt(str.charAt(i)), 1, context);
	}
}

// Saves the highscores.
function SaveHighScores()
{
	if (!g_storage) return;
	
	localStorage["saved"] = true;
	
	// Save each of the values into local storage.
	for (var i = 0; i < g_highScores.length; i++)
	{
		localStorage["highscore " + i + " name"] = g_highScores[i].name;
		localStorage["highscore " + i + " score"] = g_highScores[i].score.toString();
	}
}
// Loads the highscores.
function LoadHighScores()
{
	if (!g_storage) return;
	
	//infoBox.innerHTML = localStorage["saved"];
	if (localStorage["saved"] == "true")
	{
		for (var i = 0; i < g_highScores.length; i++)
		{
			if (localStorage["highscore " + i + " name"] != null)
				g_highScores[i].name = localStorage["highscore " + i + " name"];
			if (localStorage["highscore " + i + " score"] != null)
			g_highScores[i].score = parseInt(localStorage["highscore " + i + " score"]);
		}
		for (var i = 0; i < g_cds.length; i++)
		{
			if (localStorage["cds " + i] != null)
				g_cds[i] = parseInt(localStorage["cds " + i]);
		}
		if (isNaN(g_cds[0])) DefaultData();
	}
	else
	{
		DefaultData();
	}
}

// Saves the cds the player has collected.
function SaveCDs()
{
	if (!g_storage) return;
	
	for (var i = 0; i < g_cds.length; i++)
	{
		localStorage["cds " + i] = g_cds[i].toString();
	}
}

// Function to reset the game's save data and clear the storage.
function DefaultData()
{
	g_highScores.length = 0;
	g_highScores.push({name:"SoL", score:100000});
	g_highScores.push({name:"^/<>ba", score:90000});
	g_highScores.push({name:"---", score:57300});
	g_highScores.push({name:"---", score:25000});
	g_highScores.push({name:"---", score:10000});
	g_highScores.push({name:"---", score:500});
	g_highScores.push({name:"---", score:0});
	g_highScores.push({name:"---", score:0});
	
	g_cds.length = 0;
	for (var i = 0; i < 15; i++)
	{
		g_cds.push(0);
	}
	g_cds[0] = 1;
	g_cds[3] = 1;
	
	localStorage.clear();
	
	SaveHighScores();
	SaveCDs();
}