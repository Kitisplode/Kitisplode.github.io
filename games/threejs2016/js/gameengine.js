// Project: threejs2016
// File: gameengine.js
// Desc: Contains the primary game logic for the game engine.
// Author: mjensen
// Created: Jun 30, 2016
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
		var canvas2d = document.getElementById("2dCanvas");
		var canvas3d = document.getElementById("3dCanvas");
		if (canvasApp.init(Modernizr.canvas, canvas2d, canvas3d))
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
	fps: 60,
	
	inTransition: 0,
	noTransition: 1,
	outTransition: 2,
	
	stateReset: -3,
	stateInit: -2,
	stateLoad: -1,
	stateTitle: 0,
	stateRPG: 1,
	stateField: 2,
	initialState: 0,
	
	fullScreen: true,
	showHitBoxes: false
};

var GamePlayConstants =
{
}

function GameEngine(pFullScreen)
{
	var _this = this;
	
	this.fullScreen = pFullScreen;
	
	this.dirImages = "images";
	this.dirSounds = "sounds";
	this.dirMusic = "music";
	this.dirScripts = "scripts";
	this.dirModels = "models";
	
	// Field declarations:
	this.canvas2d;
	this.canvas3d;
	this.context2d;
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
	this.renderer2d;
	this.modelLoader;
	this.renderer3d;
	this.soundPlayer;
	this.inputMouse;
	this.inputKeyboard;
	
	// Loading variables:
	var toLoad = 0;
	var loaded = 0;
	
	// Gameplay global variables:
	this.tilemapObject;
	this.fieldPlayer;
	this.spawnPosition = {x:0, y:0, z:0};
	var titleCycle = 0;
	
	// Initializes the GameEngine
	this.init = function(canvasSupport, pCanvas2d, pCanvas3d)
	{
		// Check that the browser supports canvas.
		if (!canvasSupport)
		{
			return false;
		}
		
		// Set up fields.
		_this.canvas2d = pCanvas2d;
		_this.context2d = _this.canvas2d.getContext("2d");
		_this.screenSize = {x:_this.canvas2d.width, y:_this.canvas2d.height};
		_this.windowSize = {x:0, y:0};
		_this.currentGameState = 0;
		_this.nextGameState = _this.currentGameState;
		
		_this.canvas3d = pCanvas3d;
		
		// Set up object handler.
		_this.gameObjectHandler = new GameObjectHandler(_this);
		// Add object modules.
		_this.gameObjectHandler.addType("tilemap", ModuleTilemap);
		_this.gameObjectHandler.addType("player", ModulePlayer);
		_this.gameObjectHandler.addType("effect", ModuleEffect);
		_this.gameObjectHandler.addType("timer", ModuleTimer);
		
		// Set up image loader.
		_this.imageLoader = new ImageLoader(_this.dirImages);
		// Set up the 2d renderer.
		_this.renderer2d = new Renderer(_this.context2d);
		// Set up the sound player.
		_this.soundPlayer = new SoundPlayer(_this.dirSounds, _this.dirMusic);
		
		// Set up the model loader.
		_this.modelLoader = new THREE.JSONLoader();
		// Set up the 3d renderer.
		_this.renderer3d = new ThreeRenderer();
		_this.renderer3d.initialize(_this.screenSize, _this.canvas3d);
		
		// Set up the mouse input handler.
		_this.inputMouse = new InputMouse(_this, _this.canvas2d);
		_this.inputMouse.initialize();
		
		// Set up the keyboard input handler.
		_this.inputKeyboard = new InputKeyboard(_this);
		_this.inputKeyboard.initialize();
		
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
			_this.resizeCanvas(window, _this.canvas2d);
			_this.resizeCanvas(window, _this.canvas3d);
		}
		
		// Update the mouse.
		_this.inputMouse.update();
		// Update the keyboard.
		_this.inputKeyboard.update();
		
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
			if (_this.inputKeyboard.isKeyPressed(_this.inputKeyboard.keyCodes.r))
				_this.nextGameState = GameEngineConstants.stateReset;
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
				_this.context2d.globalAlpha = _this.stateFade;
				fillScreen(_this.fadeFill);
				_this.context2d.globalAlpha = 1;
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
				// If the player clicked the screen in the title, send them to the game state.
				if (_this.currentGameState == GameEngineConstants.stateTitle)
				{
					_this.nextGameState = GameEngineConstants.stateField;
					_this.fadeFill = "#000000";
				}
			}
		}
	}
	
	// Draws things to the canvas.
	function drawObjects()
	{
		// Get the objects to prepare for drawing.
		_this.gameObjectHandler.drawAll(_this.isTransitioning(), _this.imageLoader, _this.renderer2d, GameEngineConstants.showHitBoxes);
		
		currentGameStateMethod();
		
		_this.renderer2d.draw(_this.imageLoader);
		_this.renderer3d.render();
	}
	
	// Handles the switching of states.
	this.switchGameState = function(pNewState)
	{
		_this.currentGameState = pNewState;
		
		// Clear all the objects.
		_this.gameObjectHandler.destroyAll(true);
		
		_this.renderer3d.startScene();
		
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
				break;
			case GameEngineConstants.stateRPG:
				currentGameStateMethod = gsmRPG;
				break;
			case GameEngineConstants.stateField:
				currentGameStateMethod = gsmField;
				
				_this.tilemapObject = _this.gameObjectHandler.create("tilemap", {x:0, y:0, z:0});
				_this.tilemapObject.module.reinit("level1.txt");
				
				_this.renderer3d.camera.position.z = 8;
				// add subtle ambient lighting
				var ambientLight = new THREE.AmbientLight(0x777777);
				_this.renderer3d.scene.add(ambientLight);
				// directional lighting
				var directionalLight = new THREE.DirectionalLight(0xbbbbbb);
				_this.renderer3d.scene.add(directionalLight);
				directionalLight.position.set(0, 16, 0);
				directionalLight.target.position.set(0,0,0);
				
				var temp = _this.gameObjectHandler.create("player", _this.spawnPosition);
				
				break;
		}
	}
	
	// Called when the game first begins to load everything up.
	function gsmInit()
	{
		fillScreen("rgba(0,0,0,1)");
		
		// Load images.
		//_this.imageLoader.loadSpriteSheet("spr_player_idle.png", 4, {x:40, y:46}, {x:20, y:34});
		_this.imageLoader.loadSpriteSheet("spr_font7x7.png", 48, {x:7, y:7}, {x:3, y:3});
		
		// Fill the sound to load list.
		//_this.soundPlayer.loadSound("snd_collect_01");
		
		// Fill the music to load list.
		//_this.soundPlayer.loadMusic("mus_monday");
		
		// Switch to the loading state immediately.
		_this.switchGameState(GameEngineConstants.stateLoad);
	}
	
	// Called while the game is loading.
	function gsmLoad()
	{
		fillScreen("rgba(0,0,0,1)");
		// Show how much has been loaded in a bar.
		
		_this.context2d.textAlign = "center";
		_this.context2d.fillStyle = "#bbbbbb";
		_this.context2d.fillText("Loading...", _this.screenSize.x / 2,_this.screenSize.y / 4);
		
		_this.context2d.fillStyle = "rgb(32,85,32)";
		_this.context2d.fillRect(_this.screenSize.x / 6, _this.screenSize.y *4/9, _this.screenSize.x * 2/3, _this.screenSize.y / 9);
		_this.context2d.fillStyle = "rgb(56,185,38)";
		_this.context2d.fillRect(_this.screenSize.x / 6, _this.screenSize.y *4/9, _this.screenSize.x * 2/3 * _this.imageLoader.loadProgress() * _this.soundPlayer.loadProgress(), _this.screenSize.y / 9);
		// Once everything is loaded, switch to the initial game state and finish up any extra loading necessary.
		if (_this.imageLoader.isLoaded() && _this.soundPlayer.isLoaded())
		{
			_this.switchGameState(GameEngineConstants.initialState);
		}
	}
	
	// Called during the title screen state.
	function gsmTitle()
	{
		clearScreen();
		//_this.renderer2d.addSpriteToQueue(_this.imageLoader.getSheetID("bg_title.png"), 0, {x:0, y:0}, 100, 1, true);
		
		titleCycle++;
		if (titleCycle % 32 >= 16)
			_this.renderer2d.addTextToQueue("click or something", {x:_this.screenSize.x / 2, y:_this.screenSize.y * 5/6}, "#ffffff", "48pt Calibri", 101, 1, -1, "center", true);
			//_this.drawText(_this.imageLoader.getSheetID("spr_font7x7.png"), "click or something", {x:_this.screenSize.x / 2, y:_this.screenSize.y * 5/6}, -1, -1, 101, 1, 2);
	}
	
	// Called during the main gameplay state.
	function gsmRPG()
	{
		clearScreen();
	}
	
	function gsmField()
	{
		clearScreen();
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
	this.resizeCanvas = function(pWindow, pCanvas)
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
			pCanvas.style.width = newWidth + 'px';
			pCanvas.style.height = newHeight + 'px';
		}
		// Otherwise, make the game's width fit and adjust the height.
		else
		{
			newHeight = newWidth / widthToHeight;
			pCanvas.style.width = newWidth + 'px';
			pCanvas.style.height = newHeight + 'px';
		}
		// Center the canvas
		pCanvas.style.top = ((pWindow.innerHeight - newHeight) / 2) + 'px';
		pCanvas.style.left = ((pWindow.innerWidth - newWidth) / 2) + 'px';
		
		// Save the updated window size.
		_this.windowSize.x = newWidth;
		_this.windowSize.y = newHeight;
	}
	
	// Called to clear the screen to the given color.
	function clearScreen()
	{
		_this.context2d.clearRect(0,0, _this.screenSize.x, _this.screenSize.y);
	}
	
	function fillScreen(color)
	{
		_this.context2d.fillStyle = color;
		_this.context2d.fillRect(0,0, _this.screenSize.x, _this.screenSize.y);
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
					_this.renderer2d.addSpriteToQueue(pSprite, pFiller, {x:pPosition.x + posXInc * width, y:pPosition.y}, pDepth, pAlpha, true);
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
				_this.renderer2d.addSpriteToQueue(pSprite, finalcAt, {x:pPosition.x + posXInc * width, y:pPosition.y}, pDepth, pAlpha, true);
			// Advance the printing "cursor"
			posXInc++;
		}
	}//*/
}

