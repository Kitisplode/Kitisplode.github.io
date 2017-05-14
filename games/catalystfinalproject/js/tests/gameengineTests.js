// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: gameengineTests.js
// Desc: Contains the tests for the game engine
// Author: mjensen
// Created: July 23, 2015
//
//**************************************************************************************************

QUnit.test( "gameEngine init test, no canvas support", function( assert )
{
	var gameEngine = new GameEngine();
	assert.ok( !gameEngine.init(false, document.getElementById("theCanvas")), "gameengine should not have initialized successfully.");
});

QUnit.test( "gameEngine init test, positive", function(assert)
{
	var gameEngine = new GameEngine();
	assert.ok(gameEngine.init(true, document.getElementById("theCanvas")), "gameEngine should have initialized successfully.");
});

QUnit.test("gameEngine requestTransition", function(assert)
{
	var gameEngine = new GameEngine();
	gameEngine.currentGameState = GameEngineConstants.stateGame;
	gameEngine.nextGameState = GameEngineConstants.stateGame;
	gameEngine.stateTransition = GameEngineConstants.noTransition;
	gameEngine.requestTransition();
	
	assert.ok(!gameEngine.isTransitioning(), "next state hasn't changed, so no transition");
	
	gameEngine.nextGameState = GameEngineConstants.stateEnd;
	gameEngine.requestTransition();
	
	assert.ok(gameEngine.isTransitioning(), "next state has changed, so transition started");
});

QUnit.test("gameEngine makeTransition", function(assert)
{
	var gameEngine = new GameEngine();
	assert.ok(gameEngine.init(true, document.getElementById("theCanvas")), "gameEngine should have initialized successfully.");
	gameEngine.currentGameState = GameEngineConstants.stateGame;
	gameEngine.nextGameState = GameEngineConstants.stateGame;
	
	assert.ok(gameEngine.isTransitioning(), "game engine starts in transition");
	
	gameEngine.makeTransition();
	
	assert.ok(gameEngine.stateFade < 1, "screencover is fading away gradually");
	
	
	gameEngine.stateFade = 0;
	gameEngine.makeTransition();
	
	assert.ok(!gameEngine.isTransitioning(), "ends transition once fade is finished");
	
	gameEngine.nextGameState = GameEngineConstants.stateEnd;
	gameEngine.requestTransition();
	
	gameEngine.makeTransition();
	assert.ok(gameEngine.stateFade > 0, "screencover is fading in gradually");
	
	gameEngine.stateFade = 1;
	gameEngine.makeTransition();
	
	assert.ok(gameEngine.currentGameState == GameEngineConstants.stateEnd, "gamestate changed once fade was finished");
	assert.ok(gameEngine.stateTransition == GameEngineConstants.inTransition, "switched to transition in");
});

QUnit.test("gameEngine appLoop init state", function(assert)
{
	var gameEngine = new GameEngine();
	assert.ok(gameEngine.init(true, document.getElementById("theCanvas")), "gameEngine should have initialized successfully.");
	
	gameEngine.appLoop();
	
	assert.ok(gameEngine.currentGameState == GameEngineConstants.stateLoad, "successfully initialized and moved to loading state");
	assert.ok(gameEngine.imageLoader.countSheets() > 0, "successfully started loading images");
});

QUnit.test("gameEngine appLoop load state", function(assert)
{
	var gameEngine = new GameEngine();
	assert.ok(gameEngine.init(true, document.getElementById("theCanvas")), "gameEngine should have initialized successfully.");
	
	gameEngine.switchGameState(GameEngineConstants.stateLoad);
	
	gameEngine.appLoop();
	
	assert.ok(gameEngine.currentGameState == GameEngineConstants.initialState, "successfully loaded (since there shouldn't be anything to load) and moved to initial state");
});

QUnit.test("gameEngine appLoop end state returning after click", function(assert)
{
	var gameEngine = new GameEngine();
	assert.ok(gameEngine.init(true, document.getElementById("theCanvas")), "gameEngine should have initialized successfully.");
	
	gameEngine.inputMouse = mock(InputMouse);
	gameEngine.imageLoader = mock(ImageLoader);
	gameEngine.renderer = mock(Renderer);
	var sheet = new SpriteSheet("spr_neox", null, 8, {x:64, y:64}, {x:32, y:32});
	when(gameEngine.imageLoader).getSheetWithID(anything()).thenReturn(sheet);
	when(gameEngine.inputMouse).getPosition().thenReturn({x:0, y:0});
	
	when(gameEngine.inputMouse).isPressed().thenReturn(true);
	
	gameEngine.switchGameState(GameEngineConstants.stateEnd);
	
	gameEngine.stateTransition = GameEngineConstants.noTransition;
	gameEngine.appLoop();
	gameEngine.appLoop();
	gameEngine.appLoop();
	assert.ok(gameEngine.nextGameState == GameEngineConstants.initialState, "redirected to game state since a click was 'registered'");
});

QUnit.test("gameengine apploop end state", function(assert)
{
	ScorePageConstants = 
	{
		timeOutPhase: 0,
		timeInPhase: 0,
		
		incrementAmount: 100
	};
	
	var gameEngine = new GameEngine();
	assert.ok(gameEngine.init(true, document.getElementById("theCanvas")), "gameEngine should have initialized successfully.");
	
	gameEngine.inputMouse = mock(InputMouse);
	gameEngine.imageLoader = mock(ImageLoader);
	gameEngine.renderer = mock(Renderer);
	var sheet = new SpriteSheet("spr_neox", null, 8, {x:64, y:64}, {x:32, y:32});
	when(gameEngine.imageLoader).getSheetWithID(anything()).thenReturn(sheet);
	when(gameEngine.inputMouse).getPosition().thenReturn({x:0, y:0});
	gameEngine.itemCount = 1;
	gameEngine.turnCount = 1;
	gameEngine.chaseCount = 1;
	
	when(gameEngine.inputMouse).isPressed().thenReturn(false);
	
	gameEngine.switchGameState(GameEngineConstants.stateEnd);
	gameEngine.stateTransition = GameEngineConstants.noTransition;
	
	gameEngine.appLoop();
	gameEngine.appLoop();
	gameEngine.appLoop();
	gameEngine.appLoop();
	gameEngine.appLoop();
	gameEngine.appLoop();
	gameEngine.appLoop();
	gameEngine.appLoop();
	gameEngine.appLoop();
	gameEngine.appLoop();
	gameEngine.appLoop();
	gameEngine.appLoop();
	assert.ok(gameEngine.nextGameState == GameEngineConstants.stateEnd, "stayed in the end state");
});

QUnit.test("gameengine apploop credits state", function(assert)
{
	
	var gameEngine = new GameEngine();
	assert.ok(gameEngine.init(true, document.getElementById("theCanvas")), "gameEngine should have initialized successfully.");
	
	gameEngine.inputMouse = mock(InputMouse);
	gameEngine.imageLoader = mock(ImageLoader);
	gameEngine.renderer = mock(Renderer);
	var sheet = new SpriteSheet("spr_neox", null, 8, {x:64, y:64}, {x:32, y:32});
	when(gameEngine.imageLoader).getSheetWithID(anything()).thenReturn(sheet);
	when(gameEngine.inputMouse).getPosition().thenReturn({x:0, y:0});
	
	when(gameEngine.inputMouse).isPressed().thenReturn(true);
	
	gameEngine.switchGameState(GameEngineConstants.stateCredits);
	gameEngine.stateTransition = GameEngineConstants.noTransition;
	
	gameEngine.appLoop();
	
	assert.ok(gameEngine.nextGameState == GameEngineConstants.initialState, "returned to the titlescreen");
});

QUnit.test("gameEngine resize to fit works", function(assert)
{
	var gameEngine = new GameEngine();
	assert.ok(gameEngine.init(true, document.getElementById("theCanvas")), "gameEngine should have initialized successfully.");
	
	var pWindow = 
	{
		innerWidth: 641,
		innerHeight: 480
	};
	
	var ar = gameEngine.screenSize.x / gameEngine.screenSize.y;
	
	gameEngine.resizeCanvas(pWindow);
	
	assert.ok((gameEngine.windowSize.x / gameEngine.windowSize.y) == ar, "aspect ratio preserved");
	assert.ok(gameEngine.windowSize.y == 480, "for given window size, fits vertically");
	
	pWindow = 
	{
		innerWidth: 480,
		innerHeight: 640
	};
	
	gameEngine.resizeCanvas(pWindow);
	
	assert.ok((gameEngine.windowSize.x / gameEngine.windowSize.y) == ar, "aspect ratio preserved");
	assert.ok(gameEngine.windowSize.x == 480, "for given window size, fits horizontally");
});

QUnit.test("gameEngine calculate item score", function(assert)
{
	var gameEngine = new GameEngine();
	assert.ok(gameEngine.init(true, document.getElementById("theCanvas")), "gameEngine should have initialized successfully.");
	
	assert.ok(gameEngine.calculateItemScore(5) == 1600, "5 items gets 1600 points");
});

QUnit.test("gameEngine print text works", function(assert)
{
	var mockEngine = new GameEngine();
	mockEngine.imageLoader = mock(ImageLoader);
	mockEngine.renderer = mock(Renderer);
	
	var sheet = new SpriteSheet("spr_font7x7.png", null, 48, {x:7, y:7}, {x:0, y:0});
	when(mockEngine.imageLoader).getSheetID("spr_font7x7.png").thenReturn(0);
	when(mockEngine.imageLoader).getSheetWithID(0).thenReturn(sheet);
	
	mockEngine.drawText(mockEngine.imageLoader.getSheetID("spr_font7x7.png"), "Tasukete eirin!", {x:1, y:1}, 20, 47, 100, 1, 0);
	
	verify(mockEngine.renderer, times(19)).addSpriteToQueue(anything(), anything(), anything(), anything(), anything(), anything());
	
	assert.ok(true, "just asserting because it's required, tests are done through verify");
});//*/