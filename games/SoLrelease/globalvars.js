// Project: SoL 2014
// File: globalvars.js
// Desc: Contains the global variable declarations.
// Author: Kitsu
// Created: January 13, 2014
//
//**************************************************************************************************

// Program reference.
var canvasApplication;

// Store the debugger and infobox references, both used for debugging scripts.
var infoBox;
var debug;

var g_screensize = {x:160, y:144};
var g_basescreen = {x:160, y:144};

var g_windowSize = {x:0, y:0};

var g_backgroundColor = "rgb(168, 176, 104)";

const GAME_STATE_RESET		= -1;
const GAME_STATE_INIT		= 0;
const GAME_STATE_LOAD		= 1;
const GAME_STATE_TITLE		= 2;
const GAME_STATE_MENU		= 3;
const GAME_STATE_OPTIONS	= 4;
const GAME_STATE_CONTROLS	= 5;
const GAME_STATE_SOUNDS		= 6;
const GAME_STATE_CREDITS	= 7;
const GAME_STATE_HIGHSCORES	= 8;
const GAME_STATE_SETHISCORE	= 9;
const GAME_STATE_GAME		= 10;
const GAME_STATE_GAMEOVER	= 11;
const GAME_STATE_COUNT		= 12;
var g_gameStateToUpdate = -1;

var g_pause = false;
var g_start = GAME_STATE_TITLE;

var g_globalvolume = 0.5;
var g_soundvolume = 1.0;
var g_musicvolume = 0.5;

var g_chunkCount = 0;
var g_chunksLoaded = 0;

// Which keys we can use for controls.
var controls = 
{
	left: 37,
	right: 39,
	jump: 88,
	up: 38,
	duck: 40,
	attack: 67,
	pause: 90
};

// Gameplay globals
var g_fullScreen = true;
var g_showHitBoxes = false;

var g_normalSpeedUp = -0.25;
var g_speedUp = g_normalSpeedUp;
var g_startingSpeed = -0.5;
var g_scrollSpeed = g_startingSpeed;
var g_difficulty = 0;
var g_diffStart = 0;

var g_playerKonami = false;
var g_playerMaxHP = 3;
var g_playerHP = g_playerMaxHP;
var g_playerMaxPaint = 12;
var g_playerStartingPaint = 6;
var g_playerPaint = g_playerStartingPaint;
var g_playerScore = 0;

var g_highScore = 7;
var g_highScores = new Array();
g_highScores.push({name:"SoL", score:100000});
g_highScores.push({name:"---", score:90000});
g_highScores.push({name:"---", score:57300});
g_highScores.push({name:"---", score:25000});
g_highScores.push({name:"---", score:10000});
g_highScores.push({name:"---", score:500});
g_highScores.push({name:"---", score:0});
g_highScores.push({name:"---", score:0});
var g_name = new Array();
for (var i = 0; i < 6; i++)
	g_name.push(66);
var g_highScorePos = 0;

var g_cds = new Array();
for (var i = 0; i < 15; i++)
{
	g_cds.push(0);
}
g_cds[0] = 1;
g_cds[3] = 1;
var g_cdsHad;
var g_soundTest = false;

var g_playerType = 1;

var g_fade = 1;
var g_fadeRate = 0.02;
var g_transition = 0;

var g_jumpType = false;

var g_soundjs;

var g_playerId = -1;

var fnt_textbox = "13px Calibri";

// Helper function to return the sign of an input.
function numberSign(x) { return x ? x < 0 ? -1 : 1 : 0; }
// Helper function to return a radian version of a degree angle.
function degToRad(x) { return x * Math.PI / 180; }
// Helper function for linear interpolation.
function lerp(x,y,a) { return x + (y - x) * a; }


var g_storage = Modernizr.localstorage;