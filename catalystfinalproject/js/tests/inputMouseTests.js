// Project: Dungeons & Generators (Catalyst Training Final Project)
// File: inputMouseTests.js
// Desc: Contains the tests for the InputMouse
// Author: mjensen
// Created: July 27, 2015
//
//**************************************************************************************************

QUnit.test("inputMouse mousedown event", function(assert)
{
	var mockEngine = mock(GameEngine);
	var testCanvas = document.getElementById("theCanvas");
	var mouse = new InputMouse(mockEngine, testCanvas);
	mockEngine.fullScreen = false;
	
	var event = {pageX: testCanvas.offsetLeft + 10, pageY: testCanvas.offsetTop + 10, type:"mousedown", preventDefault:function(){}};
	mouse.event_getMousePos(event);
	mouse.update();
	assert.ok(mouse.getPosition().x == 10 && mouse.getPosition().y == 10, "mouse position set correctly");
	assert.ok(mouse.isDown(), "mouse button correctly held down");
});

QUnit.test("inputMouse mouseup event", function(assert)
{
	var mockEngine = mock(GameEngine);
	var testCanvas = document.getElementById("theCanvas");
	var mouse = new InputMouse(mockEngine, testCanvas);
	mockEngine.fullScreen = false;
	
	var event = {pageX: testCanvas.offsetLeft + 10, pageY: testCanvas.offsetTop + 10, type:"mouseup", preventDefault:function(){}};
	mouse.event_getMousePos(event);
	mouse.update();
	assert.ok(mouse.getPosition().x == 10 && mouse.getPosition().y == 10, "mouse position set correctly");
	assert.ok(mouse.isUp(), "mouse button correctly not down");
});

QUnit.test("inputMouse mouseout event", function(assert)
{
	var mockEngine = mock(GameEngine);
	var testCanvas = document.getElementById("theCanvas");
	var mouse = new InputMouse(mockEngine, testCanvas);
	mockEngine.fullScreen = false;
	
	var event = {pageX: testCanvas.offsetLeft - 20, pageY: testCanvas.offsetTop - 20, type:"mouseout", preventDefault:function(){}};
	mouse.event_getMousePos(event);
	mouse.update();
	assert.ok(mouse.getPosition().x == -1 && mouse.getPosition().y == -1, "mouse position set correctly");
	assert.ok(mouse.isUp(), "mouse button correctly not down");
});

QUnit.test("inputMouse mouse is pressed / released check", function(assert)
{
	var mockEngine = mock(GameEngine);
	var testCanvas = document.getElementById("theCanvas");
	var mouse = new InputMouse(mockEngine, testCanvas);
	mockEngine.fullScreen = false;
	
	var event = {pageX: testCanvas.offsetLeft + 10, pageY: testCanvas.offsetTop + 10, type:"mousedown", preventDefault:function(){}};
	mouse.event_getMousePos(event);
	mouse.update();
	assert.ok(mouse.isPressed(), "mouse button correctly pressed");
	mouse.update();
	assert.ok(!mouse.isPressed(), "mouse button correctly not pressed");
	
	event.type = "mouseup";
	mouse.event_getMousePos(event);
	mouse.update();
	assert.ok(mouse.isReleased(), "mouse button correctly released");
	mouse.update();
	assert.ok(!mouse.isReleased(), "mouse button correctly not released");
});


QUnit.test("inputMouse touchstart event", function(assert)
{
	var mockEngine = mock(GameEngine);
	var testCanvas = document.getElementById("theCanvas");
	var mouse = new InputMouse(mockEngine, testCanvas);
	mockEngine.fullScreen = false;
	
	var event = {type:"touchstart", preventDefault:function(){}};
	event.touches = new Array();
	event.touches.push({screenX: testCanvas.offsetLeft + 10, screenY: testCanvas.offsetTop + 10});
	
	mouse.event_getTouchPos(event);
	mouse.update();
	assert.ok(mouse.getPosition().x == 10 && mouse.getPosition().y == 10, "mouse position set correctly");
	assert.ok(mouse.isDown(), "mouse button correctly held down");
});

QUnit.test("inputMouse touchmove event", function(assert)
{
	var mockEngine = mock(GameEngine);
	var testCanvas = document.getElementById("theCanvas");
	var mouse = new InputMouse(mockEngine, testCanvas);
	mockEngine.fullScreen = false;
	
	var event = {type:"touchmove", preventDefault:function(){}};
	event.touches = new Array();
	event.touches.push({screenX: testCanvas.offsetLeft + 10, screenY: testCanvas.offsetTop + 10});
	
	mouse.event_getTouchPos(event);
	mouse.update();
	assert.ok(mouse.getPosition().x == 10 && mouse.getPosition().y == 10, "mouse position set correctly");
	assert.ok(mouse.isDown(), "mouse button correctly held down");
});

QUnit.test("inputMouse touchend event", function(assert)
{
	var mockEngine = mock(GameEngine);
	var testCanvas = document.getElementById("theCanvas");
	var mouse = new InputMouse(mockEngine, testCanvas);
	mockEngine.fullScreen = false;
	
	var event = {type:"touchend", preventDefault:function(){}};
	event.touches = new Array();
	event.touches.push({screenX: testCanvas.offsetLeft - 200, screenY: testCanvas.offsetTop - 200});
	
	mouse.event_getTouchPos(event);
	mouse.update();
	assert.ok(mouse.getPosition().x == -1 && mouse.getPosition().y == -1, "mouse position set correctly");
	assert.ok(mouse.isUp(), "mouse button correctly not down");
});

QUnit.test("inputMouse mousedown event with fullscreen", function(assert)
{
	var mockEngine = mock(GameEngine);
	mockEngine.screenSize = {x: 10, y: 10};
	mockEngine.windowSize = {x: 1, y: 1};
	var testCanvas = document.getElementById("theCanvas");
	var mouse = new InputMouse(mockEngine, testCanvas);
	mockEngine.fullScreen = false;
	
	var event = {pageX: testCanvas.offsetLeft + 10, pageY: testCanvas.offsetTop + 10, type:"mousedown", preventDefault:function(){}};
	mouse.event_getMousePos(event);
	mouse.adjustMousePosForFullScreen(true);
	mouse.update();
	assert.ok(mouse.getPosition().x == 100 && mouse.getPosition().y == 100, "mouse position set correctly");
	assert.ok(mouse.isDown(), "mouse button correctly held down");
});

QUnit.test("inputMouse disable touch default actions", function(assert)
{
	var mockEngine = mock(GameEngine);
	var testCanvas = document.getElementById("theCanvas");
	var mouse = new InputMouse(mockEngine, testCanvas);
	mockEngine.fullScreen = false;
	
	function MockEvent()
	{
		this.preventDefault = function()
		{
		}
	}
	
	var mockEvent = mock(MockEvent);
	
	mouse.event_touchRestrictScrolling(mockEvent);
	assert.ok(!verify(mockEvent).preventDefault(), "preventDefault was called on the event");
});