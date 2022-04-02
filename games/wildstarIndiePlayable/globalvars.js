// Project: WildstarIndie
// File: globalvars.js
// Desc: Contains the global variable declarations.
// Author: Kitsu
// Created: March 13, 2013
//
//**************************************************************************************************

// Program reference.
var canvasApplication;

// Store the debugger and infobox references, both used for debugging scripts.
var infoBox;
var debug;

var g_screensize = {x:320, y:240};
var g_basescreen = {x:320, y:240};

var g_windowSize = {x:0, y:0};

var g_backgroundColor = "rgb(168, 176, 104)";

var g_scrollSpeed = -1;

const GAME_STATE_RESET		= -1;
const GAME_STATE_INIT		= 0;
const GAME_STATE_LOAD		= 1;
const GAME_STATE_TITLE		= 2;
const GAME_STATE_MENU		= 3;
const GAME_STATE_GAME		= 4;
const GAME_STATE_GAMEOVER	= 5;
const GAME_STATE_COUNT		= 6;
var g_gameStateToUpdate = -1;

var g_pause = false;
var g_start = GAME_STATE_TITLE;

var g_globalvolume = 1.0;

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

var g_playerType = 1;
var g_playerCount = 3;
var g_playerMaxHP = 6;
var g_playerHP = g_playerMaxHP;
var g_playerDeaths = 0;
var g_playerDied = false;

var g_playerText = new Array();
g_playerText[0] = "Scientist:#Seeking answers to the mysteries of Planet Nexus.#Attack with up to 5 summoned blades! ";
g_playerText[1] = "Warrior:#Out to crush the toughest of foes on Planet Nexus.#Uses a mighty sword; charge up to use a spin attack! ";
g_playerText[2] = "Explorer:#Finding all the hidden away secrets of Planet Nexus.#Fire twin guns rapidly! ";

var g_maxSlope = 2;
var g_warpPos;
var g_warpPosSet = false;
var g_nextMap = "room1.txt";
var g_currentMap = "";
var g_warpDirection = -1;
var g_playerIndex = -1;

var g_switches = new Array();
var g_text = "";
var g_textLines = new Array();
var g_textPos = 0;

var g_fade = 1;
var g_fadeRate = 0.02;
var g_transition = 0;

var fnt_textbox = "13px Calibri";

// Splash screen globals.
var menuState = 0;

// Helper function to return the sign of an input.
function numberSign(x) { return x ? x < 0 ? -1 : 1 : 0; }
// Helper function to return a radian version of a degree angle.
function degToRad(x) { return x * Math.PI / 180; }
// Helper function for linear interpolation.
function lerp(x,y,a) { return x + (y - x) * a; }