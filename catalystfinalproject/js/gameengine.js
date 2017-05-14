// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: gameengine.js
// Desc: Contains the primary game logic for the game engine.
// Author: mjensen
// Created: July 23, 2015
//
//**************************************************************************************************

var infoBox;
var canvasApp;

// Set up the game engine.
window.addEventListener('load',
	function()
	{
		infoBox = document.getElementById("infobox");
		canvasApp = new GameEngine(GameEngineConstants.fullScreen);
		if (canvasApp.init(Modernizr.canvas, document.getElementById("theCanvas")))
		{
			canvasApp.startLoop();
		}
		else
		{
			alert("Your browser doesn't support HTML5 Canvas.");
		}
	},
	false);

// Global variables used by the game engine.
var GameEngineConstants = 
{
	fps: 30,
	
	inTransition: 0,
	noTransition: 1,
	outTransition: 2,
	
	stateReset: -3,
	stateInit: -2,
	stateLoad: -1,
	stateTitle: 0,
	stateGame: 1,
	stateEnd: 2,
	stateCredits: 3,
	initialState: 0,
	
	fullScreen: true,
	showHitBoxes: false
};

var GamePlayConstants =
{
	phasePlayer: 0,
	phaseEnemy: 1,
	phaseAction: 2,
	phaseBetween: 3,
	phasePrePlayer: 4,
	phasePostPlayer: 5,
	phaseEnd: 6,
	
	enemyCount: 10,
	itemCount: 5,
	
	startingValue: 1000,
	turnValue: 10,
	itemValue: 100,
	chaseValue: 100,
	
	gameEndTime: 60
}

function GameEngine(pFullScreen)
{
	var _this = this;
	
	this.fullScreen = pFullScreen;
	
	// Field declarations:
	this.canvas;
	this.context;
	this.screenSize;
	this.windowSize;
	
	var currentGameStateMethod = null;
	this.currentGameState;
	this.nextGameState;
	
	// Game state transition variables.
	this.stateTransition = GameEngineConstants.inTransition;
	this.stateFade = 1;
	this.fadeFill = "#000000";
	var stateFadeRate = 0.15;
	
	this.paused = false;
	
	// Other handlers:
	this.gameObjectHandler;
	this.imageLoader;
	this.renderer;
	this.soundPlayer;
	this.inputMouse;
	
	// Loading variables:
	var toLoad = 0;
	var loaded = 0;
	
	// Gameplay global variables:
	this.tilemapObj = null;
	this.playerObj = null;
	this.turnPhase = GamePlayConstants.phaseBetween;
	
	this.won = false;
	
	this.turnCount = 0;
	this.itemCount = 0;
	this.chaseCount = 0;
	
	var titleCycle = 0;
	
	// Initializes the GameEngine
	this.init = function(canvasSupport, pCanvas)
	{
		// Check that the browser supports canvas.
		if (!canvasSupport)
		{
			return false;
		}
		
		// Set up fields.
		_this.canvas = pCanvas;
		_this.context = _this.canvas.getContext("2d");
		_this.screenSize = {x:_this.canvas.width, y:_this.canvas.height};
		_this.windowSize = {x:0, y:0};
		_this.currentGameState = 0;
		_this.nextGameState = _this.currentGameState;
		
		// Set up object handler.
		_this.gameObjectHandler = new GameObjectHandler();
		// Add object modules.
		_this.gameObjectHandler.addType("player", ModulePlayer);
		_this.gameObjectHandler.addType("enemy", ModuleEnemy);
		_this.gameObjectHandler.addType("attack", ModuleAttack);
		_this.gameObjectHandler.addType("item", ModuleItem);
		_this.gameObjectHandler.addType("tileMap", ModuleTileMap);
		_this.gameObjectHandler.addType("effect", ModuleEffect);
		_this.gameObjectHandler.addType("timer", ModuleTimer);
		_this.gameObjectHandler.addType("scorePage", ModuleScorePage);
		
		// Set up image loader.
		_this.imageLoader = new ImageLoader("images");
		// Set up the renderer.
		_this.renderer = new Renderer(_this.context);
		// Set up the sound player.
		_this.soundPlayer = new SoundPlayer("sounds", "music");
		
		// Set up the mouse input handler.
		_this.inputMouse = new InputMouse(_this, _this.canvas);
		_this.inputMouse.initialize();
		
		// Set up and start the game loop.
		_this.switchGameState(GameEngineConstants.stateInit);
		return true;
	}
	
	this.startLoop = function()
	{
		setInterval(_this.appLoop, 1000/GameEngineConstants.fps);
	}
	
	// Method that handles the loop of the program itself.
	this.appLoop = function()
	{
		// Resize the canvas whenever the screen changes size.
		if (_this.fullScreen && (window.innerWidth != _this.windowSize.x || window.innerHeight != _this.windowSize.y))
		{
			_this.resizeCanvas(window);
		}
		
		// Update the mouse.
		_this.inputMouse.update();
		// Update the keyboard.
		
		// Allow the game to be paused.
		
		// If we're not transitioning out of the current state, keep the nextState pointing at the currentState.
		if (_this.stateTransition != GameEngineConstants.outTransition)
		{
			_this.nextGameState = _this.currentGameState;
		}
		
		// Transitioning between states:
		_this.makeTransition();
		
		// If we're not in the process of transitioning, run the game loop.
		if (!_this.isTransitioning())
		{
			gameLoop();
		}
		
		// Handle state change requests.
		_this.requestTransition();
		
		// Draw things
		drawObjects();
		
		// If we're transitioning, draw the transition cover.
		if (_this.isTransitioning())
		{
			// Skip it for the loading state.
			if (_this.currentGameState != GameEngineConstants.stateLoad)
			{
				_this.context.globalAlpha = _this.stateFade;
				clearScreen(_this.fadeFill);
				_this.context.globalAlpha = 1;
			}
		}
	}
	
		// Handles the game loop.
	function gameLoop()
	{
		// If the current game state is in the init or loading phases, don't run the game loop.
		if (_this.currentGameState <= GameEngineConstants.stateLoad)
		{
			return;
		}
		
		// Update objects.
		_this.gameObjectHandler.updateAll();
		
		// Handle object collisions.
		_this.gameObjectHandler.collideAll();
		
		// If the cursor is over the mute button and it's clicked, toggle the sound on or off.
		if (vector2LengthSquared(vector2Difference(_this.inputMouse.getPosition(), {x:303, y:16})) < 13.5 * 13.5)
		{
			if (_this.inputMouse.isPressed())
			{
				_this.soundPlayer.toggleMute();
			}
		}
		else
		{
			if (_this.inputMouse.isPressed())
			{
				var mousePos = _this.inputMouse.getPosition();
				// If the player clicked the screen in the credits state, either go to gors's bandcamp (if they clicked that button) or back to the title.
				if (_this.currentGameState == GameEngineConstants.stateCredits)
				{
					if (mousePos.x > 254 && mousePos.x < 318 && mousePos.y > 122 && mousePos.y < 154)
					{
						window.open("http://gors.bandcamp.com/",'_blank');
					}
					else
					{
						_this.nextGameState = GameEngineConstants.stateTitle;
					}
					_this.soundPlayer.playSound("snd_start");
				}
				// If the player clicked the screen in the title, send them to the game state.
				if (_this.currentGameState == GameEngineConstants.stateTitle)
				{
					// If the player clicked the credits button, go to the credits instead.
					if (mousePos.x > 255 && mousePos.x < 319 && mousePos.y > 207 && mousePos.y < 239)
					{
						_this.nextGameState = GameEngineConstants.stateCredits;
						_this.fadeFill = "#000000";
					}
					// Otherwise, go to the game.
					else
					{
						_this.nextGameState = GameEngineConstants.stateGame;
						_this.fadeFill = "#000000";
					}
					_this.soundPlayer.playSound("snd_start");
				}
			}
		}
	}
	
	// Draws things to the canvas.
	function drawObjects()
	{
		// Get the objects to prepare for drawing.
		_this.gameObjectHandler.drawAll(_this.isTransitioning(), _this.imageLoader, _this.renderer, GameEngineConstants.showHitBoxes);
		
		currentGameStateMethod();
		
		_this.renderer.drawFullQueue(_this.imageLoader);
	}
	
	// Handles the switching of states.
	this.switchGameState = function(pNewState)
	{
		_this.currentGameState = pNewState;
		
		// Clear all the objects.
		_this.gameObjectHandler.destroyAll(true);
		
		// Initialize the new state.
		switch (_this.currentGameState)
		{
			case GameEngineConstants.stateInit:
				currentGameStateMethod = gsmInit;
				break;
			case GameEngineConstants.stateLoad:
				currentGameStateMethod = gsmLoad;
				break;
			case GameEngineConstants.stateTitle:
				currentGameStateMethod = gsmTitle;
				_this.soundPlayer.switchMusic("mus_monday");
				break;
			case GameEngineConstants.stateGame:
				currentGameStateMethod = gsmGame;
				
				_this.tilemapObj = _this.gameObjectHandler.create("tileMap", {x:0, y:0});
				_this.tilemapObj.module.generateDungeon(32, 32, 1, 36, 36, 
														16, {x:5, y:5}, {x:5, y:5}, 5, 2, _this);
				
				_this.playerObj = _this.gameObjectHandler.create("player", {x:0, y:0});
				_this.playerObj.module.setUpUnit(_this.tilemapObj.module.spawnLocation, _this.tilemapObj, _this);
				
				_this.tilemapObj.module.generateEntities(GamePlayConstants.enemyCount, "enemy", 7, 5);
				_this.tilemapObj.module.generateEntities(5, "item", 13, 5);
				
				var goal = _this.gameObjectHandler.create("effect", _this.tilemapObj.module.convertMapPosToWorldPos(_this.tilemapObj.module.exitLocation));
				goal.spriteIndex = _this.imageLoader.getSheetID("spr_eff_goal.png");
				goal.animationEnd = null;
				goal.frameSpeed = 4;
				goal.spriteLoop = true;
				goal.position.y -= 32;
				goal.drawDepth = 9999;
				
				
				_this.tilemapObj.module.clearDistances();
				
				_this.won = false;
				_this.turnCount = 0;
				_this.itemCount = 0;
				_this.chaseCount = 0;
				_this.finalScore = 0;
				_this.turnPhase = GamePlayConstants.phaseBetween;
				_this.soundPlayer.switchMusic("mus_messageWind");
				break;
			case GameEngineConstants.stateEnd:
				currentGameStateMethod = gsmEnd;
				
				var scorePage = _this.gameObjectHandler.create("scorePage", {x:0, y:0});
				scorePage.module.engine = _this;
				scorePage.module.turnCount = _this.turnCount;
				scorePage.module.itemCount = _this.itemCount;
				scorePage.module.chaseCount = _this.chaseCount;
				_this.soundPlayer.switchMusic("mus_umbrella");
				break;
			case GameEngineConstants.stateCredits:
				currentGameStateMethod = gsmCredits;
				_this.soundPlayer.switchMusic("mus_gors");
				break;
		}
	}
	
	// Called when the game first begins to load everything up.
	function gsmInit()
	{
		clearScreen("#000000");
		
		// Load images.
		_this.imageLoader.loadSpriteSheet("spr_player_idle.png", 4, {x:40, y:46}, {x:20, y:34});
		_this.imageLoader.loadSpriteSheet("spr_tileSet.png", 4, {x:36, y:55}, {x:18, y:38});
		_this.imageLoader.loadSpriteSheet("spr_unitShadow.png", 1, {x:40, y:24}, {x:20, y:12});
		_this.imageLoader.loadSpriteSheet("spr_eff_punch.png", 3, {x:57, y:55}, {x:23, y:22});
		_this.imageLoader.loadSpriteSheet("spr_item_cheese.png", 12, {x:16, y:16}, {x:8, y:12});
		_this.imageLoader.loadSpriteSheet("spr_eff_collect.png", 5, {x:21, y:21}, {x:10, y:10});
		_this.imageLoader.loadSpriteSheet("spr_player_walk_e.png", 4, {x:40, y:46}, {x:20, y:34});
		_this.imageLoader.loadSpriteSheet("spr_player_walk_n.png", 4, {x:40, y:46}, {x:20, y:34});
		_this.imageLoader.loadSpriteSheet("spr_player_walk_w.png", 4, {x:40, y:46}, {x:20, y:34});
		_this.imageLoader.loadSpriteSheet("spr_player_walk_s.png", 4, {x:40, y:46}, {x:20, y:34});
		_this.imageLoader.loadSpriteSheet("spr_player_win.png", 8, {x:40, y:54}, {x:20, y:42});
		_this.imageLoader.loadSpriteSheet("spr_enemy_orange_idle.png", 4, {x:40, y:52}, {x:20, y:40});
		_this.imageLoader.loadSpriteSheet("spr_enemy_orange_walk_e.png", 4, {x:40, y:52}, {x:20, y:40});
		_this.imageLoader.loadSpriteSheet("spr_enemy_orange_walk_n.png", 4, {x:40, y:52}, {x:20, y:40});
		_this.imageLoader.loadSpriteSheet("spr_enemy_orange_walk_w.png", 4, {x:40, y:52}, {x:20, y:40});
		_this.imageLoader.loadSpriteSheet("spr_enemy_orange_walk_s.png", 4, {x:40, y:52}, {x:20, y:40});
		_this.imageLoader.loadSpriteSheet("spr_font7x7.png", 48, {x:7, y:7}, {x:3, y:3});
		_this.imageLoader.loadSpriteSheet("spr_hud_cheese.png", 2, {x:32, y:23}, {x:16, y:11});
		_this.imageLoader.loadSpriteSheet("spr_hud_watch.png", 1, {x:32, y:32}, {x:16, y:16});
		_this.imageLoader.loadSpriteSheet("spr_enemy_cage.png", 1, {x:44, y:38}, {x:22, y:19});
		_this.imageLoader.loadSpriteSheet("spr_score_cheese.png", 2, {x:26, y:19}, {x:13, y:9});
		_this.imageLoader.loadSpriteSheet("spr_score_cage.png", 1, {x:22, y:23}, {x:11, y:11});
		_this.imageLoader.loadSpriteSheet("spr_score_watch.png", 1, {x:23, y:23}, {x:11, y:11});
		_this.imageLoader.loadSpriteSheet("spr_score_grade.png", 6, {x:64, y:64}, {x:32, y:32});
		_this.imageLoader.loadSpriteSheet("spr_eff_ring.png", 4, {x:52, y:52}, {x:26, y:26});
		_this.imageLoader.loadSpriteSheet("spr_eff_miniring.png", 4, {x:20, y:20}, {x:10, y:10});
		_this.imageLoader.loadSpriteSheet("spr_eff_goal.png", 2, {x:36, y:27}, {x:18, y:13});
		_this.imageLoader.loadSpriteSheet("spr_muteButton.png", 2, {x:27, y:27}, {x:13, y:13});
		
		_this.imageLoader.loadSpriteSheet("bg_title.png", 1, {x:320, y:240}, {x:0, y:0});
		_this.imageLoader.loadSpriteSheet("bg_ending.png", 1, {x:320, y:240}, {x:0, y:0});
		_this.imageLoader.loadSpriteSheet("bg_credits.png", 1, {x:320, y:240}, {x:0, y:0});
		
		// Fill the sound to load list.
		_this.soundPlayer.loadSound("snd_collect_01");
		_this.soundPlayer.loadSound("snd_collect_02");
		_this.soundPlayer.loadSound("snd_collect_03");
		_this.soundPlayer.loadSound("snd_collect_04");
		_this.soundPlayer.loadSound("snd_collect_05");
		_this.soundPlayer.loadSound("snd_hitEnemy");
		_this.soundPlayer.loadSound("snd_cage");
		_this.soundPlayer.loadSound("snd_clink");
		_this.soundPlayer.loadSound("snd_step");
		_this.soundPlayer.loadSound("snd_step02");
		_this.soundPlayer.loadSound("snd_bonus");
		_this.soundPlayer.loadSound("snd_score");
		_this.soundPlayer.loadSound("snd_finalScore");
		_this.soundPlayer.loadSound("snd_lose");
		_this.soundPlayer.loadSound("snd_start");
		
		// Fill the music to load list.
		_this.soundPlayer.loadMusic("mus_monday");
		_this.soundPlayer.loadMusic("mus_messageWind");
		_this.soundPlayer.loadMusic("mus_umbrella");
		_this.soundPlayer.loadMusic("mus_gors");
		
		// Switch to the loading state immediately.
		_this.switchGameState(GameEngineConstants.stateLoad);
	}
	
	// Called while the game is loading.
	function gsmLoad()
	{
		clearScreen("#000000");
		// Show how much has been loaded in a bar.
		
		_this.context.textAlign = "center";
		_this.context.fillStyle = "#bbbbbb";
		_this.context.fillText("Loading...", _this.screenSize.x / 2,_this.screenSize.y / 4);
		
		_this.context.fillStyle = "rgb(32,85,32)";
		_this.context.fillRect(_this.screenSize.x / 6, _this.screenSize.y *4/9, _this.screenSize.x * 2/3, _this.screenSize.y / 9);
		_this.context.fillStyle = "rgb(56,185,38)";
		_this.context.fillRect(_this.screenSize.x / 6, _this.screenSize.y *4/9, _this.screenSize.x * 2/3 * _this.imageLoader.loadProgress() * _this.soundPlayer.loadProgress(), _this.screenSize.y / 9);
		// Once everything is loaded, switch to the initial game state and finish up any extra loading necessary.
		if (_this.imageLoader.isLoaded() && _this.soundPlayer.isLoaded())
		{
			_this.switchGameState(GameEngineConstants.initialState);
		}
	}
	
	// Called during the title screen state.
	function gsmTitle()
	{
		_this.renderer.addSpriteToQueue(_this.imageLoader.getSheetID("bg_title.png"), 0, {x:0, y:0}, 100, 1, true);
		
		titleCycle++;
		if (titleCycle % 32 >= 16)
			_this.drawText(_this.imageLoader.getSheetID("spr_font7x7.png"), "Touch the screen!", {x:_this.screenSize.x / 2, y:_this.screenSize.y * 5/6}, -1, -1, 101, 1, 2);
		_this.renderer.addSpriteToQueue(_this.imageLoader.getSheetID("spr_muteButton.png"), _this.soundPlayer.isMuted() ? 1 : 0, {x:303, y:16}, 11111, 0.75, true);
	}
	
	// Called during the main gameplay state.
	function gsmGame()
	{
		clearScreen("#888888");
		
		if (_this.playerObj)
		{
			if (!_this.playerObj.active)
			{
				_this.playerObj.active = true;
			}
		}
		_this.renderer.addSpriteToQueue(_this.imageLoader.getSheetID("spr_muteButton.png"), _this.soundPlayer.isMuted() ? 1 : 0, {x:303, y:16}, 11111, 0.75, true);
	}
	
	function gsmEnd()
	{
		_this.renderer.addSpriteToQueue(_this.imageLoader.getSheetID("bg_ending.png"), 0, {x:0, y:0}, 100, 1, true);
		_this.renderer.addSpriteToQueue(_this.imageLoader.getSheetID("spr_muteButton.png"), _this.soundPlayer.isMuted() ? 1 : 0, {x:303, y:16}, 11111, 0.75, true);
	}
	
	function gsmCredits()
	{
		_this.renderer.addSpriteToQueue(_this.imageLoader.getSheetID("bg_credits.png"), 0, {x:0, y:0}, 100, 1, true);
		var font = _this.imageLoader.getSheetID("spr_font7x7.png");
		_this.drawText(font, "Credits!", {x:_this.screenSize.x / 2, y:92}, -1,-1, 101, 1, 2);
		_this.drawText(font, "Game", {x:111, y:165}, -1,-1, 101, 1, 2);
		_this.drawText(font, "Kitsu", {x:111, y:180}, -1,-1, 101, 1, 2);
		_this.drawText(font, "Music", {x:209, y:165}, -1,-1, 101, 1, 2);
		_this.drawText(font, "Gors", {x:209, y:180}, -1,-1, 101, 1, 2);
		_this.drawText(font, "Touch to return to title!", {x:_this.screenSize.x / 2, y:220}, -1,-1, 101, 1, 2);
		_this.renderer.addSpriteToQueue(_this.imageLoader.getSheetID("spr_muteButton.png"), _this.soundPlayer.isMuted() ? 1 : 0, {x:303, y:16}, 11111, 0.75, true);
	}
	
	// Called when an asset finishes loading.
	function itemLoaded()
	{
		loaded++;
	}
	
	// Checks to see if the game is transitioning between states.
	this.isTransitioning = function()
	{
		return (_this.stateTransition != GameEngineConstants.noTransition)
	}
	
	// Handles the transitions between states.
	this.makeTransition = function()
	{
		// If transitioning into the current state, slowly fade away the covering.
		if (_this.stateTransition == GameEngineConstants.inTransition)
		{
			// Skip the transition for the loading state.
			if (this.currentGameState != GameEngineConstants.stateLoad)
			{
				_this.stateFade -= stateFadeRate;
				// When it's finished fading away, we're no longer transitioning.
				if (_this.stateFade <= 0)
				{
					_this.stateFade = 0;
					_this.stateTransition = GameEngineConstants.noTransition;
				}
			}
		}
		// Transitioning out of the current state; slowly fade in the covering.
		else if (_this.stateTransition == GameEngineConstants.outTransition)
		{
			_this.stateFade += stateFadeRate;
			if (_this.stateFade >= 1)
			{
				_this.stateFade = 1.0;
				_this.stateTransition = GameEngineConstants.inTransition;
				_this.switchGameState(_this.nextGameState);
			}
		}
	}
	
	// Handles starting state transitions.
	this.requestTransition = function()
	{
		// If the next state doesn't match the current state, start transitioning to that next state.
		if (_this.nextGameState != _this.currentGameState)
		{
			// If a reset was requested, send the game back to this same state.
			if (_this.nextGameState == GameEngineConstants.stateReset)
				_this.nextGameState = _this.currentGameState;
			_this.stateTransition = GameEngineConstants.outTransition;
		}
	}
	
	// Resizes the canvas to fill the screen, maintaining aspect ratio.
	this.resizeCanvas = function(pWindow)
	{
		// Calculate the target and window aspect ratios.
		var widthToHeight = _this.screenSize.x / _this.screenSize.y;
		var newWidth = pWindow.innerWidth;
		var newHeight = pWindow.innerHeight;
		var newWidthToHeight = newWidth / newHeight;
		// If the aspect ratio of the window is larger than the game's, then make the game's height fit and adjust the width.
		if (newWidthToHeight > widthToHeight)
		{
			newWidth = newHeight * widthToHeight;
			_this.canvas.style.width = newWidth + 'px';
			_this.canvas.style.height = newHeight + 'px';
		}
		// Otherwise, make the game's width fit and adjust the height.
		else
		{
			newHeight = newWidth / widthToHeight;
			_this.canvas.style.width = newWidth + 'px';
			_this.canvas.style.height = newHeight + 'px';
		}
		// Center the canvas
		_this.canvas.style.top = ((pWindow.innerHeight - newHeight) / 2) + 'px';
		_this.canvas.style.left = ((pWindow.innerWidth - newWidth) / 2) + 'px';
		
		// Save the updated window size.
		_this.windowSize.x = newWidth;
		_this.windowSize.y = newHeight;
	}
	
	// Called to clear the screen to the given color.
	function clearScreen(color)
	{
		_this.context.fillStyle = color;
		_this.context.fillRect(0,0, _this.screenSize.x, _this.screenSize.y);
	}
	
	// Given a set of variables, calculates the final score.
	this.calculateFinalScore = function(pTurnCount, pItemCount, pChaseCount)
	{
		var start = GamePlayConstants.startingValue;
		if (this.won == false) start = 0;
		var score = start - (pTurnCount * GamePlayConstants.turnValue - this.calculateItemScore(pItemCount) - pChaseCount * GamePlayConstants.chaseValue);
		
		return (score > 1 ? score : 0);
	}
	
	this.calculateItemScore = function(pItemCount)
	{
		var results = 0;
		//var amount = 
		for (var i = 0; i < pItemCount; i++)
		{
			if (results == 0) results = GamePlayConstants.itemValue;
			else results += results;
		}
		return results;
	}
	
	// Method to draw text using this sheet.
	this.drawText = function(pSprite, pString, pPosition, pFullLen, pFiller, pDepth, pAlpha, pAlign)
	{
		var sprite = _this.imageLoader.getSheetWithID(pSprite);
		var width = sprite.frameSize.x - 1;
		var posXInc = 0;
		// If the alignment isn't left aligned, move the drawing position.
		var fullLength = pFullLen;
		if (fullLength < pString.length) fullLength = pString.length;
		if (pAlign == 1) pPosition.x -= fullLength * width;
		else if (pAlign == 2) pPosition.x -= fullLength * width / 2;
		// If the full length exceeds the length of the string, place filler characters in it.
		if (pFullLen > 0 && pString.length < pFullLen)
		{
			// Actually print out the filler characters.
			if (pFiller >= 0 && pFiller < sprite.frameCount)
			{
				for (var i = 0; i < pFullLen - pString.length; i++)
				{
					_this.renderer.addSpriteToQueue(pSprite, pFiller, {x:pPosition.x + posXInc * width, y:pPosition.y}, pDepth, pAlpha, true);
					posXInc++;
				}
			}
		}
		// Draw the actual text now, one character at a time.
		for (var i = 0; i < pString.length; i++)
		{
			var cAt = pString.charAt(i).toLowerCase();
			var finalcAt = -1;
			switch (cAt)
			{
				// Alphanumeric characters
				default:
				{
					var charCode = cAt.charCodeAt(0);
					// Alphabet.
					if (charCode >= 97 && charCode <= 122) finalcAt = charCode - 97;
					// Numbers.
					else if (charCode >= 48 && charCode <= 57) finalcAt = charCode - 22;
					else finalcAt = -1;
					break;
				}
				// Special characters
				case '!': finalcAt = 36; break;
				case '?': finalcAt = 37; break;
				case ':': finalcAt = 38; break;
				case '(': finalcAt = 39; break;
				case ')': finalcAt = 40; break;
				case '-': finalcAt = 41; break;
				case '+': finalcAt = 42; break;
				case ',': finalcAt = 43; break;
				case '.': finalcAt = 44; break;
				case '\'': finalcAt = 45; break;
				case '\"': finalcAt = 46; break;
				case '~': finalcAt = 47; break;
				// Line break character ( # ).
				case '#': finalcAt = -1; pos.y += 8; posXInc = -1; break;
			}
			// If we had a valid character, print it out.
			if (finalcAt != -1)
				_this.renderer.addSpriteToQueue(pSprite, finalcAt, {x:pPosition.x + posXInc * width, y:pPosition.y}, pDepth, pAlpha, true);
			// Advance the printing "cursor"
			posXInc++;
		}
	}//*/
}

